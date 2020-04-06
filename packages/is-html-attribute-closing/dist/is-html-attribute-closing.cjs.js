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
    return false;
  }
  var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
  var oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = openingQuote === "\"" ? "'" : "\"";
  }
  var attrStartsAt;
  for (var i = idxOfAttrOpening, len = str.length; i < len; i++) {
    if (i > isThisClosingIdx) {
      if (str[i].trim().length && !attrStartsAt) {
        if (charSuitableForHTMLAttrName(str[i])) {
          attrStartsAt = i;
        }
        else if (str[i] === "/" || str[i] === ">") {
            return true;
          } else {
            return false;
          }
      }
      if (openingQuote && str[idxOfAttrOpening] === str[i]) {
        return false;
      }
      if (
      openingQuote &&
      str[isThisClosingIdx] === oppositeToOpeningQuote &&
      str[i] === oppositeToOpeningQuote) {
        return false;
      }
      if (str[i] === "=" && "'\"".includes(str[stringLeftRight.right(str, i)])) {
        return true;
      }
    } else {
      if (str[i] === "=" && stringLeftRight.right(str, i) && stringLeftRight.right(str, stringLeftRight.right(str, i)) && "'\"".includes(str[stringLeftRight.right(str, i)]) &&
      !"/>".includes(str[stringLeftRight.right(str, stringLeftRight.right(str, i))]) &&
      charSuitableForHTMLAttrName(str[stringLeftRight.left(str, i)])) {
        return false;
      }
    }
  }
  return false;
}

module.exports = isAttrClosing;
