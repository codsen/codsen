/**
 * @name string-trim-spaces-only
 * @fileoverview Like String.trim() but you can choose granularly what to trim
 * @version 3.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-trim-spaces-only/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringTrimSpacesOnly = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "3.1.0";

const version = version$1;
const defaults = {
    classicTrim: false,
    cr: false,
    lf: false,
    tab: false,
    space: true,
    nbsp: false,
};
function trimSpaces(str, originalOpts) {
    // insurance:
    if (typeof str !== "string") {
        throw new Error(`string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`);
    }
    // opts preparation:
    const opts = { ...defaults, ...originalOpts };
    function check(char) {
        return ((opts.classicTrim && !char.trim()) ||
            (!opts.classicTrim &&
                ((opts.space && char === " ") ||
                    (opts.cr && char === "\r") ||
                    (opts.lf && char === "\n") ||
                    (opts.tab && char === "\t") ||
                    (opts.nbsp && char === "\u00a0"))));
    }
    // action:
    let newStart;
    let newEnd;
    if (str.length) {
        if (check(str[0])) {
            for (let i = 0, len = str.length; i < len; i++) {
                if (!check(str[i])) {
                    newStart = i;
                    break;
                }
                // if we traversed the whole string this way and didn't stumble on a non-
                // space/whitespace character (depending on opts.classicTrim), this means
                // whole thing can be trimmed:
                if (i === str.length - 1) {
                    // this means there are only spaces/whitespace from beginning to the end
                    return {
                        res: "",
                        ranges: [[0, str.length]],
                    };
                }
            }
        }
        // if we reached this far, check the last character - find out, is it worth
        // trimming the end of the given string:
        if (check(str[str.length - 1])) {
            for (let i = str.length; i--;) {
                if (!check(str[i])) {
                    newEnd = i + 1;
                    break;
                }
            }
        }
        if (newStart) {
            if (newEnd) {
                return {
                    res: str.slice(newStart, newEnd),
                    ranges: [
                        [0, newStart],
                        [newEnd, str.length],
                    ],
                };
            }
            return {
                res: str.slice(newStart),
                ranges: [[0, newStart]],
            };
        }
        if (newEnd) {
            return {
                res: str.slice(0, newEnd),
                ranges: [[newEnd, str.length]],
            };
        }
        // if we reached this far, there was nothing to trim:
        return {
            res: str,
            ranges: [],
        };
    }
    // if we reached this far, this means it's an empty string. In which case,
    // return empty values:
    return {
        res: "",
        ranges: [],
    };
}

exports.defaults = defaults;
exports.trimSpaces = trimSpaces;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
