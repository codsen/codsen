/**
 * @name regex-is-jinja-nunjucks
 * @fileoverview Regular expression for detecting Jinja or Nunjucks code
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jinja-nunjucks/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.regexIsJinjaNunjucks = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.1.0";

const version = version$1;
function isJinjaNunjucksRegex() {
    return /{%|{{|%}|}}/gi;
}

exports.isJinjaNunjucksRegex = isJinjaNunjucksRegex;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
