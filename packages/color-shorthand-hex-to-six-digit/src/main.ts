/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import r from "hex-color-regex";
import isPlainObject from "lodash.isplainobject";
import clone from "lodash.clonedeep";
import { version as v } from "../package.json";
const version: string = v;

/**
 * Convert shorthand hex color codes into full
 */
function conv(originalInput: any): any {
  // prevent any input argument mutation:
  let input = clone(originalInput);

  // f's
  // ====================

  function toFullHex(
    hex: string,
    _findings: any,
    offset: number,
    string: string
  ) {
    if (
      string[offset - 1] !== "&" && // consider false positives like &#124;
      hex.length === 4 &&
      hex.charAt(0) === "#"
    ) {
      return `#${hex.charAt(1)}${hex.charAt(1)}${hex.charAt(2)}${hex.charAt(
        2
      )}${hex.charAt(3)}${hex.charAt(3)}`.toLowerCase();
    }
    return hex.toLowerCase();
  }

  // action
  // ====================

  if (typeof originalInput === "string") {
    input = input.replace(r(), toFullHex);
  } else if (Array.isArray(input)) {
    for (let i = 0, len = input.length; i < len; i++) {
      input[i] = conv(input[i]);
    }
  } else if (isPlainObject(originalInput)) {
    Object.keys(input).forEach((key) => {
      input[key] = conv(input[key]);
    });
  } else {
    return originalInput;
  }
  return input;
}

export { conv, version };
