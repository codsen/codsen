/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.12.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arrayiffyIfString = {}));
}(this, (function (exports) { 'use strict';

// If a string is given, put it into an array. Bypass everything else.
function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length > 0) {
      return [something];
    }

    return [];
  }

  return something;
}

exports.arrayiffy = arrayiffy;

Object.defineProperty(exports, '__esModule', { value: true });

})));
