/**
 * @name is-char-suitable-for-html-attr-name
 * @fileoverview Is given character suitable to be in an HTML attribute's name?
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/is-char-suitable-for-html-attr-name/}
 */

function isAttrNameChar(char) {
  return typeof char === "string" && (
  char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 ||
  char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 ||
  char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char === ":" || char === "-");
}

export { isAttrNameChar };
