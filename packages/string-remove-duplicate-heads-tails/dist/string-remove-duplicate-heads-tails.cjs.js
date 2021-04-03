/**
 * string-remove-duplicate-heads-tails
 * Detect and (recursively) remove head and tail wrappings around the input string
 * Version: 5.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-duplicate-heads-tails/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var isObj = require('lodash.isplainobject');
var arrayiffyIfString = require('arrayiffy-if-string');
var stringMatchLeftRight = require('string-match-left-right');
var rangesPush = require('ranges-push');
var rangesApply = require('ranges-apply');
var stringTrimSpacesOnly = require('string-trim-spaces-only');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "5.0.13";

var version = version$1;
var defaults = {
  heads: ["{{"],
  tails: ["}}"]
};
function remDup(str, originalOpts) {
  var has = Object.prototype.hasOwnProperty;
  if (str === undefined) {
    throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!");
  }
  if (typeof str !== "string") {
    return str;
  }
  if (originalOpts && !isObj__default['default'](originalOpts)) {
    throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ".concat(_typeof__default['default'](originalOpts), "!"));
  }
  var clonedOriginalOpts = _objectSpread__default['default']({}, originalOpts);
  if (clonedOriginalOpts && has.call(clonedOriginalOpts, "heads")) {
    if (!arrayiffyIfString.arrayiffy(clonedOriginalOpts.heads).every(function (val) {
      return typeof val === "string" || Array.isArray(val);
    })) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!");
    } else if (typeof clonedOriginalOpts.heads === "string") {
      clonedOriginalOpts.heads = arrayiffyIfString.arrayiffy(clonedOriginalOpts.heads);
    }
  }
  if (clonedOriginalOpts && has.call(clonedOriginalOpts, "tails")) {
    if (!arrayiffyIfString.arrayiffy(clonedOriginalOpts.tails).every(function (val) {
      return typeof val === "string" || Array.isArray(val);
    })) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!");
    } else if (typeof clonedOriginalOpts.tails === "string") {
      clonedOriginalOpts.tails = arrayiffyIfString.arrayiffy(clonedOriginalOpts.tails);
    }
  }
  var temp = stringTrimSpacesOnly.trimSpaces(str).res;
  if (temp.length === 0) {
    return str;
  }
  str = temp;
  var defaults = {
    heads: ["{{"],
    tails: ["}}"]
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), clonedOriginalOpts);
  opts.heads = opts.heads.map(function (el) {
    return el.trim();
  });
  opts.tails = opts.tails.map(function (el) {
    return el.trim();
  });
  var firstNonMarkerChunkFound = false;
  var secondNonMarkerChunkFound = false;
  var realRanges = new rangesPush.Ranges({
    limitToBeAddedWhitespace: true
  });
  var conditionalRanges = new rangesPush.Ranges({
    limitToBeAddedWhitespace: true
  });
  var itsFirstTail = true;
  var itsFirstLetter = true;
  var lastMatched = "";
  function delLeadingEmptyHeadTailChunks(str1, opts1) {
    var noteDownTheIndex;
    var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchRightIncl(str1, 0, opts1.heads, {
      trimBeforeMatching: true,
      cb: function cb(_char, _theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      }
    });
    if (!resultOfAttemptToMatchHeads) {
      return str1;
    }
    var resultOfAttemptToMatchTails = stringMatchLeftRight.matchRightIncl(str1, noteDownTheIndex, opts1.tails, {
      trimBeforeMatching: true,
      cb: function cb(_char, _theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      }
    });
    if (resultOfAttemptToMatchTails) {
      return str1.slice(noteDownTheIndex);
    }
    return str1;
  }
  while (str !== delLeadingEmptyHeadTailChunks(str, opts)) {
    str = stringTrimSpacesOnly.trimSpaces(delLeadingEmptyHeadTailChunks(str, opts)).res;
  }
  function delTrailingEmptyHeadTailChunks(str1, opts1) {
    var noteDownTheIndex;
    var resultOfAttemptToMatchTails = stringMatchLeftRight.matchLeftIncl(str1, str1.length - 1, opts1.tails, {
      trimBeforeMatching: true,
      cb: function cb(_char, _theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      }
    });
    if (!resultOfAttemptToMatchTails || !noteDownTheIndex) {
      return str1;
    }
    var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchLeftIncl(str1, noteDownTheIndex, opts1.heads, {
      trimBeforeMatching: true,
      cb: function cb(_char, _theRemainderOfTheString, index) {
        noteDownTheIndex = index;
        return true;
      }
    });
    if (resultOfAttemptToMatchHeads) {
      return str1.slice(0, noteDownTheIndex + 1);
    }
    return str1;
  }
  while (str !== delTrailingEmptyHeadTailChunks(str, opts)) {
    str = stringTrimSpacesOnly.trimSpaces(delTrailingEmptyHeadTailChunks(str, opts)).res;
  }
  if (!opts.heads.length || !stringMatchLeftRight.matchRightIncl(str, 0, opts.heads, {
    trimBeforeMatching: true
  }) || !opts.tails.length || !stringMatchLeftRight.matchLeftIncl(str, str.length - 1, opts.tails, {
    trimBeforeMatching: true
  })) {
    return stringTrimSpacesOnly.trimSpaces(str).res;
  }
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i].trim() === "") ; else {
      var noteDownTheIndex = void 0;
      var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchRightIncl(str, i, opts.heads, {
        trimBeforeMatching: true,
        cb: function cb(_char, _theRemainderOfTheString, index) {
          noteDownTheIndex = index;
          return true;
        }
      });
      if (resultOfAttemptToMatchHeads && noteDownTheIndex) {
        itsFirstLetter = true;
        if (itsFirstTail) {
          itsFirstTail = true;
        }
        var tempIndexUpTo = void 0;
        var _resultOfAttemptToMatchTails = stringMatchLeftRight.matchRightIncl(str, noteDownTheIndex, opts.tails, {
          trimBeforeMatching: true,
          cb: function cb(_char, _theRemainderOfTheString, index) {
            tempIndexUpTo = index;
            return true;
          }
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
        cb: function cb(_char, _theRemainderOfTheString, index) {
          noteDownTheIndex = Number.isInteger(index) ? index : str.length;
          return true;
        }
      });
      if (resultOfAttemptToMatchTails && noteDownTheIndex) {
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
    return rangesApply.rApply(str, realRanges.current()).trim();
  }
  return str.trim();
}

exports.defaults = defaults;
exports.remDup = remDup;
exports.version = version;
