/**
 * object-set-all-values-to
 * Recursively walk the input and set all found values in plain objects to something
 * Version: 4.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-set-all-values-to/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "4.0.11";

var version = version$1;
function setAllValuesTo(inputOriginal, valueOriginal) {
  var value;
  var input = clone__default['default'](inputOriginal);
  if (arguments.length < 2) {
    value = false;
  } else if (isObj__default['default'](valueOriginal) || Array.isArray(valueOriginal)) {
    value = clone__default['default'](valueOriginal);
  } else {
    value = valueOriginal;
  }
  if (Array.isArray(input)) {
    input.forEach(function (_el, i) {
      if (isObj__default['default'](input[i]) || Array.isArray(input[i])) {
        input[i] = setAllValuesTo(input[i], value);
      }
    });
  } else if (isObj__default['default'](input)) {
    Object.keys(input).forEach(function (key) {
      if (Array.isArray(input[key]) || isObj__default['default'](input[key])) {
        input[key] = setAllValuesTo(input[key], value);
      } else {
        input[key] = value;
      }
    });
  }
  return input;
}

exports.setAllValuesTo = setAllValuesTo;
exports.version = version;
