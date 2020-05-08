/**
 * ranges-crop
 * Crop array of ranges when they go beyond the reference string's length
 * Version: 2.0.53
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-crop
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mergeRanges = _interopDefault(require('ranges-merge'));

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

var isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function existy(x) {
  return x != null;
}
function rangesCrop(arrOfRanges, strLen) {
  if (!isArr(arrOfRanges)) {
    throw new TypeError("ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
  }
  if (!Number.isInteger(strLen)) {
    throw new TypeError("ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges;
  }
  var culpritsIndex;
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
  }
  if (!arrOfRanges.every(function (rangeArr, indx) {
    if (existy(rangeArr[2]) && !isStr(rangeArr[2])) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError("ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ".concat(culpritsIndex, "th range ").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), " has a argument in the range of a type ").concat(_typeof(arrOfRanges[culpritsIndex][2])));
  }
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

module.exports = rangesCrop;
