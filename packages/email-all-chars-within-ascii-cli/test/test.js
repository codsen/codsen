import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import tap from "tap";
import execa from "execa";
import tempy from "tempy";

tap.test("01 - called upon a single file which is healthy", async (t) => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";

  // 2. asynchronously write the test file

  await fs.writeFile(path.join(tempFolder, "test.html"), "aaa");

  // 3. call the the CLI via the shell because there are no "path" argument
  // that's fed into the CLI - on the contrary, it's called from some unknown
  // location which is "current folder" from the perspective of where it's ran from,
  // but from testing perspective, it's a different folder.

  const stdOutContents = await execa(
    `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
    {
      shell: true,
    }
  );
  t.match(stdOutContents.stdout, /ALL OK/, "01");
  t.end();
});

tap.test(
  "02 - called upon a single file which contains non-ASCII symbol",
  async (t) => {
    // 1. fetch us an empty, random, temporary folder:

    // Re-route the test files into `temp/` folder instead for easier access when
    // troubleshooting. Just comment out one of two:
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";

    // 2. asynchronously write the test file

    await fs.writeFile(path.join(tempFolder, "test.html"), "£20");

    // 3. call the the CLI

    // const error1 = await t.throwsAsync(() =>
    t.rejects(async () => {
      const error1 = await execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
        { shell: true }
      );
      t.match(error1.stdout, /bad character/);
    }, "02");

    t.end();
  }
);

tap.test("03 - version output mode", async (t) => {
  const reportedVersion1 = await execa("./cli.js", ["-v"]);
  t.match(reportedVersion1.stdout.trim(), /\d\.\d/, "03.01");

  const reportedVersion2 = await execa("./cli.js", ["--version"]);
  t.match(reportedVersion2.stdout.trim(), /\d\.\d/, "03.02");
  t.end();
});

tap.test("04 - help output mode", async (t) => {
  const reportedVersion1 = await execa("./cli.js", ["-h"]);
  t.match(reportedVersion1.stdout, /Usage/, "04.01");
  t.match(reportedVersion1.stdout, /Options/, "04.02");
  t.match(reportedVersion1.stdout, /Instructions/, "04.03");

  const reportedVersion2 = await execa("./cli.js", ["--help"]);
  t.match(reportedVersion2.stdout, /Usage/, "04.04");
  t.match(reportedVersion2.stdout, /Options/, "04.05");
  t.match(reportedVersion2.stdout, /Instructions/, "04.06");
  t.end();
});

tap.test("05 - no files found in the given directory", async (t) => {
  // fetch us a random temp folder
  const tempFolder = tempy.directory();
  // call execa on that empty folder

  // CLI will complain no files could be found
  await t.rejects(async () => {
    const error1 = await execa(
      `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
      { shell: true }
    );
    t.match(error1.stdout, /there are no files in this folder/);
  });

  t.end();
});
