/**
 * @name helga
 * @fileoverview Your next best friend when editing complex nested code
 * @version 1.4.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/helga/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.helga = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "1.4.0";

const version = version$1;
const defaults = {
    targetJSON: false,
};
const escapes = {
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "\t",
    v: "\v",
    "'": "'",
    '"': '"',
    "\\": "\\",
    "0": "\0",
};
function unescape(str) {
    return str.replace(/\\([bfnrtv'"\\0])/g, (match) => {
        return (escapes[match] ||
            (match && (match.startsWith(`\\`) ? escapes[match.slice(1)] : "")));
    });
}
function helga(str, originalOpts) {
    const opts = { ...defaults, ...originalOpts };
    // console.log(
    //   `011 using ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
    //     opts,
    //     null,
    //     4
    //   )}`
    // );
    // 1. beautification:
    // ---------------------------------------------------------------------------
    const beautified = unescape(str);
    // 2. minification:
    // ---------------------------------------------------------------------------
    let minified = unescape(str);
    if (opts.targetJSON) {
        // if target is JSON, replace all tabs with two spaces, then JSON stringify
        minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0);
        // remove wrapper quotes
        minified = minified.slice(1, minified.length - 1);
    }
    // ---------------------------------------------------------------------------
    return {
        minified,
        beautified,
    };
}

exports.defaults = defaults;
exports.helga = helga;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
