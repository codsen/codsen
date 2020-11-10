/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 3.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

const rawNbsp = "\u00A0";
function collapseLeadingWhitespace(str, originallineBreakLimit = 1) {
  function reverse(s) {
    return Array.from(s).reverse().join("");
  }
  function prep(whitespaceChunk, limit, trailing) {
    const firstBreakChar = trailing ? "\n" : "\r";
    const secondBreakChar = trailing ? "\r" : "\n";
    if (!whitespaceChunk) {
      return whitespaceChunk;
    }
    let crlfCount = 0;
    let res = "";
    for (let i = 0, len = whitespaceChunk.length; i < len; i++) {
      if (
        whitespaceChunk[i] === firstBreakChar ||
        (whitespaceChunk[i] === secondBreakChar &&
          whitespaceChunk[i - 1] !== firstBreakChar)
      ) {
        crlfCount++;
      }
      if (
        `\r\n`.includes(whitespaceChunk[i]) ||
        whitespaceChunk[i] === rawNbsp
      ) {
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
        } else if (
          whitespaceChunk[i] === secondBreakChar &&
          (!whitespaceChunk[i - 1] ||
            whitespaceChunk[i - 1] !== firstBreakChar) &&
          crlfCount <= limit
        ) {
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
    let lineBreakLimit = 1;
    if (
      typeof +originallineBreakLimit === "number" &&
      Number.isInteger(+originallineBreakLimit) &&
      +originallineBreakLimit >= 0
    ) {
      lineBreakLimit = +originallineBreakLimit;
    }
    let frontPart = "";
    let endPart = "";
    if (!str.trim()) {
      frontPart = str;
    } else if (!str[0].trim()) {
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim()) {
          frontPart = str.slice(0, i);
          break;
        }
      }
    }
    if (
      str.trim() &&
      (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)
    ) {
      for (let i = str.length; i--; ) {
        if (str[i].trim()) {
          endPart = str.slice(i + 1);
          break;
        }
      }
    }
    return `${prep(frontPart, lineBreakLimit, false)}${str.trim()}${reverse(
      prep(reverse(endPart), lineBreakLimit, true)
    )}`;
  }
  return str;
}

export default collapseLeadingWhitespace;
