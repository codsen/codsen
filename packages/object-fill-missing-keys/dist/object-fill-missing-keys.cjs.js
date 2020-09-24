/**
 * object-fill-missing-keys
 * Add missing keys into plain objects, according to a reference object
 * Version: 7.10.26
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-fill-missing-keys/
 */

'use strict';

var clone = require('lodash.clonedeep');
var merge = require('object-merge-advanced');
var arrayiffyIfString = require('arrayiffy-if-string');
var allValuesEqualTo = require('object-all-values-equal-to');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);
var arrayiffyIfString__default = /*#__PURE__*/_interopDefaultLegacy(arrayiffyIfString);
var allValuesEqualTo__default = /*#__PURE__*/_interopDefaultLegacy(allValuesEqualTo);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

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

function typ(something) {
  if (isObj__default['default'](something)) {
    return "plain object";
  }
  if (Array.isArray(something)) {
    return "array";
  }
  return _typeof(something);
}
function isStr(something) {
  return typeof something === "string";
}
function existy(x) {
  return x != null;
}
var isArr = Array.isArray;
function fillMissingKeys(incompleteOriginal, schema, opts) {
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var incomplete = clone__default['default'](incompleteOriginal);
  if (existy(incomplete) || !(path.length && opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(path) && allValuesEqualTo__default['default'](incomplete, opts.placeholder))) {
    if (isObj__default['default'](schema) && isObj__default['default'](incomplete)) {
      Object.keys(schema).forEach(function (key) {
        var currentPath = "".concat(path ? "".concat(path, ".") : "").concat(key);
        if (opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(currentPath)) {
          if (existy(incomplete[key])) {
            if (allValuesEqualTo__default['default'](incomplete[key], opts.placeholder)) {
              incomplete[key] = opts.placeholder;
            }
          } else {
            incomplete[key] = opts.placeholder;
          }
        }
        if (!existy(incomplete[key]) || !(opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(currentPath) && allValuesEqualTo__default['default'](incomplete[key], opts.placeholder))) {
          incomplete[key] = fillMissingKeys(incomplete[key], schema[key], opts, currentPath);
        }
      });
    } else if (isArr(schema) && isArr(incomplete)) {
      if (incomplete.length === 0) {
        return schema;
      }
      if (schema.length > 0) {
        for (var i = incomplete.length; i--;) {
          var currentPath = "".concat(path ? "".concat(path, ".") : "", "0");
          if (isObj__default['default'](schema[0]) || isArr(schema[0])) {
            incomplete[i] = fillMissingKeys(incomplete[i], schema[0], opts, currentPath);
          }
        }
      }
    } else {
      return merge__default['default'](schema, incomplete, {
        useNullAsExplicitFalse: opts.useNullAsExplicitFalse
      });
    }
  }
  return incomplete;
}
function fillMissingKeysWrapper(originalIncompleteWrapper, originalSchemaWrapper, originalOptsWrapper) {
  if (arguments.length === 0) {
    throw new Error("object-fill-missing-keys: [THROW_ID_01] All arguments are missing!");
  }
  if (!isObj__default['default'](originalIncompleteWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_02] First argument, input object must be a plain object. Currently it's type is \"".concat(typ(originalIncompleteWrapper), "\" and it's equal to: ").concat(JSON.stringify(originalIncompleteWrapper, null, 4)));
  }
  if (!isObj__default['default'](originalSchemaWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_03] Second argument, schema object, must be a plain object. Currently it's type is \"".concat(typ(originalSchemaWrapper), "\" and it's equal to: ").concat(JSON.stringify(originalSchemaWrapper, null, 4)));
  }
  if (originalOptsWrapper !== undefined && originalOptsWrapper !== null && !isObj__default['default'](originalOptsWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_04] Third argument, schema object, must be a plain object. Currently it's type is \"".concat(typ(originalOptsWrapper), "\" and it's equal to: ").concat(JSON.stringify(originalOptsWrapper, null, 4)));
  }
  if (originalOptsWrapper === null) {
    originalOptsWrapper = {};
  }
  var defaults = {
    placeholder: false,
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    useNullAsExplicitFalse: true
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptsWrapper);
  opts.doNotFillThesePathsIfTheyContainPlaceholders = arrayiffyIfString__default['default'](opts.doNotFillThesePathsIfTheyContainPlaceholders);
  var culpritsVal = null;
  var culpritsIndex = null;
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (key, idx) {
    if (!isStr(key)) {
      culpritsVal = key;
      culpritsIndex = idx;
      return false;
    }
    return true;
  })) {
    throw new Error("object-fill-missing-keys: [THROW_ID_06] opts.doNotFillThesePathsIfTheyContainPlaceholders element with an index number \"".concat(culpritsIndex, "\" is not a string! It's ").concat(typ(culpritsVal), ", equal to:\n").concat(JSON.stringify(culpritsVal, null, 4)));
  }
  return fillMissingKeys(clone__default['default'](originalIncompleteWrapper), clone__default['default'](originalSchemaWrapper), opts);
}

module.exports = fillMissingKeysWrapper;
