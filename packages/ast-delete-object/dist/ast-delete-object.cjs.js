/**
 * @name ast-delete-object
 * @fileoverview Delete all plain objects in AST if they contain a certain key/value pair
 * @version 2.0.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-delete-object/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var clone = require('lodash.clonedeep');
var astCompare = require('ast-compare');
var astMonkeyTraverse = require('ast-monkey-traverse');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "2.0.15";

var version = version$1;
var defaults = {
  matchKeysStrictly: false,
  hungryForWhitespace: false
};
function deleteObj(originalInput, objToDelete, originalOpts) {
  if (!originalInput) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!");
  }
  if (!objToDelete) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!");
  }
  if (originalOpts && !isObj__default['default'](originalOpts)) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!");
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var input = clone__default['default'](originalInput);
  var current;
  if (astCompare.compare(input, objToDelete, {
    hungryForWhitespace: opts.hungryForWhitespace,
    matchStrictly: opts.matchKeysStrictly
  })) {
    return {};
  }
  input = astMonkeyTraverse.traverse(input, function (key, val) {
    current = val !== undefined ? val : key;
    if (isObj__default['default'](current)) {
      if (isObj__default['default'](objToDelete) && isObj__default['default'](current) && !Object.keys(objToDelete).length && !Object.keys(current).length) {
        return NaN;
      }
      if (astCompare.compare(current, objToDelete, {
        hungryForWhitespace: opts.hungryForWhitespace,
        matchStrictly: opts.matchKeysStrictly
      })) {
        return NaN;
      }
    }
    return current;
  });
  return input;
}

exports.defaults = defaults;
exports.deleteObj = deleteObj;
exports.version = version;
