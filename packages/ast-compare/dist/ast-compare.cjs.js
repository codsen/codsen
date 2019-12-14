/**
 * ast-compare
 * Compare anything: AST, objects, arrays, strings and nested thereof
 * Version: 1.12.28
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var pullAll = _interopDefault(require('lodash.pullall'));
var typeDetect = _interopDefault(require('type-detect'));
var empty = _interopDefault(require('ast-contains-only-empty-space'));
var matcher = _interopDefault(require('matcher'));

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
function isObj(something) {
  return typeDetect(something) === "Object";
}
function isStr(something) {
  return typeDetect(something) === "string";
}
function isNum(something) {
  return typeDetect(something) === "number";
}
function isBool(something) {
  return typeDetect(something) === "boolean";
}
function isNull(something) {
  return something === null;
}
function isBlank(something) {
  if (isObj(something)) {
    return Object.keys(something).length === 0;
  } else if (isArr(something) || isStr(something)) {
    return something.length === 0;
  }
  return false;
}
function isTheTypeLegit(something) {
  return isObj(something) || isStr(something) || isNum(something) || isBool(something) || isArr(something) || isNull(something);
}
function compare(bo, so, originalOpts) {
  if (bo === undefined) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_01] first argument is missing!");
  }
  if (so === undefined) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_02] second argument is missing!");
  }
  if (existy(bo) && !isTheTypeLegit(bo)) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_03] first input argument is of a wrong type, ".concat(typeDetect(bo), ", equal to: ").concat(JSON.stringify(bo, null, 4)));
  }
  if (existy(so) && !isTheTypeLegit(so)) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_04] second input argument is of a wrong type, ".concat(typeDetect(so), ", equal to: ").concat(JSON.stringify(so, null, 4)));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_05] third argument, options object, must, well, be an object! Currently it's: ".concat(typeDetect(originalOpts), " and equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var s = clone(so);
  var b = clone(bo);
  var sKeys;
  var bKeys;
  var found;
  var bOffset = 0;
  var defaults = {
    hungryForWhitespace: false,
    matchStrictly: false,
    verboseWhenMismatches: false,
    useWildcards: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.hungryForWhitespace && opts.matchStrictly && isObj(bo) && empty(bo) && isObj(so) && Object.keys(so).length === 0) {
    return true;
  }
  if ((!opts.hungryForWhitespace || opts.hungryForWhitespace && !empty(bo) && empty(so)) && isObj(bo) && Object.keys(bo).length !== 0 && isObj(so) && Object.keys(so).length === 0 || typeDetect(bo) !== typeDetect(so) && (!opts.hungryForWhitespace || opts.hungryForWhitespace && !empty(bo))) {
    return false;
  }
  if (isStr(b) && isStr(s)) {
    if (opts.hungryForWhitespace && empty(b) && empty(s)) {
      return true;
    }
    if (opts.verboseWhenMismatches) {
      return b === s ? true : "Given string ".concat(s, " is not matched! We have ").concat(b, " on the other end.");
    }
    return opts.useWildcards ? matcher.isMatch(b, s, {
      caseSensitive: true
    }) : b === s;
  } else if (isArr(b) && isArr(s)) {
    if (opts.hungryForWhitespace && empty(s) && (!opts.matchStrictly || opts.matchStrictly && b.length === s.length)) {
      return true;
    }
    if (!opts.hungryForWhitespace && s.length > b.length || opts.matchStrictly && s.length !== b.length) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      return "The length of a given array, ".concat(JSON.stringify(s, null, 4), " is ").concat(s.length, " but the length of an array on the other end, ").concat(JSON.stringify(b, null, 4), " is ").concat(b.length);
    }
    if (s.length === 0) {
      if (b.length === 0) {
        return true;
      }
      if (opts.verboseWhenMismatches) {
        return "The given array has no elements, but the array on the other end, ".concat(JSON.stringify(b, null, 4), " does have some");
      }
      return false;
    }
    for (var i = 0, sLen = s.length; i < sLen; i++) {
      found = false;
      for (var j = bOffset, bLen = b.length; j < bLen; j++) {
        bOffset += 1;
        if (compare(b[j], s[i], opts) === true) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (!opts.verboseWhenMismatches) {
          return false;
        }
        return "The given array ".concat(JSON.stringify(s, null, 4), " is not a subset of an array on the other end, ").concat(JSON.stringify(b, null, 4));
      }
    }
  } else if (isObj(b) && isObj(s)) {
    sKeys = Object.keys(s);
    bKeys = Object.keys(b);
    if (opts.matchStrictly && sKeys.length !== bKeys.length) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      var uniqueKeysOnS = pullAll(clone(sKeys), clone(bKeys));
      var sMessage = uniqueKeysOnS.length > 0 ? "First object has unique keys: ".concat(JSON.stringify(uniqueKeysOnS, null, 4), ".") : "";
      var uniqueKeysOnB = pullAll(clone(bKeys), clone(sKeys));
      var bMessage = uniqueKeysOnB.length > 0 ? "Second object has unique keys:\n        ".concat(JSON.stringify(uniqueKeysOnB, null, 4), ".") : "";
      return "When matching strictly, we found that both objects have different amount of keys. ".concat(sMessage, " ").concat(bMessage);
    }
    var _loop = function _loop(len, _i) {
      if (!existy(b[sKeys[_i]])) {
        if (!opts.useWildcards || opts.useWildcards && !sKeys[_i].includes("*")) {
          if (!opts.verboseWhenMismatches) {
            return {
              v: false
            };
          }
          return {
            v: "The given object has key ".concat(sKeys[_i], " which the other-one does not have.")
          };
        }
        else if (Object.keys(b).some(function (bKey) {
            return matcher.isMatch(bKey, sKeys[_i], {
              caseSensitive: true
            });
          })) {
            return {
              v: true
            };
          }
        if (!opts.verboseWhenMismatches) {
          return {
            v: false
          };
        }
        return {
          v: "The given object has key ".concat(sKeys[_i], " which the other-one does not have.")
        };
      }
      if (b[sKeys[_i]] !== undefined && !isTheTypeLegit(b[sKeys[_i]])) {
        throw new TypeError("ast-compare/compare(): [THROW_ID_07] The input ".concat(JSON.stringify(b, null, 4), " contains a value of a wrong type, ").concat(typeDetect(b[sKeys[_i]]), " at index ").concat(_i, ", equal to: ").concat(JSON.stringify(b[sKeys[_i]], null, 4)));
      } else if (!isTheTypeLegit(s[sKeys[_i]])) {
        throw new TypeError("ast-compare/compare(): [THROW_ID_08] The input ".concat(JSON.stringify(s, null, 4), " contains a value of a wrong type, ").concat(typeDetect(s[sKeys[_i]]), " at index ").concat(_i, ", equal to: ").concat(JSON.stringify(s[sKeys[_i]], null, 4)));
      } else if (existy(b[sKeys[_i]]) && typeDetect(b[sKeys[_i]]) !== typeDetect(s[sKeys[_i]])) {
        if (!(empty(b[sKeys[_i]]) && empty(s[sKeys[_i]]) && opts.hungryForWhitespace)) {
          if (!opts.verboseWhenMismatches) {
            return {
              v: false
            };
          }
          return {
            v: "The given key ".concat(sKeys[_i], " is of a different type on both objects. On the first-one, it's ").concat(typeDetect(s[sKeys[_i]]), ", on the second-one, it's ").concat(typeDetect(b[sKeys[_i]]))
          };
        }
      }
      else if (compare(b[sKeys[_i]], s[sKeys[_i]], opts) !== true) {
          if (!opts.verboseWhenMismatches) {
            return {
              v: false
            };
          }
          return {
            v: "The given piece ".concat(JSON.stringify(s[sKeys[_i]], null, 4), " and ").concat(JSON.stringify(b[sKeys[_i]], null, 4), " don't match.")
          };
        }
    };
    for (var _i = 0, len = sKeys.length; _i < len; _i++) {
      var _ret = _loop(len, _i);
      if (_typeof(_ret) === "object") return _ret.v;
    }
  } else {
    if (opts.hungryForWhitespace && empty(b) && empty(s) && (!opts.matchStrictly || opts.matchStrictly && isBlank(s))) {
      return true;
    }
    return b === s;
  }
  return true;
}

module.exports = compare;
