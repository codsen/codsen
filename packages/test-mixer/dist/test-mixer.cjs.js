/**
 * test-mixer
 * Test helper to generate function opts object variations
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/test-mixer/
 */

'use strict';

var obc = require('object-boolean-combinations');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var obc__default = /*#__PURE__*/_interopDefaultLegacy(obc);
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

function mixer() {
  var ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (ref && _typeof(ref) !== "object") {
    throw new Error("test-mixer: [THROW_ID_01] the first input arg is missing!");
  }
  if (defaultsObj && _typeof(defaultsObj) !== "object") {
    throw new Error("test-mixer: [THROW_ID_02] the second input arg is missing!");
  }
  var caught;
  if (_typeof(ref) === "object" && _typeof(defaultsObj) === "object" && Object.keys(ref).some(function (refKey) {
    if (!Object.keys(defaultsObj).includes(refKey)) {
      caught = refKey;
      return true;
    }
  })) {
    throw new Error("test-mixer: [THROW_ID_03] the second input arg object should be defaults; it should be a superset of 1st input arg object. However, 1st input arg object contains key \"".concat(caught, "\" which 2nd input arg object doesn't have."));
  }
  if (!Object.keys(defaultsObj).length) {
    return [];
  }
  var refClone = clone__default['default'](ref);
  var defaultsObjClone = clone__default['default'](defaultsObj);
  var optsWithBoolValues = {};
  Object.keys(defaultsObj).forEach(function (key) {
    if (typeof defaultsObjClone[key] === "boolean" && !Object.keys(ref).includes(key)) {
      optsWithBoolValues[key] = defaultsObjClone[key];
    }
  });
  var res = obc__default['default'](optsWithBoolValues).map(function (obj) {
    return _objectSpread2(_objectSpread2(_objectSpread2({}, defaultsObj), refClone), obj);
  });
  return res;
}

module.exports = mixer;
