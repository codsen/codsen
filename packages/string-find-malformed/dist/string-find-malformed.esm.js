/**
 * string-find-malformed
 * Search for a malformed string. Think of Levenshtein distance but in search.
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-find-malformed/
 */

import { right } from 'string-left-right';

var version$1 = "2.0.5";

const version = version$1;

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function isStr(something) {
  return typeof something === "string";
}

const defaults = {
  stringOffset: 0,
  maxDistance: 1,
  ignoreWhitespace: true
};

function findMalformed(str, refStr, cb, originalOpts) { //
  // insurance
  // ---------

  if (!isStr(str)) {
    throw new TypeError(`string-find-malformed: [THROW_ID_01] the first input argument, string where to look for, must be a string! Currently it's equal to: ${str} (type: ${typeof str})`);
  } else if (!str.length) {
    // empty string - quick ending
    return;
  }

  if (!isStr(refStr)) {
    throw new TypeError(`string-find-malformed: [THROW_ID_02] the second input argument, string we should find, must be a string! Currently it's equal to: ${refStr} (type: ${typeof refStr})`);
  } else if (!refStr.length) {
    // empty string to look for - quick ending
    return;
  }

  if (typeof cb !== "function") {
    throw new TypeError(`string-find-malformed: [THROW_ID_03] the third input argument, a callback function, must be a function! Currently it's equal to: ${cb} (type: ${typeof cb})`);
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(`string-find-malformed: [THROW_ID_04] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ${originalOpts} (type: ${typeof originalOpts})`);
  }

  const opts = { ...defaults,
    ...originalOpts
  }; // we perform the validation upon Object-assigned "opts" instead
  // of incoming "originalOpts" because we don't want to mutate the
  // "originalOpts" and making note of fixed values, Object-assigning
  // "opts" and then putting those noted fixed values on top is more
  // tedious than letting Object-assign to do the job, then validating
  // it, then trying to salvage the value (if possible).

  if (typeof opts.stringOffset === "string" && /^\d*$/.test(opts.stringOffset)) {
    opts.stringOffset = Number(opts.stringOffset);
  } else if (!Number.isInteger(opts.stringOffset) || opts.stringOffset < 0) {
    throw new TypeError(`[THROW_ID_05] opts.stringOffset must be a natural number or zero! Currently it's: ${opts.stringOffset}`);
  } //
  // action
  // ------

  const len = str.length; // "current" character (str[i]) is matched against first character
  // of "refStr", then, if opts.maxDistance allows and refStr has
  // enough length, current character (str[i]) is matched against the
  // second character of "refStr" - this time, "patience" is subtracted
  // by amount of skipped characters, in this case, by 1... and so on...
  // That matching chain is a "for" loop and that loop's length is below:

  const len2 = Math.min(refStr.length, (opts.maxDistance || 0) + 1);
  let pendingMatchesArr = []; // when it attempts to dip below zero, match is failed

  const patience = opts.maxDistance || 1;
  let wasThisLetterMatched;

  for (let i = 0; i < len; i++) {
    //
    //
    //
    //
    //                             THE TOP
    //                             ███████
    //
    //
    //
    //
    // Logging:
    // -------------------------------------------------------------------------

    if (opts.ignoreWhitespace && !str[i].trim()) {
      continue;
    } //
    //
    //
    //
    //                            THE MIDDLE
    //                            ██████████
    //
    //
    //
    //

    for (let z = 0, len3 = pendingMatchesArr.length; z < len3; z++) {
      wasThisLetterMatched = false;

      if (Array.isArray(pendingMatchesArr[z].pendingToCheck) && pendingMatchesArr[z].pendingToCheck.length && str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
        wasThisLetterMatched = true; // if matched, shift() it

        pendingMatchesArr[z].pendingToCheck.shift();
      } else if (Array.isArray(pendingMatchesArr[z].pendingToCheck) && pendingMatchesArr[z].pendingToCheck.length && str[i] === pendingMatchesArr[z].pendingToCheck[1]) {
        wasThisLetterMatched = true; // if matched, shift() it

        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].patienceLeft -= 1; //
      } else {
        pendingMatchesArr[z].patienceLeft -= 1; // we look up the next character, if it matches, we don't pop it

        if (str[right(str, i)] !== pendingMatchesArr[z].pendingToCheck[0]) {
          pendingMatchesArr[z].pendingToCheck.shift(); // after popping, match the current character at str[i] is it
          // equal to the first element of recently-shifted
          // pendingMatchesArr[z].pendingToCheck:

          if (str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
            pendingMatchesArr[z].pendingToCheck.shift();
          }
        }
      }
    }
    pendingMatchesArr = pendingMatchesArr.filter(obj => obj.patienceLeft >= 0); // out of all objects which deplete pendingToCheck[] to zero length,
    // we pick the one with the smallest "startsAt" value - that's filtering
    // the overlapping values

    const tempArr = pendingMatchesArr.filter(obj => obj.pendingToCheck.length === 0).map(obj => obj.startsAt);

    if (Array.isArray(tempArr) && tempArr.length) {
      const idxFrom = Math.min(...tempArr);
      const idxTo = i + (wasThisLetterMatched ? 1 : 0);

      if (str.slice(idxFrom, idxTo) !== refStr) {
        // only ping malformed values, don't ping those exactly matching "refStr"
        cb({
          idxFrom: idxFrom + (opts.stringOffset || 0),
          idxTo: idxTo + (opts.stringOffset || 0)
        });
      } // remove pendingMatchesArr[] entries with no characters to check


      pendingMatchesArr = pendingMatchesArr.filter(obj => obj.pendingToCheck.length);
    }

    for (let y = 0; y < len2; y++) {

      if (str[i] === refStr[y]) {
        const whatToPush = {
          startsAt: i,
          patienceLeft: patience - y,
          pendingToCheck: Array.from(refStr.slice(y + 1))
        };
        pendingMatchesArr.push(whatToPush);
        break;
      }
    } //
    //
    //
    //
    //                            THE BOTTOM
    //                            ██████████
    //
    //
    //
    //
    // Logging
  }
}

export { defaults, findMalformed, version };
