'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isNaturalNumber = _interopDefault(require('is-natural-number'));
var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var isFun = _interopDefault(require('lodash.isfunction'));
var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
var stringCharacterIsAstralSurrogate = require('string-character-is-astral-surrogate');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArr = Array.isArray;

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}

function isAstral(char) {
  if (typeof char !== "string") {
    return false;
  }
  return char.charCodeAt(0) >= 55296 && char.charCodeAt(0) <= 57343;
}

// A helper f(). Uses 1xx range error codes.
// Returns the index number of the first character of "strToMatch". That's location
// within the input string, "str".
function marchForward(str, fromIndexInclusive, strToMatch, opts, special) {
  // console.log(`args: ${JSON.stringify([...arguments], null, 4)}`);
  console.log("32 marchForward: " + ("\x1B[" + 33 + "m" + "fromIndexInclusive" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(fromIndexInclusive, null, 4));

  if (fromIndexInclusive <= str.length) {
    var charsToCheckCount = strToMatch.length;
    console.log("42 starting " + ("\x1B[" + 33 + "m" + "charsToCheckCount" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(charsToCheckCount, null, 4));
    for (var i = fromIndexInclusive, len = str.length; i < len; i++) {
      console.log("\x1B[" + 36 + "m" + ("================================== str[" + i + "] = " + str[i]) + "\x1B[" + 39 + "m");
      var current = str[i];

      // FIY, high surrogate goes first, low goes second
      // if it's first part of the emoji, glue the second part onto this:
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[i + 1])) {
        // and if it is, glue second onto first-one
        console.log("61 \x1B[" + 33 + "m" + "low surrogate on the right added" + "\x1B[" + 39 + "m");
        current = str[i] + str[i + 1];
      }
      // alternatively, if somehow the starting index was given in the middle,
      // between heads and tails surrogates of this emoji, and we're on the tails
      // already, check for presence of heads in front and glue that if present:
      if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i - 1])) {
        // and if it is, glue second onto first-one
        console.log("68 \x1B[" + 33 + "m" + "high surrogate on the left added" + "\x1B[" + 39 + "m");
        current = str[i - 1] + str[i];
      }

      console.log("74 " + ("\x1B[" + 33 + "m" + "current" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(current, null, 4));
      if (opts.trimBeforeMatching && str[i].trim() === "") {
        console.log("81 \x1B[" + 31 + "m" + "trimmed" + "\x1B[" + 39 + "m");
        continue;
      }
      if (!opts.i && opts.trimCharsBeforeMatching.includes(current) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
        return val.toLowerCase();
      }).includes(current.toLowerCase())) {
        console.log("91 char in the skip list");
        if (current.length === 2) {
          // if it was emoji, offset by two
          i += 1;
        }
        continue;
      }

      var whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount];
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(whatToCompareTo) && existy(strToMatch[strToMatch.length - charsToCheckCount + 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(strToMatch[strToMatch.length - charsToCheckCount + 1])) {
        whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount] + strToMatch[strToMatch.length - charsToCheckCount + 1];
      }

      console.log("114 " + ("\x1B[" + 33 + "m" + "whatToCompareTo" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(whatToCompareTo, null, 4));
      if (!opts.i && current === whatToCompareTo || opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase()) {
        charsToCheckCount -= current.length; // normally 1, but
        // if it's emoji, it can be 2

        if (charsToCheckCount < 1) {
          console.log("128 THIS WAS THE LAST SYMBOL TO CHECK, " + current);
          console.log("130 " + ("\x1B[" + 33 + "m" + "i" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(i, null, 4));
          console.log("137 " + ("\x1B[" + 33 + "m" + "strToMatch.length" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(strToMatch.length, null, 4));

          var aboutToReturn = i - strToMatch.length + current.length;

          console.log("147 " + ("\x1B[" + 33 + "m" + "aboutToReturn" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(aboutToReturn, null, 4));

          // Now, before returning result index, we need to take care of one specific
          // case.
          // If somehow the starting index was given in the middle of astral character,
          // algorithm would treat that as index at the beginning of the character.
          // However, at this point, result is that index in the middle.
          // We need to check and offset the index to be also at the beginning here.
          if (aboutToReturn >= 0 && stringCharacterIsAstralSurrogate.isLowSurrogate(str[aboutToReturn]) && existy(str[aboutToReturn - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[aboutToReturn - 1])) {
            console.log("167 " + ("\x1B[" + 33 + "m" + "aboutToReturn --1, now = " + "\x1B[" + 39 + "m") + " = " + JSON.stringify(aboutToReturn, null, 4));
            aboutToReturn -= 1;
          }

          return aboutToReturn >= 0 ? aboutToReturn : 0;
        }

        console.log("180 OK. Reduced charsToCheckCount to " + charsToCheckCount);
        if (current.length === 2 && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i])) {
          // if it was emoji, offset by two
          i += 1;
        }
      } else {
        console.log("187 str[i = " + i + "] = " + JSON.stringify(str[i], null, 4));
        console.log("189 strToMatch[strToMatch.length - charsToCheckCount = " + (strToMatch.length - charsToCheckCount) + "] = " + JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4));
        console.log("196 THEREFORE, returning false.");
        return false;
      }
      console.log("200 * charsToCheckCount = " + JSON.stringify(charsToCheckCount, null, 4));
    }
    if (charsToCheckCount > 0) {
      console.log("209 charsToCheckCount = " + JSON.stringify(charsToCheckCount, null, 4));
      console.log("211 THEREFORE, returning false.");
      return false;
    }
  } else if (!opts.relaxedApi) {
    throw new Error("string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is " + fromIndexInclusive + " beyond the input string length, " + str.length + ".");
  } else {
    return false;
  }
}

// A helper f(). Uses 2xx range error codes.
function marchBackward(str, fromIndexInclusive, strToMatch, opts, special) {
  console.log("\n229 \x1B[" + 35 + "m" + "CALLED marchBackward()" + "\x1B[" + 39 + "m");
  console.log("======\nargs:\nstr=" + str + "\nfromIndexInclusive=" + fromIndexInclusive + "\nstrToMatch=" + strToMatch + "\nopts=" + opts + "\nspecial=" + special + "\n======\n");

  var strToMatchVal = typeof strToMatch === "function" ? strToMatch() : strToMatch;

  // early ending case if matching EOL being at 0-th index:
  if (fromIndexInclusive === -1 && special && strToMatchVal === "EOL") {
    console.log("233 EARLY ENDING, return true");
    return strToMatchVal;
  }

  console.log("239 " + ("\x1B[" + 33 + "m" + "fromIndexInclusive" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(fromIndexInclusive, null, 4));

  if (fromIndexInclusive >= str.length) {
    if (!opts.relaxedApi) {
      throw new Error("string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is " + str.length + " but the second argument is beyond it:\n" + JSON.stringify(fromIndexInclusive, null, 4));
    } else {
      return false;
    }
  }
  var charsToCheckCount = special ? 1 : strToMatch.length;
  console.log("268 starting charsToCheckCount = " + charsToCheckCount);

  for (var i = fromIndexInclusive + 1; i--;) {
    console.log("269 " + ("\x1B[" + 36 + "m" + "==================================" + "\x1B[" + 39 + "m") + " " + i + ": >>" + str[i] + "<< [" + str[i].charCodeAt(0) + "]");
    console.log("274 " + (i - 1) + ": >>" + str[i - 1] + "<< [" + (existy(str[i - 1]) ? str[i - 1].charCodeAt(0) : "undefined") + "]");
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      console.log("279 trimmed");
      if (i === 0 && special && strToMatch === "EOL") {
        console.log("282 start of string reached, matching to EOL, so return true");
        return true;
      }
      continue;
    }
    var currentCharacter = str[i];
    if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i - 1])) {
      currentCharacter = str[i - 1] + str[i];
      console.log("292 " + ("\x1B[" + 33 + "m" + "currentCharacter" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(currentCharacter, null, 4));
    } else if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[i + 1])) {
      currentCharacter = str[i] + str[i + 1];
    }
    console.log("302 \x1B[" + 32 + "m" + "currentCharacter" + "\x1B[" + 39 + "m = " + currentCharacter);
    console.log("305 " + ("\x1B[" + 33 + "m" + "opts.trimCharsBeforeMatching" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(opts.trimCharsBeforeMatching, null, 4));
    console.log("312 " + ("\x1B[" + 33 + "m" + "opts.trimCharsBeforeMatching.includes(currentCharacter)" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(opts.trimCharsBeforeMatching.includes(currentCharacter), null, 4));
    if (!opts.i && opts.trimCharsBeforeMatching.includes(currentCharacter) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
      return val.toLowerCase();
    }).includes(currentCharacter.toLowerCase())) {
      console.log("325 char is in the skip list");
      if (currentCharacter.length === 2) {
        // if it was emoji, offset by two
        i -= 1;
      }
      if (special && strToMatch === "EOL" && i === 0) {
        // return true because we reached the zero'th index, exactly what we're looking for
        console.log("333 RETURN true because it's EOL next, exactly what we're looking for");
        return true;
      }
      continue;
    }
    console.log("340 " + ("\x1B[" + 33 + "m" + "charsToCheckCount" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(charsToCheckCount, null, 4));
    console.log("346 " + strToMatch[charsToCheckCount - 1]);
    console.log("348 " + strToMatch[charsToCheckCount - 2] + strToMatch[charsToCheckCount - 1]);

    var charToCompareAgainst = strToMatch[charsToCheckCount - 1];
    if (stringCharacterIsAstralSurrogate.isLowSurrogate(charToCompareAgainst)) {
      // this means current strToMatch ends with emoji
      charToCompareAgainst = "" + strToMatch[charsToCheckCount - 2] + strToMatch[charsToCheckCount - 1];
      console.log("360 " + ("\x1B[" + 33 + "m" + "charToCompareAgainst" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(charToCompareAgainst, null, 4));
      charsToCheckCount -= 1;
      i -= 1;
    }

    console.log("\n* 371 \x1B[" + 31 + "m" + "currentCharacter" + "\x1B[" + 39 + "m = " + currentCharacter);
    console.log("* 374 \x1B[" + 31 + "m" + "charToCompareAgainst" + "\x1B[" + 39 + "m = " + charToCompareAgainst);
    if (!opts.i && currentCharacter === charToCompareAgainst || opts.i && currentCharacter.toLowerCase() === charToCompareAgainst.toLowerCase()) {
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        console.log("384 all chars matched so returning i = " + i + "; charsToCheckCount = " + charsToCheckCount);
        return i >= 0 ? i : 0;
      }

      console.log("390 " + ("\x1B[" + 32 + "m" + ("OK. Reduced charsToCheckCount to " + charsToCheckCount) + "\x1B[" + 39 + "m"));
    } else {
      console.log("393 str[i = " + i + "] = " + JSON.stringify(str[i], null, 4));
      console.log("395 strToMatch[strToMatch.length - charsToCheckCount = " + (strToMatch.length - charsToCheckCount) + "] = " + JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4));
      console.log("402 THEREFORE, returning false.");
      return false;
    }

    console.log("407 * charsToCheckCount = " + JSON.stringify(charsToCheckCount, null, 4));
  }
  if (charsToCheckCount > 0) {
    if (special && strToMatch === "EOL") {
      console.log("413 charsToCheckCount = " + charsToCheckCount + ";\nwent past the beginning of the string and EOL was queried to return TRUE");
      return true;
    }
    console.log("418 charsToCheckCount = " + charsToCheckCount + " THEREFORE, returning FALSE");
    return false;
  }
}

// Real deal
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
  var defaults = {
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    relaxedApi: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  checkTypes(opts, defaults, {
    msg: "string-match-left-right: [THROW_ID_07*]",
    schema: {
      cb: ["null", "undefined", "function"]
    }
  });
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
    return isStr(el) ? el : String(el);
  });

  var culpritsIndex = void 0;
  var culpritsVal = void 0;
  if (opts.trimCharsBeforeMatching.some(function (el, i) {
    if (el.length > 1 && !isAstral(el)) {
      culpritsIndex = i;
      culpritsVal = el;
      return true;
    }
    return false;
  })) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index " + culpritsIndex + " is longer than 1 character, " + culpritsVal.length + " (equals to " + culpritsVal + "). Please split it into separate characters and put into array as separate elements.");
  }

  if (!isStr(str)) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_01] the first argument should be a string. Currently it's of a type: " + (typeof str === "undefined" ? "undefined" : _typeof(str)) + ", equal to:\n" + JSON.stringify(str, null, 4));
  } else if (str.length === 0) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_02] the first argument should be a non-empty string. Currently it's empty!");
  }

  if (!isNaturalNumber(position, { includeZero: true })) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: " + (typeof position === "undefined" ? "undefined" : _typeof(position)) + ", equal to:\n" + JSON.stringify(position, null, 4));
  }
  var whatToMatch = void 0;

  var special = void 0;
  if (isStr(originalWhatToMatch)) {
    console.log("503");
    whatToMatch = [originalWhatToMatch];
  } else if (isArr(originalWhatToMatch)) {
    console.log("506");
    whatToMatch = originalWhatToMatch;
  } else if (!existy(originalWhatToMatch)) {
    console.log("509");
    whatToMatch = originalWhatToMatch;
  } else if (isFun(originalWhatToMatch)) {
    console.log("512");
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
    console.log("510 whatToMatch = " + whatToMatch + "; Array.isArray(whatToMatch) = " + Array.isArray(whatToMatch) + "; whatToMatch.length = " + whatToMatch.length);
  } else {
    console.log("521");
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's " + (typeof originalWhatToMatch === "undefined" ? "undefined" : _typeof(originalWhatToMatch)) + ", equal to:\n" + JSON.stringify(originalWhatToMatch, null, 4));
  }

  console.log("whatToMatch = " + whatToMatch + "; typeof whatToMatch = " + (typeof whatToMatch === "undefined" ? "undefined" : _typeof(whatToMatch)));

  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"" + (typeof originalOpts === "undefined" ? "undefined" : _typeof(originalOpts)) + "\", and equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }

  // action

  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null

  if (!existy(whatToMatch) || // null || undefined
  !isArr(whatToMatch) || // 0
  isArr(whatToMatch) && !whatToMatch.length || // []
  isArr(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && whatToMatch[0].trim().length === 0 // [""]
  ) {
      if (opts.cb) {
        console.log("542");
        var firstCharOutsideIndex = void 0;

        // matchLeft() or matchRightIncl() methods start at index "position"
        var startingPosition = position;
        if (mode === "matchRight" && stringCharacterIsAstralSurrogate.isHighSurrogate(str[position]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[position + 1])) {
          startingPosition += 1;
        }
        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }

        if (mode.startsWith("matchLeft")) {
          for (var y = startingPosition; y--;) {
            // if we're on the right side of emoji, low surrogate, skip to next iteration
            if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[y]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[y - 1]) // function will accept undefined if it happens
            ) {
                continue;
              }
            // assemble the value of the current character
            var currentChar = str[y];
            if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[y]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[y + 1])) {
              currentChar = str[y] + str[y + 1];
            }
            // do the actual evaluation, is the current character non-whitespace/non-skiped
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim() !== "") && (opts.trimCharsBeforeMatching.length === 0 || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
            // if there's emoji on the left, skip its low surrogate, jump left by two indexes
            if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[y - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[y - 2])) {
              y -= 1;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (var _y = startingPosition; _y < str.length; _y++) {
            // assemble the value of the current character
            var _currentChar = str[_y];
            if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[_y]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_y + 1])) {
              _currentChar = str[_y] + str[_y + 1];
            }
            console.log("358 " + ("\x1B[" + 33 + "m" + "currentChar" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(_currentChar, null, 4));
            // do the actual evaluation, is the current character non-whitespace/non-skiped
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim() !== "") && (opts.trimCharsBeforeMatching.length === 0 || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
              console.log("612 breaking!");
              firstCharOutsideIndex = _y;
              break;
            }
            // if it's high surrogate, and we reached this far, and low surrogate
            // follows, skipt that low surrogate
            if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[_y]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_y + 1])) {
              _y += 1;
            }
          }
        }
        if (firstCharOutsideIndex === undefined) {
          console.log("624 returning false");
          return false;
        }

        var wholeCharacterOutside = str[firstCharOutsideIndex];
        if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[firstCharOutsideIndex]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[firstCharOutsideIndex + 1])) {
          wholeCharacterOutside = str[firstCharOutsideIndex] + str[firstCharOutsideIndex + 1];
        }
        if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[firstCharOutsideIndex]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[firstCharOutsideIndex - 1])) {
          wholeCharacterOutside = str[firstCharOutsideIndex - 1] + str[firstCharOutsideIndex];
          firstCharOutsideIndex -= 1;
        }

        var indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
        if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[firstCharOutsideIndex]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[firstCharOutsideIndex + 1])) {
          indexOfTheCharacterAfter += 1;
        }

        var secondArg = void 0;
        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          secondArg = str.slice(0, indexOfTheCharacterAfter);
        }
        if (mode.startsWith("matchLeft")) {
          return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
        }
        // ELSE matchRight & matchRightIncl

        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          secondArg = str.slice(firstCharOutsideIndex);
        }
        return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
      }
      var extraNote = "";
      if (!existy(originalOpts)) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }
      throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_08] the third argument, \"whatToMatch\", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key \"cb\" is not set!" + extraNote);
    }

  // Case 2. Normal operation where callback may or may not be present, but it is
  // only accompanying the matching of what was given in 3rd input argument.
  // Then if 3rd arg's contents were matched, callback is checked and its Boolean
  // result is merged using logical "AND" - meaning both have to be true to yield
  // final result "true".

  if (mode.startsWith("matchLeft")) {
    for (var i = 0, len = whatToMatch.length; i < len; i++) {
      console.log("\n689 matchLeft() LOOP " + i + " " + ("\x1B[" + 32 + "m" + "=================================================================================" + "\x1B[" + 39 + "m") + " \n\n");

      special = typeof whatToMatch[i] === "function";
      console.log("693 special = " + special);

      console.log("\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
      console.log("695 whatToMatch no. " + i + " = " + whatToMatch[i] + " (type " + _typeof(whatToMatch[i]) + ")");
      console.log("special = " + special);
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");

      // since input can be function, we need to grab the value explicitly:
      var whatToMatchVal = whatToMatch[i];

      // console.log(`703 typeof whatToMatchVal = ${typeof whatToMatchVal}`);
      // console.log(
      //   `702 ${`\u001b[${33}m${`whatToMatchVal()`}\u001b[${39}m`} = ${JSON.stringify(
      //     whatToMatchVal(),
      //     null,
      //     4
      //   )} (typeof whatToMatchVal = ${typeof whatToMatchVal})`
      // );

      var _startingPosition = position;
      if (mode === "matchLeft") {
        // Depends if the current character is surrogate.
        // Imagine, you've got blue hat emoji: \uD83E\uDDE2 to the left of your
        // current character at current index. In order to "jump left by one character"
        // you have to subtract the index by two, not by one.
        //
        if (
        // if preceding two characters exist and make a surrogate pair
        isAstral(str[i - 1]) && isAstral(str[i - 2])) {
          _startingPosition -= 2;
        } else {
          _startingPosition -= 1;
        }
      }
      console.log("730 \x1B[" + 33 + "m" + "marchBackward() called with:" + "\x1B[" + 39 + "m\n* startingPosition = " + JSON.stringify(_startingPosition, null, 4) + "\n* whatToMatchVal = \"" + whatToMatchVal + "\"\n");
      var found = marchBackward(str, _startingPosition, whatToMatchVal, opts, special);
      console.log("694 \x1B[" + 33 + "m" + "found" + "\x1B[" + 39 + "m = " + JSON.stringify(found, null, 4));

      // if marchBackward returned positive result and it was "special" case,
      // Bob's your uncle, here's the result:
      if (special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        console.log("750 returning whatToMatchVal() = " + whatToMatchVal());
        return whatToMatchVal();
      }

      // now, the "found" is the index of the first character of what was found.
      // we need to calculate the character to the left of it, which might be emoji
      // so its first character might be either "minus one index" (normal character)
      // or "minus two indexes" (emoji). Let's calculate that:

      var indexOfTheCharacterInFront = void 0;
      var fullCharacterInFront = void 0;
      var restOfStringInFront = void 0;
      if (existy(found) && found > 0) {
        indexOfTheCharacterInFront = found - 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront];
        restOfStringInFront = str.slice(0, found);
      }

      if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[indexOfTheCharacterInFront]) && existy(str[indexOfTheCharacterInFront - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[indexOfTheCharacterInFront - 1])) {
        console.log("719 the character in front is low surrogate");
        indexOfTheCharacterInFront -= 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront - 1] + str[indexOfTheCharacterInFront];
        console.log("\x1B[" + 33 + "m" + "fullCharacterInFront" + "\x1B[" + 39 + "m" + " = " + JSON.stringify(fullCharacterInFront, null, 4));
      }
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[indexOfTheCharacterInFront]) && existy(str[indexOfTheCharacterInFront + 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[indexOfTheCharacterInFront + 1])) {
        console.log("737 adding low surrogate to str[indexOfTheCharacterInFront]");
        fullCharacterInFront = str[indexOfTheCharacterInFront] + str[indexOfTheCharacterInFront + 1];
        console.log("\x1B[" + 33 + "m" + "fullCharacterInFront" + "\x1B[" + 39 + "m" + " = " + JSON.stringify(fullCharacterInFront, null, 4));
        restOfStringInFront = str.slice(0, indexOfTheCharacterInFront + 2);
      }

      if (found !== false && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatchVal;
      }
    }
    return false;
  }
  // ELSE - matchRight & matchRightIncl
  for (var _i = 0, _len = whatToMatch.length; _i < _len; _i++) {
    special = typeof whatToMatch[_i] === "function";
    console.log("\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
    console.log("838 whatToMatch no. " + _i + " = " + whatToMatch[_i]);
    console.log("special = " + special);
    console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");

    var _whatToMatchVal = whatToMatch[_i];

    var _startingPosition2 = position + (mode === "matchRight" ? 1 : 0);
    // compensate for emoji, since if currently we've sat upon emoji,
    // we need to add not one but two to reference the "character on the right"
    console.log("768 \x1B[" + 32 + "m" + "startingPosition" + "\x1B[" + 39 + "m = " + _startingPosition2);
    if (mode === "matchRight" && stringCharacterIsAstralSurrogate.isHighSurrogate(str[_startingPosition2 - 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_startingPosition2])) {
      _startingPosition2 += 1;
      console.log("777 +1: \x1B[" + 32 + "m" + "startingPosition" + "\x1B[" + 39 + "m = " + _startingPosition2);
    }

    var _found = marchForward(str, _startingPosition2, _whatToMatchVal, opts, special);
    console.log("783 " + ("\x1B[" + 33 + "m" + "found" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(_found, null, 4));

    var _indexOfTheCharacterAfter = void 0;
    var fullCharacterAfter = void 0;
    if (existy(_found) && existy(str[_found + _whatToMatchVal.length])) {
      _indexOfTheCharacterAfter = _found + _whatToMatchVal.length;
      fullCharacterAfter = str[_indexOfTheCharacterAfter];

      // fixes for emoji:
      // if the next character is high surrogate, add its counterpart
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[_indexOfTheCharacterAfter]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_indexOfTheCharacterAfter + 1])) {
        fullCharacterAfter = str[_indexOfTheCharacterAfter] + str[_indexOfTheCharacterAfter + 1];
      }
    }

    console.log("\n808 " + ("\x1B[" + 33 + "m" + "fullCharacterAfter" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(fullCharacterAfter, null, 4));
    console.log("815 " + ("\x1B[" + 33 + "m" + "indexOfTheCharacterAfter" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(_indexOfTheCharacterAfter, null, 4) + "\n");

    var _secondArg = void 0;
    if (existy(_indexOfTheCharacterAfter) && _indexOfTheCharacterAfter >= 0) {
      _secondArg = str.slice(_indexOfTheCharacterAfter);
    }
    if (_found !== false && (opts.cb ? opts.cb(fullCharacterAfter, _secondArg, _indexOfTheCharacterAfter) : true)) {
      return _whatToMatchVal;
    }
  }
  return false;
}

// External API functions

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

exports.matchLeftIncl = matchLeftIncl;
exports.matchRightIncl = matchRightIncl;
exports.matchLeft = matchLeft;
exports.matchRight = matchRight;
