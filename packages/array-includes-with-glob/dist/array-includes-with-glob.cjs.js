/**
 * array-includes-with-glob
 * like _.includes but with wildcards
 * Version: 2.12.42
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-includes-with-glob/
 */

'use strict';

var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

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
function arrayIncludesWithGlob(originalInput, stringToFind, originalOpts) {
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  var defaults = {
    arrayVsArrayAllMustBeFound: "any"
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  if (arguments.length === 0) {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_01] all inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_02] second argument missing!");
  }
  if (!isArr(originalInput)) {
    if (isStr(originalInput)) {
      originalInput = [originalInput];
    } else {
      throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_03] first argument must be an array! It was given as ".concat(_typeof(originalInput)));
    }
  }
  if (!isStr(stringToFind) && !isArr(stringToFind)) {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_04] second argument must be a string or array of strings! It was given as ".concat(_typeof(stringToFind)));
  }
  if (opts.arrayVsArrayAllMustBeFound !== "any" && opts.arrayVsArrayAllMustBeFound !== "all") {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_05] opts.arrayVsArrayAllMustBeFound was customised to an unrecognised value, ".concat(opts.arrayVsArrayAllMustBeFound, ". It must be equal to either \"any\" or \"all\"."));
  }
  if (originalInput.length === 0) {
    return false;
  }
  var input = originalInput.filter(function (elem) {
    return existy(elem);
  });
  if (input.length === 0) {
    return false;
  }
  if (isStr(stringToFind)) {
    return input.some(function (val) {
      return matcher__default['default'].isMatch(val, stringToFind, {
        caseSensitive: true
      });
    });
  }
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some(function (stringToFindVal) {
      return input.some(function (val) {
        return matcher__default['default'].isMatch(val, stringToFindVal, {
          caseSensitive: true
        });
      });
    });
  }
  return stringToFind.every(function (stringToFindVal) {
    return input.some(function (val) {
      return matcher__default['default'].isMatch(val, stringToFindVal, {
        caseSensitive: true
      });
    });
  });
}

module.exports = arrayIncludesWithGlob;
