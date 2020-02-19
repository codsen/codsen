/**
 * string-match-left-right
 * Do substrings match what's on the left or right of a given index?
 * Version: 3.11.19
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
var stringCharacterIsAstralSurrogate = require('string-character-is-astral-surrogate');

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

function existy(x) {
  return x != null;
}
function isAstral(_char) {
  if (typeof _char !== "string") {
    return false;
  }
  return _char.charCodeAt(0) >= 55296 && _char.charCodeAt(0) <= 57343;
}
function marchForward(str, fromIndexInclusive, strToMatch, opts, special) {
  var strToMatchVal = typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive >= str.length && special && strToMatchVal === "EOL") {
    return strToMatchVal;
  }
  if (fromIndexInclusive <= str.length) {
    var charsToCheckCount = special ? 1 : strToMatch.length;
    for (var i = fromIndexInclusive, len = str.length; i < len; i++) {
      var current = str[i];
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[i + 1])) {
        current = str[i] + str[i + 1];
      }
      if (stringCharacterIsAstralSurrogate.isLowSurrogate(str[i]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i - 1])) {
        current = str[i - 1] + str[i];
      }
      if (opts.trimBeforeMatching && str[i].trim() === "") {
        continue;
      }
      if (!opts.i && opts.trimCharsBeforeMatching.includes(current) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
        return val.toLowerCase();
      }).includes(current.toLowerCase())) {
        if (current.length === 2) {
          i += 1;
        }
        continue;
      }
      var whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount];
      if (stringCharacterIsAstralSurrogate.isHighSurrogate(whatToCompareTo) && existy(strToMatch[strToMatch.length - charsToCheckCount + 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(strToMatch[strToMatch.length - charsToCheckCount + 1])) {
        whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount] + strToMatch[strToMatch.length - charsToCheckCount + 1];
      }
      if (!opts.i && current === whatToCompareTo || opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase()) {
        charsToCheckCount -= current.length;
        if (charsToCheckCount < 1) {
          var aboutToReturn = i - strToMatch.length + current.length;
          if (aboutToReturn >= 0 && stringCharacterIsAstralSurrogate.isLowSurrogate(str[aboutToReturn]) && existy(str[aboutToReturn - 1]) && stringCharacterIsAstralSurrogate.isHighSurrogate(str[aboutToReturn - 1])) {
            aboutToReturn -= 1;
          }
          return aboutToReturn >= 0 ? aboutToReturn : 0;
        }
        if (current.length === 2 && stringCharacterIsAstralSurrogate.isHighSurrogate(str[i])) {
          i += 1;
        }
      } else {
        return false;
      }
    }
    if (charsToCheckCount > 0) {
      if (special && strToMatchVal === "EOL") {
        return true;
      }
      return false;
    }
  } else if (!opts.relaxedApi) {
    throw new Error("string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is ".concat(fromIndexInclusive, " beyond the input string length, ").concat(str.length, "."));
  } else {
    return false;
  }
}
function marchBackward(str, fromIndexInclusive, strToMatch, opts, special) {
  var strToMatchVal = typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive < 0 && special && strToMatchVal === "EOL") {
    return strToMatchVal;
  }
  if (fromIndexInclusive >= str.length) {
    if (!opts.relaxedApi) {
      throw new Error("string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is ".concat(str.length, " but the second argument is beyond it:\n").concat(JSON.stringify(fromIndexInclusive, null, 4)));
    } else {
      return false;
    }
  }
  var charsToCheckCount = special ? 1 : strToMatch.length;
  for (var i = fromIndexInclusive + 1; i--;) {
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (i === 0 && special && strToMatch === "EOL") {
        return true;
      }
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
        i -= 1;
      }
      if (special && strToMatch === "EOL" && i === 0) {
        return true;
      }
      continue;
    }
    var charToCompareAgainst = strToMatch[charsToCheckCount - 1];
    if (stringCharacterIsAstralSurrogate.isLowSurrogate(charToCompareAgainst)) {
      charToCompareAgainst = "".concat(strToMatch[charsToCheckCount - 2]).concat(strToMatch[charsToCheckCount - 1]);
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
    if (special && strToMatchVal === "EOL") {
      return true;
    }
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
  if (_typeof(originalOpts) === "object" && originalOpts !== null && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!").concat(Array.isArray(originalOpts.trimBeforeMatching) ? " Did you mean to use opts.trimCharsBeforeMatching?" : ""));
  }
  var opts = Object.assign({}, defaults, originalOpts);
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
    return typeof el === "string" ? el : String(el);
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
  if (typeof str !== "string") {
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
  if (!(Number.isInteger(position) && position >= 0)) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ").concat(_typeof(position), ", equal to:\n").concat(JSON.stringify(position, null, 4)));
  }
  var whatToMatch;
  var special;
  if (typeof originalWhatToMatch === "string") {
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!existy(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
  } else {
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ").concat(_typeof(originalWhatToMatch), ", equal to:\n").concat(JSON.stringify(originalWhatToMatch, null, 4)));
  }
  if (existy(originalOpts) && _typeof(originalOpts) !== "object") {
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"").concat(_typeof(originalOpts), "\", and equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (!existy(whatToMatch) ||
  !Array.isArray(whatToMatch) ||
  Array.isArray(whatToMatch) && !whatToMatch.length ||
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && typeof whatToMatch[0] === "string" && whatToMatch[0].trim().length === 0
  ) {
      if (typeof opts.cb === "function") {
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
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim() !== "") && (opts.trimCharsBeforeMatching.length === 0 || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
              firstCharOutsideIndex = _y;
              break;
            }
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
        var secondArg;
        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          secondArg = str.slice(0, indexOfTheCharacterAfter);
        }
        if (mode.startsWith("matchLeft")) {
          return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
        }
        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          secondArg = str.slice(firstCharOutsideIndex);
        }
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
      special = typeof whatToMatch[i] === "function";
      var whatToMatchVal = whatToMatch[i];
      var fullCharacterInFront = void 0;
      var indexOfTheCharacterInFront = void 0;
      var restOfStringInFront = "";
      var _startingPosition = position;
      if (mode === "matchLeft") {
        if (
        isAstral(str[i - 1]) && isAstral(str[i - 2])) {
          _startingPosition -= 2;
        } else {
          _startingPosition -= 1;
        }
      }
      var found = marchBackward(str, _startingPosition, whatToMatchVal, opts, special);
      if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
      }
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
      if (found !== false && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatchVal;
      }
    }
    return false;
  }
  for (var _i = 0, _len = whatToMatch.length; _i < _len; _i++) {
    special = typeof whatToMatch[_i] === "function";
    var _whatToMatchVal = whatToMatch[_i];
    var _startingPosition2 = position + (mode === "matchRight" ? 1 : 0);
    if (mode === "matchRight" && stringCharacterIsAstralSurrogate.isHighSurrogate(str[_startingPosition2 - 1]) && stringCharacterIsAstralSurrogate.isLowSurrogate(str[_startingPosition2])) {
      _startingPosition2 += 1;
    }
    var _found = marchForward(str, _startingPosition2, _whatToMatchVal, opts, special);
    if (_found && special && typeof _whatToMatchVal === "function" && _whatToMatchVal() === "EOL") {
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
