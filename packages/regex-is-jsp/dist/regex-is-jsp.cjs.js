/**
 * @name regex-is-jsp
 * @fileoverview Regular expression for detecting JSP (Java Server Pages) code
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jsp/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "2.0.14";

var version = version$1;
function isJSP() {
  return /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;
}

exports.isJSP = isJSP;
exports.version = version;
