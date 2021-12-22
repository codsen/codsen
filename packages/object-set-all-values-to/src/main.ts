/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

import { version as v } from "../package.json";

const version: string = v;

interface Obj {
  [key: string]: any;
}

function setAllValuesTo(inputOriginal: Obj, valueOriginal?: any): Obj {
  let value: any;
  let input = clone(inputOriginal);

  if (arguments.length < 2) {
    value = false;
  } else if (isObj(valueOriginal) || Array.isArray(valueOriginal)) {
    value = clone(valueOriginal);
  } else {
    // needed for functions as values - we can't clone them!
    value = valueOriginal;
  }

  if (Array.isArray(input)) {
    input.forEach((_el, i) => {
      if (isObj(input[i]) || Array.isArray(input[i])) {
        input[i] = setAllValuesTo(input[i], value);
      }
    });
  } else if (isObj(input)) {
    Object.keys(input).forEach((key) => {
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
