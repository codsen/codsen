'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function isHighSurrogate(something) {
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    return something.charCodeAt(0) >= 55296 && something.charCodeAt(0) <= 56319;
  } else if (something === undefined) {
    return false;
  }
  throw new TypeError("string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but " + (typeof something === "undefined" ? "undefined" : _typeof(something)));
}
function isLowSurrogate(something) {
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    return something.charCodeAt(0) >= 56320 && something.charCodeAt(0) <= 57343;
  } else if (something === undefined) {
    return false;
  }
  throw new TypeError("string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but " + (typeof something === "undefined" ? "undefined" : _typeof(something)));
}

exports.isHighSurrogate = isHighSurrogate;
exports.isLowSurrogate = isLowSurrogate;
