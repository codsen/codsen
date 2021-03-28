/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.12.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/charcode-is-valid-xml-name-character/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.charcodeIsValidXmlNameCharacter = {}));
}(this, (function (exports) { 'use strict';

/**
 * ranges-is-index-within
 * Checks if index is within any of the given string index ranges
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */
const defaults = {
  inclusiveRangeEnds: false,
  returnMatchedRangeInsteadOfTrue: false
};
function isIndexWithin(originalIndex, rangesArr, originalOpts) {
  const opts = { ...defaults,
    ...originalOpts
  };
  if (!Number.isInteger(originalIndex)) {
    throw new Error(`ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${originalIndex} (type ${typeof originalIndex})`);
  }
  if (!Array.isArray(rangesArr)) {
    return false;
  }
  if (opts.returnMatchedRangeInsteadOfTrue) {
    return rangesArr.find(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]) || false;
  }
  return rangesArr.some(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]);
}

// https://www.w3.org/TR/REC-xml/#NT-NameStartChar
// Production 4 - except lowercase letters are missing
const nameStartChar = [
    [58, 58],
    [65, 90],
    [95, 95],
    [192, 214],
    [216, 246],
    [248, 767],
    [880, 893],
    [895, 8191],
    [8204, 8205],
    [8304, 8591],
    [11264, 12271],
    [12289, 55295],
    [63744, 64975],
    [65008, 65533],
    [65536, 983039], // [#x10000-#xEFFFF]
];
// https://www.w3.org/TR/REC-xml/#NT-NameChar
// Production 4a - addition to Production 4, except lowercase letters are missing
const nameChar = [
    [45, 45],
    [46, 46],
    [48, 57],
    [58, 58],
    [65, 90],
    [95, 95],
    [183, 183],
    [192, 214],
    [216, 246],
    [248, 767],
    [768, 879],
    [880, 893],
    [895, 8191],
    [8204, 8205],
    [8255, 8256],
    [8304, 8591],
    [11264, 12271],
    [12289, 55295],
    [63744, 64975],
    [65008, 65533],
    [65536, 983039], // [#x10000-#xEFFFF]
];
const priorityNameChar = [
    [97, 122], // [a-z]
];
const opts = {
    inclusiveRangeEnds: true,
    skipIncomingRangeSorting: true,
};
// first checking the letters, then the rest
function isProduction4(char) {
    return (isIndexWithin(char.codePointAt(0), priorityNameChar, opts) ||
        isIndexWithin(char.codePointAt(0), nameStartChar, opts));
}
function isProduction4a(char) {
    return (isIndexWithin(char.codePointAt(0), priorityNameChar, opts) ||
        isIndexWithin(char.codePointAt(0), nameChar, opts));
}

exports.isProduction4 = isProduction4;
exports.isProduction4a = isProduction4a;
exports.validFirstChar = isProduction4;
exports.validSecondCharOnwards = isProduction4a;

Object.defineProperty(exports, '__esModule', { value: true });

})));
