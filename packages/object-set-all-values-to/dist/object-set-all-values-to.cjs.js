/**
 * object-set-all-values-to
 * Recursively walk the input and set all found values in plain objects to something
 * Version: 3.9.67
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-set-all-values-to/
 */

'use strict';

var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var isArr = Array.isArray;
function setAllValuesTo(inputOriginal, valueOriginal) {
  var value;
  var input = clone__default['default'](inputOriginal);
  if (arguments.length < 2) {
    value = false;
  } else if (isObj__default['default'](valueOriginal) || isArr(valueOriginal)) {
    value = clone__default['default'](valueOriginal);
  } else {
    value = valueOriginal;
  }
  if (isArr(input)) {
    input.forEach(function (el, i) {
      if (isObj__default['default'](input[i]) || isArr(input[i])) {
        input[i] = setAllValuesTo(input[i], value);
      }
    });
  } else if (isObj__default['default'](input)) {
    Object.keys(input).forEach(function (key) {
      if (isArr(input[key]) || isObj__default['default'](input[key])) {
        input[key] = setAllValuesTo(input[key], value);
      } else {
        input[key] = value;
      }
    });
  }
  return input;
}

module.exports = setAllValuesTo;
