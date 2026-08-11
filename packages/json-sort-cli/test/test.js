// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync } from "node:fs";
import { chmod, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { execa, execaCommand } from "execa";
import pMap from "p-map";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { readJson, writeJson } from "../json-file.js";

// import pack from "../package.json";
import {
  // sortedTabbedTestFileContents,
  minifiedContents,
  prettifiedContents,
  sortedTestFileContents,
  testFileContents,
  testFilePaths,
} from "./util/data.js";

// -----------------------------------------------------------------------------

test("01 - default sort, called on the whole folder", async () => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  mkdirSync(path.join(tempFolder, "test1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test1/folder1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test2"), { recursive: true });

  // 2. asynchronously write all test files

  let processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex],
      ),
  )
    .then(() =>
      writeFile(
        path.join(tempFolder, "test1/.something.yml"), //  - dotfile in yml with yml extension
        "foo:\n  bar",
      ),
    )
    .then(() =>
      writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar",
      ),
    )
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() =>
      pMap(testFilePaths, (oneOfPaths) =>
        readJson(path.join(tempFolder, oneOfPaths), "utf8"),
      ).then((contentsArray) => {
        return pMap(contentsArray, (oneOfArrays) =>
          JSON.stringify(oneOfArrays, null, 2),
        );
      }),
    )
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, sortedTestFileContents, "01.01");
});

test("02 - sort, there's a broken JSON among files", async () => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  mkdirSync(path.join(tempFolder, "test1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test1/folder1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "test2"), { recursive: true });

  // 2. asynchronously write all test files

  let processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex],
      ),
  )
    .then(() =>
      writeFile(
        path.join(tempFolder, "test1/.something.yml"), // - dotfile in yml with yml extension
        "foo:\n  bar",
      ),
    )
    .then(() =>
      writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar",
      ),
    )
    .then(() =>
      writeFile(path.join(tempFolder, "test1/broken.json"), '{a": "b"}\n'),
    )
    .then(() => execa("./cli.js", [tempFolder]))
    .then((receivedStdOut) => {
      match(receivedStdOut.stdout, /broken\.json/);
      return pMap(testFilePaths, (oneOfPaths) =>
        readJson(path.join(tempFolder, oneOfPaths), "utf8"),
      ).then((contentsArray) => {
        return pMap(contentsArray, (oneOfArrays) =>
          JSON.stringify(oneOfArrays, null, 2),
        );
      });
    })
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, sortedTestFileContents, "02.01");
});

test("03 - fixes minified dotfiles in JSON format", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, ".eslintrc.json");

  let processedFileContents = writeFile(pathOfTheTestfile, minifiedContents)
    .then(() => execa("./cli.js", [tempFolder, ".eslintrc.json"]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(await processedFileContents, prettifiedContents, "03.01");
});

test("04 - topmost level is array", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  let processedFileContents = writeFile(
    pathOfTheTestfile,
    JSON.stringify(
      [
        {
          x: "y",
          a: "b",
        },
        {
          p: "r",
          c: "d",
        },
      ],
      null,
      2,
    ),
  )
    .then(() => execa("./cli.js", [tempFolder, "sortme.json"]))
    .then(() => readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      // execaCommand(`rm -rf ${path.join(path.resolve(), "../temp")}`)
      execaCommand(`rm -rf ${tempFolder}`).then(() => received),
    )
    .catch((err) => {
      throw new Error(err);
    });

  equal(
    await processedFileContents,
    `[
  {
    "a": "b",
    "x": "y"
  },
  {
    "c": "d",
    "p": "r"
  }
]\n`,
    "04.01",
  );
});

test("05 - no files found in the given directory", async () => {
  // fetch us a random temp folder
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";

  // call execa on that empty folder
  let stdOutContents = await execa("./cli.js", [tempFolder]);
  // CLI will complain no files could be found
  match(
    stdOutContents.stdout,
    /The inputs don't lead to any json files! Exiting./,
    "05.01",
  );
});

test("06 - defaults to JSON files in cwd and accepts primitive JSON", async () => {
  let tempFolder = temporaryDirectory();
  let pathOfTheTestfile = path.join(tempFolder, "package.json");
  await writeFile(pathOfTheTestfile, '"hello"');

  await execa(path.resolve("./cli.js"), [], { cwd: tempFolder });

  equal(await readFile(pathOfTheTestfile, "utf8"), '"hello"\n', "06.01");
});

test("07 - includes node_modules when requested for a directory", async () => {
  let tempFolder = temporaryDirectory();
  let nestedFolder = path.join(tempFolder, "node_modules", "fixture");
  mkdirSync(nestedFolder, { recursive: true });
  let pathOfTheTestfile = path.join(nestedFolder, "package.json");
  await writeFile(pathOfTheTestfile, '{"z":1,"a":2}');

  await execa("./cli.js", [tempFolder, "-n"]);

  equal(
    await readFile(pathOfTheTestfile, "utf8"),
    '{\n  "a": 2,\n  "z": 1\n}\n',
    "07.01",
  );
});

test("08 - reports a file which cannot be written", async () => {
  let tempFolder = temporaryDirectory();
  let pathOfTheTestfile = path.join(tempFolder, "readonly.json");
  await writeFile(pathOfTheTestfile, '{"z":1,"a":2}');
  await chmod(pathOfTheTestfile, 0o444);

  try {
    let result = await execa("./cli.js", [pathOfTheTestfile]);
    match(result.stdout, /readonly\.json.*BAD/, "08.01");
  } finally {
    await chmod(pathOfTheTestfile, 0o644);
  }
});

test.run();
