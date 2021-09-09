/**
 * @name object-set-all-values-to
 * @fileoverview Recursively walk the input and set all found values in plain objects to something
 * @version 5.0.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/object-set-all-values-to/}
 */

import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';

var version$1 = "5.0.0";

const version = version$1;
function setAllValuesTo(inputOriginal, valueOriginal) {
  let value;
  const input = clone(inputOriginal);
  if (arguments.length < 2) {
    value = false;
  } else if (isObj(valueOriginal) || Array.isArray(valueOriginal)) {
    value = clone(valueOriginal);
  } else {
    value = valueOriginal;
  }
  if (Array.isArray(input)) {
    input.forEach((_el, i) => {
      if (isObj(input[i]) || Array.isArray(input[i])) {
        input[i] = setAllValuesTo(input[i], value);
      }
    });
  } else if (isObj(input)) {
    Object.keys(input).forEach(key => {
      if (Array.isArray(input[key]) || isObj(input[key])) {
        input[key] = setAllValuesTo(input[key], value);
      } else {
        input[key] = value;
      }
    });
  }
  return input;
}

export { setAllValuesTo, version };
