/**
 * @name regex-is-jinja-nunjucks
 * @fileoverview Regular expression for detecting Jinja or Nunjucks code
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jinja-nunjucks/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "2.1.0";

var version = version$1;
function isJinjaNunjucksRegex() {
  return /{%|{{|%}|}}/gi;
}

exports.isJinjaNunjucksRegex = isJinjaNunjucksRegex;
exports.version = version;
