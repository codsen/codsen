/**
 * object-set-all-values-to
 * Recursively walk the input and set all found values in plain objects to something
 * Version: 3.9.66
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-set-all-values-to/
 */

import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';

const isArr = Array.isArray;
function setAllValuesTo(inputOriginal, valueOriginal) {
  let value;
  const input = clone(inputOriginal);
  if (arguments.length < 2) {
    value = false;
  } else if (isObj(valueOriginal) || isArr(valueOriginal)) {
    value = clone(valueOriginal);
  } else {
    value = valueOriginal;
  }
  if (isArr(input)) {
    input.forEach((el, i) => {
      if (isObj(input[i]) || isArr(input[i])) {
        input[i] = setAllValuesTo(input[i], value);
      }
    });
  } else if (isObj(input)) {
    Object.keys(input).forEach((key) => {
      if (isArr(input[key]) || isObj(input[key])) {
        input[key] = setAllValuesTo(input[key], value);
      } else {
        input[key] = value;
      }
    });
  }
  return input;
}

export default setAllValuesTo;
