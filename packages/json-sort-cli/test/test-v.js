import fs from "fs-extra";
import path from "path";
import tap from "tap";
import execa from "execa";
import tempy from "tempy";
// import pMap from "p-map";
import pack from "../package.json";
// import {
//   testFileContents,
//   sortedTestFileContents,
//   testFilePaths,
//   sortedTabbedTestFileContents,
//   minifiedContents,
//   prettifiedContents,
// } from "./util/data.js";

// -----------------------------------------------------------------------------

tap.test("01 - version output mode", async (t) => {
  const reportedVersion1 = await execa("./cli.js", ["-v"]);
  t.equal(reportedVersion1.stdout, pack.version, "01.01");

  const reportedVersion2 = await execa("./cli.js", ["--version"]);
  t.equal(reportedVersion2.stdout, pack.version, "01.02");
  t.end();
});

tap.test("02 - version flag trumps silent flag", async (t) => {
  const unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  const output = await execa("./cli.js", [tempFolder, "-v", "-s"]).catch(
    (err) => t.fail(err)
  );

  t.match(output.stdout, /\d+\.\d+\.\d+/, "02.01");
  t.match(output.exitCode, 0, "02.02");
  t.strictSame(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02.03 - file is untouched though"
  );
  t.end();
});
