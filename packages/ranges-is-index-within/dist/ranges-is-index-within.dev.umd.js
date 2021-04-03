/**
 * ranges-is-index-within
 * Checks if index is within any of the given string index ranges
 * Version: 2.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesIsIndexWithin = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.13";

const version = version$1;
const defaults = {
    inclusiveRangeEnds: false,
    returnMatchedRangeInsteadOfTrue: false,
};
function isIndexWithin(originalIndex, rangesArr, originalOpts) {
    const opts = { ...defaults, ...originalOpts };
    // insurance
    if (!Number.isInteger(originalIndex)) {
        throw new Error(`ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${originalIndex} (type ${typeof originalIndex})`);
    }
    if (!Array.isArray(rangesArr)) {
        return false;
    }
    if (opts.returnMatchedRangeInsteadOfTrue) {
        return (rangesArr.find((arr) => opts.inclusiveRangeEnds
            ? originalIndex >= arr[0] && originalIndex <= arr[1]
            : originalIndex > arr[0] && originalIndex < arr[1]) || false);
    }
    return rangesArr.some((arr) => opts.inclusiveRangeEnds
        ? originalIndex >= arr[0] && originalIndex <= arr[1]
        : originalIndex > arr[0] && originalIndex < arr[1]);
}

exports.defaults = defaults;
exports.isIndexWithin = isIndexWithin;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
