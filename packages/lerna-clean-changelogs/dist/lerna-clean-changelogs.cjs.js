/**
 * lerna-clean-changelogs
 * Removes frivolous entries from commitizen generated changelogs
 * Version: 2.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/lerna-clean-changelogs/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version = "2.0.2";

var version$1 = version;

function isStr(something) {
  return typeof something === "string";
}

function cleanChangelogs(changelogContents) {
  // validate the first input argument:
  if (changelogContents === undefined) {
    throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");
  } else if (!isStr(changelogContents)) {
    throw new Error("lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as " + (Array.isArray(changelogContents) ? "array" : typeof changelogContents) + ", equal to:\n" + JSON.stringify(changelogContents, null, 4));
  }

  var final;
  var lastLineWasEmpty = false;

  if (typeof changelogContents === "string" && changelogContents.length && (!changelogContents.includes("\n") || !changelogContents.includes("\r"))) {
    var changelogEndedWithLinebreak = isStr(changelogContents) && changelogContents.length && (changelogContents[changelogContents.length - 1] === "\n" || changelogContents[changelogContents.length - 1] === "\r"); // eslint-disable-next-line no-param-reassign

    changelogContents = changelogContents.trim().replace(/(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g, "$1commit/");
    var linesArr = changelogContents.split(/\r?\n/); // console.log(
    //   `${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
    //     linesArr,
    //     null,
    //     4
    //   )}`
    // );
    // ███
    // 1. remove links from titles, for example, turn:
    // ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
    // into:
    // ## 2.9.1 (2018-12-27)

    linesArr.forEach(function (line, i) {
      if (line.startsWith("#")) {
        linesArr[i] = line.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g, "$1 $2");
      }

      if (i && linesArr[i].startsWith("# ")) {
        linesArr[i] = "#" + linesArr[i];
      }
    }); // console.log(
    //   `062 AFTER STEP 1, ${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
    //     linesArr,
    //     null,
    //     4
    //   )}`
    // );
    // ███
    // 2. remove bump-only entries, for example
    // "## 2.9.2 (2018-12-27)",
    // "",
    // "**Note:** Version bump only for package ranges-apply",
    //
    // and also remove anything containing "WIP" (case-insensitive)

    var newLinesArr = [];

    for (var i = linesArr.length; i--;) {

      if (linesArr[i].startsWith("**Note:** Version bump only") || linesArr[i].toLowerCase().includes("wip")) {
        // delete all the blank lines above the culprit:
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
          i -= 1;
        } // after that, delete the title, but only if there were no other entries:


        if (i && isStr(linesArr[i - 1]) && linesArr[i - 1].trim().startsWith("#")) {
          i -= 1;
        } // delete all the blank lines above the culprit:


        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
          i -= 1;
        }
      } else if (!linesArr[i].trim()) {
        // maybe this line is empty or contains only whitespace characters (spaces, tabs etc)?
        if (!lastLineWasEmpty) {
          // we push trimmed lines to prevent accidental whitespace characters
          // sitting on an empty line:
          newLinesArr.unshift(linesArr[i].trim());
          lastLineWasEmpty = true;
        }
      } // fix asterisk list items into dash (Prettier default):
      else if (linesArr[i][0] === "*" && linesArr[i][1] === " ") {
          newLinesArr.unshift("- " + linesArr[i].slice(2));
        } else {
          newLinesArr.unshift(linesArr[i]);
        } // reset:


      if (linesArr[i].trim()) {
        lastLineWasEmpty = false;
      }
    }

    final = "" + newLinesArr.join("\n") + (changelogEndedWithLinebreak ? "\n" : "");
  }

  return {
    version: version$1,
    res: final || changelogContents
  };
}

exports.cleanChangelogs = cleanChangelogs;
exports.version = version$1;
