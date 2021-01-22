/**
 * array-of-arrays-into-ast
 * Turns an array of arrays of data into a nested tree of plain objects
 * Version: 1.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-into-ast/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var objectMergeAdvanced = require('object-merge-advanced');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version = "1.10.1";

var version$1 = version;
var defaults = {
  dedupe: true
};

function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}
/**
 * Turns an array of arrays of data into a nested tree of plain objects
 */


function generateAst(input, originalOpts) {
  if (!Array.isArray(input)) {
    throw new Error("array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type " + typeof input + " equal to:\n" + JSON.stringify(input, null, 4));
  } else if (input.length === 0) {
    return {};
  }

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);

  var res = {};
  input.forEach(function (arr) {
    var temp = null;

    for (var i = arr.length; i--;) {
      var _temp;
      temp = (_temp = {}, _temp[arr[i]] = [temp], _temp); // uses ES6 computed property names
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
    }

    res = objectMergeAdvanced.mergeAdvanced(res, temp, {
      concatInsteadOfMerging: !opts.dedupe
    });
  });
  return sortObject(res);
}

exports.defaults = defaults;
exports.generateAst = generateAst;
exports.version = version$1;
