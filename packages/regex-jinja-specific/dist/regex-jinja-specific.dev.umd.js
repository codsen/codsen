/**
 * regex-jinja-specific
 * Regular expression for detecting Python-specific Jinja code
 * Version: 2.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-jinja-specific/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.regexJinjaSpecific = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.13";

const version = version$1;
function isJinjaSpecific() {
    return /(set\s*[\w]+\s*=\s*namespace\()|({{['"][\w]+['"]\s+if)|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi;
}

exports.isJinjaSpecific = isJinjaSpecific;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
