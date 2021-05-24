/**
 * @name regex-empty-conditional-comments
 * @fileoverview Regular expression for matching HTML empty conditional comments
 * @version 1.11.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-empty-conditional-comments/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.regexEmptyConditionalComments = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "1.11.0";

const version = version$1;
function emptyCondCommentRegex() {
    return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

exports.emptyCondCommentRegex = emptyCondCommentRegex;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
