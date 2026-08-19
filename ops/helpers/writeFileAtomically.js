import { promises as fs } from "node:fs";

// stands in for `write-file-atomic`: the file is written under a temporary
// name and moved into place, so an interrupted run never leaves a generated
// file half-written. `rename` within one directory is atomic on POSIX and on
// Windows, and the existing mode is carried over when the file already exists.
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

export { writeFileAtomically };
