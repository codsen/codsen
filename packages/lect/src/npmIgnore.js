const fs = require("fs").promises;
const { statSync } = require("fs");
// const path = require("path");
const objectPath = require("object-path");
const partition = require("lodash.partition");
// const isEqual = require("lodash.isequal");
const { pull } = require("array-pull-all-with-glob");
// const { red, grey, yellow, green } = require("colorette");
const writeFileAtomic = require("write-file-atomic");
// const inquirer = require("inquirer");
// const mergeAdvanced = require("object-merge-advanced");

// writes .npmignore
async function npmIgnore({ lectrc }) {
  // insurance
  if (typeof lectrc !== "object") {
    return Promise.reject(
      new Error(
        `lect/npmIgnore.js: ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} lectrc was passed empty`
      )
    );
  }

  // always include these folders
  const foldersBlacklist = [".nyc_output"];

  // always include these files
  const filesBlacklist = ["testStats.md"];

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

  // const encodingStr = "dhe1o2r3t4e5h6j7d8f9g";

  // function encodeDot(something) {
  //   if (typeof something === "string") {
  //     return something.replace(/\./g, encodingStr);
  //   }
  //   if (Array.isArray(something)) {
  //     return something.map((val) => val.replace(/\./g, encodingStr));
  //   }
  //   throw new Error("lect/init-npmignore.js > encodeDot(): bad input");
  // }

  // function decodeDot(something) {
  //   if (typeof something === "string") {
  //     return something.replace(RegExp(encodingStr, "g"), ".");
  //   }
  //   if (Array.isArray(something)) {
  //     return something.map((val) => val.replace(RegExp(encodingStr, "g"), "."));
  //   }
  //   throw new Error(
  //     `lect/init-npmignore.js > decodeDot(): bad input, ${typeof something}`
  //   );
  // }

  function get(p) {
    return objectPath.get(lectrc, p) || [];
  }

  // function ask(regardingSomePath, what = "folder") {
  //   return inquirer.prompt(
  //     regardingSomePath.map((pathName, i, arr) => ({
  //       type: "list",
  //       name: pathName,
  //       message: `${grey(
  //         `${i + 1}/${arr.length}`
  //       )} What should we do with ${what} ${yellow.bold(decodeDot(pathName))}?`,
  //       choices: [
  //         {
  //           name: `${green("do not put")} onto any .npmignore`,
  //           value: false,
  //         },
  //         {
  //           name: `${red("put")} onto ${yellow(
  //             "global"
  //           )} lectrc npmignore list in .lectrc`,
  //           value: 2,
  //         },
  //       ],
  //     }))
  //   );
  // }

  // -----------------------------------------------------------------------------

  const files = await fs.readdir("./");

  let filesList = [];
  let foldersList = [];
  for (let i = files.length; i--; ) {
    try {
      if (statSync(files[i]).isDirectory()) {
        foldersList.push(files[i]);
      } else {
        filesList.push(files[i]);
      }
    } catch (e) {
      //
    }
  }

  foldersList = pull(foldersList, npmWillTakeCareOfThese, {
    caseSensitive: false,
  });
  filesList = pull(filesList, npmWillTakeCareOfThese, { caseSensitive: false });

  // F O L D E R S   F I R S T

  let badFolders = [];
  let unclearFolders = [];
  [badFolders, unclearFolders] = partition(foldersList, (foldersName) =>
    get("npmignore.badFolders").includes(foldersName)
  );
  unclearFolders = pull(unclearFolders, get("npmignore.goodFolders"), {
    caseSensitive: false,
  });
  // let foldersToAddToGlobalList = [];

  if (Array.isArray(unclearFolders) && unclearFolders.length > 0) {
    // const folderAnswers = await ask(encodeDot(unclearFolders));
    console.log(
      `lect/npmIgnore.js: add folders to .lectrc.json: ${`\u001b[${31}m${unclearFolders.join(
        ", "
      )}\u001b[${39}m`}`
    );
    return Promise.reject(
      new Error(`add folders to .lectrc.json: ${unclearFolders.join(", ")}`)
    );
    // remove paths which are equal to "false". Leave only ones with values 1 & 2.
    // [foldersToAddToGlobalList] = partition(
    //   Object.keys(folderAnswers).filter((key1) => folderAnswers[key1]),
    //   (key2) => folderAnswers[key2] === 1
    // );
    // foldersToAddToGlobalList = decodeDot(foldersToAddToGlobalList);
  }

  // F I L E S   S E C O N D

  let badFiles = [];
  let unclearFiles = [];
  [badFiles, unclearFiles] = partition(filesList, (filesName) =>
    get("npmignore.badFiles").includes(filesName)
  );
  unclearFiles = pull(unclearFiles, get("npmignore.goodFiles"), {
    caseSensitive: false,
  });
  // let filesToAddToGlobalList = [];

  if (Array.isArray(unclearFiles) && unclearFiles.length) {
    // const fileAnswers = await ask(encodeDot(unclearFiles), "file");
    console.log(
      `lect/npmIgnore.js: add files to .lectrc.json: ${`\u001b[${31}m${unclearFiles.join(
        ", "
      )}\u001b[${39}m`}`
    );
    return Promise.reject(
      new Error(`add files to .lectrc.json: ${unclearFiles.join(", ")}`)
    );
    // remove paths which are equal to "false". Leave only ones with values 1 & 2.
    // [filesToAddToGlobalList] = partition(
    //   Object.keys(fileAnswers).filter((key1) => fileAnswers[key1]),
    //   (key2) => fileAnswers[key2] === 1
    // );
    // filesToAddToGlobalList = decodeDot(filesToAddToGlobalList);
  }

  // A S S E M B L E   T H E   F I N A L   N P M I G N O R E

  const frontStr =
    "# generated using codsen.com/os/lect \n#\n#\n#       __         ______     ______     ______  \n#      /\\ \\       /\\  ___\\   /\\  ___\\   /\\__  _\\ \n#      \\ \\ \\____  \\ \\  __\\   \\ \\ \\____  \\/_/\\ \\/ \n#       \\ \\_____\\  \\ \\_____\\  \\ \\_____\\    \\ \\_\\ \n#        \\/_____/   \\/_____/   \\/_____/     \\/_/ \n#  \n#\n";

  const finalNpmIgnoreFile = `${frontStr}\n# folders:\n\n${[
    ...new Set(badFolders.concat(foldersBlacklist)),
  ]
    .sort()
    .join("\n")}\n\n# files:\n\n${[...new Set(badFiles.concat(filesBlacklist))]
    .sort()
    .join("\n")}\n`;

  try {
    await writeFileAtomic(".npmignore", finalNpmIgnoreFile);
    // console.log(`lect .npmignore ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);

    // don't return, there is more job to do
  } catch (err) {
    console.log(
      `lect: ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} could not write .npmignore - ${err}`
    );
    return Promise.reject(err);
  }

  // !!!
  // we can't write .lectrc because there's nothing new to write -
  // inquirer can't be triggered from within the async promises array
  // therefore all amends to whitelists or blacklists inside .lectrc
  // have to be done manually
  // !!!

  // set the values to be written to .lectrc.json
  // if (foldersToAddToGlobalList.length) {
  //   objectPath.set(
  //     lectrc,
  //     "npmignore.badFolders",
  //     mergeAdvanced(
  //       objectPath.get(lectrc, "npmignore.badFolders"),
  //       foldersToAddToGlobalList
  //     ).sort()
  //   );
  // }
  // if (filesToAddToGlobalList.length) {
  //   objectPath.set(
  //     lectrc,
  //     "npmignore.badFiles",
  //     mergeAdvanced(
  //       objectPath.get(lectrc, "npmignore.badFiles"),
  //       filesToAddToGlobalList
  //     ).sort()
  //   );
  // }

  // // compare with the original
  // if (!isEqual(lectrc, state.originalLectrc)) {
  //   try {
  //     console.log(`220 lect/npmIgnore.js`);
  //     await writeFileAtomic(
  //       path.resolve("../.lectrc.json"),
  //       JSON.stringify(lectrc, null, 2)
  //     );
  //     console.log(`lect .lectrc.json ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);

  //     // don't return, there is more job to do
  //   } catch (err) {
  //     console.log(
  //       `lect: ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} could not write .lectrc.json - ${err}`
  //     );
  //     return Promise.reject(err);
  //   }
  // }
}

module.exports = npmIgnore;
