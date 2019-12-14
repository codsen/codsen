/**
 * ranges-sort
 * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
 * Version: 3.10.46
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isNatNum = _interopDefault(require('is-natural-number'));

function _typeof(obj) {
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

var isArr = Array.isArray;
function rangesSort(arrOfRanges, originalOptions) {
  if (!isArr(arrOfRanges)) {
    throw new TypeError("ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges;
  }
  var defaults = {
    strictlyTwoElementsInRangeArrays: false,
    progressFn: null
  };
  var opts = Object.assign({}, defaults, originalOptions);
  var culpritsIndex;
  var culpritsLen;
  if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }
    return true;
  })) {
    throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") has not two but ").concat(culpritsLen, " elements!"));
  }
  if (!arrOfRanges.every(function (rangeArr, indx) {
    if (!isNatNum(rangeArr[0], {
      includeZero: true
    }) || !isNatNum(rangeArr[1], {
      includeZero: true
    })) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
  }
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

module.exports = rangesSort;
