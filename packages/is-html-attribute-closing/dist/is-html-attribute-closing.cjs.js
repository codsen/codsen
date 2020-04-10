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
var stringLeftRight = require('string-left-right');
var split = _interopDefault(require('string-split-by-whitespace'));
var stringMatchLeftRight = require('string-match-left-right');

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x) {
  var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var _loop = function _loop(i, len) {
    if (y.some(function (oneOfStr) {
      return str.startsWith(oneOfStr, i);
    })) {
      return {
        v: true
      };
    } else if (str[i] === x) {
      return {
        v: false
      };
    }
  };
  for (var i = startingIdx, len = str.length; i < len; i++) {
    var _ret = _loop(i);
    if (_typeof(_ret) === "object") return _ret.v;
  }
  return true;
}
function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    } else if (str.startsWith(y, i)) {
      return false;
    }
  }
  return false;
}
function plausibleAttrStartsAtX(str, start) {
  if (!charSuitableForHTMLAttrName(str[start]) || !start) {
    return false;
  }
  var regex = /^[a-zA-Z0-9:-]*[=]?((?:'[^']*')|(?:"[^"]*"))/;
  return regex.test(str.slice(start));
}

function makeTheQuoteOpposite(quoteChar) {
  return quoteChar === "'" ? "\"" : "'";
}
function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (typeof str !== "string" || !str.trim().length || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
    return false;
  }
  var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
  var oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = makeTheQuoteOpposite(openingQuote);
  }
  var chunkStartsAt;
  var quotesCount = new Map().set("'", 0).set("\"", 0).set("matchedPairs", 0);
  var lastQuoteAt = null;
  var totalQuotesCount = 0;
  var lastQuoteWasMatched = false;
  var lastMatchedQuotesPairsStartIsAt = false;
  var lastMatchedQuotesPairsEndIsAt = false;
  var lastCapturedChunk;
  var lastChunkWasCapturedAfterSuspectedClosing = false;
  var closingBracketMet = false;
  var openingBracketMet = false;
  for (var i = idxOfAttrOpening, len = str.length; i < len; i++) {
    if (
    "'\"".includes(str[i]) &&
    lastQuoteWasMatched &&
    lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
    lastMatchedQuotesPairsEndIsAt < i &&
    i >= isThisClosingIdx) {
      var E1 = i !== isThisClosingIdx;
      var E21 = !(i > isThisClosingIdx && str[idxOfAttrOpening] === str[isThisClosingIdx] && str[idxOfAttrOpening] === str[i]);
      var E22 =
      plausibleAttrStartsAtX(str, i + 1);
      var E23 =
      chunkStartsAt && chunkStartsAt < i && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(chunkStartsAt, i).trim());
      var E24 =
      chunkStartsAt < i && str[chunkStartsAt - 1] && !str[chunkStartsAt - 1].trim().length &&
      Array.from(str.slice(chunkStartsAt, i).trim()).every(function (_char) {
        return charSuitableForHTMLAttrName(_char);
      }) &&
      str[idxOfAttrOpening] === str[isThisClosingIdx];
      var E3 =
      "/>".includes(str[stringLeftRight.right(str, i)]) ||
      charSuitableForHTMLAttrName(str[stringLeftRight.right(str, i)]) ||
      lastQuoteWasMatched;
      return E1 && (E21 || E22 || E23 || E24) && E3;
    }
    if ("'\"".includes(str[i])) {
      if (lastQuoteAt && str[i] === str[lastQuoteAt]) {
        quotesCount.set("matchedPairs", quotesCount.get("matchedPairs") + 1);
        lastMatchedQuotesPairsStartIsAt = lastQuoteAt;
        lastMatchedQuotesPairsEndIsAt = i;
        lastQuoteAt = null;
        lastQuoteWasMatched = true;
      } else {
        lastQuoteWasMatched = false;
      }
      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
      totalQuotesCount = quotesCount.get("\"") + quotesCount.get("'");
    }
    if (str[i] === ">" && !closingBracketMet) {
      closingBracketMet = true;
    }
    if (str[i] === "<" && closingBracketMet && !openingBracketMet) {
      openingBracketMet = true;
      if (i > isThisClosingIdx) {
        return false;
      }
    }
    if (str[i].trim().length && !chunkStartsAt) {
      if (charSuitableForHTMLAttrName(str[i])) {
        chunkStartsAt = i;
      }
    } else if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx;
      chunkStartsAt = null;
      if ("'\"".includes(str[i]) && quotesCount.get("matchedPairs") === 0 && totalQuotesCount === 3 && str[idxOfAttrOpening] === str[i] && htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
        var A1 = i > isThisClosingIdx;
        var A21 = !lastQuoteAt;
        var A22 = lastQuoteAt + 1 >= i;
        var A23 = split(str.slice(lastQuoteAt + 1, i)).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        var B1 = i === isThisClosingIdx;
        var B21 = totalQuotesCount < 3;
        var B22 = !!lastQuoteWasMatched;
        var B23 = !lastQuoteAt;
        var B24 = lastQuoteAt + 1 >= i;
        var B25 = !split(str.slice(lastQuoteAt + 1, i)).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        return A1 && (A21 || A22 || A23) || B1 && (B21 || B22 || B23 || B24 || B25);
      }
    }
    if (
    "'\"".includes(str[i]) && (
    !(quotesCount.get("\"") % 2) || !(quotesCount.get("'") % 2)) &&
    (quotesCount.get("\"") + quotesCount.get("'")) % 2 && (
    lastCapturedChunk &&
    htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk) ||
    i > isThisClosingIdx + 1 && Array.from(str.slice(isThisClosingIdx + 1, i).trim()).every(function (_char2) {
      return charSuitableForHTMLAttrName(_char2);
    }))) {
      var R1 = !!openingQuote;
      var R2 = str[idxOfAttrOpening] !== str[isThisClosingIdx];
      var R3 = Array.from(str.slice(idxOfAttrOpening + 1, isThisClosingIdx).trim()).every(function (_char3) {
        return charSuitableForHTMLAttrName(_char3);
      });
      var R4 = !xBeforeYOnTheRight(str, i + 1, str[isThisClosingIdx], makeTheQuoteOpposite(str[isThisClosingIdx]));
      return (
        i > isThisClosingIdx &&
        !(R1 && R2 && R3 && R4)
      );
    } else if (
    (str[i] === "=" ||
    !str[i].length &&
    str[stringLeftRight.right(str, i)] === "=") &&
    lastCapturedChunk &&
    htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
      var W1 = i > isThisClosingIdx;
      var W2 =
      !(
      !(lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx) &&
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt && lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx);
      return W1 && W2;
    }
    if (i > isThisClosingIdx) {
      if (openingQuote && str[i] === openingQuote) {
        var Y1 = !!lastQuoteAt;
        var Y2 = lastQuoteAt === isThisClosingIdx;
        var Y3 = lastQuoteAt + 1 < i && str.slice(lastQuoteAt + 1, i).trim().length;
        var Y4 = split(str.slice(lastQuoteAt + 1, i)).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        var Y5 = i >= isThisClosingIdx;
        return Y1 && Y2 && Y3 && Y4 && Y5;
      }
      if (
      openingQuote &&
      str[isThisClosingIdx] === oppositeToOpeningQuote &&
      str[i] === oppositeToOpeningQuote) {
        return false;
      }
      else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
          var _R = quotesCount.get("matchedPairs") < 2;
          var _R2 = totalQuotesCount < 3 ||
          quotesCount.get("\"") + quotesCount.get("'") - quotesCount.get("matchedPairs") * 2 !== 2;
          var R31 = !lastQuoteWasMatched || lastQuoteWasMatched && !(lastMatchedQuotesPairsStartIsAt && Array.from(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()).every(function (_char4) {
            return charSuitableForHTMLAttrName(_char4);
          }) && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()));
          var R32 = !stringLeftRight.right(str, i) && totalQuotesCount % 2 === 0;
          var R33 = str[idxOfAttrOpening - 2] && str[idxOfAttrOpening - 1] === "=" && charSuitableForHTMLAttrName(str[idxOfAttrOpening - 2]);
          var R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", ["='", "=\""]);
          return (
            _R &&
            _R2 && (
            R31 ||
            R32 ||
            R33 ||
            R34)
          );
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
        cb: function cb(_char5) {
          return !"/>".includes(_char5);
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
    if ("'\"".includes(str[i])) {
      lastQuoteAt = i;
    }
  }
  return false;
}

module.exports = isAttrClosing;
