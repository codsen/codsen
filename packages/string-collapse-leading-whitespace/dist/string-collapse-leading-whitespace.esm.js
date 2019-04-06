/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 1.12.20
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
  let limitLinebreaksCount;
  if (
    !originalLimitLinebreaksCount ||
    typeof originalLimitLinebreaksCount !== "number"
  ) {
    limitLinebreaksCount = 1;
  } else {
    limitLinebreaksCount = originalLimitLinebreaksCount;
  }
  if (typeof str === "string") {
    if (str.length === 0) {
      return "";
    } else if (str.trim() === "") {
      const linebreakCount = (str.match(/\n/g) || []).length;
      if (linebreakCount) {
        return "\n".repeat(Math.min(linebreakCount, limitLinebreaksCount));
      }
      return " ";
    }
    let startCharacter = "";
    if (str[0].trim() === "") {
      startCharacter = " ";
      let lineBreakEncountered = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === "\n") {
          lineBreakEncountered++;
        }
        if (str[i].trim().length !== 0) {
          break;
        }
      }
      if (lineBreakEncountered) {
        startCharacter = "\n".repeat(
          Math.min(lineBreakEncountered, limitLinebreaksCount)
        );
      }
    }
    let endCharacter = "";
    if (str.slice(-1).trim() === "") {
      endCharacter = " ";
      let lineBreakEncountered = 0;
      for (let i = str.length; i--; ) {
        if (str[i] === "\n") {
          lineBreakEncountered++;
        }
        if (str[i].trim().length !== 0) {
          break;
        }
      }
      if (lineBreakEncountered) {
        endCharacter = "\n".repeat(
          Math.min(lineBreakEncountered, limitLinebreaksCount)
        );
      }
    }
    return startCharacter + str.trim() + endCharacter;
  }
  return str;
}

export default collapseLeadingWhitespace;
