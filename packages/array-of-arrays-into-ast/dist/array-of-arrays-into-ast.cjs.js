/**
 * array-of-arrays-into-ast
 * turns an array of arrays of data into a nested tree of plain objects
 * Version: 1.9.42
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-into-ast
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var mergeAdvanced = _interopDefault(require('object-merge-advanced'));

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
function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}
function generateAst(input, originalOpts) {
  if (!isArr(input)) {
    throw new Error("array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ".concat(_typeof(input), " equal to:\n").concat(JSON.stringify(input, null, 4)));
  } else if (input.length === 0) {
    return {};
  }
  var defaults = {
    dedupe: true
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  checkTypes(opts, defaults, {
    msg: "array-of-arrays-into-ast: [THROW_ID_02*]",
    optsVarName: "opts"
  });
  var res = {};
  input.forEach(function (arr) {
    var temp = null;
    for (var i = arr.length; i--;) {
      temp = _defineProperty({}, arr[i], [temp]);
    }
    res = mergeAdvanced(res, temp, {
      concatInsteadOfMerging: !opts.dedupe
    });
  });
  return sortObject(res);
}

module.exports = generateAst;
