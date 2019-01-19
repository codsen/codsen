/**
 * lerna-clean-changelogs
 * Cleans all the crap from Lerna and Conventional Commits-generated changelogs
 * Version: 0.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/lerna-clean-changelogs
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var splitLines = _interopDefault(require('split-lines'));

function _typeof(obj) {
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

var version = "0.1.0";

function isStr(something) {
  return typeof something === "string";
}
function c(changelogContents) {
  if (changelogContents === undefined) {
    throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");
  } else if (!isStr(changelogContents)) {
    throw new Error("lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ".concat(Array.isArray(changelogContents) ? "array" : _typeof(changelogContents), ", equal to:\n").concat(JSON.stringify(changelogContents, null, 4)));
  }
  var final;
  if (changelogContents.length && (!changelogContents.includes("\n") || !changelogContents.includes("\r"))) {
    var changelogEndedWithLinebreak = isStr(changelogContents) && changelogContents.length && (changelogContents[changelogContents.length - 1] === "\n" || changelogContents[changelogContents.length - 1] === "\r");
    changelogContents = changelogContents.trim();
    var linesArr = splitLines(changelogContents);
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
      if (linesArr[i].startsWith("**Note:** Version bump only")) {
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim().length && i) {
          i--;
        }
        if (i && isStr(linesArr[i - 1]) && linesArr[i - 1].trim().startsWith("#")) {
          i--;
        }
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim().length && i) {
          i--;
        }
      } else {
        newLinesArr.unshift(linesArr[i]);
      }
    }
    final = "".concat(newLinesArr.join("\n")).concat(changelogEndedWithLinebreak ? "\n" : "");
  }
  return {
    version: version,
    res: final || changelogContents
  };
}

module.exports = c;
