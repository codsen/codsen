/**
 * ranges-process-outside
 * Iterate through string and optionally a given ranges as if they were one
 * Version: 2.2.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-process-outside
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var invert = _interopDefault(require('ranges-invert'));
var crop = _interopDefault(require('ranges-crop'));
var runes = _interopDefault(require('runes'));

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
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

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
function processOutside(str, originalRanges, cb) {
  var skipChecks = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
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
  if (originalRanges && !isArr(originalRanges)) {
    throw new Error("ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n".concat(JSON.stringify(originalRanges, null, 4), " (type ").concat(_typeof(originalRanges), ")"));
  }
  if (!isFunction(cb)) {
    throw new Error("ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n".concat(JSON.stringify(cb, null, 4), " (type ").concat(_typeof(cb), ")"));
  }
  function iterator(str, arrOfArrays) {
    arrOfArrays.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          fromIdx = _ref2[0],
          toIdx = _ref2[1];
      for (var i = fromIdx; i < toIdx; i++) {
        var charLength = runes(str.slice(i))[0].length;
        cb(i, i + charLength, function (offsetValue) {
          if (offsetValue != null) {
            i += offsetValue;
          }
        });
        if (charLength && charLength > 1) {
          i += charLength - 1;
        }
      }
    });
  }
  if (originalRanges && originalRanges.length) {
    var temp = crop(invert(skipChecks ? originalRanges : originalRanges, str.length, {
      skipChecks: !!skipChecks
    }), str.length);
    iterator(str, temp);
  } else {
    iterator(str, [[0, str.length]]);
  }
}

module.exports = processOutside;
