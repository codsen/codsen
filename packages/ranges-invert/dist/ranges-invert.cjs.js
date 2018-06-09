'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isNatNum = _interopDefault(require('is-natural-number'));
var ordinalSuffix = _interopDefault(require('ordinal-number-suffix'));
var checkTypes = _interopDefault(require('check-types-mini'));
var mergeRanges = _interopDefault(require('ranges-merge'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArr = Array.isArray;

function rangesInvert(arrOfRanges, strLen, originalOptions) {
  // arrOfRanges validation
  if (!isArr(arrOfRanges)) {
    throw new TypeError("ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: " + (typeof arrOfRanges === "undefined" ? "undefined" : _typeof(arrOfRanges)) + ", equal to: " + JSON.stringify(arrOfRanges, null, 4));
  }
  // strLen validation
  if (!isNatNum(strLen, { includeZero: true })) {
    throw new TypeError("ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: " + (typeof strLen === "undefined" ? "undefined" : _typeof(strLen)) + ", equal to: " + JSON.stringify(strLen, null, 4));
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges;
  }

  // opts validation

  // declare defaults, so we can enforce types later:
  var defaults = {
    strictlyTwoElementsInRangeArrays: false
  };
  // fill any settings with defaults if missing:
  var opts = Object.assign({}, defaults, originalOptions);
  // the check:
  checkTypes(opts, defaults, { msg: "ranges-invert: [THROW_ID_03*]" });

  // arrOfRanges validation

  var culpritsIndex = void 0;
  var culpritsLen = void 0;

  // validate does every range consist of exactly two indexes:
  if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }
    return true;
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the " + ordinalSuffix(culpritsIndex) + " range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") has not two but " + culpritsLen + " elements!");
  }
  // validate are range indexes natural numbers:
  if (!arrOfRanges.every(function (rangeArr, indx) {
    if (!isNatNum(rangeArr[0], { includeZero: true }) || !isNatNum(rangeArr[1], { includeZero: true })) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
      throw new TypeError("ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = " + JSON.stringify(arrOfRanges, null, 0) + "!");
    }

    throw new TypeError("ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here " + ordinalSuffix(culpritsIndex + 1) + " range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") does not consist of only natural numbers!");
  }

  if (arrOfRanges.some(function (range, i) {
    if (range[1] > strLen) {
      culpritsIndex = i;
      return true;
    }
    return false;
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_06] The reference string length strLen=" + strLen + " does not cover all the ranges. For example, the " + ordinalSuffix(culpritsIndex) + " range, " + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + " - ending of this range, " + arrOfRanges[culpritsIndex][1] + " > " + strLen + " (strLen).");
  }

  var prep = mergeRanges(Array.from(arrOfRanges).filter(function (rangeArr) {
    return rangeArr[0] !== rangeArr[1];
  }));

  if (prep.length === 0) {
    return [[0, strLen]];
  }

  var res = prep.reduce(function (accum, currArr, i, arr) {

    var res = [];

    // if the first range's first index is not zero, additionally add zero range:
    if (i === 0 && arr[0][0] !== 0) {
      res.push([0, arr[0][0]]);
    }

    // Now, for every range, add inverted range that follows. For example,
    // if we've got [[1, 2], [4, 5]] and we're processing [1, 2], then
    // add the inverted chunk that follows it, [2, 4].
    var endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      res.push([currArr[1], endingIndex]);
    }

    return accum.concat(res);
  }, []);

  return res;
}

module.exports = rangesInvert;
