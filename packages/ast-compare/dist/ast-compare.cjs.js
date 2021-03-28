/**
 * ast-compare
 * Compare anything: AST, objects, arrays, strings and nested thereof
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-compare/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _createForOfIteratorHelperLoose = require('@babel/runtime/helpers/createForOfIteratorHelperLoose');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var typeDetect = require('type-detect');
var astContainsOnlyEmptySpace = require('ast-contains-only-empty-space');
var isObj = require('lodash.isplainobject');
var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _createForOfIteratorHelperLoose__default = /*#__PURE__*/_interopDefaultLegacy(_createForOfIteratorHelperLoose);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var typeDetect__default = /*#__PURE__*/_interopDefaultLegacy(typeDetect);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

/* istanbul ignore next */
function isBlank(something) {
  if (isObj__default['default'](something)) {
    return !Object.keys(something).length;
  }
  if (Array.isArray(something) || typeof something === "string") {
    return !something.length;
  }
  return false;
}
function compare(b, s, originalOpts) {
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
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.hungryForWhitespace && opts.matchStrictly && isObj__default['default'](b) && astContainsOnlyEmptySpace.empty(b) && isObj__default['default'](s) && !Object.keys(s).length) {
    return true;
  }
  if ((!opts.hungryForWhitespace || opts.hungryForWhitespace && !astContainsOnlyEmptySpace.empty(b) && astContainsOnlyEmptySpace.empty(s)) && isObj__default['default'](b) && Object.keys(b).length !== 0 && isObj__default['default'](s) && Object.keys(s).length === 0 || typeDetect__default['default'](b) !== typeDetect__default['default'](s) && (!opts.hungryForWhitespace || opts.hungryForWhitespace && !astContainsOnlyEmptySpace.empty(b))) {
    return false;
  }
  if (typeof b === "string" && typeof s === "string") {
    if (opts.hungryForWhitespace && astContainsOnlyEmptySpace.empty(b) && astContainsOnlyEmptySpace.empty(s)) {
      return true;
    }
    if (opts.verboseWhenMismatches) {
      return b === s ? true : "Given string " + s + " is not matched! We have " + b + " on the other end.";
    }
    return opts.useWildcards ? matcher__default['default'].isMatch(b, s, {
      caseSensitive: true
    }) : b === s;
  }
  if (Array.isArray(b) && Array.isArray(s)) {
    if (opts.hungryForWhitespace && astContainsOnlyEmptySpace.empty(s) && (!opts.matchStrictly || opts.matchStrictly && b.length === s.length)) {
      return true;
    }
    if (!opts.hungryForWhitespace && s.length > b.length || opts.matchStrictly && s.length !== b.length) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      return "The length of a given array, " + JSON.stringify(s, null, 4) + " is " + s.length + " but the length of an array on the other end, " + JSON.stringify(b, null, 4) + " is " + b.length;
    }
    if (s.length === 0) {
      if (b.length === 0) {
        return true;
      }
      if (opts.verboseWhenMismatches) {
        return "The given array has no elements, but the array on the other end, " + JSON.stringify(b, null, 4) + " does have some";
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
        return "The given array " + JSON.stringify(s, null, 4) + " is not a subset of an array on the other end, " + JSON.stringify(b, null, 4);
      }
    }
  } else if (isObj__default['default'](b) && isObj__default['default'](s)) {
    sKeys = new Set(Object.keys(s));
    bKeys = new Set(Object.keys(b));
    if (opts.matchStrictly && sKeys.size !== bKeys.size) {
      if (!opts.verboseWhenMismatches) {
        return false;
      }
      var uniqueKeysOnS = new Set([].concat(sKeys).filter(function (x) {
        return !bKeys.has(x);
      }));
      var sMessage = uniqueKeysOnS.size ? " First object has unique keys: " + JSON.stringify(uniqueKeysOnS, null, 4) + "." : "";
      var uniqueKeysOnB = new Set([].concat(bKeys).filter(function (x) {
        return !sKeys.has(x);
      }));
      var bMessage = uniqueKeysOnB.size ? " Second object has unique keys:\n        " + JSON.stringify(uniqueKeysOnB, null, 4) + "." : "";
      return "When matching strictly, we found that both objects have different amount of keys." + sMessage + bMessage;
    }
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
            v: "The given object has key \"" + sKey + "\" which the other-one does not have."
          };
        }
        if (Object.keys(b).some(function (bKey) {
          return matcher__default['default'].isMatch(bKey, sKey, {
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
          v: "The given object has key \"" + sKey + "\" which the other-one does not have."
        };
      }
      if (b[sKey] != null && typeDetect__default['default'](b[sKey]) !== typeDetect__default['default'](s[sKey])) {
        if (!(astContainsOnlyEmptySpace.empty(b[sKey]) && astContainsOnlyEmptySpace.empty(s[sKey]) && opts.hungryForWhitespace)) {
          if (!opts.verboseWhenMismatches) {
            return {
              v: false
            };
          }
          return {
            v: "The given key " + sKey + " is of a different type on both objects. On the first-one, it's " + typeDetect__default['default'](s[sKey]) + ", on the second-one, it's " + typeDetect__default['default'](b[sKey])
          };
        }
      } else if (compare(b[sKey], s[sKey], opts) !== true) {
        if (!opts.verboseWhenMismatches) {
          return {
            v: false
          };
        }
        return {
          v: "The given piece " + JSON.stringify(s[sKey], null, 4) + " and " + JSON.stringify(b[sKey], null, 4) + " don't match."
        };
      }
    };
    for (var _iterator = _createForOfIteratorHelperLoose__default['default'](sKeys), _step; !(_step = _iterator()).done;) {
      var _ret = _loop();
      if (typeof _ret === "object") return _ret.v;
    }
  } else {
    if (opts.hungryForWhitespace && astContainsOnlyEmptySpace.empty(b) && astContainsOnlyEmptySpace.empty(s) && (!opts.matchStrictly || opts.matchStrictly && isBlank(s))) {
      return true;
    }
    return b === s;
  }
  return true;
}

exports.compare = compare;
