/**
 * string-convert-indexes
 * Convert between native JS string character indexes and grapheme-count-based indexes
 * Version: 1.10.18
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-convert-indexes/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var traverse = require('ast-monkey-traverse');
var GraphemeSplitter = require('grapheme-splitter');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);
var GraphemeSplitter__default = /*#__PURE__*/_interopDefaultLegacy(GraphemeSplitter);

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

function strConvertIndexes(mode, str, indexes) {
  function isItOk(something) {
    if (!["string", "number"].includes(_typeof(something)) || typeof something === "string" && !/^\d*$/.test(something) || typeof something === "number" && (!Number.isInteger(something) || something < 0)) {
      return false;
    }
    return true;
  }
  function oneNativeToUnicode(graphemeStrArr, idx) {
    var currLowerIdx = 0;
    var currUpperIdx = 0;
    for (var i = 0, len = graphemeStrArr.length; i < len; i++) {
      currUpperIdx += graphemeStrArr[i].length;
      if (idx >= currLowerIdx && idx < currUpperIdx) {
        return i;
      }
      currLowerIdx += graphemeStrArr[i].length;
    }
    throw new Error("string-convert-indexes: [THROW_ID_05] the \"indexes\" value, ".concat(indexes, ", is not covered by graphemes length!"));
  }
  function oneUnicodeToNative(graphemeStrArr, idx) {
    if (idx >= graphemeStrArr.length) {
      throw new Error("string-convert-indexes: [THROW_ID_06] the index to convert, ".concat(idx, ", is not covered by graphemes length!"));
    }
    return graphemeStrArr.slice(0, idx).join("").length;
  }
  if (typeof str !== "string" || !str) {
    throw new TypeError("string-convert-indexes: [THROW_ID_01] the first input argument, input string, must be a non-zero-length string! Currently it's: ".concat(_typeof(str), ", equal to:\n").concat(str));
  }
  if (indexes === 0) {
    return 0;
  }
  if (indexes === "0") {
    return "0";
  }
  var splitter = new GraphemeSplitter__default['default']();
  var graphemeStrArr = splitter.splitGraphemes(str);
  if (["string", "number"].includes(_typeof(indexes))) {
    if (isItOk(indexes)) {
      if (mode === "u") {
        return typeof indexes === "string" ? String(oneUnicodeToNative(graphemeStrArr, +indexes)) : oneUnicodeToNative(graphemeStrArr, +indexes);
      }
      return typeof indexes === "string" ? String(oneNativeToUnicode(graphemeStrArr, +indexes)) : oneNativeToUnicode(graphemeStrArr, +indexes);
    }
    throw new Error("string-convert-indexes: [THROW_ID_02] the second input argument, \"indexes\" is not suitable to describe string index - it was given as ".concat(JSON.stringify(indexes, null, 4), " (").concat(_typeof(indexes), ")"));
  } else if (indexes && _typeof(indexes) === "object") {
    return mode === "u" ? traverse__default['default'](indexes, function (key, val, innerObj) {
      var current = val !== undefined ? val : key;
      if (["string", "number"].includes(_typeof(current))) {
        if (isItOk(current)) {
          return typeof current === "string" ? String(oneUnicodeToNative(graphemeStrArr, +current)) : oneUnicodeToNative(graphemeStrArr, +current);
        }
        throw new Error("string-convert-indexes: [THROW_ID_03] bad value was encountered, ".concat(JSON.stringify(current, null, 4), ", its path is ").concat(innerObj.path));
      }
      return current;
    }) : traverse__default['default'](indexes, function (key, val, innerObj) {
      var current = val !== undefined ? val : key;
      if (["string", "number"].includes(_typeof(current))) {
        if (isItOk(current)) {
          return typeof current === "string" ? String(oneNativeToUnicode(graphemeStrArr, +current)) : oneNativeToUnicode(graphemeStrArr, +current);
        }
        throw new Error("string-convert-indexes: [THROW_ID_04] bad value was encountered, ".concat(JSON.stringify(current, null, 4), ", its path is ").concat(innerObj.path));
      }
      return current;
    });
  } else {
    throw new Error("string-convert-indexes: [THROW_ID_07] the first input argument, a source string should be a string but it was given as ".concat(str, ", type ").concat(_typeof(str)));
  }
}
function nativeToUnicode(str, indexes) {
  return strConvertIndexes("n", str, indexes);
}
function unicodeToNative(str, indexes) {
  return strConvertIndexes("u", str, indexes);
}

exports.nativeToUnicode = nativeToUnicode;
exports.unicodeToNative = unicodeToNative;
