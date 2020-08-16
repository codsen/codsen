/**
 * object-delete-key
 * Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.
 * Version: 1.9.32
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/object-delete-key
 */

'use strict';

var astMonkey = require('ast-monkey');
var isEmpty = require('ast-is-empty');
var clone = require('lodash.clonedeep');
var validateTheOnly = require('util-array-object-or-both');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isEmpty__default = /*#__PURE__*/_interopDefaultLegacy(isEmpty);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var validateTheOnly__default = /*#__PURE__*/_interopDefaultLegacy(validateTheOnly);

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

function deleteKey(originalInput, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(originalInput)) {
    throw new Error("object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon.");
  }
  var defaults = {
    key: null,
    val: undefined,
    cleanup: true,
    only: "any"
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  opts.only = validateTheOnly__default['default'](opts.only, {
    msg: "object-delete-key/deleteKey(): [THROW_ID_03]",
    optsVarName: "opts.only"
  });
  if (!existy(opts.key) && !existy(opts.val)) {
    throw new Error("object-delete-key/deleteKey(): [THROW_ID_04] Please provide at least a key or a value.");
  }
  var input = clone__default['default'](originalInput);
  if (opts.cleanup) {
    var findings = astMonkey.find(input, {
      key: opts.key,
      val: opts.val,
      only: opts.only
    });
    var currentIndex;
    var nodeToDelete;
    while (findings) {
      nodeToDelete = findings[0].index;
      for (var i = 1, len = findings[0].path.length; i < len; i++) {
        currentIndex = findings[0].path[len - 1 - i];
        if (isEmpty__default['default'](astMonkey.del(astMonkey.get(input, {
          index: currentIndex
        }), {
          key: opts.key,
          val: opts.val,
          only: opts.only
        }))) {
          nodeToDelete = currentIndex;
        }
      }
      input = astMonkey.drop(input, {
        index: nodeToDelete
      });
      findings = astMonkey.find(input, {
        key: opts.key,
        val: opts.val,
        only: opts.only
      });
    }
    return input;
  }
  return astMonkey.del(input, {
    key: opts.key,
    val: opts.val,
    only: opts.only
  });
}

module.exports = deleteKey;
