/**
 * @name ranges-offset
 * @fileoverview Increment or decrement each index in every range
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-offset/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesOffset = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.14";

const version = version$1;
function rOffset(arrOfRanges, offset = 0) {
    // empty Ranges are null!
    if (Array.isArray(arrOfRanges) && arrOfRanges.length) {
        return arrOfRanges.map(([...elem]) => {
            if (typeof elem[0] === "number") {
                elem[0] += offset;
            }
            if (typeof elem[1] === "number") {
                elem[1] += offset;
            }
            return [...elem];
        });
    }
    return arrOfRanges;
}

exports.rOffset = rOffset;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
