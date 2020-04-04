/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 2.8.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-trim-spaces-only
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.stringTrimSpacesOnly = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function trimSpaces(s, originalOpts) {
    // insurance:
    if (typeof s !== "string") {
      throw new Error("string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ".concat(_typeof(s), ", equal to:\n").concat(JSON.stringify(s, null, 4)));
    } // opts preparation:


    var defaults = {
      classicTrim: false,
      cr: false,
      lf: false,
      tab: false,
      space: true,
      nbsp: false
    };
    var opts = Object.assign({}, defaults, originalOpts);

    function check(_char) {
      return opts.classicTrim && _char.trim().length === 0 || !opts.classicTrim && (opts.space && _char === " " || opts.cr && _char === "\r" || opts.lf && _char === "\n" || opts.tab && _char === "\t" || opts.nbsp && _char === "\xA0");
    } // action:


    var newStart;
    var newEnd;

    if (s.length > 0) {
      if (check(s[0])) {
        for (var i = 0, len = s.length; i < len; i++) {
          if (!check(s[i])) {
            newStart = i;
            break;
          } // if we traversed the whole string this way and didn't stumble on a non-
          // space/whitespace character (depending on opts.classicTrim), this means
          // whole thing can be trimmed:


          if (i === s.length - 1) {
            // this means there are only spaces/whitespace from beginning to the end
            return {
              res: "",
              ranges: [[0, s.length]]
            };
          }
        }
      } // if we reached this far, check the last character - find out, is it worth
      // trimming the end of the given string:


      if (check(s[s.length - 1])) {
        for (var _i = s.length; _i--;) {
          if (!check(s[_i])) {
            newEnd = _i + 1;
            break;
          }
        }
      }

      if (newStart) {
        if (newEnd) {
          return {
            res: s.slice(newStart, newEnd),
            ranges: [[0, newStart], [newEnd, s.length]]
          };
        }

        return {
          res: s.slice(newStart),
          ranges: [[0, newStart]]
        };
      }

      if (newEnd) {
        return {
          res: s.slice(0, newEnd),
          ranges: [[newEnd, s.length]]
        };
      } // if we reached this far, there was nothing to trim:


      return {
        res: s,
        // return original string. No need to clone because it's string.
        ranges: []
      };
    } // if we reached this far, this means it's an empty string. In which case,
    // return empty values:


    return {
      res: "",
      ranges: []
    };
  }

  return trimSpaces;

})));
