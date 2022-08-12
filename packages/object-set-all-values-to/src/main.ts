/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

import { version as v } from "../package.json";

const version: string = v;

export interface Obj {
  [key: string]: any;
}

function setAllValuesTo(input: Obj, value?: any): Obj {
  let val: any;
  let inp = clone(input);

  if (arguments.length < 2) {
    val = false;
  } else if (isObj(value) || Array.isArray(value)) {
    val = clone(value);
  } else {
    // needed for functions as values - we can't clone them!
    val = value;
  }

  if (Array.isArray(inp)) {
    inp.forEach((_el, i) => {
      if (isObj(inp[i]) || Array.isArray(inp[i])) {
        inp[i] = setAllValuesTo(inp[i], val);
      }
    });
  } else if (isObj(inp)) {
    Object.keys(inp).forEach((key) => {
      if (Array.isArray(inp[key]) || isObj(inp[key])) {
        inp[key] = setAllValuesTo(inp[key], val);
      } else {
        inp[key] = val;
      }
    });
  }
  return inp;
}

export { setAllValuesTo, version };
