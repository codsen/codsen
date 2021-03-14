/**
 * detect-templating-language
 * Detects various templating languages present in string
 * Version: 2.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-templating-language/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var regexIsJinjaNunjucks = require('regex-is-jinja-nunjucks');
var regexIsJsp = require('regex-is-jsp');
var regexJinjaSpecific = require('regex-jinja-specific');

var version$1 = "2.0.8";

var version = version$1;
function detectLang(str) {
  var name = null;
  if (typeof str !== "string") {
    throw new TypeError("detect-templating-language: [THROW_ID_01] Input must be string! It was given as " + JSON.stringify(str, null, 4) + " (type " + typeof str + ").");
  }
  if (!str) {
    return {
      name: name
    };
  }
  if (regexIsJinjaNunjucks.isJinjaNunjucksRegex().test(str)) {
    name = "Nunjucks";
    if (regexJinjaSpecific.isJinjaSpecific().test(str)) {
      name = "Jinja";
    }
  } else if (regexIsJsp.isJSP().test(str)) {
    name = "JSP";
  }
  return {
    name: name
  };
}

exports.detectLang = detectLang;
exports.version = version;
