/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { deepClone as clone, isPlainObject as isObj } from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;

export interface Obj {
  [key: string]: any;
}

function setAllValuesTo(input: Obj, value?: any): Obj {
  let val: any;
  const inp = clone(input);

  // biome-ignore lint/complexity/noArguments: arity distinguishes an omitted second argument from an explicit undefined
  if (arguments.length < 2) {
    val = false;
  } else if (isObj(value) || Array.isArray(value)) {
    val = clone(value);
  } else {
    // needed for functions as values - we can't clone them!
    val = value;
  }

  function setNestedValues(node: Obj, replacement: any): Obj {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        if (isObj(node[i]) || Array.isArray(node[i])) {
          node[i] = setNestedValues(
            node[i],
            isObj(replacement) || Array.isArray(replacement)
              ? clone(replacement)
              : replacement,
          );
        }
      }
    } else if (isObj(node)) {
      for (const key of Object.keys(node)) {
        if (Array.isArray(node[key]) || isObj(node[key])) {
          node[key] = setNestedValues(
            node[key],
            isObj(replacement) || Array.isArray(replacement)
              ? clone(replacement)
              : replacement,
          );
        } else {
          node[key] = replacement;
        }
      }
    }
    return node;
  }

  return setNestedValues(inp, val);
}

export { setAllValuesTo, version };
