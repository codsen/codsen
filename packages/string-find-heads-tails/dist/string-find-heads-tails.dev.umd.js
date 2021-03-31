/**
 * string-find-heads-tails
 * Finds where are arbitrary templating marker heads and tails located
 * Version: 4.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-find-heads-tails/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringFindHeadsTails = {}));
}(this, (function (exports) { 'use strict';

/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.13.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length) {
      return [something];
    }
    return [];
  }
  return something;
}

/**
 * string-match-left-right
 * Match substrings on the left or right of a given index, ignoring whitespace
 * Version: 7.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-match-left-right/
 */

function isObj$1(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function isStr$1(something) {
  return typeof something === "string";
}
const defaults$1 = {
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false,
  hungry: false
};
const defaultGetNextIdx = index => index + 1;
function march(str, position, whatToMatchVal, originalOpts, special = false, getNextIdx = defaultGetNextIdx) {
  const whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;
  if (+position < 0 && special && whatToMatchValVal === "EOL") {
    return whatToMatchValVal;
  }
  const opts = { ...defaults$1,
    ...originalOpts
  };
  if (position >= str.length && !special) {
    return false;
  }
  let charsToCheckCount = special ? 1 : whatToMatchVal.length;
  let charsMatchedTotal = 0;
  let patienceReducedBeforeFirstMatch = false;
  let lastWasMismatched = false;
  let atLeastSomethingWasMatched = false;
  let patience = opts.maxMismatches;
  let i = position;
  let somethingFound = false;
  let firstCharacterMatched = false;
  let lastCharacterMatched = false;
  function whitespaceInFrontOfFirstChar() {
    return (
      charsMatchedTotal === 1 &&
      patience < opts.maxMismatches - 1
    );
  }
  while (str[i]) {
    const nextIdx = getNextIdx(i);
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    if (opts && !opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.includes(str[i]) || opts && opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.map(val => val.toLowerCase()).includes(str[i].toLowerCase())) {
      if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    const charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1];
    if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
      if (!somethingFound) {
        somethingFound = true;
      }
      if (!atLeastSomethingWasMatched) {
        atLeastSomethingWasMatched = true;
      }
      if (charsToCheckCount === whatToMatchVal.length) {
        firstCharacterMatched = true;
        if (patience !== opts.maxMismatches) {
          return false;
        }
      } else if (charsToCheckCount === 1) {
        lastCharacterMatched = true;
      }
      charsToCheckCount -= 1;
      charsMatchedTotal++;
      if (whitespaceInFrontOfFirstChar()) {
        return false;
      }
      if (!charsToCheckCount) {
        return (
          charsMatchedTotal !== whatToMatchVal.length ||
          patience === opts.maxMismatches ||
          !patienceReducedBeforeFirstMatch ? i : false
        );
      }
    } else {
      if (!patienceReducedBeforeFirstMatch && !charsMatchedTotal) {
        patienceReducedBeforeFirstMatch = true;
      }
      if (opts.maxMismatches && patience && i) {
        patience -= 1;
        for (let y = 0; y <= patience; y++) {
          const nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
          const nextCharInSource = str[getNextIdx(i)];
          if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            charsMatchedTotal++;
            if (whitespaceInFrontOfFirstChar()) {
              return false;
            }
            charsToCheckCount -= 2;
            somethingFound = true;
            break;
          } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            if (!charsMatchedTotal && !opts.hungry) {
              return false;
            }
            charsToCheckCount -= 1;
            somethingFound = true;
            break;
          } else if (nextCharToCompareAgainst === undefined && patience >= 0 && somethingFound && (!opts.firstMustMatch || firstCharacterMatched) && (!opts.lastMustMatch || lastCharacterMatched)) {
            return i;
          }
        }
        if (!somethingFound) {
          lastWasMismatched = i;
        }
      } else if (i === 0 && charsToCheckCount === 1 && !opts.lastMustMatch && atLeastSomethingWasMatched) {
        return 0;
      } else {
        return false;
      }
    }
    if (lastWasMismatched !== false && lastWasMismatched !== i) {
      lastWasMismatched = false;
    }
    if (charsToCheckCount < 1) {
      return i;
    }
    i = getNextIdx(i);
  }
  if (charsToCheckCount > 0) {
    if (special && whatToMatchValVal === "EOL") {
      return true;
    }
    if (opts && opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
      return lastWasMismatched || 0;
    }
    return false;
  }
}
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  if (isObj$1(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(originalOpts.trimBeforeMatching) ? ` Did you mean to use opts.trimCharsBeforeMatching?` : ""}`);
  }
  const opts = { ...defaults$1,
    ...originalOpts
  };
  if (typeof opts.trimCharsBeforeMatching === "string") {
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  }
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el => isStr$1(el) ? el : String(el));
  if (!isStr$1(str)) {
    return false;
  }
  if (!str.length) {
    return false;
  }
  if (!Number.isInteger(position) || position < 0) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof position}, equal to:\n${JSON.stringify(position, null, 4)}`);
  }
  let whatToMatch;
  let special;
  if (isStr$1(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!originalWhatToMatch) {
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
  } else {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(originalWhatToMatch, null, 4)}`);
  }
  if (originalOpts && !isObj$1(originalOpts)) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  }
  let culpritsIndex = 0;
  let culpritsVal = "";
  if (opts && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.some((el, i) => {
    if (el.length > 1) {
      culpritsIndex = i;
      culpritsVal = el;
      return true;
    }
    return false;
  })) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`);
  }
  if (!whatToMatch || !Array.isArray(whatToMatch) ||
  Array.isArray(whatToMatch) && !whatToMatch.length ||
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr$1(whatToMatch[0]) && !whatToMatch[0].trim()
  ) {
      if (typeof opts.cb === "function") {
        let firstCharOutsideIndex;
        let startingPosition = position;
        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }
        if (mode[5] === "L") {
          for (let y = startingPosition; y--;) {
            const currentChar = str[y];
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (let y = startingPosition; y < str.length; y++) {
            const currentChar = str[y];
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        }
        if (firstCharOutsideIndex === undefined) {
          return false;
        }
        const wholeCharacterOutside = str[firstCharOutsideIndex];
        const indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
        let theRemainderOfTheString = "";
        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
        }
        if (mode[5] === "L") {
          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        }
        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          theRemainderOfTheString = str.slice(firstCharOutsideIndex);
        }
        return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
      }
      let extraNote = "";
      if (!originalOpts) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${extraNote}`);
    }
  for (let i = 0, len = whatToMatch.length; i < len; i++) {
    special = typeof whatToMatch[i] === "function";
    const whatToMatchVal = whatToMatch[i];
    let fullCharacterInFront;
    let indexOfTheCharacterInFront;
    let restOfStringInFront = "";
    let startingPosition = position;
    if (mode === "matchRight") {
      startingPosition += 1;
    } else if (mode === "matchLeft") {
      startingPosition -= 1;
    }
    const found = march(str, startingPosition, whatToMatchVal, opts, special, i2 => mode[5] === "L" ? i2 - 1 : i2 + 1);
    if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
      return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
    }
    if (Number.isInteger(found)) {
      indexOfTheCharacterInFront = mode.startsWith("matchLeft") ? found - 1 : found + 1;
      if (mode[5] === "L") {
        restOfStringInFront = str.slice(0, found);
      } else {
        restOfStringInFront = str.slice(indexOfTheCharacterInFront);
      }
    }
    if (indexOfTheCharacterInFront < 0) {
      indexOfTheCharacterInFront = undefined;
    }
    if (str[indexOfTheCharacterInFront]) {
      fullCharacterInFront = str[indexOfTheCharacterInFront];
    }
    if (Number.isInteger(found) && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
      return whatToMatchVal;
    }
  }
  return false;
}
function matchRightIncl(str, position, whatToMatch, opts) {
  return main("matchRightIncl", str, position, whatToMatch, opts);
}

var version$1 = "4.0.12";

const version = version$1;
function isObj(something) {
    return (something && typeof something === "object" && !Array.isArray(something));
}
function isStr(something) {
    return typeof something === "string";
}
const defaults = {
    fromIndex: 0,
    throwWhenSomethingWrongIsDetected: true,
    allowWholeValueToBeOnlyHeadsOrTails: true,
    source: "string-find-heads-tails",
    matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
    relaxedAPI: false,
};
function strFindHeadsTails(str, heads, tails, originalOpts) {
    // prep opts
    if (originalOpts && !isObj(originalOpts)) {
        throw new TypeError(`string-find-heads-tails: [THROW_ID_01] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ${originalOpts} (type: ${typeof originalOpts})`);
    }
    const opts = { ...defaults, ...originalOpts };
    if (typeof opts.fromIndex === "string" && /^\d*$/.test(opts.fromIndex)) {
        opts.fromIndex = Number(opts.fromIndex);
    }
    else if (!Number.isInteger(opts.fromIndex) || opts.fromIndex < 0) {
        throw new TypeError(`${opts.source} [THROW_ID_18] the fourth input argument must be a natural number or zero! Currently it's: ${opts.fromIndex}`);
    }
    //
    // insurance
    // ---------
    if (!isStr(str) || str.length === 0) {
        if (opts.relaxedAPI) {
            return [];
        }
        throw new TypeError(`string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to: ${str}`);
    }
    let culpritsVal;
    let culpritsIndex;
    // - for heads
    if (typeof heads !== "string" && !Array.isArray(heads)) {
        if (opts.relaxedAPI) {
            return [];
        }
        throw new TypeError(`string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it's: ${typeof heads}, equal to:\n${JSON.stringify(heads, null, 4)}`);
    }
    else if (typeof heads === "string") {
        if (heads.length === 0) {
            if (opts.relaxedAPI) {
                return [];
            }
            throw new TypeError("string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it's empty.");
        }
        else {
            // eslint-disable-next-line no-param-reassign
            heads = arrayiffy(heads);
        }
    }
    else if (Array.isArray(heads)) {
        if (heads.length === 0) {
            if (opts.relaxedAPI) {
                return [];
            }
            throw new TypeError("string-find-heads-tails: [THROW_ID_05] the second input argument, heads, must be a non-empty array and contain at least one string! Currently it's empty.");
        }
        else if (!heads.every((val, index) => {
            culpritsVal = val;
            culpritsIndex = index;
            return isStr(val);
        })) {
            if (opts.relaxedAPI) {
                // eslint-disable-next-line no-param-reassign
                heads = heads.filter((el) => isStr(el) && el.length > 0);
                if (heads.length === 0) {
                    return [];
                }
            }
            else {
                throw new TypeError(`string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at ${culpritsIndex}th index is ${typeof culpritsVal}, equal to:\n${JSON.stringify(culpritsVal, null, 4)}. Whole heads array looks like:\n${JSON.stringify(heads, null, 4)}`);
            }
        }
        else if (!heads.every((val, index) => {
            culpritsIndex = index;
            return isStr(val) && val.length > 0 && val.trim() !== "";
        })) {
            if (opts.relaxedAPI) {
                // eslint-disable-next-line no-param-reassign
                heads = heads.filter((el) => isStr(el) && el.length > 0);
                if (heads.length === 0) {
                    return [];
                }
            }
            else {
                throw new TypeError(`string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there's one detected at index ${culpritsIndex} of heads array:\n${JSON.stringify(heads, null, 4)}.`);
            }
        }
    }
    // - for tails
    if (!isStr(tails) && !Array.isArray(tails)) {
        if (opts.relaxedAPI) {
            return [];
        }
        throw new TypeError(`string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it's: ${typeof tails}, equal to:\n${JSON.stringify(tails, null, 4)}`);
    }
    else if (isStr(tails)) {
        if (tails.length === 0) {
            if (opts.relaxedAPI) {
                return [];
            }
            throw new TypeError("string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it's empty.");
        }
        else {
            // eslint-disable-next-line no-param-reassign
            tails = arrayiffy(tails);
        }
    }
    else if (Array.isArray(tails)) {
        if (tails.length === 0) {
            if (opts.relaxedAPI) {
                return [];
            }
            throw new TypeError("string-find-heads-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it's empty.");
        }
        else if (!tails.every((val, index) => {
            culpritsVal = val;
            culpritsIndex = index;
            return isStr(val);
        })) {
            if (opts.relaxedAPI) {
                // eslint-disable-next-line no-param-reassign
                tails = tails.filter((el) => isStr(el) && el.length > 0);
                if (tails.length === 0) {
                    return [];
                }
            }
            else {
                throw new TypeError(`string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at ${culpritsIndex}th index is ${typeof culpritsVal}, equal to:\n${JSON.stringify(culpritsVal, null, 4)}. Whole tails array is equal to:\n${JSON.stringify(tails, null, 4)}`);
            }
        }
        else if (!tails.every((val, index) => {
            culpritsIndex = index;
            return isStr(val) && val.length > 0 && val.trim() !== "";
        })) {
            if (opts.relaxedAPI) {
                // eslint-disable-next-line no-param-reassign
                tails = tails.filter((el) => isStr(el) && el.length > 0);
                if (tails.length === 0) {
                    return [];
                }
            }
            else {
                throw new TypeError(`string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there's one detected at index ${culpritsIndex}. Whole tails array is equal to:\n${JSON.stringify(tails, null, 4)}`);
            }
        }
    }
    // inner variable meaning is opts.source the default-one
    const s = opts.source === defaults.source;
    if (opts.throwWhenSomethingWrongIsDetected &&
        !opts.allowWholeValueToBeOnlyHeadsOrTails) {
        if (arrayiffy(heads).includes(str)) {
            throw new Error(`${opts.source}${s ? ": [THROW_ID_16]" : ""} the whole input string can't be equal to ${isStr(heads) ? "" : "one of "}heads (${str})!`);
        }
        else if (arrayiffy(tails).includes(str)) {
            throw new Error(`${opts.source}${s ? ": [THROW_ID_17]" : ""} the whole input string can't be equal to ${isStr(tails) ? "" : "one of "}tails (${str})!`);
        }
    }
    //
    // prep stage.
    // ----
    // We are going to traverse the input string, checking each character one-by-one,
    // is it a first character of a sub-string, heads or tails.
    // The easy but inefficient algorithm is to traverse the input string, then
    // for each of the character, run another loop, slicing and matching, is there
    // one of heads or tails on the right of it.
    // Let's cut corners a little bit.
    // We know that heads and tails often start with special characters, not letters.
    // For example, "%%-" and "-%%".
    // There might be few types of heads and tails, for example, ones that will be
    // further processed (like wrapped with other strings) and ones that won't.
    // So, you might have two sets of heads and tails:
    // "%%-" and "-%%"; "%%_" and "_%%".
    // Notice they're quite similar and don't contain letters.
    // Imagine we're traversing the string and looking for above set of heads and
    // tails. We're concerned only if the current character is equal to "%", "-" or "_".
    // Practically, that "String.charCodeAt(0)" values:
    // '%'.charCodeAt(0) = 37
    // '-'.charCodeAt(0) = 45
    // '_'.charCodeAt(0) = 95
    // Since we don't know how many head and tail sets there will be nor their values,
    // conceptually, we are going to extract the RANGE OF CHARCODES, in the case above,
    // [37, 95].
    // This means, we traverse the string and check, is its charcode in range [37, 95].
    // If so, then we'll do all slicing/comparing.
    // take array of strings, heads, and extract the upper and lower range of indexes
    // of their first letters using charCodeAt(0)
    const headsAndTailsFirstCharIndexesRange = heads
        .concat(tails)
        .map((value) => value.charAt(0)) // get first letters
        .reduce((res, val) => {
        if (val.charCodeAt(0) > res[1]) {
            return [res[0], val.charCodeAt(0)]; // find the char index of the max char index out of all
        }
        if (val.charCodeAt(0) < res[0]) {
            return [val.charCodeAt(0), res[1]]; // find the char index of the min char index out of all
        }
        return res;
    }, [
        heads[0].charCodeAt(0),
        heads[0].charCodeAt(0),
    ]);
    const res = [];
    let oneHeadFound = false;
    let tempResObj = {};
    let tailSuspicionRaised = "";
    // if opts.opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder is on and heads
    // matched was i-th in the array, we will record its index "i" and later match
    // the next tails to be also "i-th". Or throw.
    let strictMatchingIndex;
    for (let i = opts.fromIndex, len = str.length; i < len; i++) {
        const firstCharsIndex = str[i].charCodeAt(0);
        if (firstCharsIndex <= headsAndTailsFirstCharIndexesRange[1] &&
            firstCharsIndex >= headsAndTailsFirstCharIndexesRange[0]) {
            const matchedHeads = matchRightIncl(str, i, heads);
            if (matchedHeads && opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder) {
                for (let z = heads.length; z--;) {
                    if (heads[z] === matchedHeads) {
                        strictMatchingIndex = z;
                        break;
                    }
                }
            }
            if (typeof matchedHeads === "string") {
                if (!oneHeadFound) {
                    // res[0].push(i)
                    tempResObj = {};
                    tempResObj.headsStartAt = i;
                    tempResObj.headsEndAt = i + matchedHeads.length;
                    oneHeadFound = true;
                    // offset the index so the characters of the confirmed heads can't be "reused"
                    // again for subsequent, false detections:
                    i += matchedHeads.length - 1;
                    if (tailSuspicionRaised) {
                        tailSuspicionRaised = "";
                    }
                    continue;
                }
                else if (opts.throwWhenSomethingWrongIsDetected) {
                    throw new TypeError(`${opts.source}${s ? ": [THROW_ID_19]" : ""} When processing "${str}", we found heads (${str.slice(i, i + matchedHeads.length)}) starting at character with index number "${i}" and there was another set of heads before it! Generally speaking, there should be "heads-tails-heads-tails", not "heads-heads-tails"!\nWe're talking about the area of the code:\n\n\n--------------------------------------starts\n${str.slice(Math.max(i - 200, 0), i)}\n      ${`\u001b[${33}m------->\u001b[${39}m`} ${`\u001b[${31}m${str.slice(i, i + matchedHeads.length)}\u001b[${39}m`} \u001b[${33}m${"<-------"}\u001b[${39}m\n${str.slice(i + matchedHeads.length, Math.min(len, i + 200))}\n--------------------------------------ends\n\n\nTo turn off this error being thrown, set opts.throwWhenSomethingWrongIsDetected to Boolean false.`);
                }
            }
            const matchedTails = matchRightIncl(str, i, tails);
            if (oneHeadFound &&
                matchedTails &&
                opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder &&
                strictMatchingIndex !== undefined &&
                tails[strictMatchingIndex] !== undefined &&
                tails[strictMatchingIndex] !== matchedTails) {
                let temp;
                // find out which index in "matchedTails" does have "tails":
                for (let z = tails.length; z--;) {
                    if (tails[z] === matchedTails) {
                        temp = z;
                        break;
                    }
                }
                throw new TypeError(`${opts.source}${s ? ": [THROW_ID_20]" : ""} When processing "${str}", we had "opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder" on. We found heads (${heads[strictMatchingIndex]}) but the tails the followed it were not of the same index, ${strictMatchingIndex} (${tails[strictMatchingIndex]}) but ${temp} (${matchedTails}).`);
            }
            if (typeof matchedTails === "string") {
                if (oneHeadFound) {
                    tempResObj.tailsStartAt = i;
                    tempResObj.tailsEndAt = i + matchedTails.length;
                    res.push(tempResObj);
                    tempResObj = {};
                    oneHeadFound = false;
                    // same for tails, offset the index to prevent partial, erroneous detections:
                    i += matchedTails.length - 1;
                    continue;
                }
                else if (opts.throwWhenSomethingWrongIsDetected) {
                    // this means it's tails found, without preceding heads
                    tailSuspicionRaised = `${opts.source}${s ? ": [THROW_ID_21]" : ""} When processing "${str}", we found tails (${str.slice(i, i + matchedTails.length)}) starting at character with index number "${i}" but there were no heads preceding it. That's very naughty!`;
                }
            }
        }
        // closing, global checks:
        // if it's the last character and some heads were found but no tails:
        if (opts.throwWhenSomethingWrongIsDetected && i === len - 1) {
            if (Object.keys(tempResObj).length !== 0) {
                throw new TypeError(`${opts.source}${s ? ": [THROW_ID_22]" : ""} When processing "${str}", we reached the end of the string and yet didn't find any tails (${JSON.stringify(tails, null, 4)}) to match the last detected heads (${str.slice(tempResObj.headsStartAt, tempResObj.headsEndAt)})!`);
            }
            else if (tailSuspicionRaised) {
                throw new Error(tailSuspicionRaised);
            }
        }
    }
    return res;
}

exports.defaults = defaults;
exports.strFindHeadsTails = strFindHeadsTails;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
