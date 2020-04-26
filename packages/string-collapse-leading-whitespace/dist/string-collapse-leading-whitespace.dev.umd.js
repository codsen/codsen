/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 2.0.18
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.stringCollapseLeadingWhitespace = factory());
}(this, (function () { 'use strict';

  var rawNbsp = "\xA0"; // this function filters the characters, does the "collapsing" and trimming

  function push(arr) {
    var leftSide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var charToPush = arguments.length > 2 ? arguments[2] : undefined;

    // character has to be line break, space or non-breaking space - nothing
    // else is considered
    if ( // 1. it's \n or nbsp or space or some other whitespace char which would end up as space
    !charToPush.trim() && ( // 2. don't let sequences of spaces - \n or nbsp sequences are fine
    !arr.length || charToPush === "\n" || charToPush === rawNbsp || (leftSide ? arr[arr.length - 1] : arr[0]) !== " ") && ( // 3. line trimming - only other linebreaks or nbsp's can follow linebreaks (per-line trim)
    !arr.length || (leftSide ? arr[arr.length - 1] : arr[0]) !== "\n" || charToPush === "\n" || charToPush === rawNbsp) // this last clause is line trimming
    ) {
        // don't let in spaces if array is empty
        // tabs would end up as spaces
        if (leftSide) {
          if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[arr.length - 1] === " ") {
            while (arr.length && arr[arr.length - 1] === " ") {
              arr.pop(); // remove the last element, space
            }
          } // 2. put in the end of arr


          arr.push(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
        } else {
          // 1. if last char in arr is space and line break is incoming, remove
          // all spaces from the end of arr either until it's empty or until the
          // last element is not a space
          if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[0] === " ") {
            while (arr.length && arr[0] === " ") {
              arr.shift(); // remove the first element, space
            }
          } // 2. put in front of arr


          arr.unshift(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
        }
      }
  }

  function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
    if (typeof str === "string" && str.length) {
      var windowsEol = false;

      if (str.includes("\r\n")) {
        windowsEol = true;
      } // without a fuss, set the max allowed line breaks as a leading/trailing whitespace:


      var limitLinebreaksCount;

      if (!originalLimitLinebreaksCount || // will avoid zero too
      typeof originalLimitLinebreaksCount !== "number") {
        limitLinebreaksCount = 1;
      } else {
        limitLinebreaksCount = originalLimitLinebreaksCount;
      }

      var limit; //
      // STAGE 1. quick end - whole string is whitespace

      if (str.trim() === "") {
        var resArr = [];
        limit = limitLinebreaksCount;
        Array.from(str).forEach(function (char) {
          if (char !== "\n" || limit) {
            if (char === "\n") {
              limit -= 1;
            }

            push(resArr, true, char);
          }
        }); // now trim the whitespace characters from the end which are not
        // non-breaking spaces:

        while (resArr.length > 1 && resArr[resArr.length - 1] === " ") {
          resArr.pop();
        }

        return resArr.join("");
      } //
      // STAGE 2. Calculation.
      // Set the default to put in front:


      var startCharacter = [];
      limit = limitLinebreaksCount; // If there's some leading whitespace. Check first character:

      if (str[0].trim() === "") {
        for (var i = 0, len = str.length; i < len; i++) {
          if (str[i].trim()) {
            break;
          } else if (str[i] !== "\n" || limit) {
            // limit the amount of linebreaks to "limitLinebreaksCount"
            if (str[i] === "\n") {
              limit -= 1;
            }

            push(startCharacter, true, str[i]);
          }
        }
      } // set the default to put in front:


      var endCharacter = [];
      limit = limitLinebreaksCount; // if there's some trailing whitespace

      if (str.slice(-1).trim() === "") {
        for (var _i = str.length; _i--;) {
          if (str[_i].trim()) {
            break;
          } else if (str[_i] !== "\n" || limit) {
            // limit the amount of linebreaks to "limitLinebreaksCount"
            if (str[_i] === "\n") {
              limit -= 1;
            }

            push(endCharacter, false, str[_i]);
          }
        }
      } // -------------------------------------------------------------------------


      if (!windowsEol) {
        return startCharacter.join("") + str.trim() + endCharacter.join("");
      }

      return "".concat(startCharacter.join("")).concat(str.trim()).concat(endCharacter.join("")).replace(/\n/g, "\r\n");
    }

    return str;
  }

  return collapseLeadingWhitespace;

})));
