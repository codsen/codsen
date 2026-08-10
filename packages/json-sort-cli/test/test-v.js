// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

const require2 = createRequire(import.meta.url);
const pack = require2("../package.json");

// -----------------------------------------------------------------------------

test("01 - version output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-v"]);
  equal(reportedVersion1.stdout, pack.version, "01.01");

  let reportedVersion2 = await execa("./cli.js", ["--version"]);
  equal(reportedVersion2.stdout, pack.version, "01.02");
});

test("02 - version flag trumps silent flag", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", [tempFolder, "-v", "-s"]).catch(
    (err) => {
      throw new Error(err);
    },
  );

  match(output.stdout, /\d+\.\d+\.\d+/, "02.01");
  equal(output.exitCode, 0, "02.01");
  equal(
    readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02.02",
  );
});

test.run();
