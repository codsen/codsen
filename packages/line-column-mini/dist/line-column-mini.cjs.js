/**
 * @name line-column-mini
 * @fileoverview Convert string index to line-column position
 * @version 1.1.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/line-column-mini/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "1.1.15";

var version = version$1;
function binarySearch(el, arr) {
  var m = 0;
  var n = arr.length - 2;
  while (m < n) {
    var k = m + (n - m >> 1);
    if (el < arr[k]) {
      n = k - 1;
    } else if (el >= arr[k + 1]) {
      m = k + 1;
    } else {
      m = k;
      break;
    }
  }
  return m;
}
function getLineStartIndexes(str) {
  return str.split(/\n|\r(?!\n)/g).reduce(function (acc, curr) {
    acc.push(acc[acc.length - 1] + curr.length + 1);
    return acc;
  }, [0]);
}
function lineCol(input, idx) {
  var skipChecks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!skipChecks && (!Array.isArray(input) && typeof input !== "string" || (typeof input === "string" || Array.isArray(input)) && !input.length)) {
    return null;
  }
  if (!skipChecks && (typeof idx !== "number" || typeof input === "string" && idx >= input.length || Array.isArray(input) && idx + 1 >= input[input.length - 1])) {
    return null;
  }
  if (typeof input === "string") {
    var startIndexesOfEachLine = getLineStartIndexes(input);
    var _line = binarySearch(idx, startIndexesOfEachLine);
    return {
      col: idx - startIndexesOfEachLine[_line] + 1,
      line: _line + 1
    };
  }
  var line = binarySearch(idx, input);
  return {
    col: idx - input[line] + 1,
    line: line + 1
  };
}

exports.getLineStartIndexes = getLineStartIndexes;
exports.lineCol = lineCol;
exports.version = version;
