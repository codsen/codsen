'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var r = _interopDefault(require('hex-color-regex'));
var isPlainObject = _interopDefault(require('lodash.isplainobject'));
var isString = _interopDefault(require('lodash.isstring'));
var clone = _interopDefault(require('lodash.clonedeep'));

var isArray = Array.isArray;
function conv(originalInput) {
  var input = clone(originalInput);
  function toFullHex(hex, findings, offset, string) {
    if (string[offset - 1] !== "&" &&
    hex.length === 4 && hex.charAt(0) === "#") {
      hex = "#" + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2) + hex.charAt(3) + hex.charAt(3);
    }
    return hex.toLowerCase();
  }
  if (isString(originalInput)) {
    input = input.replace(r(), toFullHex);
  } else if (isArray(input)) {
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
