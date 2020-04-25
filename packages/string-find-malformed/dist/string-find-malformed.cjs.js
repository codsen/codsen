/**
 * string-find-malformed
 * Search for a malformed string. Think of Levenshtein distance but in search.
 * Version: 1.1.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-malformed
 */

'use strict';

var stringLeftRight = require('string-left-right');

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
function strFindMalformed(str, refStr, cb, originalOpts) {
  if (!isStr(str)) {
    throw new TypeError("string-find-malformed: [THROW_ID_01] the first input argument, string where to look for, must be a string! Currently it's equal to: ".concat(str, " (type: ").concat(_typeof(str), ")"));
  } else if (!str.length) {
    return;
  }
  if (!isStr(refStr)) {
    throw new TypeError("string-find-malformed: [THROW_ID_02] the second input argument, string we should find, must be a string! Currently it's equal to: ".concat(refStr, " (type: ").concat(_typeof(refStr), ")"));
  } else if (!refStr.length) {
    return;
  }
  if (typeof cb !== "function") {
    throw new TypeError("string-find-malformed: [THROW_ID_03] the third input argument, a callback function, must be a function! Currently it's equal to: ".concat(cb, " (type: ").concat(_typeof(cb), ")"));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError("string-find-malformed: [THROW_ID_04] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ".concat(originalOpts, " (type: ").concat(_typeof(originalOpts), ")"));
  }
  var defaults = {
    stringOffset: 0,
    maxDistance: 1,
    ignoreWhitespace: true
  };
  var opts = _objectSpread2({}, defaults, {}, originalOpts);
  if (typeof opts.stringOffset === "string" && /^\d*$/.test(opts.stringOffset)) {
    opts.stringOffset = Number(opts.stringOffset);
  } else if (!Number.isInteger(opts.stringOffset) || opts.stringOffset < 0) {
    throw new TypeError("".concat(opts.source, " [THROW_ID_05] opts.stringOffset must be a natural number or zero! Currently it's: ").concat(opts.fromIndex));
  }
  var len = str.length;
  var len2 = Math.min(refStr.length, opts.maxDistance + 1);
  var pendingMatchesArr = [];
  var patience = opts.maxDistance;
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
      var idxFrom = Math.min.apply(Math, _toConsumableArray(tempArr));
      var idxTo = i + (wasThisLetterMatched ? 1 : 0);
      if (str.slice(idxFrom, idxTo) !== refStr) {
        cb({
          idxFrom: idxFrom + opts.stringOffset,
          idxTo: idxTo + opts.stringOffset
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

module.exports = strFindMalformed;
