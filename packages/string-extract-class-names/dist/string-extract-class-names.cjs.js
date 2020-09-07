/**
 * string-extract-class-names
 * Extract class (or id) name from a string
 * Version: 5.9.29
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-class-names/
 */

'use strict';

var stringLeftRight = require('string-left-right');

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

function stringExtractClassNames(input) {
  var returnRangesInstead = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (typeof input !== "string") {
    throw new TypeError("string-extract-class-names: [THROW_ID_02] first input should be string, not ".concat(_typeof(input), ", currently equal to ").concat(JSON.stringify(input, null, 4)));
  }
  if (typeof returnRangesInstead !== "boolean") {
    throw new TypeError("string-extract-class-names: [THROW_ID_03] second input argument should be a Boolean, not ".concat(_typeof(input), ", currently equal to ").concat(JSON.stringify(input, null, 4)));
  }
  var badChars = ".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`";
  var stateCurrentlyIs;
  function isLatinLetter(char) {
    return typeof char === "string" && char.length && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
  }
  var selectorStartsAt = null;
  var result = [];
  for (var i = 0, len = input.length; i < len; i++) {
    if (selectorStartsAt !== null && i >= selectorStartsAt && (badChars.includes(input[i]) || !input[i].trim())) {
      if (i > selectorStartsAt + 1) {
        if (returnRangesInstead) {
          result.push([selectorStartsAt, i]);
        } else {
          result.push("".concat(stateCurrentlyIs || "").concat(input.slice(selectorStartsAt, i)));
        }
        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
        }
      }
      selectorStartsAt = null;
    }
    if (selectorStartsAt === null && (input[i] === "." || input[i] === "#")) {
      selectorStartsAt = i;
    }
    if (input.startsWith("class", i) && input[stringLeftRight.left(input, i)] === "[" && input[stringLeftRight.right(input, i + 4)] === "=") {
      /* istanbul ignore else */
      if (isLatinLetter(input[stringLeftRight.right(input, stringLeftRight.right(input, i + 4))])) {
        selectorStartsAt = stringLeftRight.right(input, stringLeftRight.right(input, i + 4));
      } else if ("'\"".includes(input[stringLeftRight.right(input, stringLeftRight.right(input, i + 4))]) && isLatinLetter(input[stringLeftRight.right(input, stringLeftRight.right(input, stringLeftRight.right(input, i + 4)))])) {
        selectorStartsAt = stringLeftRight.right(input, stringLeftRight.right(input, stringLeftRight.right(input, i + 4)));
      }
      stateCurrentlyIs = ".";
    }
    if (input.startsWith("id", i) && input[stringLeftRight.left(input, i)] === "[" && input[stringLeftRight.right(input, i + 1)] === "=") {
      if (isLatinLetter(input[stringLeftRight.right(input, stringLeftRight.right(input, i + 1))])) {
        selectorStartsAt = stringLeftRight.right(input, stringLeftRight.right(input, i + 1));
      } else if ("'\"".includes(input[stringLeftRight.right(input, stringLeftRight.right(input, i + 1))]) && isLatinLetter(input[stringLeftRight.right(input, stringLeftRight.right(input, stringLeftRight.right(input, i + 1)))])) {
        selectorStartsAt = stringLeftRight.right(input, stringLeftRight.right(input, stringLeftRight.right(input, i + 1)));
      }
      stateCurrentlyIs = "#";
    }
    if (i + 1 === len && selectorStartsAt !== null && i > selectorStartsAt) {
      if (returnRangesInstead) {
        result.push([selectorStartsAt, len]);
      } else {
        result.push(input.slice(selectorStartsAt, len));
      }
    }
  }
  return result;
}

module.exports = stringExtractClassNames;
