/**
 * regex-is-jinja-nunjucks
 * Regular expression for detecting Jinja or Nunjucks code
 * Version: 2.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jinja-nunjucks/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "2.0.10";

var version = version$1;
function isJinjaNunjucksRegex() {
  return /{%|{{|%}|}}/gi;
}

exports.isJinjaNunjucksRegex = isJinjaNunjucksRegex;
exports.version = version;
