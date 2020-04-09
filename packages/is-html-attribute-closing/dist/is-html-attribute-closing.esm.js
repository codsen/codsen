/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
 */

import { allHtmlAttribs } from 'html-all-known-attributes';
import charSuitableForHTMLAttrName from 'is-char-suitable-for-html-attr-name';
import { matchRight } from 'string-match-left-right';

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
  let chunkStartsAt;
  const quotesCount = new Map().set(`'`, 0).set(`"`, 0);
  let lastCapturedChunk;
  let lastChunkWasCapturedAfterSuspectedClosing = false;
  for (let i = idxOfAttrOpening, len = str.length; i < len; i++) {
    if (`'"`.includes(str[i])) {
      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
    }
    if (str[i].trim().length && !chunkStartsAt) {
      if (charSuitableForHTMLAttrName(str[i])) {
        chunkStartsAt = i;
      }
    } else if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing =
        chunkStartsAt >= isThisClosingIdx;
      chunkStartsAt = null;
    }
    if (
      `'"`.includes(str[i]) &&
      (!(quotesCount.get(`"`) % 2) || !(quotesCount.get(`'`) % 2)) &&
      (quotesCount.get(`"`) + quotesCount.get(`'`)) % 2 &&
      lastCapturedChunk &&
      allHtmlAttribs.has(lastCapturedChunk)
    ) {
      return i > isThisClosingIdx;
    }
    if (i > isThisClosingIdx) {
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
      else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
        return true;
      }
      if (
        str[i] === "=" &&
        matchRight(str, i, [`'`, `"`], {
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["="],
        })
      ) {
        return true;
      }
    } else {
      let firstNonWhitespaceCharOnTheLeft;
      if (str[i - 1] && str[i - 1].trim().length && str[i - 1] !== "=") {
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {
        for (let y = i; y--; ) {
          if (str[y].trim().length && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            break;
          }
        }
      }
      if (
        str[i] === "=" &&
        matchRight(str, i, [`'`, `"`], {
          cb: (char) => !`/>`.includes(char),
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["="],
        }) &&
        charSuitableForHTMLAttrName(str[firstNonWhitespaceCharOnTheLeft])
      ) {
        return false;
      }
    }
    if (
      `'"`.includes(str[i]) &&
      i > isThisClosingIdx
    ) {
      if (
        !lastChunkWasCapturedAfterSuspectedClosing ||
        !lastCapturedChunk ||
        !allHtmlAttribs.has(lastCapturedChunk)
      ) {
        return false;
      }
      return true;
    }
  }
  return false;
}

export default isAttrClosing;
