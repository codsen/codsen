/**
 * object-all-values-equal-to
 * Does the AST/nested-plain-object/array/whatever contain only one kind of value?
 * Version: 1.8.14
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/object-all-values-equal-to
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var isEq = _interopDefault(require('lodash.isequal'));

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

var isArr = Array.isArray;
function allValuesEqualTo(input, value, opts) {
  if (isArr(input)) {
    if (input.length === 0) {
      return true;
    }
    if (opts.arraysMustNotContainPlaceholders && input.length > 0 && input.some(function (el) {
      return isEq(el, value);
    })) {
      return false;
    }
    for (var i = input.length; i--;) {
      if (!allValuesEqualTo(input[i], value, opts)) {
        return false;
      }
    }
    return true;
  }
  if (isObj(input)) {
    var keys = Object.keys(input);
    if (keys.length === 0) {
      return true;
    }
    for (var _i = keys.length; _i--;) {
      if (!allValuesEqualTo(input[keys[_i]], value, opts)) {
        return false;
      }
    }
    return true;
  }
  return isEq(input, value);
}
function allValuesEqualToWrapper(inputOriginal, valueOriginal, originalOpts) {
  if (inputOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument.");
  }
  if (valueOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument.");
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj(originalOpts)) {
    throw new Error("object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    arraysMustNotContainPlaceholders: true
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  return allValuesEqualTo(inputOriginal, valueOriginal, opts);
}

module.exports = allValuesEqualToWrapper;
