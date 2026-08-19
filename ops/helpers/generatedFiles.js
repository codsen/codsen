import { promises as fs } from "node:fs";
import path from "node:path";

import { writeFileAtomically } from "./writeFileAtomically.js";

const GENERATION_MODES = Object.freeze({
  CHECK: "check",
  WRITE: "write",
});

function assertGenerationMode(mode) {
  if (!Object.values(GENERATION_MODES).includes(mode)) {
    throw new TypeError(`Unsupported generated-file mode: ${mode}`);
  }
}

function displayPath(filename) {
  const relative = path.relative(process.cwd(), filename);
  return relative && !relative.startsWith("..") ? relative : filename;
}

function staleGeneratedFile(filename, fixCommand) {
  return new Error(
    `Generated file is stale: ${displayPath(filename)}. Run "${fixCommand}" to update it.`,
  );
}

async function readIfPresent(filename) {
  try {
    return await fs.readFile(filename, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

async function writeGeneratedFile({
  contents,
  filename,
  fixCommand,
  mode = GENERATION_MODES.WRITE,
}) {
  assertGenerationMode(mode);
  const current = await readIfPresent(filename);
  if (current === contents) {
    return false;
  }
  if (mode === GENERATION_MODES.CHECK) {
    throw staleGeneratedFile(filename, fixCommand);
  }
  await writeFileAtomically(filename, contents);
  return true;
}

async function deleteGeneratedFile({
  filename,
  fixCommand,
  mode = GENERATION_MODES.WRITE,
}) {
  assertGenerationMode(mode);
  if (mode === GENERATION_MODES.CHECK) {
    try {
      await fs.lstat(filename);
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      throw error;
    }
    throw staleGeneratedFile(filename, fixCommand);
  }
  try {
    await fs.unlink(filename);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

export {
  deleteGeneratedFile,
  GENERATION_MODES,
  readIfPresent,
  writeGeneratedFile,
};
