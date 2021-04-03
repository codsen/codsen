/**
 * @name ranges-process-outside
 * @fileoverview Iterate string considering ranges, as if they were already applied
 * @version 4.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-process-outside/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesProcessOutside = {}));
}(this, (function (exports) { 'use strict';

const HIGH_SURROGATE_START = 0xd800;
const HIGH_SURROGATE_END = 0xdbff;

const LOW_SURROGATE_START = 0xdc00;

const REGIONAL_INDICATOR_START = 0x1f1e6;
const REGIONAL_INDICATOR_END = 0x1f1ff;

const FITZPATRICK_MODIFIER_START = 0x1f3fb;
const FITZPATRICK_MODIFIER_END = 0x1f3ff;

const VARIATION_MODIFIER_START = 0xfe00;
const VARIATION_MODIFIER_END = 0xfe0f;

const DIACRITICAL_MARKS_START = 0x20d0;
const DIACRITICAL_MARKS_END = 0x20ff;

const ZWJ = 0x200d;

const GRAPHEMS = [
  0x0308, // ( ◌̈ ) COMBINING DIAERESIS
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x0BA8, // ( ந ) TAMIL LETTER NA
  0x0BBF, // ( ி ) TAMIL VOWEL SIGN I
  0x0BCD, // ( ◌்) TAMIL SIGN VIRAMA
  0x0E31, // ( ◌ั ) THAI CHARACTER MAI HAN-AKAT
  0x0E33, // ( ำ ) THAI CHARACTER SARA AM
  0x0E40, // ( เ ) THAI CHARACTER SARA E
  0x0E49, // ( เ ) THAI CHARACTER MAI THO
  0x1100, // ( ᄀ ) HANGUL CHOSEONG KIYEOK
  0x1161, // ( ᅡ ) HANGUL JUNGSEONG A
  0x11A8 // ( ᆨ ) HANGUL JONGSEONG KIYEOK
];

function runes (string) {
  if (typeof string !== 'string') {
    throw new Error('string cannot be undefined or null')
  }
  const result = [];
  let i = 0;
  let increment = 0;
  while (i < string.length) {
    increment += nextUnits(i + increment, string);
    if (isGraphem(string[i + increment])) {
      increment++;
    }
    if (isVariationSelector(string[i + increment])) {
      increment++;
    }
    if (isDiacriticalMark(string[i + increment])) {
      increment++;
    }
    if (isZeroWidthJoiner(string[i + increment])) {
      increment++;
      continue
    }
    result.push(string.substring(i, i + increment));
    i += increment;
    increment = 0;
  }
  return result
}

// Decide how many code units make up the current character.
// BMP characters: 1 code unit
// Non-BMP characters (represented by surrogate pairs): 2 code units
// Emoji with skin-tone modifiers: 4 code units (2 code points)
// Country flags: 4 code units (2 code points)
// Variations: 2 code units
function nextUnits (i, string) {
  const current = string[i];
  // If we don't have a value that is part of a surrogate pair, or we're at
  // the end, only take the value at i
  if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
    return 1
  }

  const currentPair = current + string[i + 1];
  let nextPair = string.substring(i + 2, i + 5);

  // Country flags are comprised of two regional indicator symbols,
  // each represented by a surrogate pair.
  // See http://emojipedia.org/flags/
  // If both pairs are regional indicator symbols, take 4
  if (isRegionalIndicator(currentPair) && isRegionalIndicator(nextPair)) {
    return 4
  }

  // If the next pair make a Fitzpatrick skin tone
  // modifier, take 4
  // See http://emojipedia.org/modifiers/
  // Technically, only some code points are meant to be
  // combined with the skin tone modifiers. This function
  // does not check the current pair to see if it is
  // one of them.
  if (isFitzpatrickModifier(nextPair)) {
    return 4
  }
  return 2
}

function isFirstOfSurrogatePair (string) {
  return string && betweenInclusive(string[0].charCodeAt(0), HIGH_SURROGATE_START, HIGH_SURROGATE_END)
}

function isRegionalIndicator (string) {
  return betweenInclusive(codePointFromSurrogatePair(string), REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END)
}

function isFitzpatrickModifier (string) {
  return betweenInclusive(codePointFromSurrogatePair(string), FITZPATRICK_MODIFIER_START, FITZPATRICK_MODIFIER_END)
}

function isVariationSelector (string) {
  return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), VARIATION_MODIFIER_START, VARIATION_MODIFIER_END)
}

function isDiacriticalMark (string) {
  return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), DIACRITICAL_MARKS_START, DIACRITICAL_MARKS_END)
}

function isGraphem (string) {
  return typeof string === 'string' && GRAPHEMS.indexOf(string.charCodeAt(0)) !== -1
}

function isZeroWidthJoiner (string) {
  return typeof string === 'string' && string.charCodeAt(0) === ZWJ
}

function codePointFromSurrogatePair (pair) {
  const highOffset = pair.charCodeAt(0) - HIGH_SURROGATE_START;
  const lowOffset = pair.charCodeAt(1) - LOW_SURROGATE_START;
  return (highOffset << 10) + lowOffset + 0x10000
}

function betweenInclusive (value, lower, upper) {
  return value >= lower && value <= upper
}

function substring (string, start, width) {
  const chars = runes(string);
  if (start === undefined) {
    return string
  }
  if (start >= chars.length) {
    return ''
  }
  const rest = chars.length - start;
  const stringWidth = width === undefined ? rest : width;
  let endIndex = start + stringWidth;
  if (endIndex > (start + rest)) {
    endIndex = undefined;
  }
  return chars.slice(start, endIndex).join('')
}

var runes_1 = runes;
var substr = substring;
runes_1.substr = substr;

/**
 * @name ranges-sort
 * @fileoverview Sort string index ranges
 * @version 4.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-sort/}
 */
const defaults$1 = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
};
function rSort(arrOfRanges, originalOptions) {
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  }
  const opts = { ...defaults$1,
    ...originalOptions
  };
  let culpritsIndex;
  let culpritsLen;
  if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) has not two but ${culpritsLen} elements!`);
  }
  if (!arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) does not consist of only natural numbers!`);
  }
  const maxPossibleIterations = arrOfRanges.filter(range => range).length ** 2;
  let counter = 0;
  return Array.from(arrOfRanges).filter(range => range).sort((range1, range2) => {
    if (opts.progressFn) {
      counter += 1;
      opts.progressFn(Math.floor(counter * 100 / maxPossibleIterations));
    }
    if (range1[0] === range2[0]) {
      if (range1[1] < range2[1]) {
        return -1;
      }
      if (range1[1] > range2[1]) {
        return 1;
      }
      return 0;
    }
    if (range1[0] < range2[0]) {
      return -1;
    }
    return 1;
  });
}

/**
 * @name ranges-merge
 * @fileoverview Merge and sort string index ranges
 * @version 7.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-merge/}
 */
const defaults = {
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true
};
function rMerge(arrOfRanges, originalOpts) {
  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return null;
  }
  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = { ...defaults,
        ...originalOpts
      };
      if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
        opts.progressFn = null;
      } else if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${JSON.stringify(opts.progressFn, null, 4)}`);
      }
      if (opts.mergeType && +opts.mergeType !== 1 && +opts.mergeType !== 2) {
        throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
      }
      if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof opts.joinRangesThatTouchEdges}", equal to ${JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)}`);
      }
    } else {
      throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(originalOpts, null, 4)} (type ${typeof originalOpts})`);
    }
  } else {
    opts = { ...defaults
    };
  }
  const filtered = arrOfRanges
  .filter(range => range).map(subarr => [...subarr]).filter(
  rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]);
  let sortedRanges;
  let lastPercentageDone;
  let percentageDone;
  if (opts.progressFn) {
    sortedRanges = rSort(filtered, {
      progressFn: percentage => {
        percentageDone = Math.floor(percentage / 5);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }
    });
  } else {
    sortedRanges = rSort(filtered);
  }
  if (!sortedRanges) {
    return null;
  }
  const len = sortedRanges.length - 1;
  for (let i = len; i > 0; i--) {
    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || !opts.joinRangesThatTouchEdges && sortedRanges[i][0] < sortedRanges[i - 1][1] || opts.joinRangesThatTouchEdges && sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);
      if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] != null) {
            if (+opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            } else {
              sortedRanges[i - 1][2] += sortedRanges[i][2];
            }
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      }
      sortedRanges.splice(i, 1);
      i = sortedRanges.length;
    }
  }
  return sortedRanges.length ? sortedRanges : null;
}

/**
 * @name ranges-crop
 * @fileoverview Crop array of ranges when they go beyond the reference string's length
 * @version 4.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-crop/}
 */
function rCrop(arrOfRanges, strLen) {
  if (arrOfRanges === null) {
    return null;
  }
  if (!Array.isArray(arrOfRanges)) {
    throw new TypeError(`ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`);
  }
  if (!Number.isInteger(strLen)) {
    throw new TypeError(`ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(strLen, null, 4)}`);
  }
  if (!arrOfRanges.filter(range => range).length) {
    return arrOfRanges.filter(range => range);
  }
  let culpritsIndex = 0;
  if (!arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (!Number.isInteger(rangeArr[0]) || !Number.isInteger(rangeArr[1])) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
      throw new TypeError(`ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(arrOfRanges, null, 0)}!`);
    }
    throw new TypeError(`ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) does not consist of only natural numbers!`);
  }
  if (!arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (rangeArr[2] != null && typeof rangeArr[2] !== "string") {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ${culpritsIndex}th range ${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)} has a argument in the range of a type ${typeof arrOfRanges[culpritsIndex][2]}`);
  }
  const res = (rMerge(arrOfRanges) || []).filter(singleRangeArr => singleRangeArr[0] <= strLen && (singleRangeArr[2] != undefined || singleRangeArr[0] < strLen)).map(singleRangeArr => {
    if (singleRangeArr[1] > strLen) {
      if (singleRangeArr[2] != undefined) {
        return [singleRangeArr[0], strLen, singleRangeArr[2]];
      }
      return [singleRangeArr[0], strLen];
    }
    return singleRangeArr;
  });
  return res === [] ? null : res;
}

/**
 * @name ranges-invert
 * @fileoverview Invert string index ranges
 * @version 4.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-invert/}
 */
function rInvert(arrOfRanges, strLen, originalOptions) {
  if (!Array.isArray(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError(`ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`);
  }
  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError(`ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(strLen, null, 4)}`);
  }
  if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
    throw new TypeError(`ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(arrOfRanges, null, 0)}!`);
  }
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.filter(range => Array.isArray(range) && range[0] !== range[1]).length || !strLen) {
    if (!strLen) {
      return null;
    }
    return [[0, strLen]];
  }
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    skipChecks: false
  };
  const opts = { ...defaults,
    ...originalOptions
  };
  let culpritsIndex = 0;
  let culpritsLen;
  if (!opts.skipChecks && opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) has not two but ${culpritsLen} elements!`);
  }
  if (!opts.skipChecks && !arrOfRanges.every((rangeArr, indx) => {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex + 1}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) does not consist of only natural numbers!`);
  }
  let prep;
  if (!opts.skipChecks) {
    prep = rMerge(arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1]));
  } else {
    prep = arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1]);
  }
  const res = prep.reduce((accum, currArr, i, arr) => {
    const res2 = [];
    if (i === 0 && arr[0][0] !== 0) {
      res2.push([0, arr[0][0]]);
    }
    const endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      if (opts.skipChecks && currArr[1] > endingIndex) {
        throw new TypeError(`ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [${currArr[1]}, ${endingIndex}] which is backwards. For investigation, whole ranges array is:\n${JSON.stringify(arr, null, 0)}`);
      }
      res2.push([currArr[1], endingIndex]);
    }
    return accum.concat(res2);
  }, []);
  return rCrop(res, strLen);
}

var version$1 = "4.0.13";

const version = version$1;
function rProcessOutside(originalStr, originalRanges, cb, skipChecks = false) {
    //
    // insurance:
    //
    if (typeof originalStr !== "string") {
        if (originalStr === undefined) {
            throw new Error(`ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`);
        }
        else {
            throw new Error(`ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(originalStr, null, 4)} (type ${typeof originalStr})`);
        }
    }
    if (originalRanges &&
        (!Array.isArray(originalRanges) ||
            (originalRanges.length && !Array.isArray(originalRanges[0])))) {
        throw new Error(`ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n${JSON.stringify(originalRanges, null, 4)} (type ${typeof originalRanges})`);
    }
    if (typeof cb !== "function") {
        throw new Error(`ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n${JSON.stringify(cb, null, 4)} (type ${typeof cb})`);
    }
    // separate the iterator because it might be called with inverted ranges or
    // with separately calculated "everything" if the ranges are empty/falsey
    function iterator(str, arrOfArrays) {
        (arrOfArrays || []).forEach(([fromIdx, toIdx]) => {
            for (let i = fromIdx; i < toIdx; i++) {
                const charLength = runes_1(str.slice(i))[0].length;
                cb(i, i + charLength, (offsetValue) => {
                    /* istanbul ignore else */
                    if (offsetValue != null) {
                        i += offsetValue;
                    }
                });
                if (charLength && charLength > 1) {
                    i += charLength - 1;
                }
            }
        });
    }
    if (originalRanges && originalRanges.length) {
        // if ranges are given, invert and run callback against each character
        const temp = rCrop(rInvert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
            skipChecks: !!skipChecks,
        }), originalStr.length);
        iterator(originalStr, temp);
    }
    else {
        // otherwise, run callback on everything
        iterator(originalStr, [[0, originalStr.length]]);
    }
}

exports.rProcessOutside = rProcessOutside;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
