import fs from "fs-extra";
import path from "path";
import tap from "tap";
import execa from "execa";
import tempy from "tempy";

tap.test("01.01 - called upon a single file which is healthy", async (t) => {
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
  // but from testing perspective, it's a different folder. I know, it's mind-
  // bending, but to be able to call the CLI as from "current folder" but that
  // current folder being arbitrary path, we have to manually "cd" into it
  // via the shell command (so it's "current"), then call CLI from CLI's location,
  // the "__dirname", along with all attributes.

  const stdOutContents = await execa(
    `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
    { shell: true }
  );
  t.match(stdOutContents.stdout, /ALL OK/);
  t.end();
});

tap.test(
  "01.02 - called upon a single file which contains non-ASCII symbol",
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
    await t.rejects(async () => {
      const error1 = await execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
        { shell: true }
      );
      t.match(error1.stdout, /Non ascii character found/);
    });

    t.end();
  }
);

tap.test("01.03 - version output mode", async (t) => {
  const reportedVersion1 = await execa("./cli.js", ["-v"]);
  t.match(reportedVersion1.stdout.trim(), /\d\.\d/);

  const reportedVersion2 = await execa("./cli.js", ["--version"]);
  t.match(reportedVersion2.stdout.trim(), /\d\.\d/);
  t.end();
});

tap.test("01.04 - help output mode", async (t) => {
  const reportedVersion1 = await execa("./cli.js", ["-h"]);
  t.match(reportedVersion1.stdout, /Usage/);
  t.match(reportedVersion1.stdout, /Options/);
  t.match(reportedVersion1.stdout, /Instructions/);

  const reportedVersion2 = await execa("./cli.js", ["--help"]);
  t.match(reportedVersion2.stdout, /Usage/);
  t.match(reportedVersion2.stdout, /Options/);
  t.match(reportedVersion2.stdout, /Instructions/);
  t.end();
});

tap.test("01.05 - no files found in the given directory", async (t) => {
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
