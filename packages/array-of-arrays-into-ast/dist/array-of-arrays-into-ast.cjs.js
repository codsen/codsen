/**
 * array-of-arrays-into-ast
 * turns an array of arrays of data into a nested tree of plain objects
 * Version: 1.9.25
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-into-ast
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var mergeAdvanced = _interopDefault(require('object-merge-advanced'));

function _typeof(obj) {
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

var isArr = Array.isArray;
function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}
function generateAst(input, opts) {
  if (!isArr(input)) {
    throw new Error("array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ".concat(_typeof(input), " equal to:\n").concat(JSON.stringify(input, null, 4)));
  } else if (input.length === 0) {
    return {};
  }
  var defaults = {
    dedupe: true
  };
  opts = Object.assign({}, defaults, opts);
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
