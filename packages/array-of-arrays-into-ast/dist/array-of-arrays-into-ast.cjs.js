/**
 * @name array-of-arrays-into-ast
 * @fileoverview Turns an array of arrays of data into a nested tree of plain objects
 * @version 2.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-of-arrays-into-ast/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var objectMergeAdvanced = require('object-merge-advanced');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "2.0.16";

var version = version$1;
var defaults = {
  dedupe: true
};
function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}
function generateAst(input, originalOpts) {
  if (!Array.isArray(input)) {
    throw new Error("array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ".concat(_typeof__default['default'](input), " equal to:\n").concat(JSON.stringify(input, null, 4)));
  } else if (input.length === 0) {
    return {};
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var res = {};
  input.forEach(function (arr) {
    var temp = null;
    for (var i = arr.length; i--;) {
      temp = _defineProperty__default['default']({}, arr[i], [temp]);
    }
    res = objectMergeAdvanced.mergeAdvanced(res, temp, {
      concatInsteadOfMerging: !opts.dedupe
    });
  });
  return sortObject(res);
}

exports.defaults = defaults;
exports.generateAst = generateAst;
exports.version = version;
