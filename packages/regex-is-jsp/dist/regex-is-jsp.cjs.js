/**
 * regex-is-jsp
 * Regular expression for detecting JSP (Java Server Pages) code
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jsp/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version = "1.1.1";

function isJSP() {
  return /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;
}

exports.isJSP = isJSP;
exports.version = version;
