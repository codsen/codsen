/**
 * @name string-remove-duplicate-heads-tails
 * @fileoverview Detect and (recursively) remove head and tail wrappings around the input string
 * @version 5.0.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-remove-duplicate-heads-tails/}
 */

import isObj from 'lodash.isplainobject';
import { arrayiffy } from 'arrayiffy-if-string';
import { matchRightIncl, matchLeftIncl } from 'string-match-left-right';
import { Ranges } from 'ranges-push';
import { rApply } from 'ranges-apply';
import { trimSpaces } from 'string-trim-spaces-only';

var version$1 = "5.0.15";

const version = version$1;
const defaults = {
  heads: ["{{"],
  tails: ["}}"]
};
function remDup(str, originalOpts) {
  const has = Object.prototype.hasOwnProperty;
  if (str === undefined) {
    throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!");
  }
  if (typeof str !== "string") {
    return str;
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(`string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ${typeof originalOpts}!`);
  }
  const clonedOriginalOpts = { ...originalOpts
  };
  if (clonedOriginalOpts && has.call(clonedOriginalOpts, "heads")) {
    if (!arrayiffy(clonedOriginalOpts.heads).every(val => typeof val === "string" || Array.isArray(val))) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!");
    } else if (typeof clonedOriginalOpts.heads === "string") {
      clonedOriginalOpts.heads = arrayiffy(clonedOriginalOpts.heads);
    }
  }
  if (clonedOriginalOpts && has.call(clonedOriginalOpts, "tails")) {
    if (!arrayiffy(clonedOriginalOpts.tails).every(val => typeof val === "string" || Array.isArray(val))) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!");
    } else if (typeof clonedOriginalOpts.tails === "string") {
      clonedOriginalOpts.tails = arrayiffy(clonedOriginalOpts.tails);
    }
  }
  const temp = trimSpaces(str).res;
  if (temp.length === 0) {
    return str;
  }
  str = temp;
  const defaults = {
    heads: ["{{"],
    tails: ["}}"]
  };
  const opts = { ...defaults,
    ...clonedOriginalOpts
  };
  opts.heads = opts.heads.map(el => el.trim());
  opts.tails = opts.tails.map(el => el.trim());
  let firstNonMarkerChunkFound = false;
  let secondNonMarkerChunkFound = false;
  const realRanges = new Ranges({
    limitToBeAddedWhitespace: true
  });
  const conditionalRanges = new Ranges({
    limitToBeAddedWhitespace: true
  });
  let itsFirstTail = true;
  let itsFirstLetter = true;
  let lastMatched = "";
  function delLeadingEmptyHeadTailChunks(str1, opts1) {
    let noteDownTheIndex;
    const resultOfAttemptToMatchHeads = matchRightIncl(str1, 0, opts1.heads, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        noteDownTheIndex = index;
        return true;
      }
    });
    if (!resultOfAttemptToMatchHeads) {
      return str1;
    }
    const resultOfAttemptToMatchTails = matchRightIncl(str1, noteDownTheIndex, opts1.tails, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        noteDownTheIndex = index;
        return true;
      }
    });
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
    const resultOfAttemptToMatchTails = matchLeftIncl(str1, str1.length - 1, opts1.tails, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        noteDownTheIndex = index;
        return true;
      }
    });
    if (!resultOfAttemptToMatchTails || !noteDownTheIndex) {
      return str1;
    }
    const resultOfAttemptToMatchHeads = matchLeftIncl(str1, noteDownTheIndex, opts1.heads, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        noteDownTheIndex = index;
        return true;
      }
    });
    if (resultOfAttemptToMatchHeads) {
      return str1.slice(0, noteDownTheIndex + 1);
    }
    return str1;
  }
  while (str !== delTrailingEmptyHeadTailChunks(str, opts)) {
    str = trimSpaces(delTrailingEmptyHeadTailChunks(str, opts)).res;
  }
  if (!opts.heads.length || !matchRightIncl(str, 0, opts.heads, {
    trimBeforeMatching: true
  }) || !opts.tails.length || !matchLeftIncl(str, str.length - 1, opts.tails, {
    trimBeforeMatching: true
  })) {
    return trimSpaces(str).res;
  }
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].trim() === "") ; else {
      let noteDownTheIndex;
      const resultOfAttemptToMatchHeads = matchRightIncl(str, i, opts.heads, {
        trimBeforeMatching: true,
        cb: (_char, _theRemainderOfTheString, index) => {
          noteDownTheIndex = index;
          return true;
        }
      });
      if (resultOfAttemptToMatchHeads && noteDownTheIndex) {
        itsFirstLetter = true;
        if (itsFirstTail) {
          itsFirstTail = true;
        }
        let tempIndexUpTo;
        const resultOfAttemptToMatchTails = matchRightIncl(str, noteDownTheIndex, opts.tails, {
          trimBeforeMatching: true,
          cb: (_char, _theRemainderOfTheString, index) => {
            tempIndexUpTo = index;
            return true;
          }
        });
        if (resultOfAttemptToMatchTails) {
          realRanges.push(i, tempIndexUpTo);
        }
        if (conditionalRanges.current() && firstNonMarkerChunkFound && lastMatched !== "tails") {
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
        cb: (_char, _theRemainderOfTheString, index) => {
          noteDownTheIndex = Number.isInteger(index) ? index : str.length;
          return true;
        }
      });
      if (resultOfAttemptToMatchTails && noteDownTheIndex) {
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
    return rApply(str, realRanges.current()).trim();
  }
  return str.trim();
}

export { defaults, remDup, version };
