/**
 * @name string-overlap-one-on-another
 * @fileoverview Lay one string on top of another, with an optional offset
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-overlap-one-on-another/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringOverlapOneOnAnother = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.13";

const version = version$1;
const defaults = {
    offset: 0,
    offsetFillerCharacter: " ", // how many characters str2 is to the right? (negative means it's off to the left)
};
function overlap(str1, str2, originalOpts) {
    if (typeof str1 !== "string") {
        throw new Error(`string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as ${JSON.stringify(str1, null, 4)}, which is type "${typeof str1}"`);
    }
    if (typeof str2 !== "string") {
        throw new Error(`string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as ${JSON.stringify(str2, null, 4)}, which is type "${typeof str2}"`);
    }
    let opts;
    if (!originalOpts) {
        // it's fine because we won't overwrite opts:
        opts = defaults;
    }
    else if (typeof originalOpts !== "object") {
        throw new Error(`string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ${JSON.stringify(str2, null, 4)}, which is type "${typeof originalOpts}"`);
    }
    else {
        opts = { ...defaults, ...originalOpts };
        if (!opts.offset) {
            opts.offset = 0;
        }
        else if (!Number.isInteger(Math.abs(opts.offset))) {
            throw new Error(`string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ${JSON.stringify(str2, null, 4)}, which is type "${typeof str2}"`);
        }
        if (!opts.offsetFillerCharacter && opts.offsetFillerCharacter !== "") {
            opts.offsetFillerCharacter = " ";
        }
    }
    if (str2.length === 0) {
        return str1;
    }
    if (str1.length === 0) {
        return str2;
    }
    if (opts.offset < 0) {
        // filler character sequence - space or opts.offsetFillerCharacter:
        const part2 = Math.abs(opts.offset) > str2.length
            ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str2.length)
            : "";
        // the reset of str1 string protruding from underneath, if any:
        const part3 = str1.slice(str2.length - Math.abs(opts.offset) > 0
            ? str2.length - Math.abs(opts.offset)
            : 0);
        return str2 + part2 + part3;
    }
    if (opts.offset > 0) {
        // filler character sequence, if any, the space or opts.offsetFillerCharacter:
        const par1 = str1.slice(0, opts.offset) +
            (opts.offset > str1.length
                ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str1.length)
                : "");
        // the rest of str1 string, if applicable:
        const part2 = str1.length - opts.offset - str2.length > 0
            ? str1.slice(str1.length - opts.offset - str2.length + 1)
            : "";
        return par1 + str2 + part2;
    }
    return str2 + (str1.length > str2.length ? str1.slice(str2.length) : "");
}

exports.overlap = overlap;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
