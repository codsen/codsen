import { deepClone as clone, isPlainObject as isObj } from "codsen-utils";
import { merge } from "lodash-es";

import { version as v } from "../package.json";

const version: string = v;

export interface Obj {
  [key: string]: any;
}
export interface Opts {
  flattenArraysContainingStringsToBeEmpty: boolean;
}
const defaults: Opts = {
  flattenArraysContainingStringsToBeEmpty: false,
};

function flattenAllArrays(input: Obj, opts?: Partial<Opts>): Obj {
  const resolvedOpts: Opts = { ...defaults, ...opts };

  function flattenValue(incoming: any): any {
    if (Array.isArray(incoming)) {
      if (
        resolvedOpts.flattenArraysContainingStringsToBeEmpty &&
        incoming.some((value) => typeof value === "string")
      ) {
        return [];
      }

      let firstObjectIndex = -1;
      let combinedObject = {};
      for (let i = 0; i < incoming.length; i++) {
        if (isObj(incoming[i])) {
          combinedObject = merge(combinedObject, incoming[i]);
          if (firstObjectIndex === -1) {
            firstObjectIndex = i;
          } else {
            incoming.splice(i, 1);
            i -= 1;
          }
        }
      }
      if (firstObjectIndex !== -1) {
        incoming[firstObjectIndex] = combinedObject;
      }

      for (let i = 0; i < incoming.length; i++) {
        if (isObj(incoming[i]) || Array.isArray(incoming[i])) {
          incoming[i] = flattenValue(incoming[i]);
        }
      }
    } else if (isObj(incoming)) {
      for (const key of Object.keys(incoming)) {
        if (isObj(incoming[key]) || Array.isArray(incoming[key])) {
          incoming[key] = flattenValue(incoming[key]);
        }
      }
    }
    return incoming;
  }

  return flattenValue(clone(input));
}

export { defaults, flattenAllArrays, version };
