/**
 * email-all-chars-within-ascii
 * Scans all characters within a string and checks are they within ASCII range
 * Version: 3.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/email-all-chars-within-ascii/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.emailAllCharsWithinAscii = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "3.0.12";

const version = version$1;
const defaults = {
    lineLength: 500,
};
function within(str, originalOpts) {
    if (typeof str !== "string") {
        throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
    }
    if (originalOpts && typeof originalOpts !== "object") {
        throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
    }
    // quick ending
    if (!str.length) {
        return [];
    }
    // set the options
    const opts = { ...defaults, ...originalOpts };
    // -----------------------------------------------------------------------------
    // max line length will be measured against it:
    let column = 0;
    // current row number
    let currLine = 1;
    // what to return
    const res = [];
    for (let i = 0, len = str.length; i <= len; i++) {
        //
        // top clauses
        // -----------------------------------------------------------------------------
        // check the line length
        // =====================
        if (opts.lineLength &&
            (!str[i] || str[i] === "\r" || str[i] === "\n") &&
            column > opts.lineLength) {
            res.push({
                type: "line length",
                line: currLine,
                column: column,
                positionIdx: i,
                value: column,
            });
        }
        // count chars per line
        // ====================
        if (str[i] === "\r" || str[i] === "\n") {
            // 2. reset per-line char counter
            column = 0;
            // 3. count line breaks, minding the CRLF
            if (str[i] === "\n" || str[i + 1] !== "\n") {
                currLine += 1;
            }
        }
        else {
            column += 1;
        }
        //
        // middle clauses
        // -----------------------------------------------------------------------------
        // logging
        // =======
        // track non-ASCII
        // ===============
        // allowed ASCII control characters:
        //
        // #9  - HT, horizontal tab
        // #10 - LF, new line
        // #13 - CR, carriage return
        //
        // the rest, below decimal point #32 are not allowed
        // Naturally, above #126 is not allowed. This concerns #127, DEL too!
        if (str[i]) {
            const currCodePoint = str[i].codePointAt(0);
            if (currCodePoint === undefined ||
                currCodePoint > 126 ||
                currCodePoint < 9 ||
                currCodePoint === 11 ||
                currCodePoint === 12 ||
                (currCodePoint > 13 && currCodePoint < 32)) {
                res.push({
                    type: "character",
                    line: currLine,
                    column,
                    positionIdx: i,
                    value: str[i],
                    codePoint: currCodePoint,
                    UTF32Hex: str[i]
                        .charCodeAt(0)
                        .toString(16)
                        .padStart(4, "0")
                        .toLowerCase(),
                });
            }
        }
        //
        // bottom clauses
        // -----------------------------------------------------------------------------
    }
    return res;
}

exports.defaults = defaults;
exports.version = version;
exports.within = within;

Object.defineProperty(exports, '__esModule', { value: true });

})));
