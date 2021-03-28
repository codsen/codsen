/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.3.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.astMonkeyUtil = {}));
}(this, (function (exports) { 'use strict';

// bumps the last chunk in the string path from:
// 9.children.3
// to
// 9.children.4
// the path notation is object-path
function pathNext(str) {
    if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
        return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) + 1}`;
    }
    if (/^\d*$/.test(str)) {
        return `${+str + 1}`;
    }
    return str;
}

// decrements the last chunk in the string path from:
// 9.children.3
// to
// 9.children.2
// the path notation is object-path
function pathPrev(str) {
    if (!str) {
        return null;
    }
    const extractedValue = str.slice(str.lastIndexOf(".") + 1);
    if (extractedValue === "0") {
        return null;
    }
    if (str.includes(".") && /^\d*$/.test(extractedValue)) {
        return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) - 1}`;
    }
    if (/^\d*$/.test(str)) {
        return `${+str - 1}`;
    }
    return null;
}

function pathUp(str) {
    // input must have at least two dots:
    if (str.includes(".") && str.slice(str.indexOf(".") + 1).includes(".")) {
        // go up, for example, from "a.children.2" to "a"
        let dotsCount = 0;
        for (let i = str.length; i--;) {
            // console.log(`010 str[${i}] = ${str[i]}`);
            if (str[i] === ".") {
                dotsCount += 1;
            }
            if (dotsCount === 2) {
                return str.slice(0, i);
            }
        }
    }
    // zero is the root level's first element
    return "0";
}

// calulate parent key, for example,
// "a" => null
// "0" => null
// "a.b" => "a"
// "a.0" => "a"
// "a.0.c" => "0"
function parent(str) {
    // input must have at least one dot:
    if (str.includes(".")) {
        const lastDotAt = str.lastIndexOf(".");
        if (!str.slice(0, lastDotAt).includes(".")) {
            return str.slice(0, lastDotAt);
        }
        for (let i = lastDotAt - 1; i--;) {
            if (str[i] === ".") {
                return str.slice(i + 1, lastDotAt);
            }
        }
    }
    return null;
}

var version$1 = "1.3.11";

const version = version$1;

exports.parent = parent;
exports.pathNext = pathNext;
exports.pathPrev = pathPrev;
exports.pathUp = pathUp;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
