/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.3.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function pathNext(str) {
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return "" + str.slice(0, str.lastIndexOf(".") + 1) + (+str.slice(str.lastIndexOf(".") + 1) + 1);
  }
  if (/^\d*$/.test(str)) {
    return "" + (+str + 1);
  }
  return str;
}

function pathPrev(str) {
  if (!str) {
    return null;
  }
  var extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  }
  if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return "" + str.slice(0, str.lastIndexOf(".") + 1) + (+str.slice(str.lastIndexOf(".") + 1) - 1);
  }
  if (/^\d*$/.test(str)) {
    return "" + (+str - 1);
  }
  return null;
}

function pathUp(str) {
  if (str.includes(".") && str.slice(str.indexOf(".") + 1).includes(".")) {
    var dotsCount = 0;
    for (var i = str.length; i--;) {
      if (str[i] === ".") {
        dotsCount += 1;
      }
      if (dotsCount === 2) {
        return str.slice(0, i);
      }
    }
  }
  return "0";
}

function parent(str) {
  if (str.includes(".")) {
    var lastDotAt = str.lastIndexOf(".");
    if (!str.slice(0, lastDotAt).includes(".")) {
      return str.slice(0, lastDotAt);
    }
    for (var i = lastDotAt - 1; i--;) {
      if (str[i] === ".") {
        return str.slice(i + 1, lastDotAt);
      }
    }
  }
  return null;
}

var version$1 = "1.3.11";

var version = version$1;

exports.parent = parent;
exports.pathNext = pathNext;
exports.pathPrev = pathPrev;
exports.pathUp = pathUp;
exports.version = version;
