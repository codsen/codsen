/* eslint no-param-reassign:0, max-len:0 */

/* The whole purpose of this script is to analyse all your open source project
folders and help you extract the definitive list of files to npm-ignore (or not).
*/

const fs = require("fs-extra");
const logSymbols = require("log-symbols");
const chalk = require("chalk");
const pReduce = require("p-reduce");
const util = require("util");
const matcher = require("matcher");
const partition = require("lodash.partition");
const inquirer = require("inquirer");
const objectPath = require("object-path");

const readdir = util.promisify(fs.readdir);
const access = util.promisify(fs.access);

const { log } = console;
const foldersToIgnore = ["test", "_archive", "_deprecated"]; // these folders will be skipped

// List from https://docs.npmjs.com/misc/developers
const npmWillTakeCareOfThese = [
  "package.json",
  "README*",
  "CHANGES*",
  "CHANGELOG*",
  "HISTORY*",
  "LICENSE*",
  "LICENCE*",
  "NOTICE*",
  ".git",
  "CVS*",
  ".svn",
  ".hg",
  ".lock-wscript",
  ".wafpickle-N",
  ".*.swp",
  ".DS_Store",
  "._*",
  "npm-debug.log",
  ".npmrc",
  "node_modules",
  "config.gypi",
  "*.orig",
  "package-lock.json",
];

const definitelyBadFolders = [
  ".*",
  "lib-cov",
  "coverage",
  "src",
  "test",
  "logs",
  "media",
  "tests",
  "spec",
];

const definitelyBadFiles = [
  ".*",
  "rollup.config.js",
  "*.gif",
  "*.psd",
  "*.jpg",
  "*.jpeg",
  "*.png",
  "*.zip",
  "*.md",
  "*CONTRIBUTING*",
  "test*",
  "tests*",
  "*spec.js",
];

const isArr = Array.isArray;

function removeOfficiallyTakenCareOf(arr = []) {
  return matcher(
    arr.map((val) => val.toLowerCase()),
    npmWillTakeCareOfThese.map((val) => `!${val.toLowerCase()}`)
  );
}

const encodingStr = "dhe1o2r3t4e5h6j7d8f9g";

function encodeDot(something) {
  if (typeof something === "string") {
    return something.replace(/\./g, encodingStr);
  }
  if (isArr(something)) {
    return something.map((val) => val.replace(/\./g, encodingStr));
  }
  throw new Error("lect/init-npmignore.js > encodeDot(): bad input");
}

function decodeDot(something) {
  if (typeof something === "string") {
    return something.replace(RegExp(encodingStr, "g"), ".");
  }
  if (isArr(something)) {
    return something.map((val) => val.replace(RegExp(encodingStr, "g"), "."));
  }
  throw new Error(
    `lect/init-npmignore.js > decodeDot(): bad input, ${typeof something}`
  );
}

function askUser(unsureAboutTheseFolders, what = "folder") {
  return inquirer.prompt(
    unsureAboutTheseFolders.map((pathName, i, arr) => ({
      type: "list",
      name: pathName,
      message: `${chalk.grey(
        `${i + 1}/${arr.length}`
      )} Do you want to include ${what} ${chalk.yellow.bold(
        decodeDot(pathName)
      )} on all .npmignore's?`,
      choices: [
        { name: "no", value: false },
        { name: "yes", value: true },
      ],
    }))
  );
}

// takes plain object {folders: ['..', '..'], files: ['..', '..']} and prepares
// the final file to write
async function prepRes(res) {
  let finalGoodFolders = [];
  let finalBadFolders = [];
  let finalGoodFiles = [];
  let finalBadFiles = [];

  //     F O L D E R S

  // First, extract folders that we know should definitely go into global npmignore.
  // That's folders listed in in "definitelyBadFolders"
  let [knownBadFolders, unsureAboutTheseFolders] = partition(
    res.folders,
    (foldersName) =>
      definitelyBadFolders.some((ignoreThisOne) =>
        matcher.isMatch(foldersName.toLowerCase(), ignoreThisOne.toLowerCase())
      )
  );
  knownBadFolders = knownBadFolders.map(encodeDot);
  unsureAboutTheseFolders = unsureAboutTheseFolders.map(encodeDot);

  const checkFolder = await askUser(unsureAboutTheseFolders);
  const [confirmedBadFolders, confirmedGoodFolders] = partition(
    Object.keys(checkFolder),
    (key) => checkFolder[key]
  );

  finalBadFolders = finalBadFolders
    .concat(knownBadFolders, confirmedBadFolders)
    .map(decodeDot);
  finalGoodFolders = finalGoodFolders
    .concat(confirmedGoodFolders)
    .map(decodeDot);

  //     F I L E S

  // First, extract folders that we know should definitely go into global npmignore.
  // That's folders listed in in "definitelyBadFolders"
  let [knownBadFiles, unsureAboutTheseFiles] = partition(
    res.files,
    (filesName) =>
      definitelyBadFiles.some((ignoreThisOne) =>
        matcher.isMatch(filesName.toLowerCase(), ignoreThisOne.toLowerCase())
      )
  );
  knownBadFiles = knownBadFiles.map(encodeDot);
  unsureAboutTheseFiles = unsureAboutTheseFiles.map(encodeDot);

  // console.log(`knownBadFiles = ${JSON.stringify(knownBadFiles.map(decodeDot), null, 4)}`)
  // console.log(`unsureAboutTheseFiles = ${JSON.stringify(unsureAboutTheseFiles.map(decodeDot), null, 4)}`)

  const checkFile = await askUser(unsureAboutTheseFiles, "file");

  const [confirmedBadFiles, confirmedGoodFiles] = partition(
    Object.keys(checkFile),
    (key) => checkFile[key]
  );
  // console.log(`confirmedGoodFiles = ${JSON.stringify(confirmedGoodFiles.map(decodeDot), null, 4)}`)
  // console.log(`confirmedBadFiles = ${JSON.stringify(confirmedBadFiles.map(decodeDot), null, 4)}`)

  finalBadFiles = finalBadFiles
    .concat(knownBadFiles, confirmedBadFiles)
    .map(decodeDot);
  finalGoodFiles = finalGoodFiles.concat(confirmedGoodFiles).map(decodeDot);
  // console.log(`finalBadFiles = ${JSON.stringify(finalBadFiles, null, 4)}`)
  // console.log(`finalGoodFiles = ${JSON.stringify(finalGoodFiles, null, 4)}`)

  //     W R I T E   O U T   T O   L E C T R C

  fs.readJson(".lectrc.json", (err, lectrc) => {
    if (err) {
      fs.writeJson(
        ".lectrc.json",
        {
          npmignore: {
            badFiles: finalBadFiles,
            badFolders: finalBadFolders,
            goodFiles: finalGoodFiles,
            goodFolders: finalGoodFolders,
          },
        },
        { spaces: 2 },
        (err2) => {
          if (err2) {
            log(
              `${chalk.red(
                logSymbols.error,
                `could not write .lectrc.json:\n${err2}`
              )}`
            );
            process.exit(1);
          }
          log(
            `${chalk.green(logSymbols.success, ".lectrc.json.npmignore OK")}`
          );
          process.exit(0);
        }
      );
    } else {
      objectPath.set(lectrc, "npmignore", {
        badFiles: finalBadFiles,
        badFolders: finalBadFolders,
        goodFiles: finalGoodFiles,
        goodFolders: finalGoodFolders,
      });
      fs.writeJson(".lectrc.json", lectrc, { spaces: 2 }, (err2) => {
        if (err2) {
          log(
            `${chalk.red(
              logSymbols.error,
              `could not write .lectrc.json:\n${err2}`
            )}`
          );
          process.exit(1);
        }
        log(`${chalk.green(logSymbols.success, ".lectrc.json.npmignore OK")}`);
        process.exit(0);
      });
    }
  });
}

function initNpmIgnore() {
  // 1. generate a list of unique file and folder names
  fs.readdir("./", (err2, contents) => {
    if (err2) {
      log(
        `${chalk.red(
          logSymbols.error,
          `could not read the root folder:\n${err2}`
        )}`
      );
      process.exit(1);
    }
    const projects = contents.filter((file) => fs.statSync(file).isDirectory());
    // extract the list of all unique file names and all unique folder names
    // from each subfolder (only 1 level-deep within root) which has "package.json"
    // inside.
    pReduce(
      projects.map((val) => Promise.resolve(val)),
      (res, projectFolder) =>
        readdir(`${projectFolder}`)
          .then((contents2) =>
            access(`${projectFolder}/package.json`)
              .then(() => {
                contents2.forEach((fileOrFolderName) => {
                  if (
                    !foldersToIgnore.some((el) =>
                      matcher.isMatch(projectFolder, el)
                    )
                  ) {
                    if (
                      fs
                        .statSync(`${projectFolder}/${fileOrFolderName}`)
                        .isDirectory()
                    ) {
                      res.folders.push(fileOrFolderName);
                    } else {
                      res.files.push(fileOrFolderName);
                    }
                  }
                });
                return res;
              })
              .catch(() => res)
          )
          .catch((err) => log(err)),
      {
        folders: [],
        files: [],
      }
    )
      .then(({ folders, files }) => ({
        folders: removeOfficiallyTakenCareOf([...new Set(folders)].sort()),
        files: removeOfficiallyTakenCareOf([...new Set(files)].sort()),
      }))
      .then((res) => {
        prepRes(res);
      });
  });
}

module.exports = {
  initNpmIgnore,
  npmWillTakeCareOfThese,
  encodeDot,
  decodeDot,
};
