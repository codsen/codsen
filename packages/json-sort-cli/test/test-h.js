import fs from "fs-extra";
import path from "path";
import tap from "tap";
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

tap.test("01 - help output mode", async (t) => {
  const reportedVersion1 = await execa("./cli.js", ["-h"]);
  t.match(reportedVersion1.stdout, /Usage/, "01.01");
  t.match(reportedVersion1.stdout, /Options/, "01.02");
  t.match(reportedVersion1.stdout, /Example/, "01.03");

  const reportedVersion2 = await execa("./cli.js", ["--help"]);
  t.match(reportedVersion2.stdout, /Usage/, "01.04");
  t.match(reportedVersion2.stdout, /Options/, "01.05");
  t.match(reportedVersion2.stdout, /Example/, "01.06");
  t.end();
});

tap.test("02 - help flag trumps silent flag", async (t) => {
  const unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  const output = await execa("./cli.js", [tempFolder, "-h", "-s"]).catch(
    (err) => t.fail(err)
  );

  t.match(output.stdout, /Usage/, "02.01");
  t.match(output.stdout, /Options/, "02.02");
  t.match(output.exitCode, 0, "02.03");
  t.strictSame(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02.04 - file is untouched though"
  );
  t.end();
});
