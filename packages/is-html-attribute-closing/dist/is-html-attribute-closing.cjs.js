/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.4.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-attribute-closing/
 */

'use strict';

var htmlAllKnownAttributes = require('html-all-known-attributes');
var charSuitableForHTMLAttrName = require('is-char-suitable-for-html-attr-name');
var stringLeftRight = require('string-left-right');
var stringMatchLeftRight = require('string-match-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var charSuitableForHTMLAttrName__default = /*#__PURE__*/_interopDefaultLegacy(charSuitableForHTMLAttrName);

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
    }
    if (str[i] === x) {
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
    }
    if (str.startsWith(y, i)) {
      return false;
    }
  }
  return false;
}
function plausibleAttrStartsAtX(str, start) {
  if (!charSuitableForHTMLAttrName__default['default'](str[start]) || !start) {
    return false;
  }
  var regex = /^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/;
  return regex.test(str.slice(start));
}
function guaranteedAttrStartsAtX(str, start) {
  if (!charSuitableForHTMLAttrName__default['default'](str[start]) || !start) {
    return false;
  }
  var regex = /^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  return regex.test(str.slice(start));
}
function findAttrNameCharsChunkOnTheLeft(str, i) {
  if (!charSuitableForHTMLAttrName__default['default'](str[stringLeftRight.left(str, i)])) {
    return;
  }
  for (var y = i; y--;) {
    if (str[y].trim().length && !charSuitableForHTMLAttrName__default['default'](str[y])) {
      return str.slice(y + 1, i);
    }
  }
}

function makeTheQuoteOpposite(quoteChar) {
  return quoteChar === "'" ? "\"" : "'";
}
function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (typeof str !== "string" || !str.trim() || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
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
  var secondLastCapturedChunk;
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
      var E1 = i !== isThisClosingIdx || guaranteedAttrStartsAtX(str, stringLeftRight.right(str, isThisClosingIdx)) || "/>".includes(str[stringLeftRight.right(str, i)]);
      var E2 = !(i > isThisClosingIdx && str[idxOfAttrOpening] === str[isThisClosingIdx] && str[idxOfAttrOpening] === str[i] &&
      plausibleAttrStartsAtX(str, i + 1));
      var E31 =
      i === isThisClosingIdx &&
      plausibleAttrStartsAtX(str, isThisClosingIdx + 1);
      var E32 =
      chunkStartsAt && chunkStartsAt < i && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(chunkStartsAt, i).trim());
      var plausibleAttrName = str.slice(chunkStartsAt, i).trim();
      var E33 = chunkStartsAt && chunkStartsAt < i && str[chunkStartsAt - 1] && !str[chunkStartsAt - 1].trim() &&
      Array.from(str.slice(chunkStartsAt, i).trim()).every(function (char) {
        return charSuitableForHTMLAttrName__default['default'](char);
      }) &&
      str[idxOfAttrOpening] === str[isThisClosingIdx] && !"/>".includes(str[stringLeftRight.right(str, i)]) && ensureXIsNotPresentBeforeOneOfY(str, i + 1, "=", ["'", "\""]);
      var attrNameCharsChunkOnTheLeft = void 0;
      if (i === isThisClosingIdx) {
        attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
      }
      var E34 =
      i === isThisClosingIdx && (
      !charSuitableForHTMLAttrName__default['default'](str[stringLeftRight.left(str, i)]) ||
      attrNameCharsChunkOnTheLeft && !htmlAllKnownAttributes.allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) &&
      str[stringLeftRight.left(str, i)] !== "=";
      var E41 =
      "/>".includes(str[stringLeftRight.right(str, i)]) && i === isThisClosingIdx;
      var E42 =
      charSuitableForHTMLAttrName__default['default'](str[stringLeftRight.right(str, i)]);
      var E43 =
      lastQuoteWasMatched && i !== isThisClosingIdx;
      var E5 =
      !(
      i >= isThisClosingIdx &&
      str[stringLeftRight.left(str, isThisClosingIdx)] === ":");
      return E1 && E2 && (E31 || E32 || E33 || E34) && (E41 || E42 || E43) && E5;
    }
    if ("'\"".includes(str[i])) {
      if (str[i] === "'" && str[i - 1] === "\"" && str[i + 1] === "\"" || str[i] === "\"" && str[i - 1] === "'" && str[i + 1] === "'") {
        continue;
      }
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
      if (totalQuotesCount && quotesCount.get("matchedPairs") && totalQuotesCount === quotesCount.get("matchedPairs") * 2 &&
      i < isThisClosingIdx) {
        return false;
      }
    }
    if (str[i] === "<" && closingBracketMet && !openingBracketMet) {
      openingBracketMet = true;
      return false;
    }
    if (str[i].trim() && !chunkStartsAt) {
      if (charSuitableForHTMLAttrName__default['default'](str[i])) {
        chunkStartsAt = i;
      }
    } else if (chunkStartsAt && !charSuitableForHTMLAttrName__default['default'](str[i])) {
      secondLastCapturedChunk = lastCapturedChunk;
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx;
      if ("'\"".includes(str[i]) && quotesCount.get("matchedPairs") === 0 && totalQuotesCount === 3 && str[idxOfAttrOpening] === str[i] && htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk) && !"'\"".includes(str[stringLeftRight.right(str, i)])) {
        var A1 = i > isThisClosingIdx;
        var A21 = !lastQuoteAt;
        var A22 = lastQuoteAt + 1 >= i;
        var A23 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        var A3 = !lastCapturedChunk || !secondLastCapturedChunk || !secondLastCapturedChunk.endsWith(":");
        var B1 = i === isThisClosingIdx;
        var B21 = totalQuotesCount < 3;
        var B22 = !!lastQuoteWasMatched;
        var B23 = !lastQuoteAt;
        var B24 = lastQuoteAt + 1 >= i;
        var B25 = !str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        return A1 && (A21 || A22 || A23) && A3 || B1 && (B21 || B22 || B23 || B24 || B25);
      }
      if (
      lastCapturedChunk && htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk) && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx) {
        return true;
      }
    }
    if (
    "'\"".includes(str[i]) && (
    !(quotesCount.get("\"") % 2) || !(quotesCount.get("'") % 2)) &&
    (quotesCount.get("\"") + quotesCount.get("'")) % 2 && (
    lastCapturedChunk &&
    htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk) ||
    i > isThisClosingIdx + 1 && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(isThisClosingIdx + 1, i).trim())) &&
    !(str[i + 1] === str[i] && str[i] === str[idxOfAttrOpening]) &&
    !(
    i > isThisClosingIdx + 1 &&
    str[stringLeftRight.left(str, isThisClosingIdx)] === ":") &&
    !(lastCapturedChunk && secondLastCapturedChunk && secondLastCapturedChunk.trim().endsWith(":"))) {
      var R0 = i > isThisClosingIdx;
      var R1 = !!openingQuote;
      var R2 = str[idxOfAttrOpening] !== str[isThisClosingIdx];
      var R3 = htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, isThisClosingIdx).trim());
      var R4 = !xBeforeYOnTheRight(str, i + 1, str[isThisClosingIdx], makeTheQuoteOpposite(str[isThisClosingIdx]));
      return R0 && !(R1 && R2 && R3 && R4);
    }
    if (
    (str[i] === "=" ||
    !str[i].length &&
    str[stringLeftRight.right(str, i)] === "=") &&
    lastCapturedChunk &&
    htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
      var W1 = i > isThisClosingIdx;
      var W2 =
      !(!(
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx ||
      guaranteedAttrStartsAtX(str, chunkStartsAt)) &&
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt && lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx);
      return W1 && W2;
    }
    if (i > isThisClosingIdx) {
      if (openingQuote && str[i] === openingQuote) {
        var Y1 = !!lastQuoteAt;
        var Y2 = lastQuoteAt === isThisClosingIdx;
        var Y3 = lastQuoteAt + 1 < i && str.slice(lastQuoteAt + 1, i).trim();
        var Y4 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        var Y5 = i >= isThisClosingIdx;
        var Y6 = !str[stringLeftRight.right(str, i)] || !"'\"".includes(str[stringLeftRight.right(str, i)]);
        return Y1 && Y2 && Y3 && Y4 && Y5 && Y6;
      }
      if (
      openingQuote &&
      str[isThisClosingIdx] === oppositeToOpeningQuote &&
      str[i] === oppositeToOpeningQuote) {
        return false;
      }
      if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
        var _R =
        str[idxOfAttrOpening] === str[isThisClosingIdx] &&
        lastQuoteAt === isThisClosingIdx &&
        !str.slice(idxOfAttrOpening + 1, isThisClosingIdx).includes(str[idxOfAttrOpening]);
        var R11 = quotesCount.get("matchedPairs") < 2;
        var _attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
        var R12 = (!_attrNameCharsChunkOnTheLeft || !htmlAllKnownAttributes.allHtmlAttribs.has(_attrNameCharsChunkOnTheLeft)) && (
        !(i > isThisClosingIdx &&
        quotesCount.get("'") &&
        quotesCount.get("\"") &&
        quotesCount.get("matchedPairs") > 1) ||
        "/>".includes(str[stringLeftRight.right(str, i)]));
        var _R2 = totalQuotesCount < 3 ||
        quotesCount.get("\"") + quotesCount.get("'") - quotesCount.get("matchedPairs") * 2 !== 2;
        var R31 = !lastQuoteWasMatched || lastQuoteWasMatched && !(lastMatchedQuotesPairsStartIsAt && Array.from(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()).every(function (char) {
          return charSuitableForHTMLAttrName__default['default'](char);
        }) && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()));
        var R32 = !stringLeftRight.right(str, i) && totalQuotesCount % 2 === 0;
        var R33 = str[idxOfAttrOpening - 2] && str[idxOfAttrOpening - 1] === "=" && charSuitableForHTMLAttrName__default['default'](str[idxOfAttrOpening - 2]);
        var R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", ["='", "=\""]);
        return (
          _R ||
          (R11 || R12) &&
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
      if (str[i - 1] && str[i - 1].trim() && str[i - 1] !== "=") {
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {
        for (var y = i; y--;) {
          if (str[y].trim() && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            break;
          }
        }
      }
      if (str[i] === "=" && stringMatchLeftRight.matchRight(str, i, ["'", "\""], {
        cb: function cb(char) {
          return !"/>".includes(char);
        },
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      }) &&
      charSuitableForHTMLAttrName__default['default'](str[firstNonWhitespaceCharOnTheLeft])) {
        return false;
      }
      if (i === isThisClosingIdx && guaranteedAttrStartsAtX(str, i + 1)) {
        return true;
      }
      if (i < isThisClosingIdx && "'\"".includes(str[i]) && lastCapturedChunk && str[stringLeftRight.left(str, idxOfAttrOpening)] && str[stringLeftRight.left(str, idxOfAttrOpening)] !== "=" && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      }
      if (i === isThisClosingIdx && "'\"".includes(str[i]) && lastCapturedChunk && secondLastCapturedChunk && totalQuotesCount % 2 === 0 && secondLastCapturedChunk.endsWith(":")) {
        return true;
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
    if (chunkStartsAt && !charSuitableForHTMLAttrName__default['default'](str[i])) {
      chunkStartsAt = null;
    }
  }
  return false;
}

module.exports = isAttrClosing;
