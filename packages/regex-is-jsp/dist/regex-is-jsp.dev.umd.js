/**
 * @name regex-is-jsp
 * @fileoverview Regular expression for detecting JSP (Java Server Pages) code
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jsp/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.regexIsJsp = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.13";

const version = version$1;
function isJSP() {
    return /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;
}

exports.isJSP = isJSP;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
