/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import r from "hex-color-regex";
import { isPlainObject } from "codsen-utils";
import rfdc from "rfdc";
import { version as v } from "../package.json";

const clone = rfdc();
const version: string = v;

/**
 * Convert shorthand hex color codes into full
 */
function conv(input: any): any {
  if (
    typeof input !== "string" &&
    !Array.isArray(input) &&
    !isPlainObject(input)
  ) {
    return input;
  }

  function toFullHex(
    hex: string,
    _findings: any,
    offset: number,
    string: string,
  ): string {
    if (
      string[offset - 1] !== "&" && // consider false positives like &#124;
      hex.length === 4 &&
      hex.charAt(0) === "#"
    ) {
      return `#${hex.charAt(1)}${hex.charAt(1)}${hex.charAt(2)}${hex.charAt(
        2,
      )}${hex.charAt(3)}${hex.charAt(3)}`.toLowerCase();
    }
    return hex.toLowerCase();
  }

  // action
  // ====================

  if (typeof input === "string") {
    return input.replace(r(), toFullHex);
  }
  if (Array.isArray(input)) {
    return input.map(conv);
  }
  if (isPlainObject(input)) {
    let clonedInput = clone(input);
    Object.keys(clonedInput).forEach((key) => {
      clonedInput[key] = conv(clonedInput[key]);
    });
    return clonedInput;
  }
  return input;
}

export { conv, version };
