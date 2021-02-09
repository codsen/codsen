/**
 * regex-is-jinja-nunjucks
 * Regular expression for detecting Jinja or Nunjucks code
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jinja-nunjucks/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.regexIsJinjaNunjucks = {}));
}(this, (function (exports) { 'use strict';

var version = "2.0.3";

var version$1 = version;

function isJinjaNunjucksRegex() {
  return /{%|{{|%}|}}/gi;
}

exports.isJinjaNunjucksRegex = isJinjaNunjucksRegex;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
