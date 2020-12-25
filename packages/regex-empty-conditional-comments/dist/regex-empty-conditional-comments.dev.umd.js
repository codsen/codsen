/**
 * regex-empty-conditional-comments
 * Regular expression for matching HTML empty conditional comments
 * Version: 1.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-empty-conditional-comments/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.regexEmptyConditionalComments = {}));
}(this, (function (exports) { 'use strict';

var version = "1.9.1";

function emptyCondCommentRegex() {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

exports.emptyCondCommentRegex = emptyCondCommentRegex;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
