/**
 * ranges-is-index-within
 * Checks if index is within any of the given string index ranges
 * Version: 2.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesIsIndexWithin = {}));
}(this, (function (exports) { 'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var version = "2.0.0";

var version$1 = version;
var defaults = {
  inclusiveRangeEnds: false,
  returnMatchedRangeInsteadOfTrue: false
};

function isIndexWithin(originalIndex, rangesArr, originalOpts) {
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // insurance


  if (!Number.isInteger(originalIndex)) {
    throw new Error("ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as " + originalIndex + " (type " + typeof originalIndex + ")");
  }

  if (!Array.isArray(rangesArr)) {
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

exports.defaults = defaults;
exports.isIndexWithin = isIndexWithin;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
