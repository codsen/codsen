/**
 * @name string-split-by-whitespace
 * @fileoverview Split string into array by chunks of whitespace
 * @version 2.0.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-split-by-whitespace/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringSplitByWhitespace = {}));
}(this, (function (exports) { 'use strict';

/**
 * @name ranges-is-index-within
 * @fileoverview Checks if index is within any of the given string index ranges
 * @version 2.0.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-is-index-within/}
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

var version$1 = "2.0.15";

const version = version$1;
function splitByW(str, originalOpts) {
    if (str === undefined) {
        throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");
    }
    if (typeof str !== "string") {
        return str;
    }
    // early ending:
    if (str.trim() === "") {
        return [];
    }
    const defaults = {
        ignoreRanges: [],
    };
    const opts = { ...defaults, ...originalOpts };
    if (opts.ignoreRanges.length > 0 &&
        !opts.ignoreRanges.every((arr) => Array.isArray(arr))) {
        throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");
    }
    // if reached this far, traverse and slice accordingly
    let nonWhitespaceSubStringStartsAt = null;
    const res = [];
    for (let i = 0, len = str.length; i < len; i++) {
        // catch the first non-whitespace character
        if (nonWhitespaceSubStringStartsAt === null &&
            str[i].trim() &&
            (!opts ||
                !opts.ignoreRanges ||
                !opts.ignoreRanges.length ||
                (opts.ignoreRanges.length &&
                    !isIndexWithin(i, opts.ignoreRanges.map((arr) => [arr[0], arr[1] - 1]), {
                        inclusiveRangeEnds: true,
                    })))) {
            nonWhitespaceSubStringStartsAt = i;
        }
        // catch the first whitespace char when recording substring
        if (nonWhitespaceSubStringStartsAt !== null) {
            if (!str[i].trim()) {
                res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
                nonWhitespaceSubStringStartsAt = null;
            }
            else if (opts.ignoreRanges.length &&
                isIndexWithin(i, opts.ignoreRanges)) {
                res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
                nonWhitespaceSubStringStartsAt = null;
            }
            else if (str[i + 1] === undefined) {
                res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
            }
        }
    }
    return res;
}

exports.splitByW = splitByW;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
