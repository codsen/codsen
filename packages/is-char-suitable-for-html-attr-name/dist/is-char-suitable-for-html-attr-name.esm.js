/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 1.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-char-suitable-for-html-attr-name/
 */

// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
function isAttrNameChar(char) {
  return typeof char === "string" && ( //
  // lowercase letters, indexes 97 - 122:
  char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || // uppercase letters, indexes 65 - 90
  char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || // digits 0 - 9, indexes 48 - 57
  char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char === ":" || char === "-");
}

export { isAttrNameChar };
