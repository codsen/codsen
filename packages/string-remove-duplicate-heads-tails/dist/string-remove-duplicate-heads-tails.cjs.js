/**
 * string-remove-duplicate-heads-tails
 * Detect and (recursively) remove head and tail wrappings around the input string
 * Version: 3.0.68
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-duplicate-heads-tails/
 */

'use strict';

var isObj = require('lodash.isplainobject');
var arrayiffy = require('arrayiffy-if-string');
var stringMatchLeftRight = require('string-match-left-right');
var Ranges = require('ranges-push');
var rangesApply = require('ranges-apply');
var trimSpaces = require('string-trim-spaces-only');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var arrayiffy__default = /*#__PURE__*/_interopDefaultLegacy(arrayiffy);
var Ranges__default = /*#__PURE__*/_interopDefaultLegacy(Ranges);
var rangesApply__default = /*#__PURE__*/_interopDefaultLegacy(rangesApply);
var trimSpaces__default = /*#__PURE__*/_interopDefaultLegacy(trimSpaces);

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
  if (existy(originalOpts) && !isObj__default['default'](originalOpts)) {
    throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ".concat(_typeof(originalOpts), "!"));
  }
  if (existy(originalOpts) && has.call(originalOpts, "heads")) {
    if (!arrayiffy__default['default'](originalOpts.heads).every(function (val) {
      return isStr(val);
    })) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!");
    } else if (isStr(originalOpts.heads)) {
      originalOpts.heads = arrayiffy__default['default'](originalOpts.heads);
    }
  }
  if (existy(originalOpts) && has.call(originalOpts, "tails")) {
    if (!arrayiffy__default['default'](originalOpts.tails).every(function (val) {
      return isStr(val);
    })) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!");
    } else if (isStr(originalOpts.tails)) {
      originalOpts.tails = arrayiffy__default['default'](originalOpts.tails);
    }
  }
  var temp = trimSpaces__default['default'](str).res;
  if (temp.length === 0) {
    return str;
  }
  str = temp;
  var defaults = {
    heads: ["{{"],
    tails: ["}}"]
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  opts.heads = opts.heads.map(function (el) {
    return el.trim();
  });
  opts.tails = opts.tails.map(function (el) {
    return el.trim();
  });
  var firstNonMarkerChunkFound = false;
  var secondNonMarkerChunkFound = false;
  var realRanges = new Ranges__default['default']({
    limitToBeAddedWhitespace: true
  });
  var conditionalRanges = new Ranges__default['default']({
    limitToBeAddedWhitespace: true
  });
  var itsFirstTail = true;
  var itsFirstLetter = true;
  var lastMatched = "";
  function delLeadingEmptyHeadTailChunks(str1, opts1) {
    var noteDownTheIndex;
    var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchRightIncl(str1, 0, opts1.heads, {
      trimBeforeMatching: true,
      cb: function cb(char, theRemainderOfTheString, index) {
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
      cb: function cb(char, theRemainderOfTheString, index) {
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
    str = trimSpaces__default['default'](delLeadingEmptyHeadTailChunks(str, opts)).res;
  }
  function delTrailingEmptyHeadTailChunks(str1, opts1) {
    var noteDownTheIndex;
    var resultOfAttemptToMatchTails = stringMatchLeftRight.matchLeftIncl(str1, str1.length - 1, opts1.tails, {
      trimBeforeMatching: true,
      cb: function cb(char, theRemainderOfTheString, index) {
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
      cb: function cb(char, theRemainderOfTheString, index) {
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
    str = trimSpaces__default['default'](delTrailingEmptyHeadTailChunks(str, opts)).res;
  }
  if (!opts.heads.length || !stringMatchLeftRight.matchRightIncl(str, 0, opts.heads, {
    trimBeforeMatching: true,
    relaxedApi: true
  }) || !opts.tails.length || !stringMatchLeftRight.matchLeftIncl(str, str.length - 1, opts.tails, {
    trimBeforeMatching: true,
    relaxedApi: true
  })) {
    return trimSpaces__default['default'](str).res;
  }
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i].trim() === "") ; else {
      var noteDownTheIndex = void 0;
      var resultOfAttemptToMatchHeads = stringMatchLeftRight.matchRightIncl(str, i, opts.heads, {
        trimBeforeMatching: true,
        cb: function cb(char, theRemainderOfTheString, index) {
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
          cb: function cb(char, theRemainderOfTheString, index) {
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
        cb: function cb(char, theRemainderOfTheString, index) {
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
    return rangesApply__default['default'](str, realRanges.current()).trim();
  }
  return str.trim();
}

module.exports = removeDuplicateHeadsTails;
