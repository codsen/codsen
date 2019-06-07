/**
 * html-table-patcher
 * Wraps any content between TR/TD tags in additional rows/columns to appear in browser correctly
 * Version: 1.0.15
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rangesApply = _interopDefault(require('ranges-apply'));
var Ranges = _interopDefault(require('ranges-push'));
var htmlCommentRegex = _interopDefault(require('html-comment-regex'));

var version = "1.0.15";

var isArr = Array.isArray;
function isLetter(str) {
  return typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase();
}
function isStr(something) {
  return typeof something === "string";
}
function deleteAllKindsOfComments(str) {
  if (isStr(str)) {
    return str.replace(htmlCommentRegex, "");
  }
  return str;
}
var defaults = {
  cssStylesContent: "",
  alwaysCenter: false
};
function patcher(str, originalOpts) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.cssStylesContent && (!isStr(opts.cssStylesContent) || !opts.cssStylesContent.trim().length)) {
    opts.cssStylesContent = undefined;
  }
  var tableTagStartsAt = null;
  var tableTagEndsAt = null;
  var trOpeningStartsAt = null;
  var trOpeningEndsAt = null;
  var tdOpeningStartsAt = null;
  var tdClosingEndsAt = null;
  var trClosingEndsAt = null;
  var donothingUntil = null;
  var countTds = false;
  var countVal = null;
  var centeredTdsDetected = false;
  var quotes = null;
  var type1Gaps = new Ranges();
  var type2Gaps = new Ranges();
  var type3Gaps = new Ranges();
  var type4Gaps = new Ranges();
  var tableColumnCounts = [];
  var tableColumnCount = [];
  outerLoop: for (var i = 0, len = str.length; i < len; i++) {
    if (donothingUntil) {
      if (str.slice(i).startsWith(donothingUntil)) {
        i += donothingUntil.length - 1;
        donothingUntil = null;
        continue;
      } else {
        continue;
      }
    }
    if (str[i] === "<" && str[i + 1] === "!" && str[i + 2] === "-" && str[i + 3] === "-") {
      for (var y = i; y < len; y++) {
        if (str[y] === "-" && str[y + 1] === "-" && str[y + 2] === ">" || str[y + 1] === undefined) {
          i = y + 2;
          continue outerLoop;
        }
      }
    }
    if ((str[i] === "'" || str[i] === '"') && (str[i - 1] === "=" || str[i - 1] === " " && str[i - 2] === "=")) {
      if (!quotes) {
        quotes = {
          type: str[i],
          startedAt: i
        };
      }
    }
    if (quotes && str[i] === quotes.type) {
      quotes = null;
    }
    if (!quotes && str[i] === "<" && str[i + 1] === "/" && str[i + 2] === "t" && str[i + 3] === "d") {
      if (str[i + 3] === ">") {
        tdClosingEndsAt = i + 3;
      } else {
        for (var _y = i + 3; _y < len; _y++) {
          if (str[_y] === ">") {
            tdClosingEndsAt = _y;
            i = _y;
            continue outerLoop;
          }
        }
      }
    }
    if (!quotes && str[i] === ">" && tdOpeningStartsAt !== null && tdOpeningStartsAt < i && tableTagStartsAt === null && tableTagEndsAt < i && trOpeningStartsAt === null && trOpeningEndsAt < i) {
      if (countTds && (str.slice(tdOpeningStartsAt, i).includes('align="center"') || str.slice(tdOpeningStartsAt, i).match(/text-align:\s*center/gi))) {
        centeredTdsDetected = true;
      }
      tdOpeningStartsAt = null;
    }
    if (!quotes && str[i] === "<" && str[i + 1] === "t" && str[i + 2] === "d" && !isLetter(str[i + 3])) {
      tdOpeningStartsAt = i;
      if (
      trOpeningEndsAt !== null && (tdClosingEndsAt === null || tdClosingEndsAt < trOpeningEndsAt)) {
        if (deleteAllKindsOfComments(str.slice(trOpeningEndsAt + 1, i)).trim().length !== 0) {
          type2Gaps.push(trOpeningEndsAt + 1, i, deleteAllKindsOfComments(str.slice(trOpeningEndsAt + 1, i)).trim());
        }
      } else if (
      tdClosingEndsAt !== null && (trClosingEndsAt === null || tdClosingEndsAt > trClosingEndsAt)) {
        if (deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim().length !== 0) {
          type3Gaps.push(tdClosingEndsAt + 1, i, deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim());
          if (countTds) {
            countTds = false;
          }
        }
      }
      if (countTds) {
        if (countVal === null) {
          countVal = 1;
        } else {
          countVal++;
        }
      }
    }
    if (!quotes && str[i] === "<" && str[i + 1] === "/" && str[i + 2] === "t" && str[i + 3] === "a" && str[i + 4] === "b" && str[i + 5] === "l" && str[i + 6] === "e" && str[i + 7] === ">") {
      if (deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim().length !== 0) {
        type1Gaps.push(trClosingEndsAt + 1, i, deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim());
      }
      if (tableColumnCount) {
        if (countVal !== null) {
          tableColumnCounts.push([tableColumnCount[0], i + 7, countVal, centeredTdsDetected]);
        }
        tableColumnCount = [];
        countTds = false;
        countVal = null;
        centeredTdsDetected = false;
      }
    }
    if (!quotes && str[i] === "<" && str[i + 1] === "/" && str[i + 2] === "t" && str[i + 3] === "r" && str[i + 4] === ">") {
      if (tdClosingEndsAt !== null && deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim().length !== 0) {
        type4Gaps.push(tdClosingEndsAt + 1, i, deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim());
      }
      trClosingEndsAt = i + 4;
      trOpeningStartsAt = null;
      if (countTds) {
        countTds = false;
      }
      i += 4;
      continue;
    }
    if (!quotes && str[i] === ">" && trOpeningStartsAt !== null && trOpeningStartsAt < i && tableTagStartsAt === null && tableTagEndsAt < i) {
      trOpeningEndsAt = i;
      if (tableTagEndsAt !== null) {
        if (deleteAllKindsOfComments(str.slice(tableTagEndsAt + 1, trOpeningStartsAt)).trim().length !== 0) {
          type1Gaps.push(tableTagEndsAt + 1, trOpeningStartsAt, deleteAllKindsOfComments(str.slice(tableTagEndsAt + 1, trOpeningStartsAt)).trim());
        }
        trOpeningStartsAt = null;
        tableTagEndsAt = null;
      } else if (trClosingEndsAt !== null) {
        if (deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, trOpeningStartsAt)).trim().length !== 0) {
          type1Gaps.push(trClosingEndsAt + 1, trOpeningStartsAt, deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, trOpeningStartsAt)).trim());
        }
        trClosingEndsAt = null;
      }
      if (!countTds && countVal === null) {
        countTds = true;
      }
    }
    if (!quotes && str[i] === "<" && str[i + 1] === "t" && str[i + 2] === "r" && !isLetter(str[i + 3])) {
      if (trClosingEndsAt !== null && tableTagEndsAt === null && deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim().length !== 0) {
        type1Gaps.push(trClosingEndsAt + 1, i, deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim());
        trClosingEndsAt = null;
      }
      trOpeningStartsAt = i;
    }
    if (!quotes && str[i] === ">" && tableTagStartsAt !== null && tableTagStartsAt < i) {
      tableTagEndsAt = i;
      if (!(isArr(tableColumnCount) && tableColumnCount.length)) {
        tableColumnCount.push(tableTagStartsAt);
      }
      tableTagStartsAt = null;
    }
    if (!quotes && str[i] === "<" && str[i + 1] === "t" && str[i + 2] === "a" && str[i + 3] === "b" && str[i + 4] === "l" && str[i + 5] === "e" && !isLetter(str[i + 6])) {
      if (!countTds && countVal === null) {
        tableTagStartsAt = i;
      } else {
        donothingUntil = "</table";
      }
    }
  }
  if (!type1Gaps.current() && !type2Gaps.current() && !type3Gaps.current() && !type4Gaps.current()) {
    return str;
  }
  var resRanges = new Ranges();
  if (type1Gaps.current()) {
    resRanges.push(type1Gaps.current().map(function (range) {
      if (typeof range[2] === "string" && range[2].length > 0) {
        var attributesToAdd = "";
        var tempColspanValIfFound;
        var addAlignCenter = false;
        if (isArr(tableColumnCounts) && tableColumnCounts.length && tableColumnCounts.some(function (refRange) {
          if (range[0] >= refRange[0] && range[0] <= refRange[1]) {
            if (refRange[2] !== 1) {
              tempColspanValIfFound = refRange[2];
            }
            if (refRange[3]) {
              addAlignCenter = refRange[3];
            }
            return true;
          }
          return false;
        })) {
          if (tempColspanValIfFound) {
            attributesToAdd += " colspan=\"".concat(tempColspanValIfFound, "\"");
          }
          if (opts.cssStylesContent) {
            attributesToAdd += " style=\"".concat(opts.cssStylesContent, "\"");
          }
          if (opts.alwaysCenter || addAlignCenter) {
            attributesToAdd += " align=\"center\"";
          }
        }
        return [range[0], range[1], "<tr><td".concat(attributesToAdd, ">").concat(range[2].trim(), "</td></tr>")];
      }
      return range;
    }));
  }
  if (type2Gaps.current()) {
    resRanges.push(type2Gaps.current().map(function (range) {
      if (typeof range[2] === "string" && range[2].length > 0) {
        var attributesToAdd = "";
        var tempColspanValIfFound;
        var addAlignCenter = false;
        if (isArr(tableColumnCounts) && tableColumnCounts.length && tableColumnCounts.some(function (refRange) {
          if (range[0] >= refRange[0] && range[0] <= refRange[1]) {
            if (refRange[2] !== 1) {
              tempColspanValIfFound = refRange[2];
            }
            if (refRange[3]) {
              addAlignCenter = refRange[3];
            }
            return true;
          }
          return false;
        })) {
          if (tempColspanValIfFound) {
            attributesToAdd += " colspan=\"".concat(tempColspanValIfFound, "\"");
          }
          if (opts.cssStylesContent) {
            attributesToAdd += " style=\"".concat(opts.cssStylesContent, "\"");
          }
          if (opts.alwaysCenter || addAlignCenter) {
            attributesToAdd += " align=\"center\"";
          }
        }
        return [range[0], range[1], "<td".concat(attributesToAdd, ">").concat(range[2].trim(), "</td></tr>\n<tr>")];
      }
      return range;
    }));
  }
  if (type3Gaps.current()) {
    resRanges.push(type3Gaps.current().map(function (range) {
      if (typeof range[2] === "string" && range[2].length > 0) {
        var attributesToAdd = "";
        if (opts.alwaysCenter) {
          attributesToAdd += " align=\"center\"";
        }
        if (opts.cssStylesContent) {
          attributesToAdd += " style=\"".concat(opts.cssStylesContent, "\"");
        }
        return [range[0], range[1], "</tr>\n<tr><td".concat(attributesToAdd, ">").concat(range[2].trim(), "</td></tr><tr>")];
      }
      return range;
    }));
  }
  if (type4Gaps.current()) {
    resRanges.push(type4Gaps.current().map(function (range) {
      if (typeof range[2] === "string" && range[2].length > 0) {
        var attributesToAdd = "";
        if (opts.alwaysCenter) {
          attributesToAdd += " align=\"center\"";
        }
        if (opts.cssStylesContent) {
          attributesToAdd += " style=\"".concat(opts.cssStylesContent, "\"");
        }
        return [range[0], range[1], "</tr><tr><td".concat(attributesToAdd, ">").concat(range[2].trim(), "</td>")];
      }
      return range;
    }));
  }
  if (resRanges.current()) {
    var finalRes = rangesApply(str, resRanges.current());
    return finalRes;
  }
  return str;
}

exports.defaults = defaults;
exports.patcher = patcher;
exports.version = version;
