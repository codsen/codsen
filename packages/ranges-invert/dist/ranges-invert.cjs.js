/**
 * ranges-invert
 * Invert string index ranges
 * Version: 4.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-invert/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var rangesMerge = require('ranges-merge');
var rangesCrop = require('ranges-crop');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version = "4.0.0";

var version$1 = version;

function rInvert(arrOfRanges, strLen, originalOptions) {
  if (!Array.isArray(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError("ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: " + typeof arrOfRanges + ", equal to: " + JSON.stringify(arrOfRanges, null, 4));
  } // strLen validation


  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError("ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: " + typeof strLen + ", equal to: " + JSON.stringify(strLen, null, 4));
  } // arrOfRanges validation


  if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
    throw new TypeError("ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = " + JSON.stringify(arrOfRanges, null, 0) + "!");
  }

  if (!Array.isArray(arrOfRanges) || !arrOfRanges.filter(function (range) {
    return Array.isArray(range) && range[0] !== range[1];
  }).length || !strLen) {
    // this could be ranges.current() from "ranges-push" npm library
    // which means, absence of any ranges, so invert result is everything:
    // from index zero to index string.length
    if (!strLen) {
      return null;
    }

    return [[0, strLen]];
  } // opts validation // declare defaults, so we can enforce types later:

  var defaults = {
    strictlyTwoElementsInRangeArrays: false,
    skipChecks: false
  }; // fill any settings with defaults if missing:

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOptions); // arrOfRanges validation


  var culpritsIndex = 0;
  var culpritsLen; // validate does every range consist of exactly two indexes:

  if (!opts.skipChecks && opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(function (range) {
    return range;
  }).every(function (rangeArr, indx) {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") has not two but " + culpritsLen + " elements!");
  } // validate are range indexes natural numbers:


  if (!opts.skipChecks && !arrOfRanges.every(function (rangeArr, indx) {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here " + (culpritsIndex + 1) + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") does not consist of only natural numbers!");
  }

  var prep;

  if (!opts.skipChecks) {
    // if checks are enabled, filter merged ranges.
    // For posterity, merging is general cleaning: sorting, joining overlapping
    // ranges, also deleting blank ranges (equal start and end indexes with
    // nothing to insert). Imagine, how can we iterate unsorted ranges, for
    // example: [[1, 3], [0, 4]] -> it's impossible because order is messed up
    // and there's overlap. In reality, merged result is simply [[0, 4]].
    // Then, we invert from 4 onwards to the end of reference string length.
    prep = rangesMerge.rMerge(arrOfRanges.filter(function (rangeArr) {
      return rangeArr[0] !== rangeArr[1];
    }));
  } else {
    // but if checks are turned off, filter straight away:
    prep = arrOfRanges.filter(function (rangeArr) {
      return rangeArr[0] !== rangeArr[1];
    }); // hopefully input ranges were really sorted...
  }
  var res = prep.reduce(function (accum, currArr, i, arr) {
    var res2 = []; // if the first range's first index is not zero, additionally add zero range:

    if (i === 0 && arr[0][0] !== 0) {
      res2.push([0, arr[0][0]]);
    } // Now, for every range, add inverted range that follows. For example,
    // if we've got [[1, 2], [4, 5]] and we're processing [1, 2], then
    // add the inverted chunk that follows it, [2, 4].


    var endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;

    if (currArr[1] !== endingIndex) { // this can happen only when opts.skipChecks is on:

      if (opts.skipChecks && currArr[1] > endingIndex) {
        throw new TypeError("ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [" + currArr[1] + ", " + endingIndex + "] which is backwards. For investigation, whole ranges array is:\n" + JSON.stringify(arr, null, 0));
      }

      res2.push([currArr[1], endingIndex]);
    }

    return accum.concat(res2);
  }, []);
  return rangesCrop.rCrop(res, strLen);
}

exports.rInvert = rInvert;
exports.version = version$1;
