/**
 * @name is-char-suitable-for-html-attr-name
 * @fileoverview Is given character suitable to be in an HTML attribute's name?
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/is-char-suitable-for-html-attr-name/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.isCharSuitableForHtmlAttrName = {}));
}(this, (function (exports) { 'use strict';

// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
function isAttrNameChar(char) {
    return (typeof char === "string" &&
        //
        // lowercase letters, indexes 97 - 122:
        ((char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123) ||
            // uppercase letters, indexes 65 - 90
            (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
            // digits 0 - 9, indexes 48 - 57
            (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) ||
            char === ":" ||
            char === "-"));
}

exports.isAttrNameChar = isAttrNameChar;

Object.defineProperty(exports, '__esModule', { value: true });

})));
