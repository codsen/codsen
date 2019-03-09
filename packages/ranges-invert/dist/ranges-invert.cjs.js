/**
 * ranges-invert
 * Invert string index ranges [ [1, 3] ] => [ [0, 1], [3, ...] ]
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isNatNum = _interopDefault(require('is-natural-number'));
var ordinalSuffix = _interopDefault(require('ordinal-number-suffix'));
var checkTypes = _interopDefault(require('check-types-mini'));
var mergeRanges = _interopDefault(require('ranges-merge'));

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
  if (!isArr(arrOfRanges)) {
    throw new TypeError("ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
  }
  if (!isNatNum(strLen, {
    includeZero: true
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges;
  }
  var defaults = {
    strictlyTwoElementsInRangeArrays: false
  };
  var opts = Object.assign({}, defaults, originalOptions);
  checkTypes(opts, defaults, {
    msg: "ranges-invert: [THROW_ID_03*]"
  });
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
    throw new TypeError("ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ".concat(ordinalSuffix(culpritsIndex), " range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") has not two but ").concat(culpritsLen, " elements!"));
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
    if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
      throw new TypeError("ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ".concat(JSON.stringify(arrOfRanges, null, 0), "!"));
    }
    throw new TypeError("ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ".concat(ordinalSuffix(culpritsIndex + 1), " range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") does not consist of only natural numbers!"));
  }
  if (arrOfRanges.some(function (range, i) {
    if (range[1] > strLen) {
      culpritsIndex = i;
      return true;
    }
    return false;
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_06] The reference string length strLen=".concat(strLen, " does not cover all the ranges. For example, the ").concat(ordinalSuffix(culpritsIndex), " range, ").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), " - ending of this range, ").concat(arrOfRanges[culpritsIndex][1], " > ").concat(strLen, " (strLen)."));
  }
  var prep = mergeRanges(Array.from(arrOfRanges).filter(function (rangeArr) {
    return rangeArr[0] !== rangeArr[1];
  }));
  if (prep.length === 0) {
    return [[0, strLen]];
  }
  var res = prep.reduce(function (accum, currArr, i, arr) {
    var res = [];
    if (i === 0 && arr[0][0] !== 0) {
      res.push([0, arr[0][0]]);
    }
    var endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      res.push([currArr[1], endingIndex]);
    }
    return accum.concat(res);
  }, []);
  return res;
}

module.exports = rangesInvert;
