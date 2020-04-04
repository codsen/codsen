/**
 * string-remove-duplicate-heads-tails
 * Detect and (recursively) remove head and tail wrappings around the input string
 * Version: 3.0.53
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
var stringMatchLeftRight = require('string-match-left-right');
var Ranges = _interopDefault(require('ranges-push'));
var rangesApply = _interopDefault(require('ranges-apply'));
var trimSpaces = _interopDefault(require('string-trim-spaces-only'));

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

function removeDuplicateHeadsTails(str) {
  var originalOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  function existy(x) {
    return x != null;
  }
  var has = Object.prototype.hasOwnProperty;
  function isStr(something) {
    return typeof something === "string";
  }
  if (str === undefined) {
    throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!");
  }
  if (typeof str !== "string") {
    return str;
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ".concat(_typeof(originalOpts), "!"));
  }
  if (existy(originalOpts) && has.call(originalOpts, "heads")) {
    if (!arrayiffy(originalOpts.heads).every(function (val) {
      return isStr(val);
    })) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!");
    } else if (isStr(originalOpts.heads)) {
      originalOpts.heads = arrayiffy(originalOpts.heads);
    }
  }
  if (existy(originalOpts) && has.call(originalOpts, "tails")) {
    if (!arrayiffy(originalOpts.tails).every(function (val) {
      return isStr(val);
    })) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!");
    } else if (isStr(originalOpts.tails)) {
      originalOpts.tails = arrayiffy(originalOpts.tails);
    }
  }
  var temp = trimSpaces(str).res;
  if (temp.length === 0) {
    return str;
  }
  str = temp;
  var defaults = {
    heads: ["{{"],
    tails: ["}}"]
  };
  var opts = Object.assign({}, defaults, originalOpts);
  opts.heads = opts.heads.map(function (el) {
    return el.trim();
  });
  opts.tails = opts.tails.map(function (el) {
    return el.trim();
  });
  var firstNonMarkerChunkFound = false;
  var secondNonMarkerChunkFound = false;
  var realRanges = new Ranges({
    limitToBeAddedWhitespace: true
  });
  var conditionalRanges = new Ranges({
    limitToBeAddedWhitespace: true
  });
  var itsFirstTail = true;
  var itsFirstLetter = true;
  var lastMatched = "";
  function delLeadingEmptyHeadTailChunks(str1, opts1) {
    var noteDownTheIndex;
    var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchRightIncl(str1, 0, opts1.heads, {
      trimBeforeMatching: true,
      cb: function cb(_char, theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      },
      relaxedApi: true
    });
    if (!resultOfAttemptToMatchHeads) {
      return str1;
    }
    var resultOfAttemptToMatchTails = stringMatchLeftRight.matchRightIncl(str1, noteDownTheIndex, opts1.tails, {
      trimBeforeMatching: true,
      cb: function cb(_char2, theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      },
      relaxedApi: true
    });
    if (resultOfAttemptToMatchTails) {
      return str1.slice(noteDownTheIndex);
    }
    return str1;
  }
  while (str !== delLeadingEmptyHeadTailChunks(str, opts)) {
    str = trimSpaces(delLeadingEmptyHeadTailChunks(str, opts)).res;
  }
  function delTrailingEmptyHeadTailChunks(str1, opts1) {
    var noteDownTheIndex;
    var resultOfAttemptToMatchTails = stringMatchLeftRight.matchLeftIncl(str1, str1.length - 1, opts1.tails, {
      trimBeforeMatching: true,
      cb: function cb(_char3, theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      },
      relaxedApi: true
    });
    if (!resultOfAttemptToMatchTails) {
      return str1;
    }
    var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchLeftIncl(str1, noteDownTheIndex, opts1.heads, {
      trimBeforeMatching: true,
      cb: function cb(_char4, theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      },
      relaxedApi: true
    });
    if (resultOfAttemptToMatchHeads) {
      return str1.slice(0, noteDownTheIndex + 1);
    }
    return str1;
  }
  while (str !== delTrailingEmptyHeadTailChunks(str, opts)) {
    str = trimSpaces(delTrailingEmptyHeadTailChunks(str, opts)).res;
  }
  if (!opts.heads.length || !stringMatchLeftRight.matchRightIncl(str, 0, opts.heads, {
    trimBeforeMatching: true,
    relaxedApi: true
  }) || !opts.tails.length || !stringMatchLeftRight.matchLeftIncl(str, str.length - 1, opts.tails, {
    trimBeforeMatching: true,
    relaxedApi: true
  })) {
    return trimSpaces(str).res;
  }
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i].trim() === "") ; else {
      var noteDownTheIndex = void 0;
      var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchRightIncl(str, i, opts.heads, {
        trimBeforeMatching: true,
        cb: function cb(_char5, theRemainderOfTheString, index) {
          noteDownTheIndex = index;
          return true;
        },
        relaxedApi: true
      });
      if (resultOfAttemptToMatchHeads) {
        itsFirstLetter = true;
        if (itsFirstTail) {
          itsFirstTail = true;
        }
        var tempIndexUpTo = void 0;
        var _resultOfAttemptToMatchTails = stringMatchLeftRight.matchRightIncl(str, noteDownTheIndex, opts.tails, {
          trimBeforeMatching: true,
          cb: function cb(_char6, theRemainderOfTheString, index) {
            tempIndexUpTo = index;
            return true;
          },
          relaxedApi: true
        });
        if (_resultOfAttemptToMatchTails) {
          realRanges.push(i, tempIndexUpTo);
        }
        if (conditionalRanges.current() && firstNonMarkerChunkFound && lastMatched !== "tails") {
          realRanges.push(conditionalRanges.current());
        }
        if (!firstNonMarkerChunkFound) {
          if (conditionalRanges.current()) {
            realRanges.push(conditionalRanges.current());
            conditionalRanges.wipe();
          }
          conditionalRanges.push(i, noteDownTheIndex);
        } else {
          conditionalRanges.push(i, noteDownTheIndex);
        }
        lastMatched = "heads";
        i = noteDownTheIndex - 1;
        continue;
      }
      var resultOfAttemptToMatchTails = stringMatchLeftRight.matchRightIncl(str, i, opts.tails, {
        trimBeforeMatching: true,
        cb: function cb(_char7, theRemainderOfTheString, index) {
          noteDownTheIndex = existy(index) ? index : str.length;
          return true;
        },
        relaxedApi: true
      });
      if (resultOfAttemptToMatchTails) {
        itsFirstLetter = true;
        if (!itsFirstTail) {
          conditionalRanges.push(i, noteDownTheIndex);
        } else {
          if (lastMatched === "heads") {
            conditionalRanges.wipe();
          }
          itsFirstTail = false;
        }
        lastMatched = "tails";
        i = noteDownTheIndex - 1;
        continue;
      }
      if (itsFirstTail) {
        itsFirstTail = true;
      }
      if (itsFirstLetter && !firstNonMarkerChunkFound) {
        firstNonMarkerChunkFound = true;
        itsFirstLetter = false;
      } else if (itsFirstLetter && !secondNonMarkerChunkFound) {
        secondNonMarkerChunkFound = true;
        itsFirstTail = true;
        itsFirstLetter = false;
        if (lastMatched === "heads") {
          conditionalRanges.wipe();
        }
      } else if (itsFirstLetter && secondNonMarkerChunkFound) {
        conditionalRanges.wipe();
      }
    }
  }
  if (conditionalRanges.current()) {
    realRanges.push(conditionalRanges.current());
  }
  if (realRanges.current()) {
    return rangesApply(str, realRanges.current()).trim();
  }
  return str.trim();
}

module.exports = removeDuplicateHeadsTails;
