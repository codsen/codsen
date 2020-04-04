/**
 * array-of-arrays-sort-by-col
 * sort array of arrays by column, rippling the sorting outwards from that column
 * Version: 2.12.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-sort-by-col
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.arrayOfArraysSortByCol = factory());
}(this, (function () { 'use strict';

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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // FUNCTIONS - INTERNAL
  // -----------------------------------------------------------------------------
  function existy(x) {
    return x != null;
  }
  //   console.log(
  //     `\n\n\n\n*** logArrayOfArrays:\n${"=".repeat(
  //       arr[0].length * 8 + (arr[0].length - 1)
  //     )}${arr.reduce((accum, currVal) => {
  //       return `${accum}\n${logArray(currVal, highlightIdx)}`;
  //     }, "")}\n${"=".repeat(arr[0].length * 8 + (arr[0].length - 1))}\n\n\n`
  //   );
  // }
  // EXTERNAL API
  // -----------------------------------------------------------------------------


  function sortBySubarray(arr) {
    var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!Array.isArray(arr)) {
      throw new Error("array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ".concat(_typeof(arr), ", equal to:\n").concat(JSON.stringify(arr, null, 0)));
    }

    if (!Number.isInteger(axis)) {
      if (/^\d*$/.test(axis)) {
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

    var resToBeReturned = Array.from(arr).sort(function (arr1, arr2) {
      // 1. check the axis column first:
      if (arr1[axis] !== arr2[axis]) {
        if (!existy(arr1[axis]) && existy(arr2[axis]) || existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] > arr2[axis]) {
          return 1;
        }

        if (existy(arr1[axis]) && !existy(arr2[axis]) || existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] < arr2[axis]) {
          return -1;
        }
      } // 2. if we reached this point, we need to ripple outwards from the axis
      // column, comparing first what's outside on the left-side, then right, then
      // left outside of it, then right outside of it, then left outside of it...


      var maxRangeToIterate = Math.max(arr1.length, arr2.length);
      var maxRipplesLength = Math.max(axis, maxRangeToIterate - axis - 1); // console.log(
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
      } // 3. if by now any of returns hasn't happened yet, these two rows are equal


      return 0;
    }); // console.log("\n\n\nRETURNING:");
    // logArrayOfArrays(resToBeReturned, axis);

    return resToBeReturned;
  }

  return sortBySubarray;

})));
