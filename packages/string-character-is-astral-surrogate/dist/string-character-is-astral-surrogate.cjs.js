/**
 * string-character-is-astral-surrogate
 * Tells, is given character a part of astral character, specifically, a high and low surrogate
 * Version: 1.12.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-character-is-astral-surrogate/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// high surrogate goes first, low goes second
function isHighSurrogate(something) {
  // [\uD800-\uDBFF]
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    } // \uD800 charCode is 55296
    // \uDBFF charCode is 56319


    return something.charCodeAt(0) >= 55296 && something.charCodeAt(0) <= 56319;
  }

  if (something === undefined) {
    return false;
  }

  throw new TypeError("string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but " + typeof something);
}

function isLowSurrogate(something) {
  // [\uDC00-\uDFFF]
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    } // \uDC00 charCode is 56320
    // \uDFFF charCode is 57343


    return something.charCodeAt(0) >= 56320 && something.charCodeAt(0) <= 57343;
  }

  if (something === undefined) {
    return false;
  }

  throw new TypeError("string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but " + typeof something);
}

exports.isHighSurrogate = isHighSurrogate;
exports.isLowSurrogate = isLowSurrogate;
