/**
 * ast-compare
 * Compare anything: AST, objects, arrays, strings and nested thereof
 * Version: 1.13.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var typeDetect = _interopDefault(require('type-detect'));
var empty = _interopDefault(require('ast-contains-only-empty-space'));
var matcher = _interopDefault(require('matcher'));

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

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var it,
      normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isBool(something) {
  return typeof something === "boolean";
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
function compare(b, s, originalOpts) {
  if (b === undefined) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_01] first argument is missing!");
  }
  if (s === undefined) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_02] second argument is missing!");
  }
  if (existy(b) && !isTheTypeLegit(b)) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_03] first input argument is of a wrong type, ".concat(typeDetect(b), ", equal to: ").concat(JSON.stringify(b, null, 4)));
  }
  if (existy(s) && !isTheTypeLegit(s)) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_04] second input argument is of a wrong type, ".concat(typeDetect(s), ", equal to: ").concat(JSON.stringify(s, null, 4)));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError("ast-compare/compare(): [THROW_ID_05] third argument, options object, must, well, be an object! Currently it's: ".concat(typeDetect(originalOpts), " and equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
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
  if (opts.hungryForWhitespace && opts.matchStrictly && isObj(b) && empty(b) && isObj(s) && !Object.keys(s).length) {
    return true;
  }
  if ((!opts.hungryForWhitespace || opts.hungryForWhitespace && !empty(b) && empty(s)) && isObj(b) && Object.keys(b).length !== 0 && isObj(s) && Object.keys(s).length === 0 || typeDetect(b) !== typeDetect(s) && (!opts.hungryForWhitespace || opts.hungryForWhitespace && !empty(b))) {
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
    sKeys = new Set(Object.keys(s));
    bKeys = new Set(Object.keys(b));
    if (opts.matchStrictly && sKeys.size !== bKeys.size) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      var uniqueKeysOnS = new Set(_toConsumableArray(sKeys).filter(function (x) {
        return !bKeys.has(x);
      }));
      var sMessage = uniqueKeysOnS.size ? " First object has unique keys: ".concat(JSON.stringify(uniqueKeysOnS, null, 4), ".") : "";
      var uniqueKeysOnB = new Set(_toConsumableArray(bKeys).filter(function (x) {
        return !sKeys.has(x);
      }));
      var bMessage = uniqueKeysOnB.size ? " Second object has unique keys:\n        ".concat(JSON.stringify(uniqueKeysOnB, null, 4), ".") : "";
      return "When matching strictly, we found that both objects have different amount of keys.".concat(sMessage).concat(bMessage);
    }
    var _iterator = _createForOfIteratorHelper(sKeys),
        _step;
    try {
      var _loop = function _loop() {
        var sKey = _step.value;
        if (!Object.prototype.hasOwnProperty.call(b, sKey)) {
          if (!opts.useWildcards || opts.useWildcards && !sKey.includes("*")) {
            if (!opts.verboseWhenMismatches) {
              return {
                v: false
              };
            }
            return {
              v: "The given object has key \"".concat(sKey, "\" which the other-one does not have.")
            };
          }
          else if (Object.keys(b).some(function (bKey) {
              return matcher.isMatch(bKey, sKey, {
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
            v: "The given object has key \"".concat(sKey, "\" which the other-one does not have.")
          };
        } else if (existy(b[sKey]) && typeDetect(b[sKey]) !== typeDetect(s[sKey])) {
          if (!(empty(b[sKey]) && empty(s[sKey]) && opts.hungryForWhitespace)) {
            if (!opts.verboseWhenMismatches) {
              return {
                v: false
              };
            }
            return {
              v: "The given key ".concat(sKey, " is of a different type on both objects. On the first-one, it's ").concat(typeDetect(s[sKey]), ", on the second-one, it's ").concat(typeDetect(b[sKey]))
            };
          }
        } else if (compare(b[sKey], s[sKey], opts) !== true) {
          if (!opts.verboseWhenMismatches) {
            return {
              v: false
            };
          }
          return {
            v: "The given piece ".concat(JSON.stringify(s[sKey], null, 4), " and ").concat(JSON.stringify(b[sKey], null, 4), " don't match.")
          };
        }
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _ret = _loop();
        if (_typeof(_ret) === "object") return _ret.v;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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
