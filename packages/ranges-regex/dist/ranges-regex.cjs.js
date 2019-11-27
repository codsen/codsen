/**
 * ranges-regex
 * Perform a regex search on string and get a ranges array of findings (or null)
 * Version: 2.0.40
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-regex
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mergeRanges = _interopDefault(require('ranges-merge'));
var isregexp = _interopDefault(require('lodash.isregexp'));

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

function rangesRegex(regx, str, replacement) {
  if (regx === undefined) {
    throw new TypeError("ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!");
  } else if (!isregexp(regx)) {
    throw new TypeError("ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ".concat(_typeof(regx), ", equal to: ").concat(JSON.stringify(regx, null, 4)));
  }
  if (typeof str !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (replacement !== undefined && replacement !== null && typeof replacement !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ".concat(_typeof(replacement), ", equal to: ").concat(JSON.stringify(replacement, null, 4)));
  }
  if (str.length === 0) {
    return null;
  }
  var tempArr;
  var resRange = [];
  if (replacement === null || typeof replacement === "string" && replacement.length > 0) {
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex, replacement]);
    }
  } else {
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex]);
    }
  }
  if (resRange.length) {
    return mergeRanges(resRange);
  }
  return null;
}

module.exports = rangesRegex;
