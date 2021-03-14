/**
 * string-find-malformed
 * Search for a malformed string. Think of Levenshtein distance but in search.
 * Version: 2.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-find-malformed/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version$1 = "2.0.8";

var version = version$1;
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
var defaults = {
  stringOffset: 0,
  maxDistance: 1,
  ignoreWhitespace: true
};
function findMalformed(str, refStr, cb, originalOpts) {
  if (!isStr(str)) {
    throw new TypeError("string-find-malformed: [THROW_ID_01] the first input argument, string where to look for, must be a string! Currently it's equal to: " + str + " (type: " + typeof str + ")");
  } else if (!str.length) {
    return;
  }
  if (!isStr(refStr)) {
    throw new TypeError("string-find-malformed: [THROW_ID_02] the second input argument, string we should find, must be a string! Currently it's equal to: " + refStr + " (type: " + typeof refStr + ")");
  } else if (!refStr.length) {
    return;
  }
  if (typeof cb !== "function") {
    throw new TypeError("string-find-malformed: [THROW_ID_03] the third input argument, a callback function, must be a function! Currently it's equal to: " + cb + " (type: " + typeof cb + ")");
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError("string-find-malformed: [THROW_ID_04] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: " + originalOpts + " (type: " + typeof originalOpts + ")");
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (typeof opts.stringOffset === "string" && /^\d*$/.test(opts.stringOffset)) {
    opts.stringOffset = Number(opts.stringOffset);
  } else if (!Number.isInteger(opts.stringOffset) || opts.stringOffset < 0) {
    throw new TypeError("[THROW_ID_05] opts.stringOffset must be a natural number or zero! Currently it's: " + opts.stringOffset);
  }
  var len = str.length;
  var len2 = Math.min(refStr.length, (opts.maxDistance || 0) + 1);
  var pendingMatchesArr = [];
  var patience = opts.maxDistance || 1;
  var wasThisLetterMatched;
  for (var i = 0; i < len; i++) {
    if (opts.ignoreWhitespace && !str[i].trim()) {
      continue;
    }
    for (var z = 0, len3 = pendingMatchesArr.length; z < len3; z++) {
      wasThisLetterMatched = false;
      if (Array.isArray(pendingMatchesArr[z].pendingToCheck) && pendingMatchesArr[z].pendingToCheck.length && str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
        wasThisLetterMatched = true;
        pendingMatchesArr[z].pendingToCheck.shift();
      } else if (Array.isArray(pendingMatchesArr[z].pendingToCheck) && pendingMatchesArr[z].pendingToCheck.length && str[i] === pendingMatchesArr[z].pendingToCheck[1]) {
        wasThisLetterMatched = true;
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].patienceLeft -= 1;
      } else {
        pendingMatchesArr[z].patienceLeft -= 1;
        if (str[stringLeftRight.right(str, i)] !== pendingMatchesArr[z].pendingToCheck[0]) {
          pendingMatchesArr[z].pendingToCheck.shift();
          if (str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
            pendingMatchesArr[z].pendingToCheck.shift();
          }
        }
      }
    }
    pendingMatchesArr = pendingMatchesArr.filter(function (obj) {
      return obj.patienceLeft >= 0;
    });
    var tempArr = pendingMatchesArr.filter(function (obj) {
      return obj.pendingToCheck.length === 0;
    }).map(function (obj) {
      return obj.startsAt;
    });
    if (Array.isArray(tempArr) && tempArr.length) {
      var idxFrom = Math.min.apply(Math, tempArr);
      var idxTo = i + (wasThisLetterMatched ? 1 : 0);
      if (str.slice(idxFrom, idxTo) !== refStr) {
        cb({
          idxFrom: idxFrom + (opts.stringOffset || 0),
          idxTo: idxTo + (opts.stringOffset || 0)
        });
      }
      pendingMatchesArr = pendingMatchesArr.filter(function (obj) {
        return obj.pendingToCheck.length;
      });
    }
    for (var y = 0; y < len2; y++) {
      if (str[i] === refStr[y]) {
        var whatToPush = {
          startsAt: i,
          patienceLeft: patience - y,
          pendingToCheck: Array.from(refStr.slice(y + 1))
        };
        pendingMatchesArr.push(whatToPush);
        break;
      }
    }
  }
}

exports.defaults = defaults;
exports.findMalformed = findMalformed;
exports.version = version;
