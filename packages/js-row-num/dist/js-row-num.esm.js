/**
 * js-row-num
 * Update all row numbers in all console.logs in JS code
 * Version: 2.7.26
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/js-row-num/
 */

import Ranges from 'ranges-push';
import apply from 'ranges-apply';

const BACKSLASH = `\u005C`;
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
    return (
      something && typeof something === "object" && !Array.isArray(something)
    );
  }
  const defaults = {
    padStart: 3,
    overrideRowNum: null,
    returnRangesOnly: false,
    triggerKeywords: ["console.log"],
    extractedLogContentsWereGiven: false,
  };
  const opts = Object.assign(defaults, originalOpts);
  if (
    !opts.padStart ||
    typeof opts.padStart !== "number" ||
    (typeof opts.padStart === "number" && opts.padStart < 0)
  ) {
    opts.padStart = 0;
  }
  const finalIndexesToDelete = new Ranges();
  let i;
  const len = str.length;
  let quotes = null;
  let consoleStartsAt = null;
  let bracketOpensAt = null;
  let currentRow = 1;
  let wasLetterDetected = false;
  let digitStartsAt = null;
  if (opts.padStart && len > 45000) {
    opts.padStart = 4;
  }
  for (i = 0; i < len; i++) {
    if (
      opts.overrideRowNum === null &&
      (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n"))
    ) {
      currentRow += 1;
    }
    if (
      !opts.extractedLogContentsWereGiven &&
      quotes !== null &&
      quotes.start < i &&
      quotes.type === str[i]
    ) {
      quotes = null;
      consoleStartsAt = null;
      bracketOpensAt = null;
      digitStartsAt = null;
      wasLetterDetected = false;
    }
    if (
      quotes === null &&
      (opts.extractedLogContentsWereGiven ||
        (consoleStartsAt &&
          consoleStartsAt < i &&
          bracketOpensAt &&
          bracketOpensAt < i)) &&
      str[i].trim()
    ) {
      if (str[i] === '"' || str[i] === "'" || str[i] === "`") {
        quotes = {};
        quotes.start = i;
        quotes.type = str[i];
        wasLetterDetected = false;
      } else if (opts.extractedLogContentsWereGiven && digitStartsAt === null) {
        if (isDigit(str[i])) {
          digitStartsAt = i;
        } else {
          break;
        }
      } else if (
        str[i].trim() &&
        str[i] !== "/" &&
        !opts.extractedLogContentsWereGiven
      ) {
        consoleStartsAt = null;
        bracketOpensAt = null;
        digitStartsAt = null;
      }
    }
    if (
      quotes &&
      Number.isInteger(quotes.start) &&
      quotes.start < i &&
      !wasLetterDetected &&
      digitStartsAt === null &&
      isDigit(str[i])
    ) {
      digitStartsAt = i;
    }
    if (
      Number.isInteger(digitStartsAt) &&
      (!isDigit(str[i]) || !str[i + 1]) &&
      (i > digitStartsAt || !str[i + 1])
    ) {
      if (!opts.padStart) {
        if (opts.overrideRowNum != null) ;
      }
      finalIndexesToDelete.push(
        digitStartsAt,
        !isDigit(str[i]) ? i : i + 1,
        opts.padStart
          ? String(
              opts.overrideRowNum != null ? opts.overrideRowNum : currentRow
            ).padStart(opts.padStart, "0")
          : `${opts.overrideRowNum != null ? opts.overrideRowNum : currentRow}`
      );
      digitStartsAt = null;
      wasLetterDetected = true;
    }
    if (
      quotes &&
      Number.isInteger(quotes.start) &&
      quotes.start < i &&
      !wasLetterDetected &&
      isAZ(str[i]) &&
      !(str[i] === "n" && str[i - 1] === BACKSLASH)
    ) {
      /* istanbul ignore if */
      if (
        /* istanbul ignore next */
        str[i - 1] === BACKSLASH &&
        str[i] === "u" &&
        str[i + 1] === "0" &&
        str[i + 2] === "0" &&
        str[i + 3] === "1" &&
        (str[i + 4] === "b" || str[i + 5] === "B") &&
        str[i + 5] === "["
      ) {
        let startMarchingForwFrom;
        if (isDigit(str[i + 6])) {
          startMarchingForwFrom = i + 6;
        } else if (
          str[i + 6] === "$" &&
          str[i + 7] === "{" &&
          isDigit(str[i + 8])
        ) {
          startMarchingForwFrom = i + 8;
        }
        let numbersSequenceEndsAt;
        if (startMarchingForwFrom) {
          for (let y = startMarchingForwFrom; y < len; y++) {
            if (!isDigit(str[y])) {
              numbersSequenceEndsAt = y;
              break;
            }
          }
        }
        let ansiSequencesLetterMAt;
        if (str[numbersSequenceEndsAt] === "m") {
          ansiSequencesLetterMAt = numbersSequenceEndsAt;
        } else if (
          str[numbersSequenceEndsAt] === "}" &&
          str[numbersSequenceEndsAt + 1] === "m"
        ) {
          ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
        }
        /* istanbul ignore else */
        if (!ansiSequencesLetterMAt) {
          wasLetterDetected = true;
          continue;
        }
        /* istanbul ignore else */
        if (
          str[ansiSequencesLetterMAt + 1] === "$" &&
          str[ansiSequencesLetterMAt + 2] === "{" &&
          str[ansiSequencesLetterMAt + 3] === "`"
        ) {
          i = ansiSequencesLetterMAt + 3;
          continue;
        }
      }
      wasLetterDetected = true;
    }
    if (
      !bracketOpensAt &&
      str[i].trim() &&
      consoleStartsAt &&
      consoleStartsAt <= i
    ) {
      if (str[i] === "(") {
        bracketOpensAt = i;
      } else {
        consoleStartsAt = null;
        digitStartsAt = null;
      }
    }
    if (
      isObj(opts) &&
      opts.triggerKeywords &&
      Array.isArray(opts.triggerKeywords)
    ) {
      let caughtKeyword;
      for (let y = 0, len2 = opts.triggerKeywords.length; y < len2; y++) {
        /* istanbul ignore else */
        if (str.startsWith(opts.triggerKeywords[y], i)) {
          caughtKeyword = opts.triggerKeywords[y];
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
    return apply(str, finalIndexesToDelete.current());
  }
  return str;
}

export default fixRowNums;
