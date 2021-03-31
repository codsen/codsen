/**
 * string-extract-sass-vars
 * Parse SASS variables file into a plain object of CSS key-value pairs
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-sass-vars/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringExtractSassVars = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.12";

const version = version$1;
// Takes string, SASS variables file and extracts the plain object of variables: key-value pairs
// As a bonus, it turns digit-only value strings into numbers.
const BACKSLASH = "\u005C";
const defaults = {
    throwIfEmpty: false,
    cb: null,
};
function extractVars(str, originalOpts) {
    if (typeof str !== "string") {
        return {};
    }
    if (originalOpts && typeof originalOpts !== "object") {
        throw new Error(`string-extract-sass-vars: [THROW_ID_01] the second input argument should be a plain object but it was given as ${JSON.stringify(originalOpts, null, 4)} (type ${typeof originalOpts})`);
    }
    const opts = { ...defaults, ...originalOpts };
    if (opts.cb && typeof opts.cb !== "function") {
        throw new Error(`string-extract-sass-vars: [THROW_ID_02] opts.cb should be function! But it was given as ${JSON.stringify(originalOpts, null, 4)} (type ${typeof originalOpts})`);
    }
    const len = str.length;
    let varNameStartsAt = null;
    let varValueStartsAt = null;
    let varName = null;
    let varValue = null;
    let withinQuotes = null;
    let lastNonQuoteCharAt = null;
    let withinComments = false;
    let withinSlashSlashComment = false;
    let withinSlashAsteriskComment = false;
    const res = {};
    for (let i = 0; i < len; i++) {
        //
        //
        //
        //
        //                                THE TOP
        //                                ███████
        //
        //
        // end the state of being within quotes
        if (!withinComments &&
            withinQuotes &&
            str[i] === withinQuotes &&
            str[i - 1] !== BACKSLASH) {
            withinQuotes = null;
        }
        // catch the state of being within quotes
        else if (!withinQuotes &&
            !withinComments &&
            str[i - 1] !== BACKSLASH &&
            `'"`.includes(str[i])) {
            withinQuotes = str[i];
        }
        // catch ending of withinSlashSlashComment
        if (withinSlashSlashComment && `\r\n`.includes(str[i])) {
            withinSlashSlashComment = false;
        }
        // catch a start of slashslash comments block
        if (!withinComments && str[i] === "/" && str[i + 1] === "/") {
            withinSlashSlashComment = true;
        }
        // catch the ending of slash astrisk comments block
        if (withinSlashAsteriskComment &&
            str[i - 2] === "*" &&
            str[i - 1] === "/") {
            withinSlashAsteriskComment = false;
        }
        // catch a start of slash astrisk comments block
        // withinSlashAsteriskComment
        if (!withinComments && str[i] === "/" && str[i + 1] === "*") {
            withinSlashAsteriskComment = true;
        }
        // "within various comments" states aggregator
        withinComments = withinSlashSlashComment || withinSlashAsteriskComment;
        // Logging:
        // -------------------------------------------------------------------------
        //
        //
        //
        //
        //                              THE MIDDLE
        //                              ██████████
        //
        //
        //
        //
        // catch the beginning of the var name
        // -----------------------------------------------------------------------------
        if (!withinComments && str[i] === "$" && varNameStartsAt === null) {
            varNameStartsAt = i + 1;
        }
        // catch the ending of a value
        // -----------------------------------------------------------------------------
        if (!withinComments &&
            varValueStartsAt !== null &&
            !withinQuotes &&
            str[i] === ";") {
            varValue = str.slice(!`"'`.includes(str[varValueStartsAt])
                ? varValueStartsAt
                : varValueStartsAt + 1, (lastNonQuoteCharAt || 0) + 1);
            if (/^-?\d*\.?\d*$/.test(varValue)) {
                varValue = +varValue;
            }
            // if the callback has been given, run the value past it:
            res[varName] = opts.cb ? opts.cb(varValue) : varValue;
            varNameStartsAt = null;
            varValueStartsAt = null;
            varName = null;
            varValue = null;
        }
        // catch the beginning of a value
        // -----------------------------------------------------------------------------
        if (!withinComments &&
            varName !== null &&
            str[i] &&
            str[i].trim().length &&
            varValueStartsAt === null) {
            varValueStartsAt = i;
        }
        // catch the ending of the var name
        // -----------------------------------------------------------------------------
        if (!withinComments &&
            !varName &&
            varNameStartsAt !== null &&
            str[i] === ":" &&
            !withinQuotes) {
            varName = str.slice(varNameStartsAt, i);
        }
        //
        //
        //
        //
        //                              THE BOTTOM
        //                              ██████████
        //
        //
        //
        //
        if (!`'"`.includes(str[i])) {
            lastNonQuoteCharAt = i;
        }
        // LOGGING:
    }
    // opts.throwIfEmpty
    if (!Object.keys(res).length && opts.throwIfEmpty) {
        throw new Error(`string-extract-sass-vars: [THROW_ID_03] no keys extracted! (setting opts.originalOpts)`);
    }
    return res;
}

exports.defaults = defaults;
exports.extractVars = extractVars;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
