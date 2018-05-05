'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var isNaturalNumber = _interopDefault(require('is-natural-number'));
var isNaturalNumberString = _interopDefault(require('is-natural-number-string'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isArr = Array.isArray;

// FUNCTIONS - INTERNAL
// -----------------------------------------------------------------------------

function existy(x) {
  return x != null;
}

// EXTERNAL API
// -----------------------------------------------------------------------------

function sortBySubarray(arr) {
  var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  if (!isArr(arr)) {
    throw new Error("array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as " + (typeof arr === "undefined" ? "undefined" : _typeof(arr)) + ", equal to:\n" + JSON.stringify(arr, null, 0));
  }
  if (!isNaturalNumber(axis, { includeZero: true })) {
    if (isNaturalNumberString(axis, { includeZero: true })) {
      axis = parseInt(axis, 10);
    } else {
      throw new Error("array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n" + JSON.stringify(axis, null, 0));
    }
  }
  var maxLength = Math.max.apply(Math, _toConsumableArray(arr.map(function (arr) {
    return arr.length;
  })));
  if (maxLength === 0) {
    return arr;
  }

  if (axis >= maxLength) {
    throw new Error("array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as " + axis + " while highest index goes as far as " + maxLength + ".");
  }

  var resToBeReturned = clone(arr).sort(function (arr1, arr2) {

    // 1. check the axis column first:
    if (arr1[axis] !== arr2[axis]) {
      if (!existy(arr1[axis]) && existy(arr2[axis]) || existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] > arr2[axis]) {
        return 1;
      }
      if (existy(arr1[axis]) && !existy(arr2[axis]) || existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] < arr2[axis]) {
        return -1;
      }
    }
    // 2. if we reached this point, we need to ripple outwards from the axis
    // column, comparing first what's outside on the left-side, then right, then
    // left outside of it, then right outside of it, then left outside of it...

    var maxRangeToIterate = Math.max(arr1.length, arr2.length);
    var maxRipplesLength = Math.max(axis, maxRangeToIterate - axis - 1);

    // console.log(
    //   `\u001b[${35}m${`maxRipplesLength: ${maxRipplesLength}`}\u001b[${39}m`
    // );

    // iterate through the ripple's length:
    for (var i = 1; i <= maxRipplesLength; i++) {
      if (axis - i >= 0) {
        // logging:

        // comparison:
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
          // arr1 value is null or undefined
          // it's enough for arr2 not to be null or undefined and it goes on top:
          if (existy(arr2[axis - i])) {
            return 1;
          }
        }
      }
      if (axis + i < maxRangeToIterate) {
        // logging:

        // comparison:
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
          // arr1 value is null or undefined
          // it's enough for arr2 not to be null or undefined and it goes on top:
          if (existy(arr2[axis + i])) {
            return 1;
          }
        }
      }
    }

    // 3. if by now any of returns hasn't happened yet, these two rows are equal
    return 0;
  });

  return resToBeReturned;
}

module.exports = sortBySubarray;
