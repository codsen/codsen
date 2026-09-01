// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync } from "node:fs";
import { chmod, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { execa, execaCommand } from "execa";
import pMap from "p-map";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { readJson, writeJson } from "../json-file.js";
import { processFiles } from "../process-files.js";

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
        path.join(tempFolder, "test1/.somethinginyml"), // - JSON dotfile without an extension
        "{}",
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

  await pMap(testFilePaths, (oneOfTestFilePaths, testIndex) =>
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
        path.join(tempFolder, "test1/.somethinginyml"), // - JSON dotfile without an extension
        "{}",
      ),
    )
    .then(() =>
      writeFile(path.join(tempFolder, "test1/broken.json"), '{a": "b"}\n'),
    );

  let result = await execa("./cli.js", [tempFolder], { reject: false });
  let processedFileContents = await pMap(testFilePaths, (oneOfPaths) =>
    readJson(path.join(tempFolder, oneOfPaths), "utf8"),
  ).then((contentsArray) =>
    pMap(contentsArray, (oneOfArrays) => JSON.stringify(oneOfArrays, null, 2)),
  );

  equal(result.exitCode, 1, "02.01");
  match(result.stderr, /broken\.json.*BAD/, "02.02");
  match(result.stdout, /files sorted/, "02.03");
  match(result.stderr, /1 file could not be sorted/, "02.04");
  equal(processedFileContents, sortedTestFileContents, "02.05");
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
    /The inputs don't lead to any JSON files\. Exiting\./,
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

test("08 - atomically replaces a read-only file and preserves its mode", async () => {
  let tempFolder = temporaryDirectory();
  let pathOfTheTestfile = path.join(tempFolder, "readonly.json");
  await writeFile(pathOfTheTestfile, '{"z":1,"a":2}');
  await chmod(pathOfTheTestfile, 0o444);

  try {
    let result = await execa("./cli.js", [pathOfTheTestfile], {
      reject: false,
    });
    equal(result.exitCode, 0, "08.01");
    equal(
      await readFile(pathOfTheTestfile, "utf8"),
      '{\n  "a": 2,\n  "z": 1\n}\n',
      "08.02",
    );
    equal((await stat(pathOfTheTestfile)).mode & 0o777, 0o444, "08.03");
  } finally {
    await chmod(pathOfTheTestfile, 0o644);
  }
});

test("09 - an injected read failure has a structured stage", async () => {
  let receivedError;

  try {
    await processFiles(["unreadable.json"], {
      read: async () => {
        throw new Error("injected read failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.name, "ProcessingError", "09.01");
  equal(receivedError?.failures[0].stage, "read", "09.02");
  equal(receivedError?.successful, [], "09.03");
});

test("10 - an injected parse failure has a structured stage", async () => {
  let receivedError;

  try {
    await processFiles(["malformed.json"], {
      parse: () => {
        throw new Error("injected parse failure");
      },
      read: async () => "{}",
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "parse", "10.01");
  equal(
    receivedError?.failures[0].error.message,
    "injected parse failure",
    "10.02",
  );
});

test("11 - an injected transform failure has a structured stage", async () => {
  let receivedError;

  try {
    await processFiles(["invalid.json"], {
      read: async () => "{}",
      transform: () => {
        throw new Error("injected transform failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "transform", "11.01");
  equal(
    receivedError?.failures[0].error.message,
    "injected transform failure",
    "11.02",
  );
});

test("12 - an injected write failure has a structured stage", async () => {
  let receivedError;

  try {
    await processFiles(["unwritable.json"], {
      read: async () => "{}",
      write: async () => {
        throw new Error("injected write failure");
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "write", "12.01");
  equal(
    receivedError?.failures[0].error.message,
    "injected write failure",
    "12.02",
  );
});

test("13 - malformed CI input never claims all files are sorted", async () => {
  let tempFolder = temporaryDirectory();
  let sortedPath = path.join(tempFolder, "sorted.json");
  let unsortedPath = path.join(tempFolder, "unsorted.json");
  let malformedPath = path.join(tempFolder, "malformed.json");
  await Promise.all([
    writeFile(sortedPath, '{\n  "a": 1,\n  "b": 2\n}\n'),
    writeFile(unsortedPath, '{"b":2,"a":1}\n'),
    writeFile(malformedPath, '{"a":}\n'),
  ]);

  let result = await execa(path.resolve("./cli.js"), ["--ci", "*.json"], {
    cwd: tempFolder,
    reject: false,
  });

  equal(result.exitCode, 1, "13.01");
  match(result.stdout, /Unsorted files:/, "13.02");
  match(result.stdout, /unsorted\.json/, "13.03");
  match(result.stderr, /1 file could not be checked/, "13.04");
  equal(
    result.stdout.includes("All files were already sorted"),
    false,
    "13.05",
  );
  equal(await readFile(unsortedPath, "utf8"), '{"b":2,"a":1}\n', "13.06");
});

test("14 - CI failures still report already-sorted files", async () => {
  let tempFolder = temporaryDirectory();
  let sortedPath = path.join(tempFolder, "sorted.json");
  let malformedPath = path.join(tempFolder, "malformed.json");
  await Promise.all([
    writeFile(sortedPath, '{\n  "a": 1,\n  "b": 2\n}\n'),
    writeFile(malformedPath, '{"a":}\n'),
  ]);

  let result = await execa(path.resolve("./cli.js"), ["--ci", "*.json"], {
    cwd: tempFolder,
    reject: false,
  });

  equal(result.exitCode, 1, "14.01");
  match(result.stdout, /1 file already sorted:/, "14.02");
  match(result.stdout, /(?:^|\n)sorted\.json(?:\n|$)/, "14.03");
  match(result.stderr, /1 file could not be checked/, "14.04");
  not.match(result.stdout, /All files were already sorted/, "14.05");
  equal(await readFile(malformedPath, "utf8"), '{"a":}\n', "14.06");
});

test.run();
