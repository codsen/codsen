/**
 * ranges-crop
 * Crop array of ranges when they go beyond the reference string's length
 * Version: 2.0.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-crop
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.rangesCrop = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /**
   * ranges-sort
   * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
   * Version: 3.11.6
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
   */
  function rangesSort(arrOfRanges, originalOptions) {
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    const defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    };
    const opts = { ...defaults,
      ...originalOptions
    };
    let culpritsIndex;
    let culpritsLen;

    if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every((rangeArr, indx) => {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) has not two but ${culpritsLen} elements!`);
    }

    if (!arrOfRanges.every((rangeArr, indx) => {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) does not consist of only natural numbers!`);
    }

    const maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
    let counter = 0;
    return Array.from(arrOfRanges).sort((range1, range2) => {
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
   * Merge and sort arrays which mean string slice ranges
   * Version: 4.3.7
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge
   */

  function mergeRanges(arrOfRanges, originalOpts) {
    function isStr(something) {
      return typeof something === "string";
    }

    function isObj(something) {
      return something && typeof something === "object" && !Array.isArray(something);
    }

    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    const defaults = {
      mergeType: 1,
      progressFn: null,
      joinRangesThatTouchEdges: true
    };
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

        if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
          if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
            opts.mergeType = 1;
          } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
            opts.mergeType = 2;
          } else {
            throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
          }
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

    const filtered = arrOfRanges.map(subarr => [...subarr]).filter(rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]);
    let sortedRanges;
    let lastPercentageDone;
    let percentageDone;

    if (opts.progressFn) {
      sortedRanges = rangesSort(filtered, {
        progressFn: percentage => {
          percentageDone = Math.floor(percentage / 5);

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            opts.progressFn(percentageDone);
          }
        }
      });
    } else {
      sortedRanges = rangesSort(filtered);
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
            } else if (sortedRanges[i - 1][2] !== undefined) {
              if (opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
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

    return sortedRanges;
  }

  var isArr = Array.isArray;

  function isStr(something) {
    return typeof something === "string";
  }

  function existy(x) {
    return x != null;
  }

  function rangesCrop(arrOfRanges, strLen) {
    // arrOfRanges validation
    if (!isArr(arrOfRanges)) {
      throw new TypeError("ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
    } // strLen validation


    if (!Number.isInteger(strLen)) {
      throw new TypeError("ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
    }

    if (arrOfRanges.length === 0) {
      return arrOfRanges;
    }

    var culpritsIndex; // validate are range indexes natural numbers:

    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || !Number.isInteger(rangeArr[1])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
        throw new TypeError("ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ".concat(JSON.stringify(arrOfRanges, null, 0), "!"));
      }

      throw new TypeError("ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ".concat(culpritsIndex + 1, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") does not consist of only natural numbers!"));
    } // validate that any third argument values (if any) are of a string-type


    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (existy(rangeArr[2]) && !isStr(rangeArr[2])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ".concat(culpritsIndex, "th range ").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), " has a argument in the range of a type ").concat(_typeof(arrOfRanges[culpritsIndex][2])));
    } //                       finally, the real action
    // ---------------------------------------------------------------------------


    var res = mergeRanges(arrOfRanges).filter(function (singleRangeArr) {
      return singleRangeArr[0] <= strLen && (singleRangeArr[2] !== undefined || singleRangeArr[0] < strLen);
    }).map(function (singleRangeArr) {
      if (singleRangeArr[1] > strLen) {
        if (singleRangeArr[2] !== undefined) {
          return [singleRangeArr[0], strLen, singleRangeArr[2]];
        }

        return [singleRangeArr[0], strLen];
      }

      return singleRangeArr;
    });
    return res;
  }

  return rangesCrop;

})));
