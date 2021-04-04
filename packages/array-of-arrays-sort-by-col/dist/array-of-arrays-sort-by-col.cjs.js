/**
 * @name array-of-arrays-sort-by-col
 * @fileoverview Sort array of arrays by column, rippling the sorting outwards from that column
 * @version 3.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-of-arrays-sort-by-col/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "3.0.14";

var version = version$1;
function existy(x) {
  return x != null;
}
function sortByCol(arr) {
  var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!Array.isArray(arr)) {
    throw new Error("array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ".concat(_typeof__default['default'](arr), ", equal to:\n").concat(JSON.stringify(arr, null, 0)));
  }
  if (isNaN(+axis)) {
    throw new Error("array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n".concat(JSON.stringify(axis, null, 0), " (type ").concat(_typeof__default['default'](axis), ")"));
  }
  var maxLength = Math.max.apply(Math, _toConsumableArray__default['default'](arr.map(function (arr2) {
    return arr2.length;
  })));
  if (!maxLength) {
    return arr;
  }
  if (+axis >= maxLength) {
    throw new Error("array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ".concat(+axis, " while highest index goes as far as ").concat(maxLength, "."));
  }
  var resToBeReturned = Array.from(arr).sort(function (arr1, arr2) {
    if (arr1[+axis] !== arr2[+axis]) {
      if (!existy(arr1[+axis]) && existy(arr2[+axis]) || existy(arr1[+axis]) && existy(arr2[+axis]) && arr1[+axis] > arr2[+axis]) {
        return 1;
      }
      /* istanbul ignore else */
      if (existy(arr1[+axis]) && !existy(arr2[+axis]) || existy(arr1[+axis]) && existy(arr2[+axis]) && arr1[+axis] < arr2[+axis]) {
        return -1;
      }
    }
    var maxRangeToIterate = Math.max(arr1.length, arr2.length);
    var maxRipplesLength = Math.max(+axis, maxRangeToIterate - +axis - 1);
    for (var i = 1; i <= maxRipplesLength; i++) {
      if (+axis - i >= 0) {
        if (existy(arr1[+axis - i])) {
          if (existy(arr2[+axis - i])) {
            if (arr1[+axis - i] < arr2[+axis - i]) {
              return -1;
            }
            if (arr1[+axis - i] > arr2[+axis - i]) {
              return 1;
            }
          } else {
            return -1;
          }
        }
        else if (existy(arr2[+axis - i])) {
            return 1;
          }
      }
      /* istanbul ignore else */
      if (+axis + i < maxRangeToIterate) {
        if (existy(arr1[+axis + i])) {
          if (existy(arr2[+axis + i])) {
            if (arr1[+axis + i] < arr2[+axis + i]) {
              return -1;
            }
            if (arr1[+axis + i] > arr2[+axis + i]) {
              return 1;
            }
          } else {
            return -1;
          }
        }
        else if (existy(arr2[+axis + i])) {
            return 1;
          }
      }
    }
    return 0;
  });
  return resToBeReturned;
}

exports.sortByCol = sortByCol;
exports.version = version;
