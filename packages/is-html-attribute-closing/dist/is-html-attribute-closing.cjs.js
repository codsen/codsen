/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var charSuitableForHTMLAttrName = _interopDefault(require('is-char-suitable-for-html-attr-name'));
var stringLeftRight = require('string-left-right');

function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (typeof str !== "string" || !str.trim().length || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
    console.log("015 ".concat("\x1B[".concat(31, "m", "WRONG INPUTS, RETURN FALSE", "\x1B[", 39, "m")));
    return false;
  }
  var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
  var oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = openingQuote === "\"" ? "'" : "\"";
  }
  console.log("028 ".concat("\x1B[".concat(33, "m", "openingQuote", "\x1B[", 39, "m"), ": ", "\x1B[".concat(35, "m", openingQuote, "\x1B[", 39, "m"), "   ", "\x1B[".concat(33, "m", "oppositeToOpeningQuote", "\x1B[", 39, "m"), ": ", "\x1B[".concat(35, "m", oppositeToOpeningQuote, "\x1B[", 39, "m")));
  var attrStartsAt;
  for (var i = idxOfAttrOpening, len = str.length; i < len; i++) {
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ").concat(str[i] && str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 4)), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m\n"));
    console.log(i === isThisClosingIdx ? "                 \u2588\u2588 isThisClosingIdx met at ".concat(i, " \u2588\u2588") : "");
    if (i > isThisClosingIdx) {
      console.log("055 i > isThisClosingIdx");
      if (str[i].trim().length && !attrStartsAt) {
        if (charSuitableForHTMLAttrName(str[i])) {
          console.log("070 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 new attribute name starts", "\x1B[", 39, "m")));
          console.log("073 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrStartsAt", "\x1B[", 39, "m"), " = ", JSON.stringify(attrStartsAt, null, 4)));
          attrStartsAt = i;
        }
        else if (str[i] === "/" || str[i] === ">") {
            console.log("088 closing bracket caught first - ".concat("\x1B[".concat(32, "m", "RETURN TRUE", "\x1B[", 39, "m")));
            return true;
          } else {
            console.log("095 character is not suitable for attr name - ".concat("\x1B[".concat(31, "m", "RETURN FALSE", "\x1B[", 39, "m")));
            return false;
          }
      }
      if (openingQuote && str[idxOfAttrOpening] === str[i]) {
        console.log("104 happy path, opening quote matched - ".concat("\x1B[".concat(31, "m", "RETURN FALSE", "\x1B[", 39, "m")));
        return false;
      }
      if (
      openingQuote &&
      str[isThisClosingIdx] === oppositeToOpeningQuote &&
      str[i] === oppositeToOpeningQuote) {
        console.log("128 another quote same as suspected was met - ".concat("\x1B[".concat(31, "m", "RETURN FALSE", "\x1B[", 39, "m")));
        return false;
      }
      if (str[i] === "=" && "'\"".includes(str[stringLeftRight.right(str, i)])) {
        console.log("139 new attribute starts - ".concat("\x1B[".concat(32, "m", "RETURN TRUE", "\x1B[", 39, "m")));
        return true;
      }
    } else {
      console.log("144 i <= isThisClosingIdx");
      if (str[i] === "=" && stringLeftRight.right(str, i) && stringLeftRight.right(str, stringLeftRight.right(str, i)) && "'\"".includes(str[stringLeftRight.right(str, i)]) &&
      !"/>".includes(str[stringLeftRight.right(str, stringLeftRight.right(str, i))]) &&
      charSuitableForHTMLAttrName(str[stringLeftRight.left(str, i)])) {
        console.log("184 new attribute starts - ".concat("\x1B[".concat(31, "m", "RETURN FALSE", "\x1B[", 39, "m")));
        return false;
      }
    }
    console.log("".concat("\x1B[".concat(90, "m", "\u2588\u2588 attrStartsAt = ".concat(attrStartsAt), "\x1B[", 39, "m")));
  }
  console.log("199 ".concat("\x1B[".concat(31, "m", "RETURN DEFAULT FALSE", "\x1B[", 39, "m")));
  return false;
}

module.exports = isAttrClosing;
