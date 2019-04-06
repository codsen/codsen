/**
 * ranges-is-index-within
 * Efficiently checks if index is within any of the given ranges
 * Version: 1.13.20
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var checkTypes = _interopDefault(require('check-types-mini'));
var isNatStr = _interopDefault(require('is-natural-number-string'));
var isNatNum = _interopDefault(require('is-natural-number'));
var ordinalSuffix = _interopDefault(require('ordinal-number-suffix'));
var rangesSort = _interopDefault(require('ranges-sort'));

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
function rangesIsIndexWithin(originalIndex, rangesArr, originalOpts) {
  function existy(x) {
    return x != null;
  }
  var index;
  if (rangesArr === null) {
    return false;
  }
  if (isNatNum(originalIndex, {
    includeZero: true
  })) {
    index = originalIndex;
  } else if (isNatStr(originalIndex, {
    includeZero: true
  })) {
    index = parseInt(originalIndex, 10);
  } else {
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_01] Input must mean an index, so it has to be either a natural number or a string containing natural number! Currently its type is: ".concat(_typeof(originalIndex), ", equal to: ").concat(JSON.stringify(originalIndex, null, 4)));
  }
  if (!existy(rangesArr)) {
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_02] We're missing the second input, rangesArr. It's meant to be an array of one or more range arrays.");
  } else if (!isArr(rangesArr)) {
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_03] Second input argument, rangesArr must be an array! Currently its type is: ".concat(_typeof(originalIndex), ", equal to: ").concat(JSON.stringify(originalIndex, null, 4)));
  } else if (rangesArr.length === 0) {
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_04] Second input argument, rangesArr must be not empty! Currently it's empty.");
  }
  var culpritsIndex = null;
  if (isArr(rangesArr) && rangesArr.length > 0 && !isArr(rangesArr[0])) {
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_05] Second input argument, rangesArr must be an array of (index range) arrays! Currently it's equal to: ".concat(rangesArr, "."));
  }
  if (!rangesArr.every(function (rangeArr, indx) {
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
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_06] Second input argument, rangesArr must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(ordinalSuffix(culpritsIndex), " range (").concat(JSON.stringify(rangesArr[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
  }
  if (!rangesArr.every(function (rangeArr, indx) {
    if (rangeArr[0] > rangeArr[1]) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_07] The ".concat(ordinalSuffix(culpritsIndex), " range (").concat(JSON.stringify(rangesArr[culpritsIndex], null, 4), ") in the ranges array has beginning of the index bigger than ending! They can be equal but in the backwards order."));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_08] Options object must be a plain object! Currently its type is: ".concat(_typeof(originalOpts), ", equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    inclusiveRangeEnds: false,
    returnMatchedRangeInsteadOfTrue: false,
    skipIncomingRangeSorting: false
  };
  var opts = Object.assign(Object.assign({}, defaults), originalOpts);
  checkTypes(opts, defaults, {
    msg: "ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_07*]"
  });
  if (rangesArr.length < 3) {
    if (rangesArr.length === 1) {
      var res;
      if (opts.inclusiveRangeEnds) {
        res = index >= rangesArr[0][0] && index <= rangesArr[0][1];
      } else {
        res = index > rangesArr[0][0] && index < rangesArr[0][1];
      }
      if (opts.returnMatchedRangeInsteadOfTrue && res) {
        return rangesArr[0];
      }
      return res;
    }
    var _res;
    var _res2;
    if (opts.inclusiveRangeEnds) {
      _res = index >= rangesArr[0][0] && index <= rangesArr[0][1];
      _res2 = index >= rangesArr[1][0] && index <= rangesArr[1][1];
    } else {
      _res = index > rangesArr[0][0] && index < rangesArr[0][1];
      _res2 = index > rangesArr[1][0] && index < rangesArr[1][1];
    }
    if (opts.returnMatchedRangeInsteadOfTrue && (_res || _res2)) {
      return _res ? rangesArr[0] : rangesArr[1];
    }
    return _res || _res2;
  }
  var rarr = opts.skipIncomingRangeSorting ? rangesArr : rangesSort(rangesArr);
  if (index < rarr[0][0] || index > rarr[rarr.length - 1][1]) {
    return false;
  } else if (index === rarr[0][0]) {
    if (opts.inclusiveRangeEnds) {
      if (opts.returnMatchedRangeInsteadOfTrue) {
        return rarr[0];
      }
      return true;
    }
    return false;
  } else if (index === rarr[rarr.length - 1][1]) {
    if (opts.inclusiveRangeEnds) {
      if (opts.returnMatchedRangeInsteadOfTrue) {
        return rarr[rarr.length - 1];
      }
      return true;
    }
    return false;
  }
  var lowerIndex = 0;
  var upperIndex = rarr.length - 1;
  var theIndexOfTheRangeInTheMiddle = Math.floor((upperIndex + lowerIndex) / 2);
  while (Math.floor(upperIndex - lowerIndex) > 1 && theIndexOfTheRangeInTheMiddle !== 0) {
    theIndexOfTheRangeInTheMiddle = Math.floor((upperIndex + lowerIndex) / 2);
    if (index < rarr[theIndexOfTheRangeInTheMiddle][0]) {
      upperIndex = theIndexOfTheRangeInTheMiddle;
    } else if (index > rarr[theIndexOfTheRangeInTheMiddle][1]) {
      lowerIndex = theIndexOfTheRangeInTheMiddle;
    } else if (index === rarr[theIndexOfTheRangeInTheMiddle][0] || index === rarr[theIndexOfTheRangeInTheMiddle][1]) {
      if (opts.inclusiveRangeEnds) {
        if (opts.returnMatchedRangeInsteadOfTrue) {
          return rarr[theIndexOfTheRangeInTheMiddle];
        }
        return true;
      }
      return false;
    } else {
      if (opts.returnMatchedRangeInsteadOfTrue) {
        return rarr[theIndexOfTheRangeInTheMiddle];
      }
      return true;
    }
  }
  var res1;
  var res2;
  if (opts.inclusiveRangeEnds) {
    res1 = index >= rangesArr[lowerIndex][0] && index <= rangesArr[lowerIndex][1];
    res2 = index >= rangesArr[upperIndex][0] && index <= rangesArr[upperIndex][1];
  } else {
    res1 = index > rangesArr[lowerIndex][0] && index < rangesArr[lowerIndex][1];
    res2 = index > rangesArr[upperIndex][0] && index < rangesArr[upperIndex][1];
  }
  if (opts.returnMatchedRangeInsteadOfTrue && (res1 || res2)) {
    return res1 ? rangesArr[lowerIndex] : rangesArr[upperIndex];
  }
  return res1 || res2;
}

module.exports = rangesIsIndexWithin;
