/**
 * @name ranges-sort
 * @fileoverview Sort string index ranges
 * @version 4.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-sort/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesSort = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "4.1.0";

const version = version$1;
const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    progressFn: null,
};
function rSort(arrOfRanges, originalOptions) {
    // quick ending
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
        return arrOfRanges;
    }
    // fill any settings with defaults if missing:
    const opts = { ...defaults, ...originalOptions };
    // arrOfRanges validation
    let culpritsIndex;
    let culpritsLen;
    // validate does every range consist of exactly two indexes:
    if (opts.strictlyTwoElementsInRangeArrays &&
        !arrOfRanges
            .filter((range) => range)
            .every((rangeArr, indx) => {
            if (rangeArr.length !== 2) {
                culpritsIndex = indx;
                culpritsLen = rangeArr.length;
                return false;
            }
            return true;
        })) {
        throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) has not two but ${culpritsLen} elements!`);
    }
    // validate are range indexes natural numbers:
    if (!arrOfRanges
        .filter((range) => range)
        .every((rangeArr, indx) => {
        if (!Number.isInteger(rangeArr[0]) ||
            rangeArr[0] < 0 ||
            !Number.isInteger(rangeArr[1]) ||
            rangeArr[1] < 0) {
            culpritsIndex = indx;
            return false;
        }
        return true;
    })) {
        throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) does not consist of only natural numbers!`);
    }
    // let's assume worst case scenario is N x N.
    const maxPossibleIterations = arrOfRanges.filter((range) => range).length ** 2;
    let counter = 0;
    return Array.from(arrOfRanges)
        .filter((range) => range)
        .sort((range1, range2) => {
        if (opts.progressFn) {
            counter += 1;
            opts.progressFn(Math.floor((counter * 100) / maxPossibleIterations));
        }
        if (range1[0] === range2[0]) {
            if (range1[1] < range2[1]) {
                return -1;
            }
            if (range1[1] > range2[1]) {
                return 1;
            }
            return 0;
        }
        if (range1[0] < range2[0]) {
            return -1;
        }
        return 1;
    });
}

exports.defaults = defaults;
exports.rSort = rSort;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
