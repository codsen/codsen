/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
 */

import charSuitableForHTMLAttrName from 'is-char-suitable-for-html-attr-name';
import { right, left } from 'string-left-right';

function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (
    typeof str !== "string" ||
    !str.trim().length ||
    !Number.isInteger(idxOfAttrOpening) ||
    !Number.isInteger(isThisClosingIdx) ||
    !str[idxOfAttrOpening] ||
    !str[isThisClosingIdx] ||
    idxOfAttrOpening >= isThisClosingIdx
  ) {
    return false;
  }
  const openingQuote = `'"`.includes(str[idxOfAttrOpening])
    ? str[idxOfAttrOpening]
    : null;
  let oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = openingQuote === `"` ? `'` : `"`;
  }
  let attrStartsAt;
  for (let i = idxOfAttrOpening, len = str.length; i < len; i++) {
    if (i > isThisClosingIdx) {
      if (str[i].trim().length && !attrStartsAt) {
        if (charSuitableForHTMLAttrName(str[i])) {
          attrStartsAt = i;
        }
        else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
          return true;
        } else {
          return false;
        }
      } else if (attrStartsAt && !charSuitableForHTMLAttrName(str[i])) {
        attrStartsAt = null;
      }
      if (openingQuote && str[idxOfAttrOpening] === str[i]) {
        return false;
      }
      if (
        openingQuote &&
        str[isThisClosingIdx] === oppositeToOpeningQuote &&
        str[i] === oppositeToOpeningQuote
      ) {
        return false;
      }
      if (str[i] === "=" && `'"`.includes(str[right(str, i)])) {
        return true;
      }
    } else {
      if (
        str[i] === "=" &&
        right(str, i) &&
        right(str, right(str, i)) &&
        `'"`.includes(str[right(str, i)]) &&
        !`/>`.includes(str[right(str, right(str, i))]) &&
        charSuitableForHTMLAttrName(str[left(str, i)])
      ) {
        return false;
      }
    }
  }
  return false;
}

export default isAttrClosing;
