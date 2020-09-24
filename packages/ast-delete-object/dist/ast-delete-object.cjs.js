/**
 * ast-delete-object
 * Delete all plain objects in AST if they contain a certain key/value pair
 * Version: 1.8.75
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-delete-object/
 */

'use strict';

var clone = require('lodash.clonedeep');
var compare = require('ast-compare');
var traverse = require('ast-monkey-traverse');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var compare__default = /*#__PURE__*/_interopDefaultLegacy(compare);
var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);

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

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function deleteObj(originalInput, objToDelete, originalOpts) {
  if (!originalInput) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!");
  }
  if (!objToDelete) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!");
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!");
  }
  var defaults = {
    matchKeysStrictly: false,
    hungryForWhitespace: false
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var input = clone__default['default'](originalInput);
  var current;
  if (compare__default['default'](input, objToDelete, {
    hungryForWhitespace: opts.hungryForWhitespace,
    matchStrictly: opts.matchKeysStrictly
  })) {
    return {};
  }
  input = traverse__default['default'](input, function (key, val) {
    current = val !== undefined ? val : key;
    if (isObj(current)) {
      if (isObj(objToDelete) && isObj(current) && !Object.keys(objToDelete).length && !Object.keys(current).length) {
        return NaN;
      }
      if (compare__default['default'](current, objToDelete, {
        hungryForWhitespace: opts.hungryForWhitespace,
        matchStrictly: opts.matchKeysStrictly
      })) {
        return NaN;
      }
    }
    return current;
  });
  return input;
}

module.exports = deleteObj;
