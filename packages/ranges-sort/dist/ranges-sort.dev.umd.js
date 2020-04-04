/**
 * ranges-sort
 * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
 * Version: 3.11.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.rangesSort = factory());
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

  //
  //                              /\___/\
  //                             ( o   o )
  //                             ====Y====
  //                             (        )
  //                             (         )
  //                             (        )))))))))))
  //
  // does this: [ [2, 5], [1, 6] ] => [ [1, 6], [2, 5] ]
  // sorts first by first element, then by second. Retains possible third element.
  function rangesSort(arrOfRanges, originalOptions) {
    // arrOfRanges validation
    if (!Array.isArray(arrOfRanges)) {
      throw new TypeError("ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
    }

    if (arrOfRanges.length === 0) {
      return arrOfRanges;
    } // opts validation
    // declare defaults, so we can enforce types later:


    var defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    }; // fill any settings with defaults if missing:

    var opts = Object.assign({}, defaults, originalOptions); // arrOfRanges validation

    var culpritsIndex;
    var culpritsLen; // validate does every range consist of exactly two indexes:

    if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") has not two but ").concat(culpritsLen, " elements!"));
    } // validate are range indexes natural numbers:


    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
    } // let's assume worst case scenario is N x N.


    var maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
    var counter = 0;
    return Array.from(arrOfRanges).sort(function (range1, range2) {
      if (opts.progressFn) {
        counter++;
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

  return rangesSort;

})));
