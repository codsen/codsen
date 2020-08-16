/**
 * color-shorthand-hex-to-six-digit
 * Convert shorthand hex color codes into full
 * Version: 2.10.64
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/color-shorthand-hex-to-six-digit
 */

'use strict';

var r = require('hex-color-regex');
var isPlainObject = require('lodash.isplainobject');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var r__default = /*#__PURE__*/_interopDefaultLegacy(r);
var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

function conv(originalInput) {
  var input = clone__default['default'](originalInput);
  function toFullHex(hex, findings, offset, string) {
    if (string[offset - 1] !== "&" &&
    hex.length === 4 && hex.charAt(0) === "#") {
      return "#".concat(hex.charAt(1)).concat(hex.charAt(1)).concat(hex.charAt(2)).concat(hex.charAt(2)).concat(hex.charAt(3)).concat(hex.charAt(3)).toLowerCase();
    }
    return hex.toLowerCase();
  }
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

module.exports = conv;
