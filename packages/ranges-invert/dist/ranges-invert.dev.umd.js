/**
 * ranges-invert
 * Invert string index ranges
 * Version: 4.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-invert/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesInvert = {}));
}(this, (function (exports) { 'use strict';

/**
 * ranges-sort
 * Sort string index ranges
 * Version: 4.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-sort/
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
 * ranges-merge
 * Merge and sort string index ranges
 * Version: 7.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-merge/
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
 * ranges-crop
 * Crop array of ranges when they go beyond the reference string's length
 * Version: 4.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-crop/
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

var version$1 = "4.0.13";

const version = version$1;
function rInvert(arrOfRanges, strLen, originalOptions) {
    if (!Array.isArray(arrOfRanges) && arrOfRanges !== null) {
        throw new TypeError(`ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`);
    }
    // strLen validation
    if (!Number.isInteger(strLen) || strLen < 0) {
        throw new TypeError(`ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(strLen, null, 4)}`);
    }
    // arrOfRanges validation
    if (Array.isArray(arrOfRanges) &&
        typeof arrOfRanges[0] === "number" &&
        typeof arrOfRanges[1] === "number") {
        throw new TypeError(`ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(arrOfRanges, null, 0)}!`);
    }
    if (!Array.isArray(arrOfRanges) ||
        !arrOfRanges.filter((range) => Array.isArray(range) && range[0] !== range[1]).length ||
        !strLen) {
        // this could be ranges.current() from "ranges-push" npm library
        // which means, absence of any ranges, so invert result is everything:
        // from index zero to index string.length
        if (!strLen) {
            return null;
        }
        return [[0, strLen]];
    }
    // opts validation
    // declare defaults, so we can enforce types later:
    const defaults = {
        strictlyTwoElementsInRangeArrays: false,
        skipChecks: false,
    };
    // fill any settings with defaults if missing:
    const opts = { ...defaults, ...originalOptions };
    // arrOfRanges validation
    let culpritsIndex = 0;
    let culpritsLen;
    // validate does every range consist of exactly two indexes:
    if (!opts.skipChecks &&
        opts.strictlyTwoElementsInRangeArrays &&
        !arrOfRanges
            .filter((range) => range)
            .every((rangeArr, indx) => {
            if (rangeArr.length !== 2) {
                culpritsIndex = indx;
                culpritsLen = rangeArr.length;
                return false;
            }
            return true;
        })) {
        throw new TypeError(`ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) has not two but ${culpritsLen} elements!`);
    }
    // validate are range indexes natural numbers:
    if (!opts.skipChecks &&
        !arrOfRanges.every((rangeArr, indx) => {
            if (!Number.isInteger(rangeArr[0]) ||
                rangeArr[0] < 0 ||
                !Number.isInteger(rangeArr[1]) ||
                rangeArr[1] < 0) {
                culpritsIndex = indx;
                return false;
            }
            return true;
        })) {
        throw new TypeError(`ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex + 1}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) does not consist of only natural numbers!`);
    }
    let prep;
    if (!opts.skipChecks) {
        // if checks are enabled, filter merged ranges.
        // For posterity, merging is general cleaning: sorting, joining overlapping
        // ranges, also deleting blank ranges (equal start and end indexes with
        // nothing to insert). Imagine, how can we iterate unsorted ranges, for
        // example: [[1, 3], [0, 4]] -> it's impossible because order is messed up
        // and there's overlap. In reality, merged result is simply [[0, 4]].
        // Then, we invert from 4 onwards to the end of reference string length.
        prep = rMerge(arrOfRanges.filter((rangeArr) => rangeArr[0] !== rangeArr[1]));
    }
    else {
        // but if checks are turned off, filter straight away:
        prep = arrOfRanges.filter((rangeArr) => rangeArr[0] !== rangeArr[1]);
        // hopefully input ranges were really sorted...
    }
    const res = prep.reduce((accum, currArr, i, arr) => {
        const res2 = [];
        // if the first range's first index is not zero, additionally add zero range:
        if (i === 0 && arr[0][0] !== 0) {
            res2.push([0, arr[0][0]]);
        }
        // Now, for every range, add inverted range that follows. For example,
        // if we've got [[1, 2], [4, 5]] and we're processing [1, 2], then
        // add the inverted chunk that follows it, [2, 4].
        const endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
        if (currArr[1] !== endingIndex) {
            // this can happen only when opts.skipChecks is on:
            if (opts.skipChecks && currArr[1] > endingIndex) {
                throw new TypeError(`ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [${currArr[1]}, ${endingIndex}] which is backwards. For investigation, whole ranges array is:\n${JSON.stringify(arr, null, 0)}`);
            }
            res2.push([currArr[1], endingIndex]);
        }
        return accum.concat(res2);
    }, []);
    return rCrop(res, strLen);
}

exports.rInvert = rInvert;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
