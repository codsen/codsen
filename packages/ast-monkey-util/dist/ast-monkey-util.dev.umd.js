/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.1.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.astMonkeyUtil = {}));
}(this, (function (exports) { 'use strict';

  // bumps the last chunk in the string path from:
  // 9.children.3
  // to
  // 9.children.4
  // the path notation is object-path
  function pathNext(str) {
    if (typeof str !== "string" || !str.length) {
      return str;
    }

    if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
      return "".concat(str.slice(0, str.lastIndexOf(".") + 1)).concat(+str.slice(str.lastIndexOf(".") + 1) + 1);
    }

    if (/^\d*$/.test(str)) {
      return "".concat(+str + 1);
    }

    return str;
  }

  // decrements the last chunk in the string path from:
  // 9.children.3
  // to
  // 9.children.2
  // the path notation is object-path
  function pathPrev(str) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    var extractedValue = str.slice(str.lastIndexOf(".") + 1);

    if (extractedValue === "0") {
      return null;
    }

    if (str.includes(".") && /^\d*$/.test(extractedValue)) {
      return "".concat(str.slice(0, str.lastIndexOf(".") + 1)).concat(+str.slice(str.lastIndexOf(".") + 1) - 1);
    }

    if (/^\d*$/.test(str)) {
      return "".concat(+str - 1);
    }

    return null;
  }

  function pathUp(str) {
    if (typeof str === "string") {
      // input must have at least two dots:
      if (!str.includes(".") || !str.slice(str.indexOf(".") + 1).includes(".")) {
        // zero is the root level's first element
        return "0";
      } // go up, for example, from "a.children.2" to "a"


      var dotsCount = 0;

      for (var i = str.length; i--;) {
        // console.log(`010 str[${i}] = ${str[i]}`);
        if (str[i] === ".") {
          dotsCount += 1;
        }

        if (dotsCount === 2) {
          return str.slice(0, i);
        }
      }
    }

    return str;
  }

  exports.pathNext = pathNext;
  exports.pathPrev = pathPrev;
  exports.pathUp = pathUp;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
