/**
 * color-shorthand-hex-to-six-digit
 * Convert shorthand hex color codes into full
 * Version: 2.10.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/color-shorthand-hex-to-six-digit
 */

import r from 'hex-color-regex';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import clone from 'lodash.clonedeep';

const { isArray } = Array;
function conv(originalInput) {
  let input = clone(originalInput);
  function toFullHex(hex, findings, offset, string) {
    if (
      string[offset - 1] !== "&" &&
      hex.length === 4 &&
      hex.charAt(0) === "#"
    ) {
      hex = `#${hex.charAt(1)}${hex.charAt(1)}${hex.charAt(2)}${hex.charAt(
        2
      )}${hex.charAt(3)}${hex.charAt(3)}`;
    }
    return hex.toLowerCase();
  }
  if (isString(originalInput)) {
    input = input.replace(r(), toFullHex);
  } else if (isArray(input)) {
    for (let i = 0, len = input.length; i < len; i++) {
      input[i] = conv(input[i]);
    }
  } else if (isPlainObject(originalInput)) {
    Object.keys(input).forEach(key => {
      input[key] = conv(input[key]);
    });
  } else {
    return originalInput;
  }
  return input;
}

export default conv;
