/**
 * array-of-arrays-sort-by-col
 * sort array of arrays by column, rippling the sorting outwards from that column
 * Version: 2.11.24
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-sort-by-col
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var isNaturalNumber = _interopDefault(require('is-natural-number'));
var isNaturalNumberString = _interopDefault(require('is-natural-number-string'));

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function sortBySubarray(arr) {
  var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!isArr(arr)) {
    throw new Error("array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ".concat(_typeof(arr), ", equal to:\n").concat(JSON.stringify(arr, null, 0)));
  }
  if (!isNaturalNumber(axis, {
    includeZero: true
  })) {
    if (isNaturalNumberString(axis, {
      includeZero: true
    })) {
      axis = parseInt(axis, 10);
    } else {
      throw new Error("array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n".concat(JSON.stringify(axis, null, 0)));
    }
  }
  var maxLength = Math.max.apply(Math, _toConsumableArray(arr.map(function (arr) {
    return arr.length;
  })));
  if (maxLength === 0) {
    return arr;
  }
  if (axis >= maxLength) {
    throw new Error("array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ".concat(axis, " while highest index goes as far as ").concat(maxLength, "."));
  }
  var resToBeReturned = clone(arr).sort(function (arr1, arr2) {
    if (arr1[axis] !== arr2[axis]) {
      if (!existy(arr1[axis]) && existy(arr2[axis]) || existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] > arr2[axis]) {
        return 1;
      }
      if (existy(arr1[axis]) && !existy(arr2[axis]) || existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] < arr2[axis]) {
        return -1;
      }
    }
    var maxRangeToIterate = Math.max(arr1.length, arr2.length);
    var maxRipplesLength = Math.max(axis, maxRangeToIterate - axis - 1);
    for (var i = 1; i <= maxRipplesLength; i++) {
      if (axis - i >= 0) {
        if (existy(arr1[axis - i])) {
          if (existy(arr2[axis - i])) {
            if (arr1[axis - i] < arr2[axis - i]) {
              return -1;
            }
            if (arr1[axis - i] > arr2[axis - i]) {
              return 1;
            }
          } else {
            return -1;
          }
        } else {
          if (existy(arr2[axis - i])) {
            return 1;
          }
        }
      }
      if (axis + i < maxRangeToIterate) {
        if (existy(arr1[axis + i])) {
          if (existy(arr2[axis + i])) {
            if (arr1[axis + i] < arr2[axis + i]) {
              return -1;
            }
            if (arr1[axis + i] > arr2[axis + i]) {
              return 1;
            }
          } else {
            return -1;
          }
        } else {
          if (existy(arr2[axis + i])) {
            return 1;
          }
        }
      }
    }
    return 0;
  });
  return resToBeReturned;
}

module.exports = sortBySubarray;
