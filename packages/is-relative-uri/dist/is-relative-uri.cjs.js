/**
 * is-relative-uri
 * Is given string a relative URI?
 * Version: 0.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-relative-uri
 */

'use strict';

function _typeof(obj) {
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

var BACKSLASH = "\\";
function isRel(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("is-relative-uri: [THROW_ID_01] input string must be string, it was given as \"".concat(str, "\" (type ").concat(_typeof(str), ")"));
  }
  if (originalOpts && _typeof(originalOpts) !== "object") {
    throw new Error("is-relative-uri: [THROW_ID_02] opts be plain object, it was given as ".concat(originalOpts, " (type ").concat(_typeof(originalOpts), ")"));
  }
  var defaults = {
    offset: 0
  };
  var opts;
  if (originalOpts) {
    opts = Object.assign({}, defaults, originalOpts);
  } else {
    opts = Object.assign({}, defaults);
  }
  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error("is-relative-uri: [THROW_ID_02] opts.offset must be an integer, it was given as ".concat(opts.offset, " (type ").concat(_typeof(opts.offset), ")"));
  }
  if (!opts.offset) {
    opts.offset = 0;
  }
  if (str.split("").some(function (_char) {
    return !_char.trim().length;
  })) {
    return {
      res: false,
      message: "Remove whitespace."
    };
  }
  if (str.match(/\/\s*\/\s*\//g)) {
    return {
      res: false,
      message: "Three consecutive slashes found."
    };
  }
  if (str.match(/.\/\s*\//g)) {
    return {
      res: false,
      message: "Two consecutive slashes surrounded by other characters."
    };
  }
  if (str.match(/\.\.\./g)) {
    return {
      res: false,
      message: "Three consecutive dots."
    };
  }
  if (str.includes("%") && !str.match(/%[0-9a-f]/gi)) {
    return {
      res: false,
      message: "Unescaped \"%\" character."
    };
  }
  if (str.includes("<")) {
    return {
      res: false,
      message: "Unescaped \"<\" character."
    };
  }
  if (str.includes(">")) {
    return {
      res: false,
      message: "Unescaped \">\" character."
    };
  }
  if (str.includes("[")) {
    return {
      res: false,
      message: "Unescaped \"[\" character."
    };
  }
  if (str.includes("]")) {
    return {
      res: false,
      message: "Unescaped \"]\" character."
    };
  }
  if (str.includes("{")) {
    return {
      res: false,
      message: "Unescaped \"{\" character."
    };
  }
  if (str.includes("}")) {
    return {
      res: false,
      message: "Unescaped \"}\" character."
    };
  }
  if (str.includes("|")) {
    return {
      res: false,
      message: "Unescaped \"|\" character."
    };
  }
  if (str.includes(BACKSLASH)) {
    return {
      res: false,
      message: "Unescaped backslash (".concat(BACKSLASH, ") character.")
    };
  }
  if (str.includes("^")) {
    return {
      res: false,
      message: "Unescaped caret (^) character."
    };
  }
  if (str.endsWith(".") && !str.startsWith(".")) {
    return {
      res: false,
      message: "Ends with dot, is file extension missing?"
    };
  }
  if (str.includes("??")) {
    return {
      res: false,
      message: "Two consecutive question marks."
    };
  }
  return {
    res: true,
    message: null
  };
}

module.exports = isRel;
