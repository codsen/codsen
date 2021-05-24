/**
 * @name js-row-num
 * @fileoverview Update all row numbers in all console.logs in JS code
 * @version 4.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/js-row-num/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var rangesPush = require('ranges-push');
var rangesApply = require('ranges-apply');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "4.1.0";

var version = version$1;
var BACKSLASH = "\\";
var defaults = {
  padStart: 3,
  overrideRowNum: null,
  returnRangesOnly: false,
  triggerKeywords: ["console.log"],
  extractedLogContentsWereGiven: false
};
function fixRowNums(str, originalOpts) {
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  function isDigit(something) {
    return /[0-9]/.test(something);
  }
  function isAZ(something) {
    return /[A-Za-z]/.test(something);
  }
  function isObj(something) {
    return something && _typeof__default['default'](something) === "object" && !Array.isArray(something);
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (!opts.padStart || typeof opts.padStart !== "number" || typeof opts.padStart === "number" && opts.padStart < 0) {
    opts.padStart = 0;
  }
  var finalIndexesToDelete = new rangesPush.Ranges();
  var i;
  var len = str.length;
  var quotes = null;
  var consoleStartsAt = null;
  var bracketOpensAt = null;
  var currentRow = 1;
  var wasLetterDetected = false;
  var digitStartsAt = null;
  if (opts.padStart && len > 45000) {
    opts.padStart = 4;
  }
  for (i = 0; i < len; i++) {
    if (opts.overrideRowNum === null && (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n")) {
      currentRow += 1;
    }
    if (!opts.extractedLogContentsWereGiven && quotes !== null && quotes.start < i && quotes.type === str[i]) {
      quotes = null;
      consoleStartsAt = null;
      bracketOpensAt = null;
      digitStartsAt = null;
      wasLetterDetected = false;
    }
    if (quotes === null && (opts.extractedLogContentsWereGiven || consoleStartsAt && consoleStartsAt < i && bracketOpensAt && bracketOpensAt < i) && str[i].trim()) {
      if (str[i] === '"' || str[i] === "'" || str[i] === "`") {
        quotes = {
          start: i,
          type: str[i]
        };
        wasLetterDetected = false;
      } else if (opts.extractedLogContentsWereGiven && digitStartsAt === null) {
        if (isDigit(str[i])) {
          digitStartsAt = i;
        } else {
          break;
        }
      } else if (str[i].trim() && str[i] !== "/" && !opts.extractedLogContentsWereGiven) {
        consoleStartsAt = null;
        bracketOpensAt = null;
        digitStartsAt = null;
      }
    }
    if (quotes && Number.isInteger(quotes.start) && quotes.start < i && !wasLetterDetected && digitStartsAt === null && isDigit(str[i])) {
      digitStartsAt = i;
    }
    if (Number.isInteger(digitStartsAt) && (!isDigit(str[i]) || !str[i + 1]) && (i > digitStartsAt || !str[i + 1])) {
      if (!opts.padStart) {
        if (opts.overrideRowNum != null) ;
      }
      finalIndexesToDelete.push(digitStartsAt, !isDigit(str[i]) ? i : i + 1, opts.padStart ? String(opts.overrideRowNum != null ? opts.overrideRowNum : currentRow).padStart(opts.padStart, "0") : "".concat(opts.overrideRowNum != null ? opts.overrideRowNum : currentRow));
      digitStartsAt = null;
      wasLetterDetected = true;
    }
    if (quotes && Number.isInteger(quotes.start) && quotes.start < i && !wasLetterDetected && isAZ(str[i]) && !(str[i] === "n" && str[i - 1] === BACKSLASH)) {
      /* istanbul ignore if */
      if (
      /* istanbul ignore next */
      str[i - 1] === BACKSLASH && str[i] === "u" && str[i + 1] === "0" && str[i + 2] === "0" && str[i + 3] === "1" && (str[i + 4] === "b" || str[i + 5] === "B") && str[i + 5] === "[") {
        var startMarchingForwFrom = void 0;
        if (isDigit(str[i + 6])) {
          startMarchingForwFrom = i + 6;
        } else if (str[i + 6] === "$" && str[i + 7] === "{" && isDigit(str[i + 8])) {
          startMarchingForwFrom = i + 8;
        }
        var numbersSequenceEndsAt = void 0;
        if (startMarchingForwFrom) {
          for (var y = startMarchingForwFrom; y < len; y++) {
            if (!isDigit(str[y])) {
              numbersSequenceEndsAt = y;
              break;
            }
          }
        }
        var ansiSequencesLetterMAt = void 0;
        if (numbersSequenceEndsAt !== undefined && str[numbersSequenceEndsAt] === "m") {
          ansiSequencesLetterMAt = numbersSequenceEndsAt;
        } else if (numbersSequenceEndsAt !== undefined && str[numbersSequenceEndsAt] === "}" && str[numbersSequenceEndsAt + 1] === "m") {
          ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
        }
        /* istanbul ignore else */
        if (!ansiSequencesLetterMAt) {
          wasLetterDetected = true;
          continue;
        }
        /* istanbul ignore else */
        if (str[ansiSequencesLetterMAt + 1] === "$" && str[ansiSequencesLetterMAt + 2] === "{" && str[ansiSequencesLetterMAt + 3] === "`") {
          i = ansiSequencesLetterMAt + 3;
          continue;
        }
      }
      wasLetterDetected = true;
    }
    if (!bracketOpensAt && str[i].trim() && consoleStartsAt && consoleStartsAt <= i) {
      if (str[i] === "(") {
        bracketOpensAt = i;
      } else {
        consoleStartsAt = null;
        digitStartsAt = null;
      }
    }
    if (isObj(opts) && opts.triggerKeywords && Array.isArray(opts.triggerKeywords)) {
      var caughtKeyword = void 0;
      for (var _y = 0, len2 = opts.triggerKeywords.length; _y < len2; _y++) {
        /* istanbul ignore else */
        if (str.startsWith(opts.triggerKeywords[_y], i)) {
          caughtKeyword = opts.triggerKeywords[_y];
          break;
        }
      }
      /* istanbul ignore else */
      if (caughtKeyword) {
        consoleStartsAt = i + caughtKeyword.length;
        i = i + caughtKeyword.length - 1;
        continue;
      }
    }
  }
  quotes = null;
  consoleStartsAt = null;
  bracketOpensAt = null;
  currentRow = 1;
  wasLetterDetected = undefined;
  digitStartsAt = null;
  currentRow = 1;
  if (opts.returnRangesOnly) {
    return finalIndexesToDelete.current();
  }
  if (finalIndexesToDelete.current()) {
    return rangesApply.rApply(str, finalIndexesToDelete.current());
  }
  return str;
}

exports.defaults = defaults;
exports.fixRowNums = fixRowNums;
exports.version = version;
