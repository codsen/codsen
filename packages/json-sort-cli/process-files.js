import { readFile } from "node:fs/promises";
import path from "node:path";
import { traverse } from "ast-monkey-traverse";
import { isPlainObject, resolveEolSetting } from "codsen-utils";
import sortPackageJson, { sortOrder } from "sort-package-json";
import { writeJson } from "./json-file.js";

function asError(error) {
  return error instanceof Error ? error : new Error(String(error));
}

function sortObject(object) {
  const result = {};
  for (const key of Object.keys(object).sort()) {
    result[key] = object[key];
  }
  return result;
}

function formatPackageJson(object) {
  if (typeof object !== "object") {
    return object;
  }
  const customSortOrder = sortOrder.filter(
    (field) => !["lect", "tap"].includes(field),
  );
  const resolutionsIndex = customSortOrder.indexOf("resolutions");
  customSortOrder.splice(resolutionsIndex, 0, "tap", "lect");
  return sortPackageJson(object, { sortOrder: customSortOrder });
}

function normalizeLineEndings(stringified, eolChar) {
  if (eolChar === "\r\n") {
    return stringified
      .replaceAll(/(?<!\r)\n/g, "\r\n")
      .replaceAll(/\r(?!\n)/g, "\n");
  }
  return stringified.replaceAll(/(?:\r?\n)|\r/g, eolChar);
}

function prepareJson(
  parsedJson,
  { arrays, contents, filePath, indentationCount, lineEnding, pack, tabs },
) {
  const eol = resolveEolSetting(contents, lineEnding);
  let result = isPlainObject(parsedJson) ? sortObject(parsedJson) : parsedJson;
  if (
    arrays &&
    Array.isArray(result) &&
    result.length &&
    result.every((item) => typeof item === "string")
  ) {
    result.sort((a, b) => a.localeCompare(b));
  } else if (!pack && path.basename(filePath) === "package.json") {
    result = formatPackageJson(result);
  }

  const value = traverse(result, (key, val) => {
    const current = val !== undefined ? val : key;
    if (isPlainObject(current)) {
      return sortObject(current);
    }
    if (
      arrays &&
      Array.isArray(current) &&
      current.length > 1 &&
      current.every((item) => typeof item === "string")
    ) {
      return current.sort((a, b) => a.localeCompare(b));
    }
    return current;
  });
  const spaces = tabs ? "\t".repeat(indentationCount) : indentationCount;
  const stringified = normalizeLineEndings(
    JSON.stringify(value, null, spaces),
    eol,
  );

  return {
    changed: stringified.trimEnd() !== contents.trimEnd(),
    eol,
    spaces,
    value,
  };
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
  let contents;
  try {
    contents = await read(filePath, "utf8");
  } catch (error) {
    throw new FileProcessingError(filePath, "read", error);
  }

  let parsedJson;
  try {
    parsedJson = parse(contents);
  } catch (error) {
    throw new FileProcessingError(filePath, "parse", error);
  }

  let prepared;
  try {
    prepared = transform(parsedJson, { contents, filePath, ...options });
  } catch (error) {
    throw new FileProcessingError(filePath, "transform", error);
  }

  if (!options.ci) {
    try {
      await write(filePath, prepared.value, {
        EOL: prepared.eol,
        spaces: prepared.spaces,
      });
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
    parse = JSON.parse,
    read = readFile,
    tabs = false,
    transform = prepareJson,
    write = writeJson,
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

  async function captureOutcome(filePath) {
    try {
      const outcome = await processFile(filePath, options, {
        parse,
        read,
        transform,
        write,
      });
      return { ...outcome, status: "success" };
    } catch (error) {
      if (!(error instanceof FileProcessingError)) {
        throw error;
      }
      return {
        error: error.error,
        failure: error,
        path: error.path,
        stage: error.stage,
        status: "failure",
      };
    }
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
    onOutcome(outcome);
  }

  if (failures.length) {
    throw new ProcessingError(failures, successful, unsorted);
  }
  return { failures, successful, unsorted };
}
