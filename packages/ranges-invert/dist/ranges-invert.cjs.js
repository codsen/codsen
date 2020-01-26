/**
 * ranges-invert
 * Invert string index ranges [ [1, 3] ] => [ [0, 1], [3, ...] ]
 * Version: 2.1.32
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mergeRanges = _interopDefault(require('ranges-merge'));
var rangesCrop = _interopDefault(require('ranges-crop'));

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
function rangesInvert(arrOfRanges, strLen, originalOptions) {
  if (!isArr(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError("ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
  }
  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError("ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
  }
  if (arrOfRanges === null) {
    if (strLen === 0) {
      return [];
    }
    return [[0, strLen]];
  } else if (arrOfRanges.length === 0) {
    return [];
  }
  var defaults = {
    strictlyTwoElementsInRangeArrays: false,
    skipChecks: false
  };
  var opts = Object.assign({}, defaults, originalOptions);
  var culpritsIndex;
  var culpritsLen;
  if (!opts.skipChecks && opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }
    return true;
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") has not two but ").concat(culpritsLen, " elements!"));
  }
  if (!opts.skipChecks && !arrOfRanges.every(function (rangeArr, indx) {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
      throw new TypeError("ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ".concat(JSON.stringify(arrOfRanges, null, 0), "!"));
    }
    throw new TypeError("ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ".concat(culpritsIndex + 1, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") does not consist of only natural numbers!"));
  }
  var prep;
  if (!opts.skipChecks) {
    prep = mergeRanges(arrOfRanges.filter(function (rangeArr) {
      return rangeArr[0] !== rangeArr[1];
    }));
  } else {
    prep = arrOfRanges.filter(function (rangeArr) {
      return rangeArr[0] !== rangeArr[1];
    });
  }
  if (prep.length === 0) {
    if (strLen === 0) {
      return [];
    }
    return [[0, strLen]];
  }
  var res = prep.reduce(function (accum, currArr, i, arr) {
    var res = [];
    if (i === 0 && arr[0][0] !== 0) {
      res.push([0, arr[0][0]]);
    }
    var endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      if (opts.skipChecks && currArr[1] > endingIndex) {
        throw new TypeError("ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [".concat(currArr[1], ", ").concat(endingIndex, "] which is backwards. For investigation, whole ranges array is:\n").concat(JSON.stringify(arr, null, 0)));
      }
      res.push([currArr[1], endingIndex]);
    }
    return accum.concat(res);
  }, []);
  return rangesCrop(res, strLen);
}

module.exports = rangesInvert;
