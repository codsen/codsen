/** 
 * string-extract-class-names
 * Extract class (or id) name from a string
 * Version: 5.8.35
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-class-names
 */
'use strict';

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

function stringExtractClassNames(input, returnRangesInstead) {
  function existy(x) {
    return x != null;
  }
  if (input === undefined) {
    throw new Error("string-extract-class-names: [THROW_ID_01] input must not be undefined!");
  } else if (typeof input !== "string") {
    throw new TypeError("string-extract-class-names: [THROW_ID_02] first input should be string, not ".concat(_typeof(input), ", currently equal to ").concat(JSON.stringify(input, null, 4)));
  }
  if (!existy(returnRangesInstead) || !returnRangesInstead) {
    returnRangesInstead = false;
  } else if (typeof returnRangesInstead !== "boolean") {
    throw new TypeError("string-extract-class-names: [THROW_ID_03] second input argument should be a Boolean, not ".concat(_typeof(input), ", currently equal to ").concat(JSON.stringify(input, null, 4)));
  }
  var badChars = ".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`";
  var selectorStartsAt = null;
  var result = [];
  for (var i = 0, len = input.length; i < len; i++) {
    if (selectorStartsAt !== null && (badChars.includes(input[i]) || input[i].trim().length === 0)) {
      if (i > selectorStartsAt + 1) {
        if (returnRangesInstead) {
          result.push([selectorStartsAt, i]);
        } else {
          result.push(input.slice(selectorStartsAt, i));
        }
      }
      selectorStartsAt = null;
    }
    if (selectorStartsAt === null && (input[i] === "." || input[i] === "#")) {
      selectorStartsAt = i;
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
