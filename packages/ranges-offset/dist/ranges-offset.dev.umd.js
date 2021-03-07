/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 2.0.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesOffset = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.7";

var version = version$1;

function rOffset(arrOfRanges, offset) {
  if (offset === void 0) {
    offset = 0;
  }

  // empty Ranges are null!
  if (Array.isArray(arrOfRanges) && arrOfRanges.length) {
    return arrOfRanges.map(function (_ref) {
      var elem = _ref.slice(0);

      if (typeof elem[0] === "number") {
        elem[0] += offset;
      }

      if (typeof elem[1] === "number") {
        elem[1] += offset;
      }

      return [].concat(elem);
    });
  }

  return arrOfRanges;
}

exports.rOffset = rOffset;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
