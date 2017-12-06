import r from 'hex-color-regex';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import clone from 'lodash.clonedeep';

/* eslint no-param-reassign:0 */

var isArray = Array.isArray;


function conv(originalInput) {
  var input = clone(originalInput);
  // f's
  function toFullHex(hex) {
    // console.log('received: ' + JSON.stringify(hex, null, 4))
    if (hex.length === 4 && hex.charAt(0) === '#') {
      hex = '#' + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2) + hex.charAt(3) + hex.charAt(3);
    }
    return hex;
  }
  function toLowerCase(match) {
    return match.toLowerCase();
  }
  // action
  if (isString(originalInput)) {
    input = input.replace(r(), toFullHex);
    input = input.replace(r(), toLowerCase);
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

export default conv;
