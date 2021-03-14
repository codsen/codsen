/**
 * ranges-regex
 * Integrate regex operations into Ranges workflow
 * Version: 4.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-regex/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rangesMerge = require('ranges-merge');
var isregexp = require('lodash.isregexp');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isregexp__default = /*#__PURE__*/_interopDefaultLegacy(isregexp);

var version$1 = "4.0.8";

var version = version$1;
function rRegex(regx, str, replacement) {
  if (regx === undefined) {
    throw new TypeError("ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!");
  } else if (!isregexp__default['default'](regx)) {
    throw new TypeError("ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: " + typeof regx + ", equal to: " + JSON.stringify(regx, null, 4));
  }
  if (typeof str !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: " + typeof str + ", equal to: " + JSON.stringify(str, null, 4));
  }
  if (replacement && typeof replacement !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: " + typeof replacement + ", equal to: " + JSON.stringify(replacement, null, 4));
  }
  if (!str.length) {
    return null;
  }
  var tempArr;
  var resRange = [];
  if (replacement === null || typeof replacement === "string" && replacement.length) {
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex, replacement]);
    }
  } else {
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex]);
    }
  }
  if (resRange.length) {
    return rangesMerge.rMerge(resRange);
  }
  return null;
}

exports.rRegex = rRegex;
exports.version = version;
