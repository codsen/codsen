// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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
  match(reportedVersion2.stdout, /--stdout/, "01.07");
  match(reportedVersion2.stdout, /cat YOURFILE\.json \| jsonsort/, "01.08");
});

test("02 - help flag trumps silent flag", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", [tempFolder, "-h", "-s"]).catch(
    (err) => {
      throw new Error(err);
    },
  );

  match(output.stdout, /Usage/, "02.01");
  match(output.stdout, /Options/, "02.02");
  equal(output.exitCode, 0, "02.03");
  equal(
    readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02.04",
  );
});

test.run();
