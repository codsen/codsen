/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 2.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-split-by-whitespace/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var rangesIsIndexWithin = require('ranges-is-index-within');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version$1 = "2.0.10";

var version = version$1;
function splitByW(str, originalOpts) {
  if (str === undefined) {
    throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");
  }
  if (typeof str !== "string") {
    return str;
  }
  if (str.trim() === "") {
    return [];
  }
  var defaults = {
    ignoreRanges: []
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.ignoreRanges.length > 0 && !opts.ignoreRanges.every(function (arr) {
    return Array.isArray(arr);
  })) {
    throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");
  }
  var nonWhitespaceSubStringStartsAt = null;
  var res = [];
  for (var i = 0, len = str.length; i < len; i++) {
    if (nonWhitespaceSubStringStartsAt === null && str[i].trim() && (!opts || !opts.ignoreRanges || !opts.ignoreRanges.length || opts.ignoreRanges.length && !rangesIsIndexWithin.isIndexWithin(i, opts.ignoreRanges.map(function (arr) {
      return [arr[0], arr[1] - 1];
    }), {
      inclusiveRangeEnds: true
    }))) {
      nonWhitespaceSubStringStartsAt = i;
    }
    if (nonWhitespaceSubStringStartsAt !== null) {
      if (!str[i].trim()) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
        nonWhitespaceSubStringStartsAt = null;
      } else if (opts.ignoreRanges.length && rangesIsIndexWithin.isIndexWithin(i, opts.ignoreRanges)) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
        nonWhitespaceSubStringStartsAt = null;
      } else if (str[i + 1] === undefined) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
      }
    }
  }
  return res;
}

exports.splitByW = splitByW;
exports.version = version;
