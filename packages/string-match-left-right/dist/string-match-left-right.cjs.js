/** 
 * string-match-left-right
 * Do substrings match what's on the left or right of a given index?
 * Version: 3.10.36
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isNaturalNumber = _interopDefault(require('is-natural-number'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var isFun = _interopDefault(require('lodash.isfunction'));
var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
var stringCharacterIsAstralSurrogate = require('string-character-is-astral-surrogate');

function _typeof(obj) {
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

var isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function isAstral(_char) {
  if (typeof _char !== "string") {
    return false;
  }
  return _char.charCodeAt(0) >= 55296 && _char.charCodeAt(0) <= 57343;
}
function marchForward(str, fromIndexInclusive, strToMatch, opts, special) {
  console.log("030 \x1B[".concat(35, "m", "CALLED marchForward()", "\x1B[", 39, "m"));
  console.log("======\nargs:\nstr=".concat(str, "\nfromIndexInclusive=").concat(fromIndexInclusive, "\nstrToMatch=").concat(strToMatch, "\nopts=").concat(JSON.stringify(opts, null, 4), "\nspecial=").concat(special, "\n======\n"));
  var strToMatchVal = typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive >= str.length && special && strToMatchVal === "EOL") {
    console.log("044 EARLY ENDING, return true");
    return strToMatchVal;
  }
  console.log("049 ".concat("\x1B[".concat(33, "m", "fromIndexInclusive", "\x1B[", 39, "m"), " = ", JSON.stringify(fromIndexInclusive, null, 4)));
  if (fromIndexInclusive <= str.length) {
    var charsToCheckCount = special ? 1 : strToMatch.length;
    console.log("058 starting charsToCheckCount = ".concat(charsToCheckCount));
    for (var i = fromIndexInclusive, len = str.length; i < len; i++) {
      console.log("\x1B[".concat(36, "m", "================================== str[".concat(i, "] = ").concat(str[i]), "\x1B[", 39, "m"));
      var current = str[i];
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[i + 1])) {
        console.log("071 \x1B[".concat(33, "m", "low surrogate on the right added", "\x1B[", 39, "m"));
        current = str[i] + str[i + 1];
      }
      if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i - 1])) {
        console.log("081 \x1B[".concat(33, "m", "high surrogate on the left added", "\x1B[", 39, "m"));
        current = str[i - 1] + str[i];
      }
      console.log("087 ".concat("\x1B[".concat(33, "m", "current", "\x1B[", 39, "m"), " = ", JSON.stringify(current, null, 4)));
      if (opts.trimBeforeMatching && str[i].trim() === "") {
        console.log("094 \x1B[".concat(31, "m", "trimmed", "\x1B[", 39, "m"));
        continue;
      }
      if (!opts.i && opts.trimCharsBeforeMatching.includes(current) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
        return val.toLowerCase();
      }).includes(current.toLowerCase())) {
        console.log("104 char in the skip list");
        if (current.length === 2) {
          i += 1;
        }
        continue;
      }
      var whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount];
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(whatToCompareTo) && existy(strToMatch[strToMatch.length - charsToCheckCount + 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(strToMatch[strToMatch.length - charsToCheckCount + 1])) {
        whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount] + strToMatch[strToMatch.length - charsToCheckCount + 1];
      }
      console.log("124 ".concat("\x1B[".concat(33, "m", "whatToCompareTo", "\x1B[", 39, "m"), " = ", JSON.stringify(whatToCompareTo, null, 4)));
      if (!opts.i && current === whatToCompareTo || opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase()) {
        charsToCheckCount -= current.length;
        if (charsToCheckCount < 1) {
          console.log("138 THIS WAS THE LAST SYMBOL TO CHECK, ".concat(current));
          console.log("140 ".concat("\x1B[".concat(33, "m", "i", "\x1B[", 39, "m"), " = ", JSON.stringify(i, null, 4)));
          console.log("147 ".concat("\x1B[".concat(33, "m", "strToMatch.length", "\x1B[", 39, "m"), " = ", JSON.stringify(strToMatch.length, null, 4)));
          var aboutToReturn = i - strToMatch.length + current.length;
          console.log("157 ".concat("\x1B[".concat(33, "m", "aboutToReturn", "\x1B[", 39, "m"), " = ", JSON.stringify(aboutToReturn, null, 4)));
          if (aboutToReturn >= 0 && stringCharacterIsAstralSurrogate.isLowSurrogate(str[aboutToReturn]) && existy(str[aboutToReturn - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[aboutToReturn - 1])) {
            console.log("177 ".concat("\x1B[".concat(33, "m", "aboutToReturn --1, now = ", "\x1B[", 39, "m"), " = ", JSON.stringify(aboutToReturn, null, 4)));
            aboutToReturn -= 1;
          }
          return aboutToReturn >= 0 ? aboutToReturn : 0;
        }
        console.log("190 OK. Reduced charsToCheckCount to ".concat(charsToCheckCount));
        if (current.length === 2 && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i])) {
          i += 1;
        }
      } else {
        console.log("197 str[i = ".concat(i, "] = ").concat(JSON.stringify(str[i], null, 4)));
        console.log("199 strToMatch[strToMatch.length - charsToCheckCount = ".concat(strToMatch.length - charsToCheckCount, "] = ").concat(JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4)));
        console.log("206 THEREFORE, returning false.");
        return false;
      }
      console.log("210 * charsToCheckCount = ".concat(JSON.stringify(charsToCheckCount, null, 4)));
    }
    if (charsToCheckCount > 0) {
      if (special && strToMatchVal === "EOL") {
        console.log("220 charsToCheckCount = ".concat(charsToCheckCount, ";\nwent past the beginning of the string and EOL was queried to return TRUE"));
        return true;
      }
      console.log("225 charsToCheckCount = ".concat(charsToCheckCount, " THEREFORE, returning FALSE"));
      return false;
    }
  } else if (!opts.relaxedApi) {
    throw new Error("string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is ".concat(fromIndexInclusive, " beyond the input string length, ").concat(str.length, "."));
  } else {
    return false;
  }
}
function marchBackward(str, fromIndexInclusive, strToMatch, opts, special) {
  console.log("240 \x1B[".concat(35, "m", "CALLED marchBackward()", "\x1B[", 39, "m"));
  console.log("======\nargs:\nstr=".concat(str, "\nfromIndexInclusive=").concat(fromIndexInclusive, "\nstrToMatch=").concat(strToMatch, "\nopts=").concat(JSON.stringify(opts, null, 4), "\nspecial=").concat(special, "\n======\n"));
  var strToMatchVal = typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive < 0 && special && strToMatchVal === "EOL") {
    console.log("254 EARLY ENDING, return true");
    return strToMatchVal;
  }
  console.log("259 ".concat("\x1B[".concat(33, "m", "fromIndexInclusive", "\x1B[", 39, "m"), " = ", JSON.stringify(fromIndexInclusive, null, 4)));
  if (fromIndexInclusive >= str.length) {
    if (!opts.relaxedApi) {
      throw new Error("string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is ".concat(str.length, " but the second argument is beyond it:\n").concat(JSON.stringify(fromIndexInclusive, null, 4)));
    } else {
      return false;
    }
  }
  var charsToCheckCount = special ? 1 : strToMatch.length;
  console.log("282 starting charsToCheckCount = ".concat(charsToCheckCount));
  for (var i = fromIndexInclusive + 1; i--;) {
    console.log("286 ".concat("\x1B[".concat(36, "m", "==================================", "\x1B[", 39, "m"), " ", i, ": >>").concat(str[i], "<< [").concat(str[i].charCodeAt(0), "]"));
    console.log("291 ".concat(i - 1, ": >>").concat(str[i - 1], "<< [").concat(existy(str[i - 1]) ? str[i - 1].charCodeAt(0) : "undefined", "]"));
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      console.log("296 trimmed");
      if (i === 0 && special && strToMatch === "EOL") {
        console.log("299 start of string reached, matching to EOL, so return true");
        return true;
      }
      continue;
    }
    var currentCharacter = str[i];
    if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i - 1])) {
      currentCharacter = str[i - 1] + str[i];
      console.log("309 ".concat("\x1B[".concat(33, "m", "currentCharacter", "\x1B[", 39, "m"), " = ", JSON.stringify(currentCharacter, null, 4)));
    } else if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[i + 1])) {
      currentCharacter = str[i] + str[i + 1];
    }
    console.log("319 \x1B[".concat(32, "m", "currentCharacter", "\x1B[", 39, "m = ", currentCharacter));
    console.log("322 ".concat("\x1B[".concat(33, "m", "opts.trimCharsBeforeMatching", "\x1B[", 39, "m"), " = ", JSON.stringify(opts.trimCharsBeforeMatching, null, 4)));
    console.log("329 ".concat("\x1B[".concat(33, "m", "opts.trimCharsBeforeMatching.includes(currentCharacter)", "\x1B[", 39, "m"), " = ", JSON.stringify(opts.trimCharsBeforeMatching.includes(currentCharacter), null, 4)));
    if (!opts.i && opts.trimCharsBeforeMatching.includes(currentCharacter) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
      return val.toLowerCase();
    }).includes(currentCharacter.toLowerCase())) {
      console.log("342 char is in the skip list");
      if (currentCharacter.length === 2) {
        i -= 1;
      }
      if (special && strToMatch === "EOL" && i === 0) {
        console.log("350 RETURN true because it's EOL next, exactly what we're looking for");
        return true;
      }
      continue;
    }
    console.log("357 ".concat("\x1B[".concat(33, "m", "charsToCheckCount", "\x1B[", 39, "m"), " = ", JSON.stringify(charsToCheckCount, null, 4)));
    console.log("363 ".concat(strToMatch[charsToCheckCount - 1]));
    console.log("365 ".concat(strToMatch[charsToCheckCount - 2]).concat(strToMatch[charsToCheckCount - 1]));
    var charToCompareAgainst = strToMatch[charsToCheckCount - 1];
    if (stringCharacterIsAstralSurrogate.isLowSurrogate(charToCompareAgainst)) {
      charToCompareAgainst = "".concat(strToMatch[charsToCheckCount - 2]).concat(strToMatch[charsToCheckCount - 1]);
      console.log("377 ".concat("\x1B[".concat(33, "m", "charToCompareAgainst", "\x1B[", 39, "m"), " = ", JSON.stringify(charToCompareAgainst, null, 4)));
      charsToCheckCount -= 1;
      i -= 1;
    }
    console.log("\n* 371 \x1B[".concat(31, "m", "currentCharacter", "\x1B[", 39, "m = ", currentCharacter));
    console.log("* 391 \x1B[".concat(31, "m", "charToCompareAgainst", "\x1B[", 39, "m = ", charToCompareAgainst));
    if (!opts.i && currentCharacter === charToCompareAgainst || opts.i && currentCharacter.toLowerCase() === charToCompareAgainst.toLowerCase()) {
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        console.log("401 all chars matched so returning i = ".concat(i, "; charsToCheckCount = ").concat(charsToCheckCount));
        return i >= 0 ? i : 0;
      }
      console.log("407 ".concat("\x1B[".concat(32, "m", "OK. Reduced charsToCheckCount to ".concat(charsToCheckCount), "\x1B[", 39, "m")));
    } else {
      console.log("410 str[i = ".concat(i, "] = ").concat(JSON.stringify(str[i], null, 4)));
      console.log("412 strToMatch[strToMatch.length - charsToCheckCount = ".concat(strToMatch.length - charsToCheckCount, "] = ").concat(JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4)));
      console.log("419 THEREFORE, returning false.");
      return false;
    }
    console.log("424 * charsToCheckCount = ".concat(JSON.stringify(charsToCheckCount, null, 4)));
  }
  if (charsToCheckCount > 0) {
    if (special && strToMatchVal === "EOL") {
      console.log("430 charsToCheckCount = ".concat(charsToCheckCount, ";\nwent past the beginning of the string and EOL was queried to return TRUE"));
      return true;
    }
    console.log("435 charsToCheckCount = ".concat(charsToCheckCount, " THEREFORE, returning FALSE"));
    return false;
  }
}
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  var defaults = {
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    relaxedApi: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
    return isStr(el) ? el : String(el);
  });
  var culpritsIndex;
  var culpritsVal;
  if (opts.trimCharsBeforeMatching.some(function (el, i) {
    if (el.length > 1 && !isAstral(el)) {
      culpritsIndex = i;
      culpritsVal = el;
      return true;
    }
    return false;
  })) {
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ").concat(culpritsIndex, " is longer than 1 character, ").concat(culpritsVal.length, " (equals to ").concat(culpritsVal, "). Please split it into separate characters and put into array as separate elements."));
  }
  if (!isStr(str)) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_01] the first argument should be a string. Currently it's of a type: ").concat(_typeof(str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  } else if (str.length === 0) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_02] the first argument should be a non-empty string. Currently it's empty!"));
  }
  if (!isNaturalNumber(position, {
    includeZero: true
  })) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ").concat(_typeof(position), ", equal to:\n").concat(JSON.stringify(position, null, 4)));
  }
  var whatToMatch;
  var special;
  if (isStr(originalWhatToMatch)) {
    console.log("508");
    whatToMatch = [originalWhatToMatch];
  } else if (isArr(originalWhatToMatch)) {
    console.log("511");
    whatToMatch = originalWhatToMatch;
  } else if (!existy(originalWhatToMatch)) {
    console.log("514");
    whatToMatch = originalWhatToMatch;
  } else if (isFun(originalWhatToMatch)) {
    console.log("517");
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
    console.log("521 whatToMatch = ".concat(whatToMatch, "; Array.isArray(whatToMatch) = ").concat(Array.isArray(whatToMatch), "; whatToMatch.length = ").concat(whatToMatch.length));
  } else {
    console.log("526");
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ").concat(_typeof(originalWhatToMatch), ", equal to:\n").concat(JSON.stringify(originalWhatToMatch, null, 4)));
  }
  console.log("\n\n");
  console.log("538 whatToMatch = ".concat(whatToMatch, "; typeof whatToMatch = ").concat(_typeof(whatToMatch)));
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"").concat(_typeof(originalOpts), "\", and equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (!existy(whatToMatch) ||
  !isArr(whatToMatch) ||
  isArr(whatToMatch) && !whatToMatch.length ||
  isArr(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && whatToMatch[0].trim().length === 0
  ) {
      if (typeof opts.cb === "function") {
        console.log("566");
        var firstCharOutsideIndex;
        var startingPosition = position;
        if (mode === "matchRight" && stringCharacterIsAstralSurrogate.isHighSurrogate(str[position]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[position + 1])) {
          startingPosition += 1;
        }
        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }
        if (mode.startsWith("matchLeft")) {
          for (var y = startingPosition; y--;) {
            if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[y]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[y - 1])
            ) {
                continue;
              }
            var currentChar = str[y];
            if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[y]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[y + 1])) {
              currentChar = str[y] + str[y + 1];
            }
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim() !== "") && (opts.trimCharsBeforeMatching.length === 0 || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
            if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[y - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[y - 2])) {
              y -= 1;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (var _y = startingPosition; _y < str.length; _y++) {
            var _currentChar = str[_y];
            if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[_y]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_y + 1])) {
              _currentChar = str[_y] + str[_y + 1];
            }
            console.log("622 ".concat("\x1B[".concat(33, "m", "currentChar", "\x1B[", 39, "m"), " = ", JSON.stringify(_currentChar, null, 4)));
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim() !== "") && (opts.trimCharsBeforeMatching.length === 0 || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
              console.log("635 breaking!");
              firstCharOutsideIndex = _y;
              break;
            }
            if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[_y]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_y + 1])) {
              _y += 1;
            }
          }
        }
        if (firstCharOutsideIndex === undefined) {
          console.log("647 returning false");
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
        var secondArg;
        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          secondArg = str.slice(0, indexOfTheCharacterAfter);
        }
        if (mode.startsWith("matchLeft")) {
          console.log("681");
          return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
        }
        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          secondArg = str.slice(firstCharOutsideIndex);
        }
        console.log("689");
        return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
      }
      var extraNote = "";
      if (!existy(originalOpts)) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_08] the third argument, \"whatToMatch\", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key \"cb\" is not set!").concat(extraNote));
    }
  if (mode.startsWith("matchLeft")) {
    for (var i = 0, len = whatToMatch.length; i < len; i++) {
      console.log("\n689 matchLeft() LOOP ".concat(i, " ", "\x1B[".concat(32, "m", "=================================================================================", "\x1B[", 39, "m"), " \n\n"));
      special = typeof whatToMatch[i] === "function";
      console.log("715 special = ".concat(special));
      console.log("\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
      console.log("721 whatToMatch no. ".concat(i, " = ").concat(whatToMatch[i], " (type ").concat(_typeof(whatToMatch[i]), ")"));
      console.log("special = ".concat(special));
      console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
      var whatToMatchVal = whatToMatch[i];
      var _startingPosition = position;
      if (mode === "matchLeft") {
        if (
        isAstral(str[i - 1]) && isAstral(str[i - 2])) {
          _startingPosition -= 2;
        } else {
          _startingPosition -= 1;
        }
      }
      console.log("760 \x1B[".concat(33, "m", "marchBackward() called with:", "\x1B[", 39, "m\n* startingPosition = ", JSON.stringify(_startingPosition, null, 4), "\n* whatToMatchVal = \"").concat(whatToMatchVal, "\"\n"));
      console.log("\n\n\n\n\n\n");
      console.log("768 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 marchBackward() STARTS BELOW \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
      var found = marchBackward(str, _startingPosition, whatToMatchVal, opts, special);
      console.log("778 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 marchBackward() ENDED ABOVE \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n\n\n\n\n\n");
      console.log("781 \x1B[".concat(33, "m", "found", "\x1B[", 39, "m = ", JSON.stringify(found, null, 4)));
      if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        console.log("796 returning whatToMatchVal() = ".concat(whatToMatchVal()));
        return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
      }
      var indexOfTheCharacterInFront = void 0;
      var fullCharacterInFront = void 0;
      var restOfStringInFront = "";
      if (existy(found) && found > 0) {
        indexOfTheCharacterInFront = found - 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront];
        restOfStringInFront = str.slice(0, found);
      }
      if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[indexOfTheCharacterInFront]) && existy(str[indexOfTheCharacterInFront - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[indexOfTheCharacterInFront - 1])) {
        console.log("836 the character in front is low surrogate");
        indexOfTheCharacterInFront -= 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront - 1] + str[indexOfTheCharacterInFront];
        console.log("".concat("\x1B[".concat(33, "m", "fullCharacterInFront", "\x1B[", 39, "m"), " = ", JSON.stringify(fullCharacterInFront, null, 4)));
      }
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[indexOfTheCharacterInFront]) && existy(str[indexOfTheCharacterInFront + 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[indexOfTheCharacterInFront + 1])) {
        console.log("854 adding low surrogate to str[indexOfTheCharacterInFront]");
        fullCharacterInFront = str[indexOfTheCharacterInFront] + str[indexOfTheCharacterInFront + 1];
        console.log("".concat("\x1B[".concat(33, "m", "fullCharacterInFront", "\x1B[", 39, "m"), " = ", JSON.stringify(fullCharacterInFront, null, 4)));
        restOfStringInFront = str.slice(0, indexOfTheCharacterInFront + 2);
      }
      if (found !== false && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatchVal;
      }
    }
    return false;
  }
  for (var _i = 0, _len = whatToMatch.length; _i < _len; _i++) {
    special = typeof whatToMatch[_i] === "function";
    console.log("\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
    console.log("889 whatToMatch no. ".concat(_i, " = ").concat(whatToMatch[_i]));
    console.log("special = ".concat(special));
    console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
    var _whatToMatchVal = whatToMatch[_i];
    var _startingPosition2 = position + (mode === "matchRight" ? 1 : 0);
    console.log("901 \x1B[".concat(32, "m", "startingPosition", "\x1B[", 39, "m = ", _startingPosition2));
    if (mode === "matchRight" && stringCharacterIsAstralSurrogate.isHighSurrogate(str[_startingPosition2 - 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_startingPosition2])) {
      _startingPosition2 += 1;
      console.log("910 +1: \x1B[".concat(32, "m", "startingPosition", "\x1B[", 39, "m = ", _startingPosition2));
    }
    var _found = marchForward(str, _startingPosition2, _whatToMatchVal, opts, special);
    console.log("922 ".concat("\x1B[".concat(33, "m", "found", "\x1B[", 39, "m"), " = ", JSON.stringify(_found, null, 4)));
    if (_found && special && typeof _whatToMatchVal === "function" && _whatToMatchVal() === "EOL") {
      console.log("937 returning whatToMatchVal() = ".concat(_whatToMatchVal()));
      var _fullCharacterInFront = void 0;
      var _restOfStringInFront = void 0;
      var _indexOfTheCharacterInFront = void 0;
      return _whatToMatchVal() && (opts.cb ? opts.cb(_fullCharacterInFront, _restOfStringInFront, _indexOfTheCharacterInFront) : true) ? _whatToMatchVal() : false;
    }
    var _indexOfTheCharacterAfter = void 0;
    var fullCharacterAfter = void 0;
    if (existy(_found) && existy(str[_found + _whatToMatchVal.length - 1])) {
      _indexOfTheCharacterAfter = _found + _whatToMatchVal.length;
      fullCharacterAfter = str[_indexOfTheCharacterAfter];
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[_indexOfTheCharacterAfter]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_indexOfTheCharacterAfter + 1])) {
        fullCharacterAfter = str[_indexOfTheCharacterAfter] + str[_indexOfTheCharacterAfter + 1];
      }
    }
    console.log("\n808 ".concat("\x1B[".concat(33, "m", "fullCharacterAfter", "\x1B[", 39, "m"), " = ", JSON.stringify(fullCharacterAfter, null, 4)));
    console.log("983 ".concat("\x1B[".concat(33, "m", "indexOfTheCharacterAfter", "\x1B[", 39, "m"), " = ", JSON.stringify(_indexOfTheCharacterAfter, null, 4), "\n"));
    console.log("990 ".concat("\x1B[".concat(33, "m", "whatToMatchVal", "\x1B[", 39, "m"), " = ", JSON.stringify(_whatToMatchVal, null, 4), " (").concat(_typeof(_whatToMatchVal), ")"));
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
