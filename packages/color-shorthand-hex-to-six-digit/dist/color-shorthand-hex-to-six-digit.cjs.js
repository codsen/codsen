/**
 * color-shorthand-hex-to-six-digit
 * Convert shorthand hex color codes into full
 * Version: 3.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/color-shorthand-hex-to-six-digit/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var r = require('hex-color-regex');
var isPlainObject = require('lodash.isplainobject');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var r__default = /*#__PURE__*/_interopDefaultLegacy(r);
var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

var version = "3.0.4";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
var version$1 = version;
/**
 * Convert shorthand hex color codes into full
 */

function conv(originalInput) {
  // prevent any input argument mutation:
  var input = clone__default['default'](originalInput); // f's
  // ====================

  function toFullHex(hex, _findings, offset, string) {
    if (string[offset - 1] !== "&" && // consider false positives like &#124;
    hex.length === 4 && hex.charAt(0) === "#") {
      return ("#" + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2) + hex.charAt(3) + hex.charAt(3)).toLowerCase();
    }

    return hex.toLowerCase();
  } // action
  // ====================


  if (typeof originalInput === "string") {
    input = input.replace(r__default['default'](), toFullHex);
  } else if (Array.isArray(input)) {
    for (var i = 0, len = input.length; i < len; i++) {
      input[i] = conv(input[i]);
    }
  } else if (isPlainObject__default['default'](originalInput)) {
    Object.keys(input).forEach(function (key) {
      input[key] = conv(input[key]);
    });
  } else {
    return originalInput;
  }

  return input;
}

exports.conv = conv;
exports.version = version$1;
