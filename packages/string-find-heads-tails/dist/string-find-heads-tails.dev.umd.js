/**
 * string-find-heads-tails
 * Finds where are arbitrary templating marker heads and tails located
 * Version: 4.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-find-heads-tails/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringFindHeadsTails = {}));
}(this, (function (exports) { 'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.13.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length) {
      return [something];
    }

    return [];
  }

  return something;
}

/* eslint no-plusplus:0 */

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function isStr(something) {
  return typeof something === "string";
}

var defaults = {
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false
};

var defaultGetNextIdx = function defaultGetNextIdx(index) {
  return index + 1;
}; // eslint-disable-next-line consistent-return


function march(str, position, whatToMatchVal, originalOpts, special, getNextIdx) {
  if (special === void 0) {
    special = false;
  }

  if (getNextIdx === void 0) {
    getNextIdx = defaultGetNextIdx;
  }

  var whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal; // early ending case if matching EOL being at 0-th index:

  if (+position < 0 && special && whatToMatchValVal === "EOL") {
    return whatToMatchValVal;
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  if (position >= str.length && !special) {
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
  var i = position;
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

    if (opts && !opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.includes(str[i]) || opts && opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.map(function (val) {
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
        patience -= 1; // the bigger the maxMismatches, the further away we must check for
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
    }

    if (opts && opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
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
  // insurance
  if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!" + (Array.isArray(originalOpts.trimBeforeMatching) ? " Did you mean to use opts.trimCharsBeforeMatching?" : ""));
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  if (typeof opts.trimCharsBeforeMatching === "string") {
    // arrayiffy if needed:
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  } // stringify all:


  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
    return isStr(el) ? el : String(el);
  });

  if (!isStr(str)) {
    return false;
  }

  if (!str.length) {
    return false;
  }

  if (!Number.isInteger(position) || position < 0) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: " + typeof position + ", equal to:\n" + JSON.stringify(position, null, 4));
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
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's " + typeof originalWhatToMatch + ", equal to:\n" + JSON.stringify(originalWhatToMatch, null, 4));
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"" + typeof originalOpts + "\", and equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }

  var culpritsIndex = 0;
  var culpritsVal = "";

  if (opts && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.some(function (el, i) {
    if (el.length > 1) {
      culpritsIndex = i;
      culpritsVal = el;
      return true;
    }

    return false;
  })) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index " + culpritsIndex + " is longer than 1 character, " + culpritsVal.length + " (equals to " + culpritsVal + "). Please split it into separate characters and put into array as separate elements.");
  } // action
  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null


  if (!whatToMatch || !Array.isArray(whatToMatch) || // 0
  Array.isArray(whatToMatch) && !whatToMatch.length || // []
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && !whatToMatch[0].trim() // [""]
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

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (var _y = startingPosition; _y < str.length; _y++) {
            // assemble the value of the current character
            var _currentChar = str[_y]; // do the actual evaluation, is the current character non-whitespace/non-skiped

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
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

      throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_08] the third argument, \"whatToMatch\", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key \"cb\" is not set!" + extraNote);
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
      _startingPosition += 1;
    } else if (mode === "matchLeft") {
      _startingPosition -= 1;
    }

    var found = march(str, _startingPosition, whatToMatchVal, opts, special, function (i2) {
      return mode[5] === "L" ? i2 - 1 : i2 + 1;
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

function matchRightIncl(str, position, whatToMatch, opts) {
  return main("matchRightIncl", str, position, whatToMatch, opts);
}

var version = "4.0.2";

var version$1 = version;

function isObj$1(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function isStr$1(something) {
  return typeof something === "string";
}

var defaults$1 = {
  fromIndex: 0,
  throwWhenSomethingWrongIsDetected: true,
  allowWholeValueToBeOnlyHeadsOrTails: true,
  source: "string-find-heads-tails",
  matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
  relaxedAPI: false
};

function strFindHeadsTails(str, heads, tails, originalOpts) {
  // prep opts
  if (originalOpts && !isObj$1(originalOpts)) {
    throw new TypeError("string-find-heads-tails: [THROW_ID_01] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: " + originalOpts + " (type: " + typeof originalOpts + ")");
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults$1), originalOpts);

  if (typeof opts.fromIndex === "string" && /^\d*$/.test(opts.fromIndex)) {
    opts.fromIndex = Number(opts.fromIndex);
  } else if (!Number.isInteger(opts.fromIndex) || opts.fromIndex < 0) {
    throw new TypeError(opts.source + " [THROW_ID_18] the fourth input argument must be a natural number or zero! Currently it's: " + opts.fromIndex);
  } //
  // insurance
  // ---------

  if (!isStr$1(str) || str.length === 0) {
    if (opts.relaxedAPI) {
      return [];
    }

    throw new TypeError("string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: " + typeof str + ", equal to: " + str);
  }

  var culpritsVal;
  var culpritsIndex; // - for heads

  if (typeof heads !== "string" && !Array.isArray(heads)) {
    if (opts.relaxedAPI) {
      return [];
    }

    throw new TypeError("string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it's: " + typeof heads + ", equal to:\n" + JSON.stringify(heads, null, 4));
  } else if (typeof heads === "string") {
    if (heads.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }

      throw new TypeError("string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it's empty.");
    } else {
      // eslint-disable-next-line no-param-reassign
      heads = arrayiffy(heads);
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
        // eslint-disable-next-line no-param-reassign
        heads = heads.filter(function (el) {
          return isStr$1(el) && el.length > 0;
        });

        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at " + culpritsIndex + "th index is " + typeof culpritsVal + ", equal to:\n" + JSON.stringify(culpritsVal, null, 4) + ". Whole heads array looks like:\n" + JSON.stringify(heads, null, 4));
      }
    } else if (!heads.every(function (val, index) {
      culpritsIndex = index;
      return isStr$1(val) && val.length > 0 && val.trim() !== "";
    })) {
      if (opts.relaxedAPI) {
        // eslint-disable-next-line no-param-reassign
        heads = heads.filter(function (el) {
          return isStr$1(el) && el.length > 0;
        });

        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there's one detected at index " + culpritsIndex + " of heads array:\n" + JSON.stringify(heads, null, 4) + ".");
      }
    }
  } // - for tails


  if (!isStr$1(tails) && !Array.isArray(tails)) {
    if (opts.relaxedAPI) {
      return [];
    }

    throw new TypeError("string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it's: " + typeof tails + ", equal to:\n" + JSON.stringify(tails, null, 4));
  } else if (isStr$1(tails)) {
    if (tails.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }

      throw new TypeError("string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it's empty.");
    } else {
      // eslint-disable-next-line no-param-reassign
      tails = arrayiffy(tails);
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
        // eslint-disable-next-line no-param-reassign
        tails = tails.filter(function (el) {
          return isStr$1(el) && el.length > 0;
        });

        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at " + culpritsIndex + "th index is " + typeof culpritsVal + ", equal to:\n" + JSON.stringify(culpritsVal, null, 4) + ". Whole tails array is equal to:\n" + JSON.stringify(tails, null, 4));
      }
    } else if (!tails.every(function (val, index) {
      culpritsIndex = index;
      return isStr$1(val) && val.length > 0 && val.trim() !== "";
    })) {
      if (opts.relaxedAPI) {
        // eslint-disable-next-line no-param-reassign
        tails = tails.filter(function (el) {
          return isStr$1(el) && el.length > 0;
        });

        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError("string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there's one detected at index " + culpritsIndex + ". Whole tails array is equal to:\n" + JSON.stringify(tails, null, 4));
      }
    }
  } // inner variable meaning is opts.source the default-one


  var s = opts.source === defaults$1.source;

  if (opts.throwWhenSomethingWrongIsDetected && !opts.allowWholeValueToBeOnlyHeadsOrTails) {
    if (arrayiffy(heads).includes(str)) {
      throw new Error("" + opts.source + (s ? ": [THROW_ID_16]" : "") + " the whole input string can't be equal to " + (isStr$1(heads) ? "" : "one of ") + "heads (" + str + ")!");
    } else if (arrayiffy(tails).includes(str)) {
      throw new Error("" + opts.source + (s ? ": [THROW_ID_17]" : "") + " the whole input string can't be equal to " + (isStr$1(tails) ? "" : "one of ") + "tails (" + str + ")!");
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
  }, [heads[0].charCodeAt(0), heads[0].charCodeAt(0)]);
  var res = [];
  var oneHeadFound = false;
  var tempResObj = {};
  var tailSuspicionRaised = ""; // if opts.opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder is on and heads
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

      if (typeof matchedHeads === "string") {
        if (!oneHeadFound) {
          // res[0].push(i)
          tempResObj = {};
          tempResObj.headsStartAt = i;
          tempResObj.headsEndAt = i + matchedHeads.length;
          oneHeadFound = true; // offset the index so the characters of the confirmed heads can't be "reused"
          // again for subsequent, false detections:

          i += matchedHeads.length - 1;

          if (tailSuspicionRaised) {
            tailSuspicionRaised = "";
          }

          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          throw new TypeError("" + opts.source + (s ? ": [THROW_ID_19]" : "") + " When processing \"" + str + "\", we found heads (" + str.slice(i, i + matchedHeads.length) + ") starting at character with index number \"" + i + "\" and there was another set of heads before it! Generally speaking, there should be \"heads-tails-heads-tails\", not \"heads-heads-tails\"!\nWe're talking about the area of the code:\n\n\n--------------------------------------starts\n" + str.slice(Math.max(i - 200, 0), i) + "\n      " + ("\x1B[" + 33 + "m------->\x1B[" + 39 + "m") + " " + ("\x1B[" + 31 + "m" + str.slice(i, i + matchedHeads.length) + "\x1B[" + 39 + "m") + " \x1B[" + 33 + "m" + "<-------" + "\x1B[" + 39 + "m\n" + str.slice(i + matchedHeads.length, Math.min(len, i + 200)) + "\n--------------------------------------ends\n\n\nTo turn off this error being thrown, set opts.throwWhenSomethingWrongIsDetected to Boolean false.");
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

        throw new TypeError("" + opts.source + (s ? ": [THROW_ID_20]" : "") + " When processing \"" + str + "\", we had \"opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder\" on. We found heads (" + heads[strictMatchingIndex] + ") but the tails the followed it were not of the same index, " + strictMatchingIndex + " (" + tails[strictMatchingIndex] + ") but " + temp + " (" + matchedTails + ").");
      }

      if (typeof matchedTails === "string") {
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
          tailSuspicionRaised = "" + opts.source + (s ? ": [THROW_ID_21]" : "") + " When processing \"" + str + "\", we found tails (" + str.slice(i, i + matchedTails.length) + ") starting at character with index number \"" + i + "\" but there were no heads preceding it. That's very naughty!";
        }
      }
    } // closing, global checks: // if it's the last character and some heads were found but no tails:

    if (opts.throwWhenSomethingWrongIsDetected && i === len - 1) {

      if (Object.keys(tempResObj).length !== 0) {
        throw new TypeError("" + opts.source + (s ? ": [THROW_ID_22]" : "") + " When processing \"" + str + "\", we reached the end of the string and yet didn't find any tails (" + JSON.stringify(tails, null, 4) + ") to match the last detected heads (" + str.slice(tempResObj.headsStartAt, tempResObj.headsEndAt) + ")!");
      } else if (tailSuspicionRaised) {
        throw new Error(tailSuspicionRaised);
      }
    }
  }
  return res;
}

exports.defaults = defaults$1;
exports.strFindHeadsTails = strFindHeadsTails;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
