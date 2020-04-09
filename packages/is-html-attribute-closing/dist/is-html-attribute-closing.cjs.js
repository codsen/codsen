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

var htmlAllKnownAttributes = require('html-all-known-attributes');
var charSuitableForHTMLAttrName = _interopDefault(require('is-char-suitable-for-html-attr-name'));
var stringMatchLeftRight = require('string-match-left-right');

function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (typeof str !== "string" || !str.trim().length || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
    return false;
  }
  var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
  var oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = openingQuote === "\"" ? "'" : "\"";
  }
  var chunkStartsAt;
  var quotesCount = new Map().set("'", 0).set("\"", 0);
  var lastCapturedChunk;
  var lastChunkWasCapturedAfterSuspectedClosing = false;
  for (var i = idxOfAttrOpening, len = str.length; i < len; i++) {
    if ("'\"".includes(str[i])) {
      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
    }
    if (str[i].trim().length && !chunkStartsAt) {
      if (charSuitableForHTMLAttrName(str[i])) {
        chunkStartsAt = i;
      }
    } else if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx;
      chunkStartsAt = null;
    }
    if (
    "'\"".includes(str[i]) && (
    !(quotesCount.get("\"") % 2) || !(quotesCount.get("'") % 2)) &&
    (quotesCount.get("\"") + quotesCount.get("'")) % 2 &&
    lastCapturedChunk &&
    htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
      return i > isThisClosingIdx;
    }
    if (i > isThisClosingIdx) {
      if (openingQuote && str[idxOfAttrOpening] === str[i]) {
        return false;
      }
      if (
      openingQuote &&
      str[isThisClosingIdx] === oppositeToOpeningQuote &&
      str[i] === oppositeToOpeningQuote) {
        return false;
      }
      else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
          return true;
        }
      if (str[i] === "=" && stringMatchLeftRight.matchRight(str, i, ["'", "\""], {
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      })) {
        return true;
      }
    } else {
      var firstNonWhitespaceCharOnTheLeft = void 0;
      if (str[i - 1] && str[i - 1].trim().length && str[i - 1] !== "=") {
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {
        for (var y = i; y--;) {
          if (str[y].trim().length && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            break;
          }
        }
      }
      if (str[i] === "=" && stringMatchLeftRight.matchRight(str, i, ["'", "\""], {
        cb: function cb(_char) {
          return !"/>".includes(_char);
        },
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      }) &&
      charSuitableForHTMLAttrName(str[firstNonWhitespaceCharOnTheLeft])) {
        return false;
      }
    }
    if ("'\"".includes(str[i]) &&
    i > isThisClosingIdx) {
      if (
      !lastChunkWasCapturedAfterSuspectedClosing || !lastCapturedChunk ||
      !htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      }
      return true;
    }
  }
  return false;
}

module.exports = isAttrClosing;
