/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 1.12.20
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

'use strict';

function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
  var limitLinebreaksCount;
  if (!originalLimitLinebreaksCount ||
  typeof originalLimitLinebreaksCount !== "number") {
    limitLinebreaksCount = 1;
  } else {
    limitLinebreaksCount = originalLimitLinebreaksCount;
  }
  if (typeof str === "string") {
    if (str.length === 0) {
      return "";
    } else if (str.trim() === "") {
      var linebreakCount = (str.match(/\n/g) || []).length;
      if (linebreakCount) {
        return "\n".repeat(Math.min(linebreakCount, limitLinebreaksCount));
      }
      return " ";
    }
    var startCharacter = "";
    if (str[0].trim() === "") {
      startCharacter = " ";
      var lineBreakEncountered = 0;
      for (var i = 0, len = str.length; i < len; i++) {
        if (str[i] === "\n") {
          lineBreakEncountered++;
        }
        if (str[i].trim().length !== 0) {
          break;
        }
      }
      if (lineBreakEncountered) {
        startCharacter = "\n".repeat(Math.min(lineBreakEncountered, limitLinebreaksCount));
      }
    }
    var endCharacter = "";
    if (str.slice(-1).trim() === "") {
      endCharacter = " ";
      var _lineBreakEncountered = 0;
      for (var _i = str.length; _i--;) {
        if (str[_i] === "\n") {
          _lineBreakEncountered++;
        }
        if (str[_i].trim().length !== 0) {
          break;
        }
      }
      if (_lineBreakEncountered) {
        endCharacter = "\n".repeat(Math.min(_lineBreakEncountered, limitLinebreaksCount));
      }
    }
    return startCharacter + str.trim() + endCharacter;
  }
  return str;
}

module.exports = collapseLeadingWhitespace;
