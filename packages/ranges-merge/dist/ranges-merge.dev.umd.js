/**
 * @name ranges-merge
 * @fileoverview Merge and sort string index ranges
 * @version 7.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-merge/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesMerge = {}));
}(this, (function (exports) { 'use strict';

/**
 * @name ranges-sort
 * @fileoverview Sort string index ranges
 * @version 4.1.0
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

var version$1 = "7.1.0";

const version = version$1;
const defaults = {
    mergeType: 1,
    progressFn: null,
    joinRangesThatTouchEdges: true,
};
// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
function rMerge(arrOfRanges, originalOpts) {
    //
    // internal functions:
    // ---------------------------------------------------------------------------
    function isObj(something) {
        return (something && typeof something === "object" && !Array.isArray(something));
    }
    // quick ending:
    // ---------------------------------------------------------------------------
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
        return null;
    }
    let opts;
    if (originalOpts) {
        if (isObj(originalOpts)) {
            opts = { ...defaults, ...originalOpts };
            // 1. validate opts.progressFn
            if (opts.progressFn &&
                isObj(opts.progressFn) &&
                !Object.keys(opts.progressFn).length) {
                opts.progressFn = null;
            }
            else if (opts.progressFn && typeof opts.progressFn !== "function") {
                throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${JSON.stringify(opts.progressFn, null, 4)}`);
            }
            // 2. validate opts.mergeType
            if (opts.mergeType && +opts.mergeType !== 1 && +opts.mergeType !== 2) {
                throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
            }
            // 3. validate opts.joinRangesThatTouchEdges
            if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
                throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof opts.joinRangesThatTouchEdges}", equal to ${JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)}`);
            }
        }
        else {
            throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(originalOpts, null, 4)} (type ${typeof originalOpts})`);
        }
    }
    else {
        opts = { ...defaults };
    }
    // progress-wise, sort takes first 20%
    // two-level-deep array clone:
    const filtered = arrOfRanges
        // filter out null
        .filter((range) => range)
        .map((subarr) => [...subarr])
        .filter(
    // filter out futile ranges with identical starting and ending points with
    // nothing to add (no 3rd argument)
    (rangeArr) => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]);
    let sortedRanges;
    let lastPercentageDone;
    let percentageDone;
    if (opts.progressFn) {
        // progress already gets reported in [0,100] range, so we just need to
        // divide by 5 in order to "compress" that into 20% range.
        sortedRanges = rSort(filtered, {
            progressFn: (percentage) => {
                percentageDone = Math.floor(percentage / 5);
                // ensure each percent is passed only once:
                if (percentageDone !== lastPercentageDone) {
                    lastPercentageDone = percentageDone;
                    opts.progressFn(percentageDone);
                }
            },
        });
    }
    else {
        sortedRanges = rSort(filtered);
    }
    if (!sortedRanges) {
        return null;
    }
    const len = sortedRanges.length - 1;
    // reset 80% of progress is this loop:
    // loop from the end:
    for (let i = len; i > 0; i--) {
        if (opts.progressFn) {
            percentageDone = Math.floor((1 - i / len) * 78) + 21;
            if (percentageDone !== lastPercentageDone &&
                percentageDone > lastPercentageDone) {
                lastPercentageDone = percentageDone;
                opts.progressFn(percentageDone);
                // console.log(
                //   `153 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
                // );
            }
        }
        // if current range is before the preceding-one
        if (sortedRanges[i][0] <= sortedRanges[i - 1][0] ||
            (!opts.joinRangesThatTouchEdges &&
                sortedRanges[i][0] < sortedRanges[i - 1][1]) ||
            (opts.joinRangesThatTouchEdges &&
                sortedRanges[i][0] <= sortedRanges[i - 1][1])) {
            sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
            sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);
            // tend the third argument, "what to insert"
            if (sortedRanges[i][2] !== undefined &&
                (sortedRanges[i - 1][0] >= sortedRanges[i][0] ||
                    sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
                // if the value of the range before exists:
                if (sortedRanges[i - 1][2] !== null) {
                    if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
                        sortedRanges[i - 1][2] = null;
                    }
                    else if (sortedRanges[i - 1][2] != null) {
                        // if there's a clash of "insert" values:
                        if (+opts.mergeType === 2 &&
                            sortedRanges[i - 1][0] === sortedRanges[i][0]) {
                            // take the value from the range that's on the right:
                            sortedRanges[i - 1][2] = sortedRanges[i][2];
                        }
                        else {
                            sortedRanges[i - 1][2] +=
                                sortedRanges[i][2];
                        }
                    }
                    else {
                        sortedRanges[i - 1][2] = sortedRanges[i][2];
                    }
                }
            }
            // get rid of the second element:
            sortedRanges.splice(i, 1);
            // reset the traversal, start from the end again
            i = sortedRanges.length;
        }
    }
    return sortedRanges.length ? sortedRanges : null;
}

exports.defaults = defaults;
exports.rMerge = rMerge;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
