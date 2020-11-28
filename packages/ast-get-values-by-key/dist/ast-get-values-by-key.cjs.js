/**
 * ast-get-values-by-key
 * Read or edit parsed HTML (or AST in general)
 * Version: 2.8.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-values-by-key/
 */

'use strict';

var traverse = require('ast-monkey-traverse');
var matcher = require('matcher');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

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

function getAllValuesByKey(originalInput, whatToFind, originalReplacement) {
  if (!originalInput) {
    throw new Error("ast-get-values-by-key: [THROW_ID_01] the first argument is missing!");
  }
  if (!whatToFind) {
    throw new Error("ast-get-values-by-key: [THROW_ID_02] the second argument is missing!");
  } else if (Array.isArray(whatToFind)) {
    var culpritsIndex;
    var culpritsVal;
    /* istanbul ignore else */
    if (whatToFind.length && whatToFind.some(function (val, i) {
      if (typeof val === "string") {
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
  if (typeof originalReplacement === "string" || originalReplacement) {
    if (typeof originalReplacement === "string") {
      replacement = [originalReplacement];
    } else {
      replacement = clone__default['default'](originalReplacement);
    }
  }
  var res = [];
  var input = traverse__default['default'](originalInput, function (key, val, innerObj) {
    var current = val !== undefined ? val : key;
    if (val !== undefined && matcher__default['default'].isMatch(key, whatToFind, {
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
