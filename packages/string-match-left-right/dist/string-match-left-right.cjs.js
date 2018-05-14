'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isNaturalNumber = _interopDefault(require('is-natural-number'));
var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
var stringCharacterIsAstralSurrogate = require('string-character-is-astral-surrogate');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
function marchForward(str, fromIndexInclusive, strToMatch, opts) {

  if (fromIndexInclusive <= str.length) {
    var charsToCheckCount = strToMatch.length;
    for (var i = fromIndexInclusive, len = str.length; i < len; i++) {
      var current = str[i];

      // FIY, high surrogate goes first, low goes second
      // if it's first part of the emoji, glue the second part onto this:
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[i + 1])) {
        // and if it is, glue second onto first-one
        current = str[i] + str[i + 1];
      }
      // alternatively, if somehow the starting index was given in the middle,
      // between heads and tails surrogates of this emoji, and we're on the tails
      // already, check for presence of heads in front and glue that if present:
      if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i - 1])) {
        // and if it is, glue second onto first-one
        current = str[i - 1] + str[i];
      }
      if (opts.trimBeforeMatching && str[i].trim() === "") {
        continue;
      }
      if (!opts.i && opts.trimCharsBeforeMatching.includes(current) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
        return val.toLowerCase();
      }).includes(current.toLowerCase())) {
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
      if (!opts.i && current === whatToCompareTo || opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase()) {
        charsToCheckCount -= current.length; // normally 1, but
        // if it's emoji, it can be 2

        if (charsToCheckCount < 1) {

          var aboutToReturn = i - strToMatch.length + current.length;

          // Now, before returning result index, we need to take care of one specific
          // case.
          // If somehow the starting index was given in the middle of astral character,
          // algorithm would treat that as index at the beginning of the character.
          // However, at this point, result is that index in the middle.
          // We need to check and offset the index to be also at the beginning here.
          if (aboutToReturn >= 0 && stringCharacterIsAstralSurrogate.isLowSurrogate(str[aboutToReturn]) && existy(str[aboutToReturn - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[aboutToReturn - 1])) {
            aboutToReturn -= 1;
          }

          return aboutToReturn >= 0 ? aboutToReturn : 0;
        }
        if (current.length === 2 && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i])) {
          // if it was emoji, offset by two
          i += 1;
        }
      } else {
        return false;
      }
    }
    if (charsToCheckCount > 0) {
      return false;
    }
  } else if (opts.strictApi) {
    throw new Error("string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is " + fromIndexInclusive + " beyond the input string length, " + str.length + ".");
  } else {
    return false;
  }
}

// A helper f(). Uses 2xx range error codes.
function marchBackward(str, fromIndexInclusive, strToMatch, opts) {
  if (fromIndexInclusive >= str.length) {
    if (opts.strictApi) {
      throw new Error("string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is " + str.length + " but the second argument is beyond it:\n" + JSON.stringify(fromIndexInclusive, null, 4));
    } else {
      return false;
    }
  }
  var charsToCheckCount = strToMatch.length;

  for (var i = fromIndexInclusive + 1; i--;) {
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      continue;
    }
    var currentCharacter = str[i];
    if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i - 1])) {
      currentCharacter = str[i - 1] + str[i];
    } else if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[i + 1])) {
      currentCharacter = str[i] + str[i + 1];
    }
    if (!opts.i && opts.trimCharsBeforeMatching.includes(currentCharacter) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
      return val.toLowerCase();
    }).includes(currentCharacter.toLowerCase())) {
      if (currentCharacter.length === 2) {
        // if it was emoji, offset by two
        i -= 1;
      }
      continue;
    }

    var charToCompareAgainst = strToMatch[charsToCheckCount - 1];
    if (stringCharacterIsAstralSurrogate.isLowSurrogate(charToCompareAgainst)) {
      // this means current strToMatch ends with emoji
      charToCompareAgainst = "" + strToMatch[charsToCheckCount - 2] + strToMatch[charsToCheckCount - 1];
      charsToCheckCount -= 1;
      i -= 1;
    }
    if (!opts.i && currentCharacter === charToCompareAgainst || opts.i && currentCharacter.toLowerCase() === charToCompareAgainst.toLowerCase()) {
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        return i >= 0 ? i : 0;
      }
    } else {
      return false;
    }
  }
  if (charsToCheckCount > 0) {
    return false;
  }
}

// Real deal
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  var isArr = Array.isArray;
  if (!isStr(str)) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_01] the first argument should be a string. Currently it's of a type: " + (typeof str === "undefined" ? "undefined" : _typeof(str)) + ", equal to:\n" + JSON.stringify(str, null, 4));
  } else if (str.length === 0) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_02] the first argument should be a non-empty string. Currently it's empty!");
  }

  if (!isNaturalNumber(position, { includeZero: true })) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: " + (typeof position === "undefined" ? "undefined" : _typeof(position)) + ", equal to:\n" + JSON.stringify(position, null, 4));
  }
  var whatToMatch = void 0;

  if (isStr(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch];
  } else if (isArr(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!existy(originalWhatToMatch)) {
    whatToMatch = [""];
  } else {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's " + (typeof originalWhatToMatch === "undefined" ? "undefined" : _typeof(originalWhatToMatch)) + ", equal to:\n" + JSON.stringify(originalWhatToMatch, null, 4));
  }

  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"" + (typeof originalOpts === "undefined" ? "undefined" : _typeof(originalOpts)) + "\", and equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }
  var defaults = {
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    strictApi: true
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

  // action

  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null

  if (!existy(whatToMatch) || isArr(whatToMatch) && existy(whatToMatch[0]) && whatToMatch[0].length === 0) {
    if (opts.cb) {
      var firstCharOutsideIndex = void 0;

      // matchLeft() or matchRightIncl() methods start ar "position"
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
          // do the actual evaluation, is the current character non-whitespace/non-skiped
          if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim() !== "") && (opts.trimCharsBeforeMatching.length === 0 || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
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
      if (mode.startsWith("matchLeft")) {
        return opts.cb(wholeCharacterOutside, str.slice(0, indexOfTheCharacterAfter), firstCharOutsideIndex);
      }
      // ELSE matchRight & matchRightIncl
      return opts.cb(wholeCharacterOutside, str.slice(firstCharOutsideIndex), firstCharOutsideIndex);
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
      var found = marchBackward(str, _startingPosition, whatToMatch[i], opts);
      // now, the "found" is the index of the first character of what was found.
      // we need to calculate the character to the left of it, which might be emoji
      // so its first character might be either "minus one index" (normal character)
      // or "minus two indexes" (emoji). Let's calculate that:

      var indexOfTheCharacterInFront = void 0;
      var fullCharacterInFront = void 0;
      var restOfStringInFront = "";
      if (existy(found) && found > 0) {
        indexOfTheCharacterInFront = found - 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront];
        restOfStringInFront = str.slice(0, found);
      }

      if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[indexOfTheCharacterInFront]) && existy(str[indexOfTheCharacterInFront - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[indexOfTheCharacterInFront - 1])) {
        indexOfTheCharacterInFront -= 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront - 1] + str[indexOfTheCharacterInFront];
      }
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[indexOfTheCharacterInFront]) && existy(str[indexOfTheCharacterInFront + 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[indexOfTheCharacterInFront + 1])) {
        fullCharacterInFront = str[indexOfTheCharacterInFront] + str[indexOfTheCharacterInFront + 1];
        restOfStringInFront = str.slice(0, indexOfTheCharacterInFront + 2);
      }

      if (indexOfTheCharacterInFront < 0) {
        indexOfTheCharacterInFront = undefined;
      }

      if (found !== false && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatch[i];
      }
    }
    return false;
  }
  // ELSE - matchRight & matchRightIncl
  for (var _i = 0, _len = whatToMatch.length; _i < _len; _i++) {

    var _startingPosition2 = position + (mode === "matchRight" ? 1 : 0);
    // compensate for emoji, since if currently we've sat upon emoji,
    // we need to add not one but two to reference the "character on the right"
    if (mode === "matchRight" && stringCharacterIsAstralSurrogate.isHighSurrogate(str[_startingPosition2 - 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_startingPosition2])) {
      _startingPosition2 += 1;
    }

    var _found = marchForward(str, _startingPosition2, whatToMatch[_i], opts);

    var _indexOfTheCharacterAfter = void 0;
    var fullCharacterAfter = void 0;
    if (existy(_found) && existy(str[_found + whatToMatch[_i].length])) {
      _indexOfTheCharacterAfter = _found + whatToMatch[_i].length;
      fullCharacterAfter = str[_indexOfTheCharacterAfter];

      // fixes for emoji:
      // if the next character is high surrogate, add its counterpart
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[_indexOfTheCharacterAfter]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_indexOfTheCharacterAfter + 1])) {
        fullCharacterAfter = str[_indexOfTheCharacterAfter] + str[_indexOfTheCharacterAfter + 1];
      }
    }

    if (_found !== false && (opts.cb ? opts.cb(fullCharacterAfter, existy(_indexOfTheCharacterAfter) ? str.slice(_indexOfTheCharacterAfter) : "", _indexOfTheCharacterAfter) : true)) {
      return whatToMatch[_i];
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
