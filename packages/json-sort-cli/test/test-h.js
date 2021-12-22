import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa } from "execa";
import tempy from "tempy";
// import pMap from "p-map";
// import pack from "../package.json";
// import {
//   testFileContents,
//   sortedTestFileContents,
//   testFilePaths,
//   sortedTabbedTestFileContents,
//   minifiedContents,
//   prettifiedContents,
// } from "./util/data.js";

// -----------------------------------------------------------------------------

test("01 - help output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-h"]);
  match(reportedVersion1.stdout, /Usage/, "01.01");
  match(reportedVersion1.stdout, /Options/, "01.02");
  match(reportedVersion1.stdout, /Example/, "01.03");

  let reportedVersion2 = await execa("./cli.js", ["--help"]);
  match(reportedVersion2.stdout, /Usage/, "01.04");
  match(reportedVersion2.stdout, /Options/, "01.05");
  match(reportedVersion2.stdout, /Example/, "01.06");
});

test("02 - help flag trumps silent flag", async () => {
  let unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", [tempFolder, "-h", "-s"]).catch(
    (err) => {
      throw new Error(err);
    }
  );

  match(output.stdout, /Usage/, "02.01");
  match(output.stdout, /Options/, "02.02");
  equal(output.exitCode, 0, "02.03");
  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02.04 - file is untouched though"
  );
});

test.run();
