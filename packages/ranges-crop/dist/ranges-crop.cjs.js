/**
 * ranges-crop
 * Crop array of ranges when they go beyond the reference string's length
 * Version: 4.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-crop/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rangesMerge = require('ranges-merge');

var version = "4.0.3";

var version$1 = version;

function rCrop(arrOfRanges, strLen) {
  if (arrOfRanges === null) {
    return null;
  }

  if (!Array.isArray(arrOfRanges)) {
    throw new TypeError("ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: " + typeof arrOfRanges + ", equal to: " + JSON.stringify(arrOfRanges, null, 4));
  } // strLen validation


  if (!Number.isInteger(strLen)) {
    throw new TypeError("ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: " + typeof strLen + ", equal to: " + JSON.stringify(strLen, null, 4));
  }

  if (!arrOfRanges.filter(function (range) {
    return range;
  }).length) {
    return arrOfRanges.filter(function (range) {
      return range;
    });
  }

  var culpritsIndex = 0; // validate are range indexes natural numbers:

  if (!arrOfRanges.filter(function (range) {
    return range;
  }).every(function (rangeArr, indx) {
    if (!Number.isInteger(rangeArr[0]) || !Number.isInteger(rangeArr[1])) {
      culpritsIndex = indx;
      return false;
    }

    return true;
  })) {
    if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
      throw new TypeError("ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = " + JSON.stringify(arrOfRanges, null, 0) + "!");
    }

    throw new TypeError("ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") does not consist of only natural numbers!");
  } // validate that any third argument values (if any) are of a string-type


  if (!arrOfRanges.filter(function (range) {
    return range;
  }).every(function (rangeArr, indx) {
    if (rangeArr[2] != null && typeof rangeArr[2] !== "string") {
      culpritsIndex = indx;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the " + culpritsIndex + "th range " + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + " has a argument in the range of a type " + typeof arrOfRanges[culpritsIndex][2]);
  } //                       finally, the real action
  // ---------------------------------------------------------------------------
  var res = (rangesMerge.rMerge(arrOfRanges) || []).filter(function (singleRangeArr) {
    return singleRangeArr[0] <= strLen && (singleRangeArr[2] != undefined || singleRangeArr[0] < strLen);
  }).map(function (singleRangeArr) {
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

exports.rCrop = rCrop;
exports.version = version$1;
