import { promises as fs, statSync } from "fs";
import objectPath from "object-path";
import partition from "lodash.partition";
import { pull } from "array-pull-all-with-glob";
import writeFileAtomic from "write-file-atomic";
// import { removeTbc } from "./_util.js";

// writes .npmignore
async function npmIgnore({
  // state,
  lectrc,
}) {
  // insurance
  if (typeof lectrc !== "object") {
    return Promise.reject(
      new Error(
        `lect/npmIgnore.js: ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} lectrc was passed empty`
      )
    );
  }

  // always include these folders
  let foldersBlacklist = ["coverage", ".turbo"];

  // always include these files
  let filesBlacklist = [".npmignore"];

  // List from https://docs.npmjs.com/misc/developers
  let npmWillTakeCareOfThese = [
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

  let files = await fs.readdir("./");

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
  }

  // F I L E S   S E C O N D

  let badFiles = [];
  let unclearFiles = [];
  [badFiles, unclearFiles] = partition(filesList, (filesName) =>
    get("npmignore.badFiles").includes(filesName)
  );
  // if (state.isCJS) {
  //   badFiles.push(`dist/${removeTbc(state.pack.name)}.esm.js`);
  // }
  unclearFiles = pull(unclearFiles, get("npmignore.goodFiles"), {
    caseSensitive: false,
  });

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
  }

  // A S S E M B L E   T H E   F I N A L   N P M I G N O R E

  let finalNpmIgnoreFile = `# folders:\n${[
    ...new Set(badFolders.concat(foldersBlacklist)),
  ]
    .sort()
    .join("\n")}\n\n# files:\n${[...new Set(badFiles.concat(filesBlacklist))]
    .sort()
    .join("\n")}\n`;

  try {
    return writeFileAtomic(".npmignore", finalNpmIgnoreFile);
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
}

export default npmIgnore;
