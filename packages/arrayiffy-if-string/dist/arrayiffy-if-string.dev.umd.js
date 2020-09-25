/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.11.37
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.arrayiffyIfString = factory());
}(this, (function () { 'use strict';

  // If a string is given, put it into an array. Bypass everything else.
  function arrayiffyString(something) {
    if (typeof something === "string") {
      if (something.length > 0) {
        return [something];
      }

      return [];
    }

    return something;
  }

  return arrayiffyString;

})));
