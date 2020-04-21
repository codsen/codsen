/**
 * string-extract-sass-vars
 * Parse SASS variables file into a plain object of CSS key-value pairs
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-sass-vars
 */

'use strict';

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

var BACKSLASH = "\\";
function extractVars(str, originalOpts) {
  if (typeof str !== "string") {
    return {};
  }
  if (originalOpts && _typeof(originalOpts) !== "object") {
    throw new Error("string-extract-sass-vars: [THROW_ID_01] the second input argument should be a plain object but it was given as ".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
  }
  var defaults = {
    throwIfEmpty: false,
    cb: null
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.cb && typeof opts.cb !== "function") {
    throw new Error("string-extract-sass-vars: [THROW_ID_02] opts.cb should be function! But it was given as ".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
  }
  var len = str.length;
  var varNameStartsAt = null;
  var varValueStartsAt = null;
  var varName = null;
  var varValue = null;
  var withinQuotes = null;
  var lastNonQuoteCharAt = null;
  var withinComments = false;
  var withinSlashSlashComment = false;
  var withinSlashAsteriskComment = false;
  var res = {};
  for (var i = 0; i < len; i++) {
    if (!withinComments && withinQuotes && str[i] === withinQuotes && str[i - 1] !== BACKSLASH) {
      withinQuotes = null;
    }
    else if (!withinQuotes && !withinComments && str[i - 1] !== BACKSLASH && "'\"".includes(str[i])) {
        withinQuotes = str[i];
      }
    if (withinSlashSlashComment && "\r\n".includes(str[i])) {
      withinSlashSlashComment = false;
    }
    if (!withinComments && str[i] === "/" && str[i + 1] === "/") {
      withinSlashSlashComment = true;
    }
    if (withinSlashAsteriskComment && str[i - 2] === "*" && str[i - 1] === "/") {
      withinSlashAsteriskComment = false;
    }
    if (!withinComments && str[i] === "/" && str[i + 1] === "*") {
      withinSlashAsteriskComment = true;
    }
    withinComments = withinSlashSlashComment || withinSlashAsteriskComment;
    if (!withinComments && str[i] === "$" && varNameStartsAt === null) {
      varNameStartsAt = i + 1;
    }
    if (!withinComments && varValueStartsAt !== null && !withinQuotes && str[i] === ";") {
      varValue = str.slice(!"\"'".includes(str[varValueStartsAt]) ? varValueStartsAt : varValueStartsAt + 1, lastNonQuoteCharAt + 1);
      if (/^-?\d*\.?\d*$/.test(varValue)) {
        varValue = +varValue;
      }
      res[varName] = opts.cb ? opts.cb(varValue) : varValue;
      varNameStartsAt = null;
      varValueStartsAt = null;
      varName = null;
      varValue = null;
    }
    if (!withinComments && varName !== null && str[i] && str[i].trim().length && varValueStartsAt === null) {
      varValueStartsAt = i;
    }
    if (!withinComments && !varName && varNameStartsAt !== null && str[i] === ":" && !withinQuotes) {
      varName = str.slice(varNameStartsAt, i);
    }
    if (!"'\"".includes(str[i])) {
      lastNonQuoteCharAt = i;
    }
  }
  if (!Object.keys(res).length && opts.throwIfEmpty) {
    throw new Error("string-extract-sass-vars: [THROW_ID_03] no keys extracted! (setting opts.originalOpts)");
  }
  return res;
}

module.exports = extractVars;
