import { promises as fs } from "node:fs";
import { genAtomic } from "generate-atomic-css";

function asError(error) {
  return error instanceof Error ? error : new Error(String(error));
}

export class ProcessingError extends AggregateError {
  constructor(failures, successful) {
    super(
      failures.map(({ error }) => error),
      `${failures.length} file${failures.length === 1 ? "" : "s"} could not be updated`,
    );
    this.name = "ProcessingError";
    this.failures = failures;
    this.successful = successful;
  }
}

async function processFile(filePath, { readFile, transform, writeFile }) {
  let contents;
  try {
    contents = await readFile(filePath, "utf8");
  } catch (error) {
    return { error: asError(error), path: filePath, stage: "read" };
  }

  let result;
  try {
    result = transform(contents);
  } catch (error) {
    return { error: asError(error), path: filePath, stage: "transform" };
  }

  try {
    await writeFile(filePath, result);
  } catch (error) {
    return { error: asError(error), path: filePath, stage: "write" };
  }

  return { path: filePath };
}

// stands in for `write-file-atomic`: the file is written under a temporary
// name and moved into place, so an interrupted run never leaves the file it
// was rewriting half-written. `rename` within one directory is atomic on
// POSIX and on Windows, and the existing mode is carried over.
async function writeFileAtomically(filename, contents) {
  const temporaryFilename = `${filename}.${process.pid}.${Date.now()}.tmp`;

  let mode;
  try {
    ({ mode } = await fs.stat(filename));
  } catch {
    // a file that does not exist yet keeps the default mode
  }

  await fs.writeFile(temporaryFilename, contents);
  try {
    if (mode !== undefined) {
      await fs.chmod(temporaryFilename, mode);
    }
    await fs.rename(temporaryFilename, filename);
  } catch (error) {
    await fs.rm(temporaryFilename, { force: true });
    throw error;
  }
}

export async function processFiles(
  paths,
  {
    logger = console.log,
    messagePrefix = "",
    readFile = fs.readFile,
    transform = (contents) => genAtomic(contents).result,
    writeFile = writeFileAtomically,
  } = {},
) {
  const successful = [];
  const failures = [];

  for (const filePath of paths) {
    const outcome = await processFile(filePath, {
      readFile,
      transform,
      writeFile,
    });
    if (outcome.error) {
      failures.push(outcome);
      logger(
        `${messagePrefix}${filePath} - ${`\u001b[${31}mBAD\u001b[${39}m`} (${outcome.stage}) - ${outcome.error}`,
      );
    } else {
      successful.push(filePath);
      logger(`${messagePrefix}${filePath} - ${`\u001b[${32}mOK\u001b[${39}m`}`);
    }
  }

  let summary;
  if (!successful.length && !failures.length) {
    summary = "Nothing to process.";
  } else {
    const parts = [];
    if (successful.length) {
      parts.push(
        `\u001b[${32}m${successful.length} file${
          successful.length === 1 ? "" : "s"
        } updated\u001b[${39}m`,
      );
    }
    if (failures.length) {
      parts.push(
        `\u001b[${31}m${failures.length} file${
          failures.length === 1 ? "" : "s"
        } could not be updated\u001b[${39}m ${`\u001b[${90}m - ${failures
          .map(({ path: failedPath }) => failedPath)
          .join(" - ")}\u001b[${39}m`}`,
      );
    }
    summary = parts.join(`\n${messagePrefix}`);
  }
  logger(`\n${messagePrefix}${summary}`);

  if (failures.length) {
    throw new ProcessingError(failures, successful);
  }
  return { failures, successful };
}
