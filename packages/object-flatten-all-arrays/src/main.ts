import { isPlainObject as isObj } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export interface Obj {
  [key: string]: any;
}
export interface Opts {
  flattenArraysContainingStringsToBeEmpty: boolean;
  /** Reuse an exclusively owned input tree instead of cloning it. The input may be mutated. */
  reuseInput?: boolean;
}
const defaults: Opts = {
  flattenArraysContainingStringsToBeEmpty: false,
};

const hasOwn = Object.prototype.hasOwnProperty;

function setOwn(target: Obj, key: string, value: any): void {
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
  } else {
    target[key] = value;
  }
}

function cloneInput(input: any): any {
  if (Array.isArray(input)) {
    const result = new Array(input.length);
    const inputRecord = input as unknown as Record<string, any>;
    for (const key of Object.keys(input)) {
      setOwn(result, key, cloneInput(inputRecord[key]));
    }
    return result;
  }
  if (isObj(input)) {
    const result: Obj = {};
    for (const key of Object.keys(input)) {
      setOwn(result, key, cloneInput(input[key]));
    }
    return result;
  }
  return input;
}

function mergeObjects(target: Obj, source: Obj): Obj {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetHasKey = hasOwn.call(target, key);
    const targetValue = targetHasKey ? target[key] : undefined;

    if (Array.isArray(sourceValue)) {
      const nextTarget = Array.isArray(targetValue) ? targetValue : [];
      setOwn(target, key, mergeObjects(nextTarget, sourceValue));
    } else if (isObj(sourceValue)) {
      const nextTarget = isObj(targetValue) ? targetValue : {};
      setOwn(target, key, mergeObjects(nextTarget, sourceValue));
    } else if (sourceValue !== undefined || !targetHasKey) {
      setOwn(target, key, sourceValue);
    }
  }
  return target;
}

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
          combinedObject = mergeObjects(combinedObject, incoming[i]);
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

  return flattenValue(resolvedOpts.reuseInput ? input : cloneInput(input));
}

export { defaults, flattenAllArrays, version };
