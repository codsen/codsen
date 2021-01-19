/**
 * regex-jinja-specific
 * Regular expression for detecting Python-specific Jinja code
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-jinja-specific/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.regexJinjaSpecific = {}));
}(this, (function (exports) { 'use strict';

var version = "1.0.1";

var version$1 = version;

function isJinjaSpecific() {
  return /(set\s*[\w]+\s*=\s*namespace\()|({{['"][\w]+['"]\s+if)|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi;
}

exports.isJinjaSpecific = isJinjaSpecific;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
