/**
 * util-array-object-or-both
 * Validate and normalise user choice: array, object or both?
 * Version: 2.7.68
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-array-object-or-both/
 */

'use strict';

var includes = require('lodash.includes');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var includes__default = /*#__PURE__*/_interopDefaultLegacy(includes);
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

function arrObjOrBoth(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(str)) {
    throw new Error("util-array-object-or-both/validate(): [THROW_ID_01] Please provide a string to work on. Currently it's equal to ".concat(JSON.stringify(str, null, 4)));
  }
  if (typeof str !== "string") {
    throw new Error("util-array-object-or-both/validate(): [THROW_ID_02] Input must be string! Currently it's ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (existy(originalOpts) && !isObj__default['default'](originalOpts)) {
    throw new Error("util-array-object-or-both/validate(): [THROW_ID_03] Second argument, options object, must be, well, object! Currenlty it's: ".concat(_typeof(originalOpts), ", equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var onlyObjectValues = ["object", "objects", "obj", "ob", "o"];
  var onlyArrayValues = ["array", "arrays", "arr", "aray", "arr", "a"];
  var onlyAnyValues = ["any", "all", "everything", "both", "either", "each", "whatever", "whatevs", "e"];
  var defaults = {
    msg: "",
    optsVarName: "given variable"
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  if (existy(opts.msg) && opts.msg.length > 0) {
    opts.msg = "".concat(opts.msg.trim(), " ");
  }
  if (opts.optsVarName !== "given variable") {
    opts.optsVarName = "variable \"".concat(opts.optsVarName, "\"");
  }
  if (includes__default['default'](onlyObjectValues, str.toLowerCase().trim())) {
    return "object";
  }
  if (includes__default['default'](onlyArrayValues, str.toLowerCase().trim())) {
    return "array";
  }
  if (includes__default['default'](onlyAnyValues, str.toLowerCase().trim())) {
    return "any";
  }
  throw new TypeError("".concat(opts.msg, "The ").concat(opts.optsVarName, " was customised to an unrecognised value: ").concat(str, ". Please check it against the API documentation."));
}

module.exports = arrObjOrBoth;
