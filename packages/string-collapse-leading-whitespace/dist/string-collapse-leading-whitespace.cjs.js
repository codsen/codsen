/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

'use strict';

var rawNbsp = "\xA0";
function push(arr) {
  var leftSide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var charToPush = arguments.length > 2 ? arguments[2] : undefined;
  if (
  !charToPush.trim().length && (
  !arr.length || charToPush === "\n" || charToPush === rawNbsp || (leftSide ? arr[arr.length - 1] : arr[0]) !== " ") && (
  !arr.length || (leftSide ? arr[arr.length - 1] : arr[0]) !== "\n" || charToPush === "\n" || charToPush === rawNbsp)
  ) {
      if (leftSide) {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[arr.length - 1] === " ") {
          while (arr.length && arr[arr.length - 1] === " ") {
            arr.pop();
          }
        }
        arr.push(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      } else {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[0] === " ") {
          while (arr.length && arr[0] === " ") {
            arr.shift();
          }
        }
        arr.unshift(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      }
    }
}
function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
  if (typeof str === "string" && str.length) {
    var windowsEol = false;
    if (str.includes("\r\n")) {
      windowsEol = true;
    }
    var limitLinebreaksCount;
    if (!originalLimitLinebreaksCount ||
    typeof originalLimitLinebreaksCount !== "number") {
      limitLinebreaksCount = 1;
    } else {
      limitLinebreaksCount = originalLimitLinebreaksCount;
    }
    var limit;
    if (str.trim() === "") {
      var resArr = [];
      limit = limitLinebreaksCount;
      Array.from(str).forEach(function (_char) {
        if (_char !== "\n" || limit) {
          if (_char === "\n") {
            limit--;
          }
          push(resArr, true, _char);
        }
      });
      while (resArr.length > 1 && resArr[resArr.length - 1] === " ") {
        resArr.pop();
      }
      return resArr.join("");
    }
    var startCharacter = [];
    limit = limitLinebreaksCount;
    if (str[0].trim() === "") {
      for (var i = 0, len = str.length; i < len; i++) {
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
    var endCharacter = [];
    limit = limitLinebreaksCount;
    if (str.slice(-1).trim() === "") {
      for (var _i = str.length; _i--;) {
        if (str[_i].trim().length !== 0) {
          break;
        } else {
          if (str[_i] !== "\n" || limit) {
            if (str[_i] === "\n") {
              limit--;
            }
            push(endCharacter, false, str[_i]);
          }
        }
      }
    }
    if (!windowsEol) {
      return startCharacter.join("") + str.trim() + endCharacter.join("");
    }
    return "".concat(startCharacter.join("")).concat(str.trim()).concat(endCharacter.join("")).replace(/\n/g, "\r\n");
  }
  return str;
}

module.exports = collapseLeadingWhitespace;
