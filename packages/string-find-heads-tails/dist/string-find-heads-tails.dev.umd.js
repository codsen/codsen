/**
 * string-find-heads-tails
 * Search for string pairs. A special case of string search algorithm.
 * Version: 3.16.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.stringFindHeadsTails = factory());
}(this, (function () { 'use strict';

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

  /**
   * string-match-left-right
   * Do substrings match what's on the left or right of a given index?
   * Version: 4.0.2
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
   */

  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function march(str, fromIndexInclusive, whatToMatchVal, opts, special, getNextIdx) {
    const whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;

    if (fromIndexInclusive < 0 && special && whatToMatchValVal === "EOL") {
      return whatToMatchValVal;
    }

    if (fromIndexInclusive >= str.length && !special) {
      return false;
    }

    let charsToCheckCount = special ? 1 : whatToMatchVal.length;
    let lastWasMismatched = false;
    let atLeastSomethingWasMatched = false;
    let patience = opts.maxMismatches;
    let i = fromIndexInclusive;
    let somethingFound = false;
    let firstCharacterMatched = false;
    let lastCharacterMatched = false;

    while (str[i]) {
      const nextIdx = getNextIdx(i);

      if (opts.trimBeforeMatching && str[i].trim() === "") {
        if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      if (!opts.i && opts.trimCharsBeforeMatching.includes(str[i]) || opts.i && opts.trimCharsBeforeMatching.map(val => val.toLowerCase()).includes(str[i].toLowerCase())) {
        if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      const charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1];

      if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
        if (!somethingFound) {
          somethingFound = true;
        }

        if (!atLeastSomethingWasMatched) {
          atLeastSomethingWasMatched = true;
        }

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
          patience--;

          for (let y = 0; y <= patience; y++) {
            const nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
            const nextCharInSource = str[getNextIdx(i)];

            if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (!opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 2;
              somethingFound = true;
              break;
            } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (!opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 1;
              somethingFound = true;
              break;
            } else if (nextCharToCompareAgainst === undefined && patience >= 0 && somethingFound && (!opts.firstMustMatch || firstCharacterMatched) && (!opts.lastMustMatch || lastCharacterMatched)) {
              return i;
            }
          }

          if (!somethingFound) {
            lastWasMismatched = i;
          }
        } else if (i === 0 && charsToCheckCount === 1 && !opts.lastMustMatch && atLeastSomethingWasMatched) {
          return 0;
        } else {
          return false;
        }
      }

      if (lastWasMismatched !== false && lastWasMismatched !== i) {
        lastWasMismatched = false;
      }

      if (charsToCheckCount < 1) {
        return i;
      }

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
  }

  function main(mode, str, position, originalWhatToMatch, originalOpts) {
    const defaults = {
      i: false,
      trimBeforeMatching: false,
      trimCharsBeforeMatching: [],
      maxMismatches: 0,
      firstMustMatch: false,
      lastMustMatch: false
    };

    if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(originalOpts.trimBeforeMatching) ? ` Did you mean to use opts.trimCharsBeforeMatching?` : ""}`);
    }

    const opts = Object.assign({}, defaults, originalOpts);
    opts.trimCharsBeforeMatching = arrayiffyString(opts.trimCharsBeforeMatching);
    opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el => isStr(el) ? el : String(el));

    if (!isStr(str)) {
      return false;
    } else if (!str.length) {
      return false;
    }

    if (!Number.isInteger(position) || position < 0) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof position}, equal to:\n${JSON.stringify(position, null, 4)}`);
    }

    let whatToMatch;
    let special;

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
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(originalWhatToMatch, null, 4)}`);
    }

    if (originalOpts && !isObj(originalOpts)) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
    }

    let culpritsIndex;
    let culpritsVal;

    if (opts.trimCharsBeforeMatching.some((el, i) => {
      if (el.length > 1) {
        culpritsIndex = i;
        culpritsVal = el;
        return true;
      }

      return false;
    })) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`);
    }

    if (!whatToMatch || !Array.isArray(whatToMatch) || Array.isArray(whatToMatch) && !whatToMatch.length || Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && !whatToMatch[0].trim().length) {
      if (typeof opts.cb === "function") {
        let firstCharOutsideIndex;
        let startingPosition = position;

        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }

        if (mode[5] === "L") {
          for (let y = startingPosition; y--;) {
            const currentChar = str[y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim().length) && (!opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (let y = startingPosition; y < str.length; y++) {
            const currentChar = str[y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar.trim().length) && (!opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        }

        if (firstCharOutsideIndex === undefined) {
          return false;
        }

        const wholeCharacterOutside = str[firstCharOutsideIndex];
        const indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
        let theRemainderOfTheString = "";

        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
        }

        if (mode[5] === "L") {
          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        }

        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          theRemainderOfTheString = str.slice(firstCharOutsideIndex);
        }

        return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
      }

      let extraNote = "";

      if (!originalOpts) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }

      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${extraNote}`);
    }

    for (let i = 0, len = whatToMatch.length; i < len; i++) {
      special = typeof whatToMatch[i] === "function";
      const whatToMatchVal = whatToMatch[i];
      let fullCharacterInFront;
      let indexOfTheCharacterInFront;
      let restOfStringInFront = "";
      let startingPosition = position;

      if (mode === "matchRight") {
        startingPosition++;
      } else if (mode === "matchLeft") {
        startingPosition--;
      }

      const found = march(str, startingPosition, whatToMatchVal, opts, special, i => mode[5] === "L" ? i - 1 : i + 1);

      if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
      }

      if (Number.isInteger(found)) {
        indexOfTheCharacterInFront = mode.startsWith("matchLeft") ? found - 1 : found + 1;

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
  }

  function matchRightIncl(str, position, whatToMatch, opts) {
    return main("matchRightIncl", str, position, whatToMatch, opts);
  }

  function isObj$1(something) {
    return something && _typeof(something) === "object" && !Array.isArray(something);
  }

  function isStr$1(something) {
    return typeof something === "string";
  }

  function strFindHeadsTails(str, heads, tails, originalOpts) {
    // prep opts
    if (originalOpts && !isObj$1(originalOpts)) {
      throw new TypeError("string-find-heads-tails: [THROW_ID_01] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ".concat(originalOpts, " (type: ").concat(_typeof(originalOpts), ")"));
    }

    var defaults = {
      fromIndex: 0,
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: true,
      source: "string-find-heads-tails",
      matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
      relaxedAPI: false
    };
    var opts = Object.assign({}, defaults, originalOpts);

    if (typeof opts.fromIndex === "string" && /^\d*$/.test(opts.fromIndex)) {
      opts.fromIndex = Number(opts.fromIndex);
    } else if (!Number.isInteger(opts.fromIndex) || opts.fromIndex < 0) {
      throw new TypeError("".concat(opts.source, " [THROW_ID_18] the fourth input argument must be a natural number or zero! Currently it's: ").concat(opts.fromIndex));
    } //
    // insurance
    // ---------


    if (!isStr$1(str) || str.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }

      throw new TypeError("string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(str));
    }

    var culpritsVal;
    var culpritsIndex; // - for heads

    if (typeof heads !== "string" && !Array.isArray(heads)) {
      if (opts.relaxedAPI) {
        return [];
      }

      throw new TypeError("string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it's: ".concat(_typeof(heads), ", equal to:\n").concat(JSON.stringify(heads, null, 4)));
    } else if (typeof heads === "string") {
      if (heads.length === 0) {
        if (opts.relaxedAPI) {
          return [];
        }

        throw new TypeError("string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it's empty.");
      } else {
        heads = arrayiffyString(heads);
      }
    } else if (Array.isArray(heads)) {
      if (heads.length === 0) {
        if (opts.relaxedAPI) {
          return [];
        }

        throw new TypeError("string-find-heads-tails: [THROW_ID_05] the second input argument, heads, must be a non-empty array and contain at least one string! Currently it's empty.");
      } else if (!heads.every(function (val, index) {
        culpritsVal = val;
        culpritsIndex = index;
        return isStr$1(val);
      })) {
        if (opts.relaxedAPI) {
          heads = heads.filter(function (el) {
            return isStr$1(el) && el.length > 0;
          });

          if (heads.length === 0) {
            return [];
          }
        } else {
          throw new TypeError("string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at ".concat(culpritsIndex, "th index is ").concat(_typeof(culpritsVal), ", equal to:\n").concat(JSON.stringify(culpritsVal, null, 4), ". Whole heads array looks like:\n").concat(JSON.stringify(heads, null, 4)));
        }
      } else if (!heads.every(function (val, index) {
        culpritsIndex = index;
        return isStr$1(val) && val.length > 0 && val.trim() !== "";
      })) {
        if (opts.relaxedAPI) {
          heads = heads.filter(function (el) {
            return isStr$1(el) && el.length > 0;
          });

          if (heads.length === 0) {
            return [];
          }
        } else {
          throw new TypeError("string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there's one detected at index ".concat(culpritsIndex, " of heads array:\n").concat(JSON.stringify(heads, null, 4), "."));
        }
      }
    } // - for tails


    if (!isStr$1(tails) && !Array.isArray(tails)) {
      if (opts.relaxedAPI) {
        return [];
      }

      throw new TypeError("string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it's: ".concat(_typeof(tails), ", equal to:\n").concat(JSON.stringify(tails, null, 4)));
    } else if (isStr$1(tails)) {
      if (tails.length === 0) {
        if (opts.relaxedAPI) {
          return [];
        }

        throw new TypeError("string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it's empty.");
      } else {
        tails = arrayiffyString(tails);
      }
    } else if (Array.isArray(tails)) {
      if (tails.length === 0) {
        if (opts.relaxedAPI) {
          return [];
        }

        throw new TypeError("string-find-heads-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it's empty.");
      } else if (!tails.every(function (val, index) {
        culpritsVal = val;
        culpritsIndex = index;
        return isStr$1(val);
      })) {
        if (opts.relaxedAPI) {
          tails = tails.filter(function (el) {
            return isStr$1(el) && el.length > 0;
          });

          if (tails.length === 0) {
            return [];
          }
        } else {
          throw new TypeError("string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at ".concat(culpritsIndex, "th index is ").concat(_typeof(culpritsVal), ", equal to:\n").concat(JSON.stringify(culpritsVal, null, 4), ". Whole tails array is equal to:\n").concat(JSON.stringify(tails, null, 4)));
        }
      } else if (!tails.every(function (val, index) {
        culpritsIndex = index;
        return isStr$1(val) && val.length > 0 && val.trim() !== "";
      })) {
        if (opts.relaxedAPI) {
          tails = tails.filter(function (el) {
            return isStr$1(el) && el.length > 0;
          });

          if (tails.length === 0) {
            return [];
          }
        } else {
          throw new TypeError("string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there's one detected at index ".concat(culpritsIndex, ". Whole tails array is equal to:\n").concat(JSON.stringify(tails, null, 4)));
        }
      }
    } // inner variable meaning is opts.source the default-one


    var s = opts.source === defaults.source;

    if (opts.throwWhenSomethingWrongIsDetected && !opts.allowWholeValueToBeOnlyHeadsOrTails) {
      if (arrayiffyString(heads).includes(str)) {
        throw new Error("".concat(opts.source).concat(s ? ": [THROW_ID_16]" : "", " the whole input string can't be equal to ").concat(isStr$1(heads) ? "" : "one of ", "heads (").concat(str, ")!"));
      } else if (arrayiffyString(tails).includes(str)) {
        throw new Error("".concat(opts.source).concat(s ? ": [THROW_ID_17]" : "", " the whole input string can't be equal to ").concat(isStr$1(tails) ? "" : "one of ", "tails (").concat(str, ")!"));
      }
    } //
    // prep stage.
    // ----
    // We are going to traverse the input string, checking each character one-by-one,
    // is it a first character of a sub-string, heads or tails.
    // The easy but inefficient algorithm is to traverse the input string, then
    // for each of the character, run another loop, slicing and matching, is there
    // one of heads or tails on the right of it.
    // Let's cut corners a little bit.
    // We know that heads and tails often start with special characters, not letters.
    // For example, "%%-" and "-%%".
    // There might be few types of heads and tails, for example, ones that will be
    // further processed (like wrapped with other strings) and ones that won't.
    // So, you might have two sets of heads and tails:
    // "%%-" and "-%%"; "%%_" and "_%%".
    // Notice they're quite similar and don't contain letters.
    // Imagine we're traversing the string and looking for above set of heads and
    // tails. We're concerned only if the current character is equal to "%", "-" or "_".
    // Practically, that "String.charCodeAt(0)" values:
    // '%'.charCodeAt(0) = 37
    // '-'.charCodeAt(0) = 45
    // '_'.charCodeAt(0) = 95
    // Since we don't know how many head and tail sets there will be nor their values,
    // conceptually, we are going to extract the RANGE OF CHARCODES, in the case above,
    // [37, 95].
    // This means, we traverse the string and check, is its charcode in range [37, 95].
    // If so, then we'll do all slicing/comparing.
    // take array of strings, heads, and extract the upper and lower range of indexes
    // of their first letters using charCodeAt(0)


    var headsAndTailsFirstCharIndexesRange = heads.concat(tails).map(function (value) {
      return value.charAt(0);
    }) // get first letters
    .reduce(function (res, val) {
      if (val.charCodeAt(0) > res[1]) {
        return [res[0], val.charCodeAt(0)]; // find the char index of the max char index out of all
      }

      if (val.charCodeAt(0) < res[0]) {
        return [val.charCodeAt(0), res[1]]; // find the char index of the min char index out of all
      }

      return res;
    }, [heads[0].charCodeAt(0), // base is the 1st char index of 1st el.
    heads[0].charCodeAt(0)]);
    var res = [];
    var oneHeadFound = false;
    var tempResObj = {};
    var tailSuspicionRaised = false; // if opts.opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder is on and heads
    // matched was i-th in the array, we will record its index "i" and later match
    // the next tails to be also "i-th". Or throw.

    var strictMatchingIndex;

    for (var i = opts.fromIndex, len = str.length; i < len; i++) {
      var firstCharsIndex = str[i].charCodeAt(0);

      if (firstCharsIndex <= headsAndTailsFirstCharIndexesRange[1] && firstCharsIndex >= headsAndTailsFirstCharIndexesRange[0]) {
        var matchedHeads = matchRightIncl(str, i, heads);

        if (matchedHeads && opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder) {
          for (var z = heads.length; z--;) {
            if (heads[z] === matchedHeads) {
              strictMatchingIndex = z;
              break;
            }
          }
        }

        if (matchedHeads) {
          if (!oneHeadFound) {
            // res[0].push(i)
            tempResObj = {};
            tempResObj.headsStartAt = i;
            tempResObj.headsEndAt = i + matchedHeads.length;
            oneHeadFound = true; // offset the index so the characters of the confirmed heads can't be "reused"
            // again for subsequent, false detections:

            i += matchedHeads.length - 1;

            if (tailSuspicionRaised) {
              tailSuspicionRaised = false;
            }

            continue;
          } else if (opts.throwWhenSomethingWrongIsDetected) {
            throw new TypeError("".concat(opts.source).concat(s ? ": [THROW_ID_19]" : "", " When processing \"").concat(str, "\", we found heads (").concat(str.slice(i, i + matchedHeads.length), ") starting at character with index number \"").concat(i, "\" and there was another set of heads before it! Generally speaking, there should be \"heads-tails-heads-tails\", not \"heads-heads-tails\"!\nWe're talking about the area of the code:\n\n\n--------------------------------------starts\n").concat(str.slice(Math.max(i - 200, 0), i), "\n      ", "\x1B[".concat(33, "m------->\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", str.slice(i, i + matchedHeads.length), "\x1B[", 39, "m"), " \x1B[", 33, "m", "<-------", "\x1B[", 39, "m\n").concat(str.slice(i + matchedHeads.length, Math.min(len, i + 200)), "\n--------------------------------------ends\n\n\nTo turn off this error being thrown, set opts.throwWhenSomethingWrongIsDetected to Boolean false."));
          }
        }

        var matchedTails = matchRightIncl(str, i, tails);

        if (oneHeadFound && matchedTails && opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder && strictMatchingIndex !== undefined && tails[strictMatchingIndex] !== undefined && tails[strictMatchingIndex] !== matchedTails) {
          var temp = void 0; // find out which index in "matchedTails" does have "tails":

          for (var _z = tails.length; _z--;) {
            if (tails[_z] === matchedTails) {
              temp = _z;
              break;
            }
          }

          throw new TypeError("".concat(opts.source).concat(s ? ": [THROW_ID_20]" : "", " When processing \"").concat(str, "\", we had \"opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder\" on. We found heads (").concat(heads[strictMatchingIndex], ") but the tails the followed it were not of the same index, ").concat(strictMatchingIndex, " (").concat(tails[strictMatchingIndex], ") but ").concat(temp, " (").concat(matchedTails, ")."));
        }

        if (matchedTails) {
          if (oneHeadFound) {
            tempResObj.tailsStartAt = i;
            tempResObj.tailsEndAt = i + matchedTails.length;
            res.push(tempResObj);
            tempResObj = {};
            oneHeadFound = false; // same for tails, offset the index to prevent partial, erroneous detections:

            i += matchedTails.length - 1;
            continue;
          } else if (opts.throwWhenSomethingWrongIsDetected) {
            // this means it's tails found, without preceding heads
            tailSuspicionRaised = "".concat(opts.source).concat(s ? ": [THROW_ID_21]" : "", " When processing \"").concat(str, "\", we found tails (").concat(str.slice(i, i + matchedTails.length), ") starting at character with index number \"").concat(i, "\" but there were no heads preceding it. That's very naughty!");
          }
        }
      } // closing, global checks:
      // if it's the last character and some heads were found but no tails:


      if (opts.throwWhenSomethingWrongIsDetected && i === len - 1) {
        if (Object.keys(tempResObj).length !== 0) {
          throw new TypeError("".concat(opts.source).concat(s ? ": [THROW_ID_22]" : "", " When processing \"").concat(str, "\", we reached the end of the string and yet didn't find any tails (").concat(JSON.stringify(tails, null, 4), ") to match the last detected heads (").concat(str.slice(tempResObj.headsStartAt, tempResObj.headsEndAt), ")!"));
        } else if (tailSuspicionRaised) {
          throw new Error(tailSuspicionRaised);
        }
      }
    }

    return res;
  }

  return strFindHeadsTails;

})));
