/**
 * @name ranges-regex
 * @fileoverview Integrate regex operations into Ranges workflow
 * @version 4.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-regex/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');
var rangesMerge = require('ranges-merge');
var isregexp = require('lodash.isregexp');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var isregexp__default = /*#__PURE__*/_interopDefaultLegacy(isregexp);

var version$1 = "4.0.16";

var version = version$1;
function rRegex(regx, str, replacement) {
  if (regx === undefined) {
    throw new TypeError("ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!");
  } else if (!isregexp__default['default'](regx)) {
    throw new TypeError("ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ".concat(_typeof__default['default'](regx), ", equal to: ").concat(JSON.stringify(regx, null, 4)));
  }
  if (typeof str !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: ".concat(_typeof__default['default'](str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (replacement && typeof replacement !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ".concat(_typeof__default['default'](replacement), ", equal to: ").concat(JSON.stringify(replacement, null, 4)));
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
