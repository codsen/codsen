/**
 * string-find-malformed
 * Search for a malformed string. Think of Levenshtein distance but in search.
 * Version: 1.1.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-malformed
 */

import { right } from 'string-left-right';

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something) {
  return typeof something === "string";
}
function strFindMalformed(str, refStr, cb, originalOpts) {
  if (!isStr(str)) {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_01] the first input argument, string where to look for, must be a string! Currently it's equal to: ${str} (type: ${typeof str})`
    );
  } else if (!str.length) {
    return;
  }
  if (!isStr(refStr)) {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_02] the second input argument, string we should find, must be a string! Currently it's equal to: ${refStr} (type: ${typeof refStr})`
    );
  } else if (!refStr.length) {
    return;
  }
  if (typeof cb !== "function") {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_03] the third input argument, a callback function, must be a function! Currently it's equal to: ${cb} (type: ${typeof cb})`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_04] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ${originalOpts} (type: ${typeof originalOpts})`
    );
  }
  const defaults = {
    stringOffset: 0,
    maxDistance: 1,
    ignoreWhitespace: true,
  };
  const opts = { ...defaults, ...originalOpts };
  if (
    typeof opts.stringOffset === "string" &&
    /^\d*$/.test(opts.stringOffset)
  ) {
    opts.stringOffset = Number(opts.stringOffset);
  } else if (!Number.isInteger(opts.stringOffset) || opts.stringOffset < 0) {
    throw new TypeError(
      `${opts.source} [THROW_ID_05] opts.stringOffset must be a natural number or zero! Currently it's: ${opts.fromIndex}`
    );
  }
  const len = str.length;
  const len2 = Math.min(refStr.length, opts.maxDistance + 1);
  let pendingMatchesArr = [];
  const patience = opts.maxDistance;
  let wasThisLetterMatched;
  for (let i = 0; i < len; i++) {
    if (opts.ignoreWhitespace && !str[i].trim()) {
      continue;
    }
    for (let z = 0, len3 = pendingMatchesArr.length; z < len3; z++) {
      wasThisLetterMatched = false;
      if (
        Array.isArray(pendingMatchesArr[z].pendingToCheck) &&
        pendingMatchesArr[z].pendingToCheck.length &&
        str[i] === pendingMatchesArr[z].pendingToCheck[0]
      ) {
        wasThisLetterMatched = true;
        pendingMatchesArr[z].pendingToCheck.shift();
      } else if (
        Array.isArray(pendingMatchesArr[z].pendingToCheck) &&
        pendingMatchesArr[z].pendingToCheck.length &&
        str[i] === pendingMatchesArr[z].pendingToCheck[1]
      ) {
        wasThisLetterMatched = true;
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].patienceLeft -= 1;
      } else {
        pendingMatchesArr[z].patienceLeft -= 1;
        if (str[right(str, i)] !== pendingMatchesArr[z].pendingToCheck[0]) {
          pendingMatchesArr[z].pendingToCheck.shift();
          if (str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
            pendingMatchesArr[z].pendingToCheck.shift();
          }
        }
      }
    }
    pendingMatchesArr = pendingMatchesArr.filter(
      (obj) => obj.patienceLeft >= 0
    );
    const tempArr = pendingMatchesArr
      .filter((obj) => obj.pendingToCheck.length === 0)
      .map((obj) => obj.startsAt);
    if (Array.isArray(tempArr) && tempArr.length) {
      const idxFrom = Math.min(...tempArr);
      const idxTo = i + (wasThisLetterMatched ? 1 : 0);
      if (str.slice(idxFrom, idxTo) !== refStr) {
        cb({
          idxFrom: idxFrom + opts.stringOffset,
          idxTo: idxTo + opts.stringOffset,
        });
      }
      pendingMatchesArr = pendingMatchesArr.filter(
        (obj) => obj.pendingToCheck.length
      );
    }
    for (let y = 0; y < len2; y++) {
      if (str[i] === refStr[y]) {
        const whatToPush = {
          startsAt: i,
          patienceLeft: patience - y,
          pendingToCheck: Array.from(refStr.slice(y + 1)),
        };
        pendingMatchesArr.push(whatToPush);
        break;
      }
    }
  }
}

export default strFindMalformed;
