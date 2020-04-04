/**
 * string-character-is-astral-surrogate
 * Tells, is given character a part of astral character, specifically, a high and low surrogate
 * Version: 1.10.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-character-is-astral-surrogate
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.stringCharacterIsAstralSurrogate = {}));
}(this, (function (exports) { 'use strict';

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

  // high surrogate goes first, low goes second
  function isHighSurrogate(something) {
    // [\uD800-\uDBFF]
    if (typeof something === "string") {
      if (something.length === 0) {
        return false;
      } // \uD800 charCode is 55296
      // \uDBFF charCode is 56319


      return something.charCodeAt(0) >= 55296 && something.charCodeAt(0) <= 56319;
    } else if (something === undefined) {
      return false;
    }

    throw new TypeError("string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but ".concat(_typeof(something)));
  }

  function isLowSurrogate(something) {
    // [\uDC00-\uDFFF]
    if (typeof something === "string") {
      if (something.length === 0) {
        return false;
      } // \uDC00 charCode is 56320
      // \uDFFF charCode is 57343


      return something.charCodeAt(0) >= 56320 && something.charCodeAt(0) <= 57343;
    } else if (something === undefined) {
      return false;
    }

    throw new TypeError("string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but ".concat(_typeof(something)));
  }

  exports.isHighSurrogate = isHighSurrogate;
  exports.isLowSurrogate = isLowSurrogate;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
