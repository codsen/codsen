/**
 * @name string-character-is-astral-surrogate
 * @fileoverview Tells, is given character a part of astral character, specifically, a high and low surrogate
 * @version 1.12.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-character-is-astral-surrogate/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

function isHighSurrogate(something) {
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    return something.charCodeAt(0) >= 55296 && something.charCodeAt(0) <= 56319;
  }
  if (something === undefined) {
    return false;
  }
  throw new TypeError("string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but ".concat(_typeof__default['default'](something)));
}
function isLowSurrogate(something) {
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    return something.charCodeAt(0) >= 56320 && something.charCodeAt(0) <= 57343;
  }
  if (something === undefined) {
    return false;
  }
  throw new TypeError("string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but ".concat(_typeof__default['default'](something)));
}

exports.isHighSurrogate = isHighSurrogate;
exports.isLowSurrogate = isLowSurrogate;
