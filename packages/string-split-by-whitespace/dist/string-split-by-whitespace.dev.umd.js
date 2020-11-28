/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 1.7.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-split-by-whitespace/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.stringSplitByWhitespace = factory());
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

  /**
   * ranges-is-index-within
   * Checks if index is within any of the given string index ranges
   * Version: 1.16.0
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://codsen.com/os/ranges-is-index-within/
   */
  function rangesIsIndexWithin(originalIndex, rangesArr, originalOpts) {
    var defaults = {
      inclusiveRangeEnds: false,
      returnMatchedRangeInsteadOfTrue: false
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    if (!Number.isInteger(originalIndex)) {
      throw new Error("ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ".concat(originalIndex, " (type ").concat(_typeof(originalIndex), ")"));
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

  function split(str, originalOpts) {
    if (str === undefined) {
      throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");
    }

    if (typeof str !== "string") {
      return str;
    } // early ending:


    if (str.trim() === "") {
      return [];
    }

    var defaults = {
      ignoreRanges: []
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    if (opts.ignoreRanges.length > 0 && !opts.ignoreRanges.every(function (arr) {
      return Array.isArray(arr);
    })) {
      throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");
    } // if reached this far, traverse and slice accordingly


    var nonWhitespaceSubStringStartsAt = null;
    var res = [];

    for (var i = 0, len = str.length; i < len; i++) {
      // catch the first non-whitespace character
      if (nonWhitespaceSubStringStartsAt === null && str[i].trim() && (!opts.ignoreRanges.length || opts.ignoreRanges.length && !rangesIsIndexWithin(i, opts.ignoreRanges.map(function (arr) {
        return [arr[0], arr[1] - 1];
      }), {
        inclusiveRangeEnds: true
      }))) {
        nonWhitespaceSubStringStartsAt = i;
      } // catch the first whitespace char when recording substring


      if (nonWhitespaceSubStringStartsAt !== null) {
        if (!str[i].trim()) {
          res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
          nonWhitespaceSubStringStartsAt = null;
        } else if (opts.ignoreRanges.length && rangesIsIndexWithin(i, opts.ignoreRanges)) {
          res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
          nonWhitespaceSubStringStartsAt = null;
        } else if (str[i + 1] === undefined) {
          res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
        }
      }
    }

    return res;
  }

  return split;

})));
