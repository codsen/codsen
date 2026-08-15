import { readFile } from "node:fs/promises";
import { cleanChangelogs } from "lerna-clean-changelogs";
import writeFile from "write-file-atomic";

const colours = {
  green: 32,
  grey: 90,
  red: 31,
};

function asError(error) {
  return error instanceof Error ? error : new Error(String(error));
}

function colour(str, colourCode) {
  return `\u001b[${colourCode}m${str}\u001b[39m`;
}

function formatTime(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${Math.round(ms / 1000)}s`;
}

export class ProcessingError extends AggregateError {
  constructor(failures, successful, skipped) {
    super(
      failures.map(({ error }) => error),
      `${failures.length} changelog${failures.length === 1 ? "" : "s"} could not be cleaned`,
    );
    this.name = "ProcessingError";
    this.failures = failures;
    this.skipped = skipped;
    this.successful = successful;
  }
}

async function processFile(
  filePath,
  { read, transform, transformOptions, write },
) {
  let contents;
  try {
    contents = await read(filePath, "utf8");
  } catch (error) {
    return { error: asError(error), path: filePath, stage: "read" };
  }

  let result;
  try {
    const transformed = transform(contents, transformOptions);
    result = transformed?.res;
    if (typeof result !== "string") {
      throw new TypeError("The changelog transform did not return text");
    }
  } catch (error) {
    return { error: asError(error), path: filePath, stage: "transform" };
  }

  if (!result.length || result === contents) {
    return { path: filePath, skipped: true };
  }

  try {
    await write(filePath, result);
  } catch (error) {
    return { error: asError(error), path: filePath, stage: "write" };
  }

  return { path: filePath };
}

export async function processFiles(
  paths,
  {
    logger = console.log,
    read = readFile,
    signature = "",
    startedAt = Date.now(),
    transform = cleanChangelogs,
    transformOptions = {},
    write = writeFile,
  } = {},
) {
  const failures = [];
  const skipped = [];
  const successful = [];

  for (const filePath of paths) {
    const outcome = await processFile(filePath, {
      read,
      transform,
      transformOptions,
      write,
    });
    if (outcome.error) {
      failures.push(outcome);
      logger(
        `${signature}${filePath} - ${colour("BAD", colours.red)} (${outcome.stage}) - ${outcome.error}`,
      );
    } else if (outcome.skipped) {
      skipped.push(filePath);
    } else {
      successful.push(filePath);
    }
  }

  const completedParts = [];
  if (successful.length) {
    completedParts.push(`${successful.length} updated`);
  }
  if (skipped.length) {
    completedParts.push(`${skipped.length} skipped`);
  }
  const summaryParts = [];
  if (completedParts.length) {
    summaryParts.push(colour(completedParts.join(", "), colours.green));
  }
  if (failures.length) {
    summaryParts.push(
      colour(
        `${failures.length} failed (${failures
          .map(({ path: failedPath }) => failedPath)
          .join(", ")})`,
        colours.red,
      ),
    );
  }
  summaryParts.push(
    colour(`(${formatTime(Date.now() - startedAt)})`, colours.grey),
  );
  logger(`${signature}${summaryParts.join(" ")}`);

  if (failures.length) {
    throw new ProcessingError(failures, successful, skipped);
  }
  return { failures, skipped, successful };
}
