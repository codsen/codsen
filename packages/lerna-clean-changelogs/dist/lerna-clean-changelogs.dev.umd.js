/**
 * lerna-clean-changelogs
 * Cleans all the crap from Lerna and Conventional Commits-generated changelogs
 * Version: 1.3.48
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.lernaCleanChangelogs = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var version = "1.3.48";

  function isStr(something) {
    return typeof something === "string";
  }

  function c(changelogContents) {
    // validate the first input argument:
    if (changelogContents === undefined) {
      throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");
    } else if (!isStr(changelogContents)) {
      throw new Error("lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ".concat(Array.isArray(changelogContents) ? "array" : _typeof(changelogContents), ", equal to:\n").concat(JSON.stringify(changelogContents, null, 4)));
    }

    var _final;

    var lastLineWasEmpty = false;

    if (changelogContents.length && (!changelogContents.includes("\n") || !changelogContents.includes("\r"))) {
      var changelogEndedWithLinebreak = isStr(changelogContents) && changelogContents.length && (changelogContents[changelogContents.length - 1] === "\n" || changelogContents[changelogContents.length - 1] === "\r");
      changelogContents = changelogContents.trim();
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
          linesArr[i] = "#".concat(linesArr[i]);
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
          while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim().length && i) {
            i--;
          } // after that, delete the title, but only if there were no other entries:


          if (i && isStr(linesArr[i - 1]) && linesArr[i - 1].trim().startsWith("#")) {
            i--;
          } // delete all the blank lines above the culprit:


          while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim().length && i) {
            i--;
          }
        } else if (!linesArr[i].trim().length) {
          // maybe this line is empty or contains only whitespace characters (spaces, tabs etc)?
          if (!lastLineWasEmpty) {
            // we push trimmed lines to prevent accidental whitespace characters
            // sitting on an empty line:
            newLinesArr.unshift(linesArr[i].trim());
            lastLineWasEmpty = true;
          }
        } else {
          // fix asterisk list items into dash (Prettier default):
          if (linesArr[i][0] === "*" && linesArr[i][1] === " ") {
            newLinesArr.unshift("- ".concat(linesArr[i].slice(2)));
          } else {
            newLinesArr.unshift(linesArr[i]);
          }
        } // reset:


        if (linesArr[i].trim().length) {
          lastLineWasEmpty = false;
        }
      }

      _final = "".concat(newLinesArr.join("\n")).concat(changelogEndedWithLinebreak ? "\n" : "");
    }

    return {
      version: version,
      res: _final || changelogContents
    };
  }

  return c;

})));
