import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";
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

test("01 - unsorted package.json, targetting two folders simultaneously", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "fol1")));
  fs.ensureDirSync(path.resolve(path.join(tempFolder, "fol2")));
  let pathOfTheTestfile1 = path.join(
    path.join(tempFolder, "fol1"),
    "package.json"
  );
  let pathOfTheTestfile2 = path.join(
    path.join(tempFolder, "fol2"),
    "package.json"
  );
  let contents = `{
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

  let file1 = fs.readFileSync(pathOfTheTestfile1, "utf8");
  let file2 = fs.readFileSync(pathOfTheTestfile2, "utf8");

  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(
    file1,
    `{
  "name": "tester",
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  }
}\n`,
    "01.01"
  );

  equal(
    file2,
    `{
  "name": "tester",
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  }
}\n`,
    "01.02"
  );
});

test("02 - already sorted package.json", async () => {
  let tempFolder = temporaryDirectory();
  let source = `{
  "dependencies": {
    "ast-monkey-traverse": "^1.11.31"
  },
  "name": "tester"
}
`;
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "package.json");

  let processedFileContents = fs
    .writeFile(pathOfTheTestfile, source)
    .then(() => execa("./cli.js", [tempFolder, "-p", "package.json"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received)
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, source, "02");
});

test("03 - empty array as package.json", async () => {
  let tempFolder = temporaryDirectory();
  let source = `[]\n`;
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "package.json");

  let processedFileContents = fs
    .writeFile(pathOfTheTestfile, source)
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received)
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, source, "03");
});

test.run();
