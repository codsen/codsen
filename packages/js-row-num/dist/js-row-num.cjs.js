/**
 * js-row-num
 * Update all row numbers in all console.logs in JS code
 * Version: 2.4.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Slices = _interopDefault(require('ranges-push'));
var applySlices = _interopDefault(require('ranges-apply'));
var clone = _interopDefault(require('lodash.clonedeep'));
var isObj = _interopDefault(require('lodash.isplainobject'));

function fixRowNums(str, originalOpts) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  function isDigit(something) {
    return /[0-9]/.test(something);
  }
  function isAZ(something) {
    return /[A-Za-z]/.test(something);
  }
  var defaults = {
    padStart: 3,
    triggerKeywords: ["console.log"]
  };
  var opts = clone(defaults);
  if (isObj(originalOpts)) {
    if (Object.prototype.hasOwnProperty.call(originalOpts, "triggerKeywords")) {
      if (Array.isArray(originalOpts.triggerKeywords)) {
        opts.triggerKeywords = clone(originalOpts.triggerKeywords);
      } else if (originalOpts.triggerKeywords === null) {
        opts.triggerKeywords = [];
      }
    }
    if (Object.prototype.hasOwnProperty.call(originalOpts, "padStart")) {
      opts.padStart = originalOpts.padStart;
    }
  }
  if (!opts.padStart || typeof opts.padStart !== "number" || typeof opts.padStart === "number" && opts.padStart < 0) {
    opts.padStart = 0;
  }
  var finalIndexesToDelete = new Slices();
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
    if (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n") {
      currentRow++;
    }
    if (digitStartsAt && !isDigit(str[i]) && i > digitStartsAt) {
      finalIndexesToDelete.push(digitStartsAt, i, opts.padStart ? String(currentRow).padStart(opts.padStart, "0") : "".concat(currentRow));
      digitStartsAt = null;
      wasLetterDetected = true;
    }
    if (quotes && quotes.start < i && !wasLetterDetected && !digitStartsAt && isDigit(str[i])) {
      digitStartsAt = i;
    }
    if (quotes && quotes.start < i && !wasLetterDetected && isAZ(str[i])) {
      if (str[i - 1] === "\\" && str[i] === "u" && str[i + 1] === "0" && str[i + 2] === "0" && str[i + 3] === "1" && (str[i + 4] === "b" || str[i + 5] === "B") && str[i + 5] === "[") {
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
        if (str[numbersSequenceEndsAt] === "m") {
          ansiSequencesLetterMAt = numbersSequenceEndsAt;
        } else if (str[numbersSequenceEndsAt] === "}" && str[numbersSequenceEndsAt + 1] === "m") {
          ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
        }
        if (!ansiSequencesLetterMAt) {
          wasLetterDetected = true;
          continue;
        }
        if (str[ansiSequencesLetterMAt + 1] === "$" && str[ansiSequencesLetterMAt + 2] === "{" && str[ansiSequencesLetterMAt + 3] === "`") {
          i = ansiSequencesLetterMAt + 3;
          continue;
        }
      }
      wasLetterDetected = true;
    }
    if (quotes && quotes.start < i && quotes.type === str[i]) {
      quotes = null;
      consoleStartsAt = null;
      bracketOpensAt = null;
      digitStartsAt = null;
      wasLetterDetected = false;
    }
    if (!quotes && consoleStartsAt && consoleStartsAt < i && bracketOpensAt && bracketOpensAt < i && str[i].trim().length) {
      if (str[i] === '"' || str[i] === "'" || str[i] === "`") {
        quotes = {};
        quotes.start = i;
        quotes.type = str[i];
        wasLetterDetected = false;
      } else if (str[i] !== "/") {
        consoleStartsAt = null;
        bracketOpensAt = null;
        digitStartsAt = null;
      }
    }
    if (!bracketOpensAt && str[i].trim().length && consoleStartsAt && consoleStartsAt <= i) {
      if (str[i] === "(") {
        bracketOpensAt = i;
      } else {
        consoleStartsAt = null;
        digitStartsAt = null;
      }
    }
    var caughtKeyword = void 0;
    if (opts.triggerKeywords.some(function (keyw) {
      if (str.startsWith(keyw, i)) {
        caughtKeyword = keyw;
        return true;
      }
    })) {
      consoleStartsAt = i + caughtKeyword.length;
      i = i + caughtKeyword.length - 1;
      continue;
    }
  }
  if (finalIndexesToDelete.current()) {
    return applySlices(str, finalIndexesToDelete.current());
  }
  quotes = undefined;
  consoleStartsAt = undefined;
  bracketOpensAt = undefined;
  currentRow = undefined;
  wasLetterDetected = undefined;
  digitStartsAt = undefined;
  currentRow = undefined;
  return str;
}

module.exports = fixRowNums;
