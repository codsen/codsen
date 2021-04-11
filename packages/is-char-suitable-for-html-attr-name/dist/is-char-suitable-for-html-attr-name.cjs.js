/**
 * @name is-char-suitable-for-html-attr-name
 * @fileoverview Is given character suitable to be in an HTML attribute's name?
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/is-char-suitable-for-html-attr-name/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isAttrNameChar(_char) {
  return typeof _char === "string" && (
  _char.charCodeAt(0) > 96 && _char.charCodeAt(0) < 123 ||
  _char.charCodeAt(0) > 64 && _char.charCodeAt(0) < 91 ||
  _char.charCodeAt(0) > 47 && _char.charCodeAt(0) < 58 || _char === ":" || _char === "-");
}

exports.isAttrNameChar = isAttrNameChar;
