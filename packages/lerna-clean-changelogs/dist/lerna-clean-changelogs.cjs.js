/**
 * lerna-clean-changelogs
 * Cleans all the crap from Lerna and Conventional Commits-generated changelogs
 * Version: 1.3.50
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs
 */

'use strict';

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

var version = "1.3.50";

function isStr(something) {
  return typeof something === "string";
}
function c(changelogContents) {
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
    var linesArr = changelogContents.split(/\r?\n/);
    linesArr.forEach(function (line, i) {
      if (line.startsWith("#")) {
        linesArr[i] = line.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g, "$1 $2");
      }
      if (i && linesArr[i].startsWith("# ")) {
        linesArr[i] = "#".concat(linesArr[i]);
      }
    });
    var newLinesArr = [];
    for (var i = linesArr.length; i--;) {
      if (linesArr[i].startsWith("**Note:** Version bump only") || linesArr[i].toLowerCase().includes("wip")) {
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim().length && i) {
          i--;
        }
        if (i && isStr(linesArr[i - 1]) && linesArr[i - 1].trim().startsWith("#")) {
          i--;
        }
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim().length && i) {
          i--;
        }
      } else if (!linesArr[i].trim().length) {
        if (!lastLineWasEmpty) {
          newLinesArr.unshift(linesArr[i].trim());
          lastLineWasEmpty = true;
        }
      } else {
        if (linesArr[i][0] === "*" && linesArr[i][1] === " ") {
          newLinesArr.unshift("- ".concat(linesArr[i].slice(2)));
        } else {
          newLinesArr.unshift(linesArr[i]);
        }
      }
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

module.exports = c;
