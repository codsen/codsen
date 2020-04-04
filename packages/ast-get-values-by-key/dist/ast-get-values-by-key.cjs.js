/**
 * ast-get-values-by-key
 * Read or edit parsed HTML (or AST in general)
 * Version: 2.6.59
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-values-by-key
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var traverse = _interopDefault(require('ast-monkey-traverse'));
var matcher = _interopDefault(require('matcher'));
var clone = _interopDefault(require('lodash.clonedeep'));

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

var isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function getAllValuesByKey(originalInput, whatToFind, originalReplacement) {
  if (!existy(originalInput)) {
    throw new Error("ast-get-values-by-key: [THROW_ID_01] the first argument is missing!");
  }
  if (!existy(whatToFind)) {
    throw new Error("ast-get-values-by-key: [THROW_ID_02] the second argument is missing!");
  } else if (isArr(whatToFind)) {
    var culpritsIndex;
    var culpritsVal;
    if (whatToFind.length && whatToFind.some(function (val, i) {
      if (isStr(val)) {
        return false;
      }
      culpritsIndex = i;
      culpritsVal = val;
      return true;
    })) {
      throw new Error("ast-get-values-by-key: [THROW_ID_03] the second argument is array of values and not all of them are strings! For example, at index ".concat(culpritsIndex, ", we have a value ").concat(JSON.stringify(culpritsVal, null, 0), " which is not string but ").concat(_typeof(culpritsVal), "!"));
    }
  } else if (typeof whatToFind !== "string") {
    throw new Error("ast-get-values-by-key: [THROW_ID_04] the second argument must be string! Currently it's of a type \"".concat(_typeof(whatToFind), "\", equal to:\n").concat(JSON.stringify(whatToFind, null, 4)));
  }
  var replacement;
  if (existy(originalReplacement)) {
    if (typeof originalReplacement === "string") {
      replacement = [originalReplacement];
    } else {
      replacement = clone(originalReplacement);
    }
  }
  var res = [];
  var input = traverse(originalInput, function (key, val, innerObj) {
    var current = val !== undefined ? val : key;
    if (val !== undefined && matcher.isMatch(key, whatToFind, {
      caseSensitive: true
    })) {
      if (replacement === undefined) {
        res.push({
          val: val,
          path: innerObj.path
        });
      } else if (replacement.length > 0) {
        return replacement.shift();
      }
    }
    return current;
  });
  return replacement === undefined ? res : input;
}

module.exports = getAllValuesByKey;
