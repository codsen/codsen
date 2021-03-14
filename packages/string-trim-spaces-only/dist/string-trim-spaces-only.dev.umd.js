/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 3.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-trim-spaces-only/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringTrimSpacesOnly = {}));
}(this, (function (exports) { 'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var version$1 = "3.0.8";

var version = version$1;
var defaults = {
  classicTrim: false,
  cr: false,
  lf: false,
  tab: false,
  space: true,
  nbsp: false
};

function trimSpaces(str, originalOpts) {
  // insurance:
  if (typeof str !== "string") {
    throw new Error("string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as " + typeof str + ", equal to:\n" + JSON.stringify(str, null, 4));
  } // opts preparation:


  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  function check(char) {
    return opts.classicTrim && !char.trim() || !opts.classicTrim && (opts.space && char === " " || opts.cr && char === "\r" || opts.lf && char === "\n" || opts.tab && char === "\t" || opts.nbsp && char === "\xA0");
  } // action:


  var newStart;
  var newEnd;

  if (str.length) {
    if (check(str[0])) {

      for (var i = 0, len = str.length; i < len; i++) {

        if (!check(str[i])) {
          newStart = i;
          break;
        } // if we traversed the whole string this way and didn't stumble on a non-
        // space/whitespace character (depending on opts.classicTrim), this means
        // whole thing can be trimmed:


        if (i === str.length - 1) {
          // this means there are only spaces/whitespace from beginning to the end
          return {
            res: "",
            ranges: [[0, str.length]]
          };
        }
      }
    } // if we reached this far, check the last character - find out, is it worth
    // trimming the end of the given string:


    if (check(str[str.length - 1])) {

      for (var _i = str.length; _i--;) {

        if (!check(str[_i])) {
          newEnd = _i + 1;
          break;
        }
      }
    }

    if (newStart) {
      if (newEnd) {
        return {
          res: str.slice(newStart, newEnd),
          ranges: [[0, newStart], [newEnd, str.length]]
        };
      }
      return {
        res: str.slice(newStart),
        ranges: [[0, newStart]]
      };
    }

    if (newEnd) {
      return {
        res: str.slice(0, newEnd),
        ranges: [[newEnd, str.length]]
      };
    } // if we reached this far, there was nothing to trim:


    return {
      res: str,
      ranges: []
    };
  } // if we reached this far, this means it's an empty string. In which case,
  // return empty values:


  return {
    res: "",
    ranges: []
  };
}

exports.defaults = defaults;
exports.trimSpaces = trimSpaces;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
