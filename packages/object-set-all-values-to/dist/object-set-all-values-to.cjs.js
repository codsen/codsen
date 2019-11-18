/**
 * object-set-all-values-to
 * Recursively walk the input and set all found values in plain objects to something
 * Version: 3.9.48
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/object-set-all-values-to
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var isObj = _interopDefault(require('lodash.isplainobject'));

var isArr = Array.isArray;
function setAllValuesTo(inputOriginal, valueOriginal) {
  var value;
  var input = clone(inputOriginal);
  if (arguments.length < 2) {
    value = false;
  } else if (isObj(valueOriginal) || isArr(valueOriginal)) {
    value = clone(valueOriginal);
  } else {
    value = valueOriginal;
  }
  if (isArr(input)) {
    input.forEach(function (el, i) {
      if (isObj(input[i]) || isArr(input[i])) {
        input[i] = setAllValuesTo(input[i], value);
      }
    });
  } else if (isObj(input)) {
    Object.keys(input).forEach(function (key) {
      if (isArr(input[key]) || isObj(input[key])) {
        input[key] = setAllValuesTo(input[key], value);
      } else {
        input[key] = value;
      }
    });
  }
  return input;
}

module.exports = setAllValuesTo;
