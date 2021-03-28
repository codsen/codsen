/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.13.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arrayiffyIfString = {}));
}(this, (function (exports) { 'use strict';

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
function arrayiffy(something) {
    if (typeof something === "string") {
        if (something.length) {
            return [something];
        }
        return [];
    }
    return something;
}

exports.arrayiffy = arrayiffy;

Object.defineProperty(exports, '__esModule', { value: true });

})));
