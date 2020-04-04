/**
 * string-match-left-right
 * Do substrings match what's on the left or right of a given index?
 * Version: 4.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.stringMatchLeftRight = {}));
}(this, (function (exports) { 'use strict';

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

  /**
   * arrayiffy-if-string
   * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
   * Version: 3.11.28
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
   */
  function arrayiffyString(something) {
    if (typeof something === "string") {
      if (something.length > 0) {
        return [something];
      }

      return [];
    }

    return something;
  }

  function isObj(something) {
    return something && _typeof(something) === "object" && !Array.isArray(something);
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function march(str, fromIndexInclusive, whatToMatchVal, opts, special, getNextIdx) {
    var whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal; // early ending case if matching EOL being at 0-th index:

    if (fromIndexInclusive < 0 && special && whatToMatchValVal === "EOL") {
      return whatToMatchValVal;
    }

    if (fromIndexInclusive >= str.length && !special) {
      return false;
    }

    var charsToCheckCount = special ? 1 : whatToMatchVal.length;
    var lastWasMismatched = false; // value is "false" or index of where it was activated
    // if no character was ever matched, even through if opts.maxMismatches
    // would otherwise allow to skip characters, this will act as a last
    // insurance - at least one character must have been matched to yield a
    // positive result!

    var atLeastSomethingWasMatched = false;
    var patience = opts.maxMismatches;
    var i = fromIndexInclusive;
    var somethingFound = false; // these two drive opts.firstMustMatch and opts.lastMustMatch:

    var firstCharacterMatched = false;
    var lastCharacterMatched = false;

    while (str[i]) {
      var nextIdx = getNextIdx(i);

      if (opts.trimBeforeMatching && str[i].trim() === "") {
        if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      if (!opts.i && opts.trimCharsBeforeMatching.includes(str[i]) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
        return val.toLowerCase();
      }).includes(str[i].toLowerCase())) {
        if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
          // return true because we reached the zero'th index, exactly what we're looking for
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      var charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1]; // let's match

      if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
        if (!somethingFound) {
          somethingFound = true;
        }

        if (!atLeastSomethingWasMatched) {
          atLeastSomethingWasMatched = true;
        } // if this was the first character from the "to-match" list, flip the flag


        if (charsToCheckCount === whatToMatchVal.length) {
          firstCharacterMatched = true;
        } else if (charsToCheckCount === 1) {
          lastCharacterMatched = true;
        }

        charsToCheckCount -= 1;

        if (charsToCheckCount < 1) {
          return i;
        }
      } else {
        if (opts.maxMismatches && patience && i) {
          patience--; // the bigger the maxMismatches, the further away we must check for
          // alternative matches

          for (var y = 0; y <= patience; y++) {
            // maybe str[i] will match against next charToCompareAgainst?
            var nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
            var nextCharInSource = str[getNextIdx(i)];

            if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && ( // ensure we're not skipping the first enforced character:
            !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 2;
              somethingFound = true;
              break;
            } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && ( // ensure we're not skipping the first enforced character:
            !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 1;
              somethingFound = true;
              break;
            } else if (nextCharToCompareAgainst === undefined && patience >= 0 && somethingFound && (!opts.firstMustMatch || firstCharacterMatched) && (!opts.lastMustMatch || lastCharacterMatched)) {
              // If "nextCharToCompareAgainst" is undefined, this
              // means there are no more characters left to match,
              // this is the last character to be matched.
              // This means, if patience >= 0, this is it,
              // the match is still positive.
              return i;
            } // ███████████████████████████████████████

          }

          if (!somethingFound) {
            // if the character was rogue, we mark it:
            lastWasMismatched = i; // patience--;
            // console.log(
            //   `350 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`patience`}\u001b[${39}m`} = ${patience}`
            // );
          }
        } else if (i === 0 && charsToCheckCount === 1 && !opts.lastMustMatch && atLeastSomethingWasMatched) {
          return 0;
        } else {
          return false;
        }
      } // turn off "lastWasMismatched" if it's on and it hasn't been activated
      // on this current index:


      if (lastWasMismatched !== false && lastWasMismatched !== i) {
        lastWasMismatched = false;
      } // if all was matched, happy days


      if (charsToCheckCount < 1) {
        return i;
      } // iterate onto the next index, otherwise while would loop infinitely


      i = getNextIdx(i);
    }

    if (charsToCheckCount > 0) {
      if (special && whatToMatchValVal === "EOL") {
        return true;
      } else if (opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
        return lastWasMismatched || 0;
      }

      return false;
    }
  } //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // Real deal


  function main(mode, str, position, originalWhatToMatch, originalOpts) {
    var defaults = {
      i: false,
      trimBeforeMatching: false,
      trimCharsBeforeMatching: [],
      maxMismatches: 0,
      firstMustMatch: false,
      lastMustMatch: false
    }; // insurance

    if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!").concat(Array.isArray(originalOpts.trimBeforeMatching) ? " Did you mean to use opts.trimCharsBeforeMatching?" : ""));
    }

    var opts = Object.assign({}, defaults, originalOpts);
    opts.trimCharsBeforeMatching = arrayiffyString(opts.trimCharsBeforeMatching);
    opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
      return isStr(el) ? el : String(el);
    });

    if (!isStr(str)) {
      return false;
    } else if (!str.length) {
      return false;
    }

    if (!Number.isInteger(position) || position < 0) {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ").concat(_typeof(position), ", equal to:\n").concat(JSON.stringify(position, null, 4)));
    }

    var whatToMatch;
    var special;

    if (isStr(originalWhatToMatch)) {
      whatToMatch = [originalWhatToMatch];
    } else if (Array.isArray(originalWhatToMatch)) {
      whatToMatch = originalWhatToMatch;
    } else if (!originalWhatToMatch) {
      whatToMatch = originalWhatToMatch;
    } else if (typeof originalWhatToMatch === "function") {
      whatToMatch = [];
      whatToMatch.push(originalWhatToMatch);
    } else {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ").concat(_typeof(originalWhatToMatch), ", equal to:\n").concat(JSON.stringify(originalWhatToMatch, null, 4)));
    }

    if (originalOpts && !isObj(originalOpts)) {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"").concat(_typeof(originalOpts), "\", and equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    }

    var culpritsIndex;
    var culpritsVal;

    if (opts.trimCharsBeforeMatching.some(function (el, i) {
      if (el.length > 1) {
        culpritsIndex = i;
        culpritsVal = el;
        return true;
      }

      return false;
    })) {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ").concat(culpritsIndex, " is longer than 1 character, ").concat(culpritsVal.length, " (equals to ").concat(culpritsVal, "). Please split it into separate characters and put into array as separate elements."));
    } // action
    // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
    // for - is falsey - empty string within array (or not), OR given null


    if (!whatToMatch || !Array.isArray(whatToMatch) || // 0
    Array.isArray(whatToMatch) && !whatToMatch.length || // []
    Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && !whatToMatch[0].trim().length // [""]
    ) {
        if (typeof opts.cb === "function") {
          var firstCharOutsideIndex; // matchLeft() or matchRightIncl() methods start at index "position"

          var startingPosition = position;

          if (mode === "matchLeftIncl" || mode === "matchRight") {
            startingPosition += 1;
          }

          if (mode[5] === "L") {
            for (var y = startingPosition; y--;) {
              // assemble the value of the current character
              var currentChar = str[y]; // do the actual evaluation, is the current character non-whitespace/non-skiped

              if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim().length) && (!opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
                firstCharOutsideIndex = y;
                break;
              }
            }
          } else if (mode.startsWith("matchRight")) {
            for (var _y = startingPosition; _y < str.length; _y++) {
              // assemble the value of the current character
              var _currentChar = str[_y]; // do the actual evaluation, is the current character non-whitespace/non-skiped

              if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim().length) && (!opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
                firstCharOutsideIndex = _y;
                break;
              }
            }
          }

          if (firstCharOutsideIndex === undefined) {
            return false;
          }

          var wholeCharacterOutside = str[firstCharOutsideIndex];
          var indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
          var theRemainderOfTheString = "";

          if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
            theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
          }

          if (mode[5] === "L") {
            return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
          } // ELSE matchRight & matchRightIncl


          if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
            theRemainderOfTheString = str.slice(firstCharOutsideIndex);
          }

          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        }

        var extraNote = "";

        if (!originalOpts) {
          extraNote = " More so, the whole options object, the fourth input argument, is missing!";
        }

        throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_08] the third argument, \"whatToMatch\", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key \"cb\" is not set!").concat(extraNote));
      } // Case 2. Normal operation where callback may or may not be present, but it is
    // only accompanying the matching of what was given in 3rd input argument.
    // Then if 3rd arg's contents were matched, callback is checked and its Boolean
    // result is merged using logical "AND" - meaning both have to be true to yield
    // final result "true".


    for (var i = 0, len = whatToMatch.length; i < len; i++) {
      special = typeof whatToMatch[i] === "function"; // since input can be function, we need to grab the value explicitly:

      var whatToMatchVal = whatToMatch[i];
      var fullCharacterInFront = void 0;
      var indexOfTheCharacterInFront = void 0;
      var restOfStringInFront = "";
      var _startingPosition = position;

      if (mode === "matchRight") {
        _startingPosition++;
      } else if (mode === "matchLeft") {
        _startingPosition--;
      }

      var found = march(str, _startingPosition, whatToMatchVal, opts, special, function (i) {
        return mode[5] === "L" ? i - 1 : i + 1;
      }); // if march() returned positive result and it was "special" case,
      // Bob's your uncle, here's the result:

      if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
      } // now, the "found" is the index of the first character of what was found.
      // we need to calculate the character to the left/right of it:


      if (Number.isInteger(found)) {
        indexOfTheCharacterInFront = mode.startsWith("matchLeft") ? found - 1 : found + 1; //

        if (mode[5] === "L") {
          restOfStringInFront = str.slice(0, found);
        } else {
          restOfStringInFront = str.slice(indexOfTheCharacterInFront);
        }
      }

      if (indexOfTheCharacterInFront < 0) {
        indexOfTheCharacterInFront = undefined;
      }

      if (str[indexOfTheCharacterInFront]) {
        fullCharacterInFront = str[indexOfTheCharacterInFront];
      }

      if (Number.isInteger(found) && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatchVal;
      }
    }

    return false;
  } // External API functions


  function matchLeftIncl(str, position, whatToMatch, opts) {
    return main("matchLeftIncl", str, position, whatToMatch, opts);
  }

  function matchLeft(str, position, whatToMatch, opts) {
    return main("matchLeft", str, position, whatToMatch, opts);
  }

  function matchRightIncl(str, position, whatToMatch, opts) {
    return main("matchRightIncl", str, position, whatToMatch, opts);
  }

  function matchRight(str, position, whatToMatch, opts) {
    return main("matchRight", str, position, whatToMatch, opts);
  }

  exports.matchLeft = matchLeft;
  exports.matchLeftIncl = matchLeftIncl;
  exports.matchRight = matchRight;
  exports.matchRightIncl = matchRightIncl;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
