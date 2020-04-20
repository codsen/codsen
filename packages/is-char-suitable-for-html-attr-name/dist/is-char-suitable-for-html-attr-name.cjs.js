/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
 */

'use strict';

function charSuitableForHTMLAttrName(char) {
  return typeof char === "string" && (
  char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 ||
  char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 ||
  char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char === ":" || char === "-");
}

module.exports = charSuitableForHTMLAttrName;
