import childProcess from "node:child_process";
import path from "node:path";

// this helper is used to test CLI's, to replace execa
// also it's a measure against child processes which exit with code 130

function spawn(tempFolder, dirname, ...args) {
  const cliPath = path.resolve(dirname, "../cli.js");
  const result = childProcess.spawnSync(process.execPath, [cliPath, ...args], {
    cwd: tempFolder,
    encoding: "utf8",
    maxBuffer: 100000000,
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const error = new Error(
      `CLI child process exited with code ${result.status}: ${
        result.stderr || result.stdout
      }`,
    );
    error.result = result;
    throw error;
  }

  return result;
}

export { spawn };
