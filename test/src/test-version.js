import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pack = require("../package.json");

// -----------------------------------------------------------------------------

test("01 - version output mode", async () => {
  let reportedVersion1 = await execa("./roast", ["-V"]);
  match(reportedVersion1.stdout, /\d+\.\d+\.\d+/, "01.01");

  let reportedVersion2 = await execa("./roast", ["--version"]);
  match(reportedVersion2.stdout, /\d+\.\d+\.\d+/, "01.02");
});

test("02 - version flag trumps silent flag", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./roast", [tempFolder, "-V", "-s"]).catch(
    (err) => {
      throw new Error(err);
    }
  );

  match(output.stdout, /\d+\.\d+\.\d+/, "02.01");
  equal(output.exitCode, 0, "02.02");
  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02.03"
  );
});

test.run();
