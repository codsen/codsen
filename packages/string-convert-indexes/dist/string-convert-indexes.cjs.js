/**
 * string-convert-indexes
 * Convert between native JS string character indexes and grapheme-count-based indexes
 * Version: 4.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-convert-indexes/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var astMonkeyTraverse = require('ast-monkey-traverse');
var GraphemeSplitter = require('grapheme-splitter');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var GraphemeSplitter__default = /*#__PURE__*/_interopDefaultLegacy(GraphemeSplitter);

var version$1 = "4.0.5";

/* eslint @typescript-eslint/explicit-module-boundary-types:0 */
var version = version$1; // inner function, common for both external API's methods that does the job:

function strConvertIndexes(mode, str, indexes) {
  function isItOk(something) {
    if (!["string", "number"].includes(typeof something) || typeof something === "string" && !/^\d*$/.test(something) || typeof something === "number" && (!Number.isInteger(something) || something < 0)) {
      // we are not going to throw because it will be impossible to
      // report where exactly is the culprit if we did it here
      return false;
    }

    return true;
  }

  function oneNativeToUnicode(graphemeStrArr, idx) {
    // we count what is the range of indexes current grapheme covers,
    // then return if given index falls in-between
    var currLowerIdx = 0;
    var currUpperIdx = 0;

    for (var i = 0, len = graphemeStrArr.length; i < len; i++) {
      // to start, lower is the same
      currUpperIdx += graphemeStrArr[i].length;

      if (idx >= currLowerIdx && idx < currUpperIdx) {
        return i;
      } // in the end, bump lower


      currLowerIdx += graphemeStrArr[i].length;
    } // if end is reached, it's an error


    throw new Error("string-convert-indexes: [THROW_ID_05] the \"indexes\" value, " + indexes + ", is not covered by graphemes length!");
  }

  function oneUnicodeToNative(graphemeStrArr, idx) {
    if (idx >= graphemeStrArr.length) {
      throw new Error("string-convert-indexes: [THROW_ID_06] the index to convert, " + idx + ", is not covered by graphemes length!");
    }

    return graphemeStrArr.slice(0, idx).join("").length;
  } //
  // insurance
  // ---------


  if (typeof str !== "string" || !str) {
    throw new TypeError("string-convert-indexes: [THROW_ID_01] the first input argument, input string, must be a non-zero-length string! Currently it's: " + typeof str + ", equal to:\n" + str);
  } // ---------------------------------------------------------------------------
  // Quick ending


  if (indexes === 0) {
    return 0;
  }

  if (indexes === "0") {
    return "0";
  } // ---------------------------------------------------------------------------


  var splitter = new GraphemeSplitter__default['default']();
  var graphemeStrArr = splitter.splitGraphemes(str); // easy - index will be the total count of all native JS index characters
  // leading up to this

  if (["string", "number"].includes(typeof indexes)) { // no need for traversal
    // validate

    if (isItOk(indexes)) {

      if (mode === "u") {
        return typeof indexes === "string" ? String(oneUnicodeToNative(graphemeStrArr, +indexes)) : oneUnicodeToNative(graphemeStrArr, +indexes);
      }

      return typeof indexes === "string" ? String(oneNativeToUnicode(graphemeStrArr, +indexes)) : oneNativeToUnicode(graphemeStrArr, +indexes);
    } // else - error - messy string or number


    throw new Error("string-convert-indexes: [THROW_ID_02] the second input argument, \"indexes\" is not suitable to describe string index - it was given as " + JSON.stringify(indexes, null, 4) + " (" + typeof indexes + ")");
  } else if (indexes && typeof indexes === "object") { // if it's array or object, traverse

    return mode === "u" ? astMonkeyTraverse.traverse(indexes, function (key, val, innerObj) {
      var current = val !== undefined ? val : key;

      if (["string", "number"].includes(typeof current)) {
        // process it then
        if (isItOk(current)) {
          return typeof current === "string" ? String(oneUnicodeToNative(graphemeStrArr, +current)) : oneUnicodeToNative(graphemeStrArr, +current);
        }

        throw new Error("string-convert-indexes: [THROW_ID_03] bad value was encountered, " + JSON.stringify(current, null, 4) + ", its path is " + innerObj.path);
      } // else - return as is


      return current;
    }) : astMonkeyTraverse.traverse(indexes, function (key, val, innerObj) {
      var current = val !== undefined ? val : key;

      if (["string", "number"].includes(typeof current)) {
        // process it then
        if (isItOk(current)) {
          return typeof current === "string" ? String(oneNativeToUnicode(graphemeStrArr, +current)) : oneNativeToUnicode(graphemeStrArr, +current);
        }

        throw new Error("string-convert-indexes: [THROW_ID_04] bad value was encountered, " + JSON.stringify(current, null, 4) + ", its path is " + innerObj.path);
      } // else - return as is


      return current;
    });
  } else {
    throw new Error("string-convert-indexes: [THROW_ID_07] the first input argument, a source string should be a string but it was given as " + str + ", type " + typeof str);
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
exports.version = version;
