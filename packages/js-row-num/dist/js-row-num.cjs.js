/**
 * js-row-num
 * Update all row numbers in all console.logs in JS code
 * Version: 3.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/js-row-num/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var rangesPush = require('ranges-push');
var rangesApply = require('ranges-apply');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version = "3.0.2";

var version$1 = version;
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
    return something && typeof something === "object" && !Array.isArray(something);
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

  for (i = 0; i < len; i++) { // count lines:

    if (opts.overrideRowNum === null && (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n")) {
      currentRow += 1;
    } // catch closing quotes console.log( ' -----> ' <------)


    if (!opts.extractedLogContentsWereGiven && quotes !== null && quotes.start < i && quotes.type === str[i]) {
      quotes = null;
      consoleStartsAt = null;
      bracketOpensAt = null;
      digitStartsAt = null;
      wasLetterDetected = false;
    } // catch opening quotes console.log( -----> ' <------ ')


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
      } else if (str[i].trim() && str[i] !== "/" && !opts.extractedLogContentsWereGiven) { // wipe
        consoleStartsAt = null;
        bracketOpensAt = null;
        digitStartsAt = null;
      }
    } // catch the first digit within console.log:


    if (quotes && Number.isInteger(quotes.start) && quotes.start < i && !wasLetterDetected && digitStartsAt === null && isDigit(str[i])) {
      digitStartsAt = i;
    } // catch the ending of the digits within console.log:


    if (Number.isInteger(digitStartsAt) && (!isDigit(str[i]) || !str[i + 1]) && (i > digitStartsAt || !str[i + 1])) {
      // replace the digits:

      if (!opts.padStart) {

        if (opts.overrideRowNum != null) ;
      } // PS. finalIndexesToDelete is a Ranges class so we can push
      // two/three arguments and it will understand it's (range) array...


      finalIndexesToDelete.push(digitStartsAt, !isDigit(str[i]) ? i : i + 1, opts.padStart ? String(opts.overrideRowNum != null ? opts.overrideRowNum : currentRow).padStart(opts.padStart, "0") : "" + (opts.overrideRowNum != null ? opts.overrideRowNum : currentRow)); // then, reset:

      digitStartsAt = null; // set wasLetterDetected as a decoy to prevent further digit lumps from being edited:

      wasLetterDetected = true;
    } // catch first letter within console.log:


    if (quotes && Number.isInteger(quotes.start) && quotes.start < i && !wasLetterDetected && isAZ(str[i]) && !(str[i] === "n" && str[i - 1] === BACKSLASH)) {
      // Skip one of more of either patterns:
      // \u001b[${33}m
      // ${`
      // `\u001b[33m       \u001b[39m`
      // \u001B[4m        \u001B[0m
      // \u001B[4m   \u001B[0m
      // check for pattern \u001B[ + optional ${ + any amount of digits + optional } + m

      /* istanbul ignore if */
      if (
      /* istanbul ignore next */
      str[i - 1] === BACKSLASH && str[i] === "u" && str[i + 1] === "0" && str[i + 2] === "0" && str[i + 3] === "1" && (str[i + 4] === "b" || str[i + 5] === "B") && str[i + 5] === "[") { // at this moment, we have stuck here:
        //
        // console.log(`\u001b[${33}m${`291 zzz`}\u001b[${39}m`)
        //                    ^
        //           here, at this bracket
        // now, the ANSI colour digit code might be wrapped with ${} and also,
        // it can be of an indeterminate width: normally there is either one or
        // two digits.
        // We need to find where digits start.
        // There are two possibilities: either here, or after string literal ${}
        // wrapper:
        // base assumption, we're here:
        // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
        //                     ^
        //                   here

        var startMarchingForwFrom = void 0;

        if (isDigit(str[i + 6])) {
          startMarchingForwFrom = i + 6;
        } else if (str[i + 6] === "$" && str[i + 7] === "{" && isDigit(str[i + 8])) {
          startMarchingForwFrom = i + 8;
        } // find out where does this (possibly a sequence) of number(s) end:

        var numbersSequenceEndsAt = void 0;

        if (startMarchingForwFrom) {

          for (var y = startMarchingForwFrom; y < len; y++) {

            if (!isDigit(str[y])) {
              numbersSequenceEndsAt = y;
              break;
            }
          }
        } // answer: at "numbersSequenceEndsAt". // We're at the next character where digits end. That is:
        // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
        //                       ^
        //                     here, OR
        // console.log(`\u001b[${33}m 123 zzz \u001b[${39}m`)
        //                         ^
        //                       here

        var ansiSequencesLetterMAt = void 0;

        if (numbersSequenceEndsAt !== undefined && str[numbersSequenceEndsAt] === "m") {
          // if number follows "m", this is it:
          ansiSequencesLetterMAt = numbersSequenceEndsAt;
        } else if (numbersSequenceEndsAt !== undefined && str[numbersSequenceEndsAt] === "}" && str[numbersSequenceEndsAt + 1] === "m") {
          ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
        }
        /* istanbul ignore else */

        if (!ansiSequencesLetterMAt) {
          // if ANSI closing "m" hasn't been detected yet, bail:
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
    } // catch the opening bracket of console.log ---->(<----- )


    if (!bracketOpensAt && str[i].trim() && consoleStartsAt && consoleStartsAt <= i) {
      if (str[i] === "(") {
        bracketOpensAt = i;
      } else {
        // wipe
        consoleStartsAt = null;
        digitStartsAt = null;
      }
    } // catch the trigger keywords


    if (isObj(opts) && opts.triggerKeywords && Array.isArray(opts.triggerKeywords)) {
      // check does any of the trigger keywords match
      var caughtKeyword = void 0;

      for (var _y = 0, len2 = opts.triggerKeywords.length; _y < len2; _y++) {
        /* istanbul ignore else */
        if (str.startsWith(opts.triggerKeywords[_y], i)) {
          caughtKeyword = opts.triggerKeywords[_y];
          break;
        }
      } // if any of trigger keywords starts here

      /* istanbul ignore else */


      if (caughtKeyword) {
        consoleStartsAt = i + caughtKeyword.length; // offset the index so we don't traverse twice what was traversed already:

        i = i + caughtKeyword.length - 1;
        continue;
      }
    }
  } // wipe

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
exports.version = version$1;
