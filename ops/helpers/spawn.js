import childProcess from "node:child_process";
import path from "path";

// this helper is used to test CLI's, to replace execa
// also it's a measure against child processes which exit with code 130

function spawn(tempFolder, dirname, ...args) {
  let result = childProcess.spawnSync(
    "cd",
    [tempFolder, "&&", path.join(dirname, "../cli.js"), ...args],
    {
      maxBuffer: 100000000,
      buffer: true,
      shell: true,
    }
  );

  if (result.status) {
    console.log(
      `child process exited with non-zero code: ${`\u001b[${31}m${
        result.status
      }\u001b[${39}m`}`
    );
    console.log(String(result.stdout));
  }
}

export { spawn };
