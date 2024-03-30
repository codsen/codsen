import { merge } from "lodash-es";
import rfdc from "rfdc";

const clone = rfdc();
import { isPlainObject as isObj } from "codsen-utils";

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
  //
  // internal functions
  // ==================

  function arrayContainsStr(arr: any[]): boolean {
    return arr.some((val) => typeof val === "string");
  }

  // setup
  // =====

  let resolvedOpts: Opts = { ...defaults, ...opts };

  let incomingObj = clone(input);
  let isFirstObj;
  let combinedObj;
  let firstObjIndex;

  // action
  // ======

  // 1. check current
  if (Array.isArray(incomingObj)) {
    if (
      resolvedOpts.flattenArraysContainingStringsToBeEmpty &&
      arrayContainsStr(incomingObj)
    ) {
      return [];
    }
    isFirstObj = null;
    combinedObj = {};
    firstObjIndex = 0;
    for (let i = 0, len = incomingObj.length; i < len; i++) {
      if (isObj(incomingObj[i])) {
        combinedObj = merge(combinedObj, incomingObj[i]);
        if (isFirstObj === null) {
          isFirstObj = true;
          firstObjIndex = i;
        } else {
          incomingObj.splice(i, 1);
          i -= 1;
        }
      }
    }
    if (isFirstObj !== null) {
      incomingObj[firstObjIndex] = clone(combinedObj);
    }
  }
  // 2. traverse deeper
  if (isObj(incomingObj)) {
    Object.keys(incomingObj).forEach((key) => {
      if (isObj(incomingObj[key]) || Array.isArray(incomingObj[key])) {
        incomingObj[key] = flattenAllArrays(
          incomingObj[key] as Obj,
          resolvedOpts,
        );
      }
    });
  } else if (Array.isArray(incomingObj)) {
    incomingObj.forEach((_el, i) => {
      if (isObj(incomingObj[i]) || Array.isArray(incomingObj[i])) {
        incomingObj[i] = flattenAllArrays(incomingObj[i], resolvedOpts);
      }
    });
  }
  return incomingObj;
}

export { flattenAllArrays, defaults, version };
