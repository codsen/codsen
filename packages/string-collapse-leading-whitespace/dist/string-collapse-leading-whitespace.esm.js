/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

const rawNbsp = "\u00A0";
function push(arr, leftSide = true, charToPush) {
  if (
    !charToPush.trim().length &&
    (!arr.length ||
      charToPush === "\n" ||
      charToPush === rawNbsp ||
      (leftSide ? arr[arr.length - 1] : arr[0]) !== " ") &&
    (!arr.length ||
      (leftSide ? arr[arr.length - 1] : arr[0]) !== "\n" ||
      charToPush === "\n" ||
      charToPush === rawNbsp)
  ) {
    if (leftSide) {
      if (
        (charToPush === "\n" || charToPush === rawNbsp) &&
        arr.length &&
        arr[arr.length - 1] === " "
      ) {
        while (arr.length && arr[arr.length - 1] === " ") {
          arr.pop();
        }
      }
      arr.push(
        charToPush === rawNbsp || charToPush === "\n" ? charToPush : " "
      );
    } else {
      if (
        (charToPush === "\n" || charToPush === rawNbsp) &&
        arr.length &&
        arr[0] === " "
      ) {
        while (arr.length && arr[0] === " ") {
          arr.shift();
        }
      }
      arr.unshift(
        charToPush === rawNbsp || charToPush === "\n" ? charToPush : " "
      );
    }
  }
}
function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
  if (typeof str === "string" && str.length) {
    let windowsEol = false;
    if (str.includes("\r\n")) {
      windowsEol = true;
    }
    let limitLinebreaksCount;
    if (
      !originalLimitLinebreaksCount ||
      typeof originalLimitLinebreaksCount !== "number"
    ) {
      limitLinebreaksCount = 1;
    } else {
      limitLinebreaksCount = originalLimitLinebreaksCount;
    }
    let limit;
    if (str.trim() === "") {
      const resArr = [];
      limit = limitLinebreaksCount;
      Array.from(str).forEach(char => {
        if (char !== "\n" || limit) {
          if (char === "\n") {
            limit--;
          }
          push(resArr, true, char);
        }
      });
      while (resArr.length > 1 && resArr[resArr.length - 1] === " ") {
        resArr.pop();
      }
      return resArr.join("");
    }
    const startCharacter = [];
    limit = limitLinebreaksCount;
    if (str[0].trim() === "") {
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim().length !== 0) {
          break;
        } else {
          if (str[i] !== "\n" || limit) {
            if (str[i] === "\n") {
              limit--;
            }
            push(startCharacter, true, str[i]);
          }
        }
      }
    }
    const endCharacter = [];
    limit = limitLinebreaksCount;
    if (str.slice(-1).trim() === "") {
      for (let i = str.length; i--; ) {
        if (str[i].trim().length !== 0) {
          break;
        } else {
          if (str[i] !== "\n" || limit) {
            if (str[i] === "\n") {
              limit--;
            }
            push(endCharacter, false, str[i]);
          }
        }
      }
    }
    if (!windowsEol) {
      return startCharacter.join("") + str.trim() + endCharacter.join("");
    }
    return `${startCharacter.join("")}${str.trim()}${endCharacter.join(
      ""
    )}`.replace(/\n/g, "\r\n");
  }
  return str;
}

export default collapseLeadingWhitespace;
