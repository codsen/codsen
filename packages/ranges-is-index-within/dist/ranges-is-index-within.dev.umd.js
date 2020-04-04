/**
 * ranges-is-index-within
 * Efficiently checks if index is within any of the given ranges
 * Version: 1.14.31
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.rangesIsIndexWithin = factory());
}(this, (function () { 'use strict';

  var isArr = Array.isArray;

  function rangesIsIndexWithin(originalIndex, rangesArr, originalOpts) {
    var defaults = {
      inclusiveRangeEnds: false,
      returnMatchedRangeInsteadOfTrue: false
    };
    var opts = Object.assign(Object.assign({}, defaults), originalOpts);

    if (!isArr(rangesArr)) {
      return false;
    }

    if (opts.returnMatchedRangeInsteadOfTrue) {
      return rangesArr.find(function (arr) {
        return opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1];
      }) || false;
    }

    return rangesArr.some(function (arr) {
      return opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1];
    });
  }

  return rangesIsIndexWithin;

})));
