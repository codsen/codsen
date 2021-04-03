/**
 * str-indexes-of-plus
 * Like indexOf but returns array and counts per-grapheme
 * Version: 3.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/str-indexes-of-plus/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "3.0.13";

var version = version$1;
function strIndexesOfPlus(str, searchValue) {
  var fromIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (typeof str !== "string") {
    throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: ".concat(_typeof__default['default'](str)));
  }
  if (typeof searchValue !== "string") {
    throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: ".concat(_typeof__default['default'](searchValue)));
  }
  if (isNaN(+fromIndex) || typeof fromIndex === "string" && !/^\d*$/.test(fromIndex)) {
    throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ".concat(fromIndex));
  }
  var strArr = Array.from(str);
  var searchValueArr = Array.from(searchValue);
  if (strArr.length === 0 || searchValueArr.length === 0 || fromIndex != null && +fromIndex >= strArr.length) {
    return [];
  }
  if (!fromIndex) {
    fromIndex = 0;
  }
  var res = [];
  var matchMode = false;
  var potentialFinding;
  for (var i = fromIndex, len = strArr.length; i < len; i++) {
    if (matchMode) {
      if (strArr[i] === searchValueArr[i - +potentialFinding]) {
        if (i - +potentialFinding + 1 === searchValueArr.length) {
          res.push(+potentialFinding);
        }
      } else {
        potentialFinding = null;
        matchMode = false;
      }
    }
    if (!matchMode) {
      if (strArr[i] === searchValueArr[0]) {
        if (searchValueArr.length === 1) {
          res.push(i);
        } else {
          matchMode = true;
          potentialFinding = i;
        }
      }
    }
  }
  return res;
}

exports.strIndexesOfPlus = strIndexesOfPlus;
exports.version = version;
