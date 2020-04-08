/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
 */

'use strict';

function charSuitableForHTMLAttrName(_char) {
  return typeof _char === "string" && (
  _char.charCodeAt(0) > 96 && _char.charCodeAt(0) < 123 ||
  _char.charCodeAt(0) > 64 && _char.charCodeAt(0) < 91 ||
  _char.charCodeAt(0) > 47 && _char.charCodeAt(0) < 58 || _char === ":" || _char === "-");
}

module.exports = charSuitableForHTMLAttrName;
