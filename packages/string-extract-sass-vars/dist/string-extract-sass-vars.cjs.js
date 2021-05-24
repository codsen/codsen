/**
 * @name string-extract-sass-vars
 * @fileoverview Parse SASS variables file into a plain object of CSS key-value pairs
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-extract-sass-vars/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "2.1.0";

var version = version$1;
var BACKSLASH = "\\";
var defaults = {
  throwIfEmpty: false,
  cb: null
};
function extractVars(str, originalOpts) {
  if (typeof str !== "string") {
    return {};
  }
  if (originalOpts && _typeof__default['default'](originalOpts) !== "object") {
    throw new Error("string-extract-sass-vars: [THROW_ID_01] the second input argument should be a plain object but it was given as ".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof__default['default'](originalOpts), ")"));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.cb && typeof opts.cb !== "function") {
    throw new Error("string-extract-sass-vars: [THROW_ID_02] opts.cb should be function! But it was given as ".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof__default['default'](originalOpts), ")"));
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
      varValue = str.slice(!"\"'".includes(str[varValueStartsAt]) ? varValueStartsAt : varValueStartsAt + 1, (lastNonQuoteCharAt || 0) + 1);
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

exports.defaults = defaults;
exports.extractVars = extractVars;
exports.version = version;
