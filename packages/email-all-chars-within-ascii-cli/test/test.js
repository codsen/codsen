import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("01 - called upon a single file which is healthy", async () => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write the test file

  await fs.writeFile(path.join(tempFolder, "test.html"), "aaa");

  // 3. call the the CLI via the shell because there are no "path" argument
  // that's fed into the CLI - on the contrary, it's called from some unknown
  // location which is "current folder" from the perspective of where it's ran from,
  // but from testing perspective, it's a different folder.

  let stdOutContents = await execa(
    `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
    {
      shell: true,
    },
  );
  match(stdOutContents.stdout, /ALL OK/, "01.01");
});

test("02 - called upon a single file which contains non-ASCII symbol", async () => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // 2. asynchronously write the test file

  await fs.writeFile(path.join(tempFolder, "test.html"), "£20");

  // 3. call the the CLI

  // const error1 = await t.throwsAsync(() =>
  let error1 = await execa(
    `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
    { shell: true },
  ).catch((e) => e);
  match(error1.stdout, /bad character/, "02.01");
});

test("03 - version output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-v"]);
  match(reportedVersion1.stdout.trim(), /\d\.\d/, "03.01");

  let reportedVersion2 = await execa("./cli.js", ["--version"]);
  match(reportedVersion2.stdout.trim(), /\d\.\d/, "03.02");
});

test("04 - help output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-h"]);
  match(reportedVersion1.stdout, /Usage/, "04.01");
  match(reportedVersion1.stdout, /Options/, "04.02");
  match(reportedVersion1.stdout, /Instructions/, "04.03");

  let reportedVersion2 = await execa("./cli.js", ["--help"]);
  match(reportedVersion2.stdout, /Usage/, "04.04");
  match(reportedVersion2.stdout, /Options/, "04.05");
  match(reportedVersion2.stdout, /Instructions/, "04.06");
});

test("05 - no files found in the given directory", async () => {
  // fetch us a random temp folder
  let tempFolder = temporaryDirectory();
  // call execa on that empty folder

  // CLI will complain no files could be found

  let error1 = await execa(
    `cd ${tempFolder} && ${path.join(__dirname, "../")}cli.js test.html`,
    { shell: true },
  ).catch((e) => e);
  match(error1.stdout, /THROW_ID_03/, "05.01");
});

test.run();
