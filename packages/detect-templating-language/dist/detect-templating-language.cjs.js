/**
 * detect-templating-language
 * Detects various templating languages present in string
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-templating-language/
 */

'use strict';

var isJinjaNunjucksRegex = require('regex-is-jinja-nunjucks');
var isJSP = require('regex-is-jsp');
var isJinjaSpecific = require('regex-jinja-specific');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isJinjaNunjucksRegex__default = /*#__PURE__*/_interopDefaultLegacy(isJinjaNunjucksRegex);
var isJSP__default = /*#__PURE__*/_interopDefaultLegacy(isJSP);
var isJinjaSpecific__default = /*#__PURE__*/_interopDefaultLegacy(isJinjaSpecific);

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

function detectLang(str) {
  var name = null;
  if (typeof str !== "string") {
    throw new TypeError("detect-templating-language: [THROW_ID_01] Input must be string! It was given as ".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")."));
  }
  if (!str) {
    return {
      name: name
    };
  }
  if (isJinjaNunjucksRegex__default['default']().test(str)) {
    name = "Nunjucks";
    if (isJinjaSpecific__default['default']().test(str)) {
      name = "Jinja";
    }
  } else if (isJSP__default['default']().test(str)) {
    name = "JSP";
  }
  return {
    name: name
  };
}

module.exports = detectLang;
