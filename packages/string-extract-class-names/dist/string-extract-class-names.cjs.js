/**
 * string-extract-class-names
 * Extracts CSS class/id names from a string
 * Version: 6.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-class-names/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stringLeftRight = require('string-left-right');

var version$1 = "6.0.12";

var version = version$1;
function extract(str) {
  if (typeof str !== "string") {
    throw new TypeError("string-extract-class-names: [THROW_ID_01] first str should be string, not " + typeof str + ", currently equal to " + JSON.stringify(str, null, 4));
  }
  var badChars = ".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`";
  var stateCurrentlyIs;
  function isLatinLetter(char) {
    return typeof char === "string" && !!char.length && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
  }
  var selectorStartsAt = null;
  var result = {
    res: [],
    ranges: []
  };
  for (var i = 0, len = str.length; i <= len; i++) {
    if (selectorStartsAt !== null && i >= selectorStartsAt && (
    !str[i] ||
    !str[i].trim() ||
    badChars.includes(str[i]))) {
      if (i > selectorStartsAt + 1) {
        result.ranges.push([selectorStartsAt, i]);
        result.res.push("" + (stateCurrentlyIs || "") + str.slice(selectorStartsAt, i));
        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
        }
      }
      selectorStartsAt = null;
    }
    if (str[i] && selectorStartsAt === null && (str[i] === "." || str[i] === "#")) {
      selectorStartsAt = i;
    }
    var temp1 = stringLeftRight.right(str, i + 4);
    if (str.startsWith("class", i) && typeof stringLeftRight.left(str, i) === "number" && str[stringLeftRight.left(str, i)] === "[" && typeof temp1 === "number" && str[temp1] === "=") {
      /* istanbul ignore else */
      if (stringLeftRight.right(str, temp1) && isLatinLetter(str[stringLeftRight.right(str, temp1)])) {
        selectorStartsAt = stringLeftRight.right(str, temp1);
      } else if ("'\"".includes(str[stringLeftRight.right(str, temp1)]) && isLatinLetter(str[stringLeftRight.right(str, stringLeftRight.right(str, temp1))])) {
        selectorStartsAt = stringLeftRight.right(str, stringLeftRight.right(str, temp1));
      }
      stateCurrentlyIs = ".";
    }
    var temp2 = stringLeftRight.right(str, i + 1);
    if (str.startsWith("id", i) && str[stringLeftRight.left(str, i)] === "[" && temp2 !== null && str[temp2] === "=") {
      if (isLatinLetter(str[stringLeftRight.right(str, temp2)])) {
        selectorStartsAt = stringLeftRight.right(str, temp2);
      } else if ("'\"".includes(str[stringLeftRight.right(str, temp2)]) && isLatinLetter(str[stringLeftRight.right(str, stringLeftRight.right(str, temp2))])) {
        selectorStartsAt = stringLeftRight.right(str, stringLeftRight.right(str, temp2));
      }
      stateCurrentlyIs = "#";
    }
  }
  if (!result.ranges.length) {
    result.ranges = null;
  }
  return result;
}

exports.extract = extract;
exports.version = version;
