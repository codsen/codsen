import fs from "fs-extra";
import path from "path";
import tap from "tap";
import { execa, execaCommand } from "execa";
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

tap.test(
  "01 - unsorted package.json, targetting two folders simultaneously",
  async (t) => {
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(path.join(tempFolder, "fol1")));
    fs.ensureDirSync(path.resolve(path.join(tempFolder, "fol2")));
    const pathOfTheTestfile1 = path.join(
      path.join(tempFolder, "fol1"),
      "package.json"
    );
    const pathOfTheTestfile2 = path.join(
      path.join(tempFolder, "fol2"),
      "package.json"
    );
    const contents = `{
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  },
  "name": "tester"
}`;

    fs.writeFileSync(pathOfTheTestfile1, contents);
    fs.writeFileSync(pathOfTheTestfile2, contents);

    await execa("./cli.js", [
      path.join(tempFolder, "fol1"),
      path.join(tempFolder, "fol2"),
    ]);

    const file1 = fs.readFileSync(pathOfTheTestfile1, "utf8");
    const file2 = fs.readFileSync(pathOfTheTestfile2, "utf8");

    await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));

    t.strictSame(
      file1,
      `{
  "name": "tester",
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  }
}\n`,
      "01.01"
    );

    t.strictSame(
      file2,
      `{
  "name": "tester",
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  }
}\n`,
      "01.02"
    );

    t.end();
  }
);

tap.test("02 - already sorted package.json", async (t) => {
  const tempFolder = tempy.directory();
  const source = `{
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  },
  "name": "tester"
}
`;
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "package.json");

  const processedFileContents = fs
    .writeFile(pathOfTheTestfile, source)
    .then(() => execa("./cli.js", [tempFolder, "-p", "package.json"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received)
    )
    .catch((err) => t.fail(err));

  t.strictSame(await processedFileContents, source, "02");
  t.end();
});

tap.test("03 - empty array as package.json", async (t) => {
  const tempFolder = tempy.directory();
  const source = `[]\n`;
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "package.json");

  const processedFileContents = fs
    .writeFile(pathOfTheTestfile, source)
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received)
    )
    .catch((err) => t.fail(err));

  t.strictSame(await processedFileContents, source, "03");
  t.end();
});
