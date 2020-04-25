/**
 * color-shorthand-hex-to-six-digit
 * Convert shorthand hex color codes into full
 * Version: 2.10.58
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/color-shorthand-hex-to-six-digit
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var r = _interopDefault(require('hex-color-regex'));
var isPlainObject = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));

function conv(originalInput) {
  var input = clone(originalInput);
  function toFullHex(hex, findings, offset, string) {
    if (string[offset - 1] !== "&" &&
    hex.length === 4 && hex.charAt(0) === "#") {
      return "#".concat(hex.charAt(1)).concat(hex.charAt(1)).concat(hex.charAt(2)).concat(hex.charAt(2)).concat(hex.charAt(3)).concat(hex.charAt(3)).toLowerCase();
    }
    return hex.toLowerCase();
  }
  if (typeof originalInput === "string") {
    input = input.replace(r(), toFullHex);
  } else if (Array.isArray(input)) {
    for (var i = 0, len = input.length; i < len; i++) {
      input[i] = conv(input[i]);
    }
  } else if (isPlainObject(originalInput)) {
    Object.keys(input).forEach(function (key) {
      input[key] = conv(input[key]);
    });
  } else {
    return originalInput;
  }
  return input;
}

module.exports = conv;
