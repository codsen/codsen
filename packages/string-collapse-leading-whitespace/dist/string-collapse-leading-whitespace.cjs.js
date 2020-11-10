/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 3.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

'use strict';

var rawNbsp = "\xA0";
function collapseLeadingWhitespace(str) {
  var originallineBreakLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  function reverse(s) {
    return Array.from(s).reverse().join("");
  }
  function prep(whitespaceChunk, limit, trailing) {
    var firstBreakChar = trailing ? "\n" : "\r";
    var secondBreakChar = trailing ? "\r" : "\n";
    if (!whitespaceChunk) {
      return whitespaceChunk;
    }
    var crlfCount = 0;
    var res = "";
    for (var i = 0, len = whitespaceChunk.length; i < len; i++) {
      if (whitespaceChunk[i] === firstBreakChar || whitespaceChunk[i] === secondBreakChar && whitespaceChunk[i - 1] !== firstBreakChar) {
        crlfCount++;
      }
      if ("\r\n".includes(whitespaceChunk[i]) || whitespaceChunk[i] === rawNbsp) {
        if (whitespaceChunk[i] === rawNbsp) {
          res += whitespaceChunk[i];
        } else if (whitespaceChunk[i] === firstBreakChar) {
          if (crlfCount <= limit) {
            res += whitespaceChunk[i];
            if (whitespaceChunk[i + 1] === secondBreakChar) {
              res += whitespaceChunk[i + 1];
              i++;
            }
          }
        } else if (whitespaceChunk[i] === secondBreakChar && (!whitespaceChunk[i - 1] || whitespaceChunk[i - 1] !== firstBreakChar) && crlfCount <= limit) {
          res += whitespaceChunk[i];
        }
      } else {
        if (!whitespaceChunk[i + 1] && !crlfCount) {
          res += " ";
        }
      }
    }
    return res;
  }
  if (typeof str === "string" && str.length) {
    var lineBreakLimit = 1;
    if (typeof +originallineBreakLimit === "number" && Number.isInteger(+originallineBreakLimit) && +originallineBreakLimit >= 0) {
      lineBreakLimit = +originallineBreakLimit;
    }
    var frontPart = "";
    var endPart = "";
    if (!str.trim()) {
      frontPart = str;
    } else if (!str[0].trim()) {
      for (var i = 0, len = str.length; i < len; i++) {
        if (str[i].trim()) {
          frontPart = str.slice(0, i);
          break;
        }
      }
    }
    if (str.trim() && (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)) {
      for (var _i = str.length; _i--;) {
        if (str[_i].trim()) {
          endPart = str.slice(_i + 1);
          break;
        }
      }
    }
    return "".concat(prep(frontPart, lineBreakLimit, false)).concat(str.trim()).concat(reverse(prep(reverse(endPart), lineBreakLimit, true)));
  }
  return str;
}

module.exports = collapseLeadingWhitespace;
