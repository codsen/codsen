import merge from "lodash.merge";
import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";
import { version } from "../package.json";

interface Obj {
  [key: string]: any;
}
interface Opts {
  flattenArraysContainingStringsToBeEmpty: boolean;
}

function flattenAllArrays(originalIncommingObj: Obj, originalOpts?: Opts): Obj {
  //
  // internal functions
  // ==================

  function arrayContainsStr(arr: any[]): boolean {
    return arr.some((val) => typeof val === "string");
  }

  // setup
  // =====

  const defaults: Opts = {
    flattenArraysContainingStringsToBeEmpty: false,
  };
  const opts: Opts = { ...defaults, ...originalOpts };

  const incommingObj = clone(originalIncommingObj);
  let isFirstObj;
  let combinedObj;
  let firstObjIndex;

  // action
  // ======

  // 1. check current
  if (Array.isArray(incommingObj)) {
    if (
      opts.flattenArraysContainingStringsToBeEmpty &&
      arrayContainsStr(incommingObj)
    ) {
      return [];
    }
    isFirstObj = null;
    combinedObj = {};
    firstObjIndex = 0;
    for (let i = 0, len = incommingObj.length; i < len; i++) {
      if (isObj(incommingObj[i])) {
        combinedObj = merge(combinedObj, incommingObj[i]);
        if (isFirstObj === null) {
          isFirstObj = true;
          firstObjIndex = i;
        } else {
          incommingObj.splice(i, 1);
          i -= 1;
        }
      }
    }
    if (isFirstObj !== null) {
      incommingObj[firstObjIndex] = clone(combinedObj);
    }
  }
  // 2. traverse deeper
  if (isObj(incommingObj)) {
    Object.keys(incommingObj).forEach((key) => {
      if (isObj(incommingObj[key]) || Array.isArray(incommingObj[key])) {
        incommingObj[key] = flattenAllArrays(incommingObj[key], opts);
      }
    });
  } else if (Array.isArray(incommingObj)) {
    incommingObj.forEach((_el, i) => {
      if (isObj(incommingObj[i]) || Array.isArray(incommingObj[i])) {
        incommingObj[i] = flattenAllArrays(incommingObj[i], opts);
      }
    });
  }
  return incommingObj;
}

export { flattenAllArrays, version };
