/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 3.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.stringCollapseLeadingWhitespace = factory());
}(this, (function () { 'use strict';

  var rawNbsp = "\xA0";

  function collapseLeadingWhitespace(str) {
    var originallineBreakLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    // helpers
    function reverse(s) {
      return Array.from(s).reverse().join("");
    } // replaces the leading/trailing whitespace chunks with final strings


    function prep(whitespaceChunk, limit, trailing) {
      // when processing the leading whitespace, it's \n\r --- CR - LF
      // when processing the trailing whitespace, we're processing inverted order,
      // so it's \n\r --- LF - CR
      // for this reason, we set first and second linebreak according to direction,
      // the "trailing" boolean:
      var firstBreakChar = trailing ? "\n" : "\r";
      var secondBreakChar = trailing ? "\r" : "\n";

      if (!whitespaceChunk) {
        return whitespaceChunk;
      } // let whitespace char count since last CR or LF
      var crlfCount = 0;
      var res = ""; // let beginning = true;

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
      // without a fuss, set the max allowed line breaks as a leading/trailing whitespace:
      var lineBreakLimit = 1;

      if (typeof +originallineBreakLimit === "number" && Number.isInteger(+originallineBreakLimit) && +originallineBreakLimit >= 0) {
        lineBreakLimit = +originallineBreakLimit;
      } // plan: extract what would String.prototype() would remove, front and back parts


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
      } // if whole string is whitespace, endPart is empty string


      if (str.trim() && (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)) {
        for (var _i = str.length; _i--;) {
          // console.log(
          //   `${`\u001b[${36}m${`----------------------------------------------\niterating through: ${JSON.stringify(
          //     str[i],
          //     null,
          //     4
          //   )}`}\u001b[${39}m`}`
          // );
          if (str[_i].trim()) {
            endPart = str.slice(_i + 1);
            break;
          }
        }
      } // -------------------------------------------------------------------------


      return "".concat(prep(frontPart, lineBreakLimit, false)).concat(str.trim()).concat(reverse(prep(reverse(endPart), lineBreakLimit, true)));
    }

    return str;
  }

  return collapseLeadingWhitespace;

})));
