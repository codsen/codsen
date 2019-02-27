/**
 * ranges-process-outside
 * Iterate through string and optionally a given ranges as if they were one
 * Version: 1.2.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-process-outside
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var isArr = Array.isArray;
function processOutside(str, originalRanges, cb, skipChecks) {
  function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
  }
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!");
    } else {
      throw new Error("ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
    }
  }
  if (originalRanges !== null && !isArr(originalRanges)) {
    throw new Error("ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n".concat(JSON.stringify(originalRanges, null, 4), " (type ").concat(_typeof(originalRanges), ")"));
  }
  if (!isArr(originalRanges) || originalRanges.length === 0) {
    cb({
      from: 0,
      to: str.length,
      value: str
    });
    return;
  }
  if (!isFunction(cb)) {
    throw new Error("ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n".concat(JSON.stringify(cb, null, 4), " (type ").concat(_typeof(cb), ")"));
  }
  var ranges;
  if (skipChecks) {
    ranges = originalRanges;
  } else {
    ranges = mergeRanges(originalRanges);
  }
  var previousTo = 0;
  ranges.forEach(function (_ref, i, wholeArr) {
    var _ref2 = _slicedToArray(_ref, 2),
        receivedFrom = _ref2[0],
        receivedTo = _ref2[1];
    if (receivedFrom < previousTo) {
      throw new Error("ranges-process-outside: [THROW_ID_05] the ranges array is not sorted/merged. It's equal to:\n".concat(JSON.stringify(originalRanges, null, 4), "\n\nNotice ranges at index ").concat(i, " and ").concat(i - 1, ": [... ").concat(JSON.stringify(ranges[i - 1], null, 0), ", ").concat(JSON.stringify(ranges[i], null, 0), "...] - use ranges-merge, ranges-sort or ranges-push npm libraries to process your ranges array upfont."));
    }
    if (receivedFrom !== null && receivedFrom !== 0) {
      cb({
        from: previousTo,
        to: receivedFrom,
        value: str.slice(previousTo, receivedFrom)
      });
    }
    previousTo = receivedTo <= str.length ? receivedTo : null;
    if (previousTo !== null && i === wholeArr.length - 1) {
      cb({
        from: previousTo,
        to: str.length,
        value: str.slice(previousTo, str.length)
      });
    }
  });
}

module.exports = processOutside;
