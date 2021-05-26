import fs from "fs-extra";
import path from "path";
import tap from "tap";
import execa from "execa";
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
  "01 - when asked, sorts arrays which contain only strings",
  async (t) => {
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

    const processedFileContents = fs
      .writeFile(
        pathOfTheTestfile,
        JSON.stringify(["a", "A", "z", "Z", "m", "M"], null, 2)
      )
      .then(() => execa("./cli.js", [tempFolder, "-a", "sortme.json"]))
      .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
      .then((received) =>
        execa
          // .command(`rm -rf ${path.join(__dirname, "../temp")}`)
          .command(`rm -rf ${tempFolder}`)
          .then(() => received)
      )
      .catch((err) => t.fail(err));

    t.strictSame(
      await processedFileContents,
      `[
  "a",
  "A",
  "m",
  "M",
  "z",
  "Z"
]\n`,
      "01"
    );
    t.end();
  }
);

tap.test(
  "02 - when not asked, does not sort arrays which contain only strings",
  async (t) => {
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    const pathOfTheTestfile = path.join(tempFolder, "sortme.json");
    const sourceArr = ["Z", "A", "z", "m", "M", "a"];

    const processedFileContents = fs
      .writeFile(pathOfTheTestfile, JSON.stringify(sourceArr, null, 2))
      .then(() => execa("./cli.js", [tempFolder, "sortme.json"]))
      .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
      .then((received) =>
        execa
          // .command(`rm -rf ${path.join(__dirname, "../temp")}`)
          .command(`rm -rf ${tempFolder}`)
          .then(() => received)
      )
      .catch((err) => t.fail(err));
    t.strictSame(
      await processedFileContents,
      `${JSON.stringify(sourceArr, null, 2)}\n`,
      "02"
    );
    t.end();
  }
);

tap.test("03 - array in deeper levels sorted (upon request)", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  const processedFileContents = fs
    .writeFile(
      pathOfTheTestfile,
      JSON.stringify(
        {
          a: {
            b: [
              {
                c: "d",
              },
              ["z", "m", "A"],
            ],
          },
        },
        null,
        2
      )
    )
    .then(() => execa("./cli.js", [tempFolder, "-a", "sortme.json"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then((received) =>
      execa
        // .command(`rm -rf ${path.join(__dirname, "../temp")}`)
        .command(`rm -rf ${tempFolder}`)
        .then(() => received)
    )
    .catch((err) => t.fail(err));

  t.strictSame(
    await processedFileContents,
    `{
  "a": {
    "b": [
      {
        "c": "d"
      },
      [
        "A",
        "m",
        "z"
      ]
    ]
  }
}\n`,
    "03"
  );
  t.end();
});
