/**
 * string-remove-duplicate-heads-tails
 * Detect and (recursively) remove head and tail wrappings around the input string
 * Version: 3.0.53
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails
 */

import isObj from 'lodash.isplainobject';
import arrayiffy from 'arrayiffy-if-string';
import { matchRightIncl, matchLeftIncl } from 'string-match-left-right';
import Ranges from 'ranges-push';
import rangesApply from 'ranges-apply';
import trimSpaces from 'string-trim-spaces-only';

function removeDuplicateHeadsTails(str, originalOpts = {}) {
  function existy(x) {
    return x != null;
  }
  const has = Object.prototype.hasOwnProperty;
  function isStr(something) {
    return typeof something === "string";
  }
  if (str === undefined) {
    throw new Error(
      "string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!"
    );
  }
  if (typeof str !== "string") {
    return str;
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(
      `string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ${typeof originalOpts}!`
    );
  }
  if (existy(originalOpts) && has.call(originalOpts, "heads")) {
    if (!arrayiffy(originalOpts.heads).every((val) => isStr(val))) {
      throw new Error(
        "string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!"
      );
    } else if (isStr(originalOpts.heads)) {
      originalOpts.heads = arrayiffy(originalOpts.heads);
    }
  }
  if (existy(originalOpts) && has.call(originalOpts, "tails")) {
    if (!arrayiffy(originalOpts.tails).every((val) => isStr(val))) {
      throw new Error(
        "string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!"
      );
    } else if (isStr(originalOpts.tails)) {
      originalOpts.tails = arrayiffy(originalOpts.tails);
    }
  }
  const temp = trimSpaces(str).res;
  if (temp.length === 0) {
    return str;
  }
  str = temp;
  const defaults = {
    heads: ["{{"],
    tails: ["}}"],
  };
  const opts = Object.assign({}, defaults, originalOpts);
  opts.heads = opts.heads.map((el) => el.trim());
  opts.tails = opts.tails.map((el) => el.trim());
  let firstNonMarkerChunkFound = false;
  let secondNonMarkerChunkFound = false;
  const realRanges = new Ranges({ limitToBeAddedWhitespace: true });
  const conditionalRanges = new Ranges({ limitToBeAddedWhitespace: true });
  let itsFirstTail = true;
  let itsFirstLetter = true;
  let lastMatched = "";
  function delLeadingEmptyHeadTailChunks(str1, opts1) {
    let noteDownTheIndex;
    const resultOfAttemptToMatchHeads = matchRightIncl(str1, 0, opts1.heads, {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        noteDownTheIndex = index;
        return true;
      },
      relaxedApi: true,
    });
    if (!resultOfAttemptToMatchHeads) {
      return str1;
    }
    const resultOfAttemptToMatchTails = matchRightIncl(
      str1,
      noteDownTheIndex,
      opts1.tails,
      {
        trimBeforeMatching: true,
        cb: (char, theRemainderOfTheString, index) => {
          noteDownTheIndex = index;
          return true;
        },
        relaxedApi: true,
      }
    );
    if (resultOfAttemptToMatchTails) {
      return str1.slice(noteDownTheIndex);
    }
    return str1;
  }
  while (str !== delLeadingEmptyHeadTailChunks(str, opts)) {
    str = trimSpaces(delLeadingEmptyHeadTailChunks(str, opts)).res;
  }
  function delTrailingEmptyHeadTailChunks(str1, opts1) {
    let noteDownTheIndex;
    const resultOfAttemptToMatchTails = matchLeftIncl(
      str1,
      str1.length - 1,
      opts1.tails,
      {
        trimBeforeMatching: true,
        cb: (char, theRemainderOfTheString, index) => {
          noteDownTheIndex = index;
          return true;
        },
        relaxedApi: true,
      }
    );
    if (!resultOfAttemptToMatchTails) {
      return str1;
    }
    const resultOfAttemptToMatchHeads = matchLeftIncl(
      str1,
      noteDownTheIndex,
      opts1.heads,
      {
        trimBeforeMatching: true,
        cb: (char, theRemainderOfTheString, index) => {
          noteDownTheIndex = index;
          return true;
        },
        relaxedApi: true,
      }
    );
    if (resultOfAttemptToMatchHeads) {
      return str1.slice(0, noteDownTheIndex + 1);
    }
    return str1;
  }
  while (str !== delTrailingEmptyHeadTailChunks(str, opts)) {
    str = trimSpaces(delTrailingEmptyHeadTailChunks(str, opts)).res;
  }
  if (
    !opts.heads.length ||
    !matchRightIncl(str, 0, opts.heads, {
      trimBeforeMatching: true,
      relaxedApi: true,
    }) ||
    !opts.tails.length ||
    !matchLeftIncl(str, str.length - 1, opts.tails, {
      trimBeforeMatching: true,
      relaxedApi: true,
    })
  ) {
    return trimSpaces(str).res;
  }
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].trim() === "") ; else {
      let noteDownTheIndex;
      const resultOfAttemptToMatchHeads = matchRightIncl(str, i, opts.heads, {
        trimBeforeMatching: true,
        cb: (char, theRemainderOfTheString, index) => {
          noteDownTheIndex = index;
          return true;
        },
        relaxedApi: true,
      });
      if (resultOfAttemptToMatchHeads) {
        itsFirstLetter = true;
        if (itsFirstTail) {
          itsFirstTail = true;
        }
        let tempIndexUpTo;
        const resultOfAttemptToMatchTails = matchRightIncl(
          str,
          noteDownTheIndex,
          opts.tails,
          {
            trimBeforeMatching: true,
            cb: (char, theRemainderOfTheString, index) => {
              tempIndexUpTo = index;
              return true;
            },
            relaxedApi: true,
          }
        );
        if (resultOfAttemptToMatchTails) {
          realRanges.push(i, tempIndexUpTo);
        }
        if (
          conditionalRanges.current() &&
          firstNonMarkerChunkFound &&
          lastMatched !== "tails"
        ) {
          realRanges.push(conditionalRanges.current());
        }
        if (!firstNonMarkerChunkFound) {
          if (conditionalRanges.current()) {
            realRanges.push(conditionalRanges.current());
            conditionalRanges.wipe();
          }
          conditionalRanges.push(i, noteDownTheIndex);
        } else {
          conditionalRanges.push(i, noteDownTheIndex);
        }
        lastMatched = "heads";
        i = noteDownTheIndex - 1;
        continue;
      }
      const resultOfAttemptToMatchTails = matchRightIncl(str, i, opts.tails, {
        trimBeforeMatching: true,
        cb: (char, theRemainderOfTheString, index) => {
          noteDownTheIndex = existy(index) ? index : str.length;
          return true;
        },
        relaxedApi: true,
      });
      if (resultOfAttemptToMatchTails) {
        itsFirstLetter = true;
        if (!itsFirstTail) {
          conditionalRanges.push(i, noteDownTheIndex);
        } else {
          if (lastMatched === "heads") {
            conditionalRanges.wipe();
          }
          itsFirstTail = false;
        }
        lastMatched = "tails";
        i = noteDownTheIndex - 1;
        continue;
      }
      if (itsFirstTail) {
        itsFirstTail = true;
      }
      if (itsFirstLetter && !firstNonMarkerChunkFound) {
        firstNonMarkerChunkFound = true;
        itsFirstLetter = false;
      } else if (itsFirstLetter && !secondNonMarkerChunkFound) {
        secondNonMarkerChunkFound = true;
        itsFirstTail = true;
        itsFirstLetter = false;
        if (lastMatched === "heads") {
          conditionalRanges.wipe();
        }
      } else if (itsFirstLetter && secondNonMarkerChunkFound) {
        conditionalRanges.wipe();
      }
    }
  }
  if (conditionalRanges.current()) {
    realRanges.push(conditionalRanges.current());
  }
  if (realRanges.current()) {
    return rangesApply(str, realRanges.current()).trim();
  }
  return str.trim();
}

export default removeDuplicateHeadsTails;
