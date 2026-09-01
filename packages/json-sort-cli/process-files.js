import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { lstat, open, realpath, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { decodeJson, formatParsedJson, parseJson } from "./json-formatter.js";

function asError(error) {
  if (error instanceof Error) {
    return error;
  }

  let description;
  try {
    description = String(error);
  } catch {
    description = "Unknown non-Error value";
  }
  return new Error(description, { cause: error });
}

async function openWithoutFollowing(filePath) {
  const noFollow = constants.O_NOFOLLOW ?? 0;
  return open(filePath, constants.O_RDONLY | noFollow);
}

async function readFileSnapshot(filePath) {
  const realPath = await realpath(filePath);
  const pathStat = await lstat(filePath, { bigint: true });
  if (pathStat.isSymbolicLink()) {
    throw new Error(`Refusing to process symbolic link: ${filePath}`);
  }

  const handle = await openWithoutFollowing(filePath);
  try {
    const stat = await handle.stat({ bigint: true });
    if (!stat.isFile()) {
      throw new Error(`Refusing to process a non-file: ${filePath}`);
    }
    if (!sameIdentity(pathStat, stat)) {
      throw new Error(
        `The file changed while it was being opened: ${filePath}`,
      );
    }
    if ((await realpath(filePath)) !== realPath) {
      throw new Error(`The file route changed while opening: ${filePath}`);
    }
    return { contents: await handle.readFile(), realPath, stat };
  } finally {
    await handle.close();
  }
}

function sameIdentity(left, right) {
  return (
    left.dev === right.dev &&
    left.ino === right.ino &&
    left.size === right.size &&
    left.mtimeNs === right.mtimeNs &&
    left.ctimeNs === right.ctimeNs
  );
}

async function commitFile(filePath, output, snapshot) {
  if (
    !snapshot?.stat ||
    !Buffer.isBuffer(snapshot.contents) ||
    typeof snapshot.realPath !== "string"
  ) {
    throw new Error("Cannot safely commit without the original file snapshot");
  }

  const commitPath = snapshot.realPath;
  const directory = path.dirname(commitPath);
  const temporaryPath = path.join(
    directory,
    `.${path.basename(commitPath)}.${process.pid}.${randomUUID()}.tmp`,
  );
  let temporaryHandle;

  try {
    if ((await realpath(filePath)) !== snapshot.realPath) {
      throw new Error(
        "The file route changed after it was read; refusing to overwrite it",
      );
    }
    temporaryHandle = await open(
      temporaryPath,
      "wx",
      Number(snapshot.stat.mode & 0o7777n),
    );
    await temporaryHandle.writeFile(output, "utf8");
    await temporaryHandle.chmod(Number(snapshot.stat.mode & 0o7777n));

    const temporaryStat = await temporaryHandle.stat({ bigint: true });
    if (
      temporaryStat.uid !== snapshot.stat.uid ||
      temporaryStat.gid !== snapshot.stat.gid
    ) {
      await temporaryHandle.chown(
        Number(snapshot.stat.uid),
        Number(snapshot.stat.gid),
      );
    }
    await temporaryHandle.sync();
    await temporaryHandle.close();
    temporaryHandle = undefined;

    const current = await readFileSnapshot(filePath);
    if (
      !sameIdentity(snapshot.stat, current.stat) ||
      !snapshot.contents.equals(current.contents)
    ) {
      throw new Error(
        "The file changed after it was read; refusing to overwrite it",
      );
    }

    if ((await realpath(filePath)) !== snapshot.realPath) {
      throw new Error(
        "The file route changed before commit; refusing to overwrite it",
      );
    }
    await rename(temporaryPath, commitPath);

    // Directory syncing is not supported by every platform. The file is
    // already durable and atomically visible when this best-effort step runs.
    try {
      const directoryHandle = await open(directory, "r");
      try {
        await directoryHandle.sync();
      } finally {
        await directoryHandle.close();
      }
    } catch {}
  } catch (error) {
    if (temporaryHandle) {
      await temporaryHandle.close().catch(() => {});
    }
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

export class FileProcessingError extends Error {
  constructor(filePath, stage, error) {
    const cause = asError(error);
    super(`${filePath}: ${stage} failed: ${cause.message}`, { cause });
    this.name = "FileProcessingError";
    this.error = cause;
    this.path = filePath;
    this.stage = stage;
  }
}

export class ProcessingError extends AggregateError {
  constructor(failures, successful, unsorted) {
    super(
      failures.map(({ error }) => error),
      `${failures.length} file${failures.length === 1 ? "" : "s"} could not be sorted`,
    );
    this.name = "ProcessingError";
    this.failures = failures;
    this.successful = successful;
    this.unsorted = unsorted;
  }
}

async function processFile(
  filePath,
  options,
  { parse, read, transform, write },
) {
  let snapshot;
  try {
    const received = await read(filePath);
    snapshot =
      received && typeof received === "object" && "contents" in received
        ? received
        : { contents: received };
  } catch (error) {
    throw new FileProcessingError(filePath, "read", error);
  }

  let decoded;
  try {
    decoded = decodeJson(snapshot.contents);
  } catch (error) {
    throw new FileProcessingError(filePath, "decode", error);
  }

  let parsed;
  try {
    parsed = (parse ?? parseJson)(decoded);
  } catch (error) {
    throw new FileProcessingError(filePath, "parse", error);
  }

  let prepared;
  try {
    prepared = transform
      ? transform(parsed, { contents: decoded, filePath, ...options })
      : formatParsedJson(parsed, decoded, { filePath, ...options });
  } catch (error) {
    throw new FileProcessingError(filePath, "transform", error);
  }

  if (!options.ci && prepared.changed) {
    try {
      await write(filePath, prepared.output, snapshot);
    } catch (error) {
      throw new FileProcessingError(filePath, "write", error);
    }
  }

  return { changed: prepared.changed, path: filePath };
}

async function mapWithConcurrency(values, mapper, concurrency) {
  const results = new Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(values[currentIndex]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, () =>
      worker(),
    ),
  );
  return results;
}

export async function processFiles(
  paths,
  {
    arrays = false,
    ci = false,
    indentationCount = 2,
    lineEnding,
    onOutcome = () => {},
    pack = false,
    parse,
    read = readFileSnapshot,
    tabs = false,
    transform,
    write = commitFile,
  } = {},
) {
  const failures = [];
  const successful = [];
  const unsorted = [];
  const options = {
    arrays,
    ci,
    indentationCount,
    lineEnding,
    pack,
    tabs,
  };
  let callbackError;

  function report(outcome) {
    try {
      onOutcome(outcome);
    } catch (error) {
      callbackError ??= asError(error);
    }
  }

  async function captureOutcome(filePath) {
    let outcome;
    try {
      outcome = {
        ...(await processFile(filePath, options, {
          parse,
          read,
          transform,
          write,
        })),
        status: "success",
      };
    } catch (error) {
      if (!(error instanceof FileProcessingError)) {
        throw error;
      }
      outcome = {
        error: error.error,
        failure: error,
        path: error.path,
        stage: error.stage,
        status: "failure",
      };
    }
    report(outcome);
    return outcome;
  }

  const outcomes = ci
    ? await mapWithConcurrency(paths, captureOutcome, 16)
    : [];
  if (!ci) {
    for (const filePath of paths) {
      outcomes.push(await captureOutcome(filePath));
    }
  }

  for (const outcome of outcomes) {
    if (outcome.status === "failure") {
      failures.push(outcome.failure);
    } else {
      successful.push(outcome.path);
      if (ci && outcome.changed) {
        unsorted.push(outcome.path);
      }
    }
  }

  if (failures.length) {
    throw new ProcessingError(failures, successful, unsorted);
  }
  if (callbackError) {
    throw callbackError;
  }
  return { failures, successful, unsorted };
}
