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

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
function march(str, fromIndexInclusive, strToMatch, opts, special, getNextIdx) {
  var strToMatchVal = typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive < 0 && special && strToMatchVal === "EOL") {
    return strToMatchVal;
  }
  if (fromIndexInclusive >= str.length && !special) {
    return false;
  }
  var charsToCheckCount = special ? 1 : strToMatch.length;
  var i = fromIndexInclusive;
  while (str[i]) {
    var nextIdx = getNextIdx(i);
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (!str[nextIdx] && special && strToMatch === "EOL") {
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    if (!opts.i && opts.trimCharsBeforeMatching.includes(str[i]) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
      return val.toLowerCase();
    }).includes(str[i].toLowerCase())) {
      if (special && strToMatch === "EOL" && !str[nextIdx]) {
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    var charToCompareAgainst = nextIdx > i ? strToMatch[strToMatch.length - charsToCheckCount] : strToMatch[charsToCheckCount - 1];
    if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        return i;
      }
    } else {
      if (opts.maxMismatches) {
        opts.maxMismatches = opts.maxMismatches - 1;
      } else {
        return false;
      }
    }
    i = getNextIdx(i);
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
    maxMismatches: 0,
    firstMustMatch: true,
    lastMustMatch: true
  };
  if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!").concat(Array.isArray(originalOpts.trimBeforeMatching) ? " Did you mean to use opts.trimCharsBeforeMatching?" : ""));
  }
  var opts = Object.assign({}, defaults, originalOpts);
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
    return isStr(el) ? el : String(el);
  });
  if (!isStr(str)) {
    return false;
  } else if (str.length === 0) {
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
  }
  if (!whatToMatch || !Array.isArray(whatToMatch) ||
  Array.isArray(whatToMatch) && !whatToMatch.length ||
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && whatToMatch[0].trim().length === 0
  ) {
      if (typeof opts.cb === "function") {
        var firstCharOutsideIndex;
        var startingPosition = position;
        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }
        if (mode.startsWith("matchLeft")) {
          for (var y = startingPosition; y--;) {
            var currentChar = str[y];
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim().length) && (opts.trimCharsBeforeMatching.length === 0 || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (var _y = startingPosition; _y < str.length; _y++) {
            var _currentChar = str[_y];
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim().length) && (opts.trimCharsBeforeMatching.length === 0 || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
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
        if (mode.startsWith("matchLeft")) {
          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        }
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
        _startingPosition -= 1;
      }
      var found = march(str, _startingPosition, whatToMatchVal, opts, special, function (i) {
        return i - 1;
      });
      if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
      }
      if (Number.isInteger(found) && found) {
        indexOfTheCharacterInFront = found - 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront];
        restOfStringInFront = str.slice(0, found);
      }
      if (Number.isInteger(found) && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatchVal;
      }
    }
    return false;
  }
  for (var _i = 0, _len = whatToMatch.length; _i < _len; _i++) {
    special = typeof whatToMatch[_i] === "function";
    var _whatToMatchVal = whatToMatch[_i];
    var _startingPosition2 = position + (mode === "matchRight" ? 1 : 0);
    var _found = march(str, _startingPosition2, _whatToMatchVal, opts, special, function (i) {
      return i + 1;
    });
    if (_found && special && typeof _whatToMatchVal === "function" && _whatToMatchVal() === "EOL") {
      return _whatToMatchVal() && (opts.cb ? opts.cb() : true) ? _whatToMatchVal() : false;
    }
    var _indexOfTheCharacterAfter = void 0;
    var characterAfter = void 0;
    if (Number.isInteger(_found)) {
      _indexOfTheCharacterAfter = _found + 1;
    }
    if (str[_indexOfTheCharacterAfter]) {
      characterAfter = str[_indexOfTheCharacterAfter];
    }
    var _theRemainderOfTheString = "";
    if (Number.isInteger(_indexOfTheCharacterAfter) && _indexOfTheCharacterAfter >= 0) {
      _theRemainderOfTheString = str.slice(_indexOfTheCharacterAfter);
    }
    if (_found !== false && (opts.cb ? opts.cb(characterAfter, _theRemainderOfTheString, _indexOfTheCharacterAfter) : true)) {
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
