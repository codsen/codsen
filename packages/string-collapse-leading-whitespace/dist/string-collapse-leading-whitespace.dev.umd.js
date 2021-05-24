/**
 * @name string-collapse-leading-whitespace
 * @fileoverview Collapse the leading and trailing whitespace of a string
 * @version 5.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-collapse-leading-whitespace/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringCollapseLeadingWhitespace = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "5.1.0";

const version = version$1;
function collWhitespace(str, originallineBreakLimit = 1) {
    const rawNbsp = "\u00A0";
    // helpers
    function reverse(s) {
        return Array.from(s).reverse().join("");
    }
    // replaces the leading/trailing whitespace chunks with final strings
    function prep(whitespaceChunk, limit, trailing) {
        // when processing the leading whitespace, it's \n\r --- CR - LF
        // when processing the trailing whitespace, we're processing inverted order,
        // so it's \n\r --- LF - CR
        // for this reason, we set first and second linebreak according to direction,
        // the "trailing" boolean:
        const firstBreakChar = trailing ? "\n" : "\r";
        const secondBreakChar = trailing ? "\r" : "\n";
        if (!whitespaceChunk) {
            return whitespaceChunk;
        }
        let crlfCount = 0;
        let res = "";
        // let beginning = true;
        for (let i = 0, len = whitespaceChunk.length; i < len; i++) {
            if (whitespaceChunk[i] === firstBreakChar ||
                (whitespaceChunk[i] === secondBreakChar &&
                    whitespaceChunk[i - 1] !== firstBreakChar)) {
                crlfCount++;
            }
            if (`\r\n`.includes(whitespaceChunk[i]) ||
                whitespaceChunk[i] === rawNbsp) {
                if (whitespaceChunk[i] === rawNbsp) {
                    res += whitespaceChunk[i];
                }
                else if (whitespaceChunk[i] === firstBreakChar) {
                    if (crlfCount <= limit) {
                        res += whitespaceChunk[i];
                        if (whitespaceChunk[i + 1] === secondBreakChar) {
                            res += whitespaceChunk[i + 1];
                            i++;
                        }
                    }
                }
                else if (whitespaceChunk[i] === secondBreakChar &&
                    (!whitespaceChunk[i - 1] ||
                        whitespaceChunk[i - 1] !== firstBreakChar) &&
                    crlfCount <= limit) {
                    res += whitespaceChunk[i];
                }
            }
            else {
                if (!whitespaceChunk[i + 1] && !crlfCount) {
                    res += " ";
                }
            }
        }
        return res;
    }
    if (typeof str === "string" && str.length) {
        // without a fuss, set the max allowed line breaks as a leading/trailing whitespace:
        let lineBreakLimit = 1;
        if (typeof +originallineBreakLimit === "number" &&
            Number.isInteger(+originallineBreakLimit) &&
            +originallineBreakLimit >= 0) {
            lineBreakLimit = +originallineBreakLimit;
        }
        // plan: extract what would String.prototype() would remove, front and back parts
        let frontPart = "";
        let endPart = "";
        if (!str.trim()) {
            frontPart = str;
        }
        else if (!str[0].trim()) {
            for (let i = 0, len = str.length; i < len; i++) {
                if (str[i].trim()) {
                    frontPart = str.slice(0, i);
                    break;
                }
            }
        }
        // if whole string is whitespace, endPart is empty string
        if (str.trim() &&
            (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)) {
            for (let i = str.length; i--;) {
                // console.log(
                //   `${`\u001b[${36}m${`----------------------------------------------\niterating through: ${JSON.stringify(
                //     str[i],
                //     null,
                //     4
                //   )}`}\u001b[${39}m`}`
                // );
                if (str[i].trim()) {
                    endPart = str.slice(i + 1);
                    break;
                }
            }
        }
        // -------------------------------------------------------------------------
        return `${prep(frontPart, lineBreakLimit, false)}${str.trim()}${reverse(prep(reverse(endPart), lineBreakLimit, true))}`;
    }
    return str;
}

exports.collWhitespace = collWhitespace;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
