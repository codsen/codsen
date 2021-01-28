/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.3.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/helga/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.helga = {}));
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

var version = "1.3.1";

var version$1 = version;
var defaults = {
  targetJSON: false
};
var escapes = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  v: "\v",
  "'": "'",
  '"': '"',
  "\\": "\\",
  "0": "\0"
};

function unescape(str) {
  return str.replace(/\\([bfnrtv'"\\0])/g, function (match) {
    return escapes[match] || match && (match.startsWith("\\") ? escapes[match.slice(1)] : "");
  });
}

function helga(str, originalOpts) {
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // console.log(
  //   `011 using ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );
  // 1. beautification:
  // ---------------------------------------------------------------------------


  var beautified = unescape(str); // 2. minification:
  // ---------------------------------------------------------------------------

  var minified = unescape(str);

  if (opts.targetJSON) {
    // if target is JSON, replace all tabs with two spaces, then JSON stringify
    minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0); // remove wrapper quotes

    minified = minified.slice(1, minified.length - 1);
  } // ---------------------------------------------------------------------------


  return {
    minified: minified,
    beautified: beautified
  };
}

exports.defaults = defaults;
exports.helga = helga;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
