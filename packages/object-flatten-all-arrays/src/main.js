import merge from "lodash.merge";
import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

const isArr = Array.isArray;

function flattenAllArrays(originalIncommingObj, originalOpts) {
  //
  // internal functions
  // ==================

  function arrayContainsStr(arr) {
    return arr.some((val) => typeof val === "string");
  }

  // setup
  // =====

  const defaults = {
    flattenArraysContainingStringsToBeEmpty: false,
  };
  const opts = Object.assign({}, defaults, originalOpts);

  const incommingObj = clone(originalIncommingObj);
  let isFirstObj;
  let combinedObj;
  let firstObjIndex;

  // action
  // ======

  // 1. check current
  if (isArr(incommingObj)) {
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
      if (isObj(incommingObj[key]) || isArr(incommingObj[key])) {
        incommingObj[key] = flattenAllArrays(incommingObj[key], opts);
      }
    });
  } else if (isArr(incommingObj)) {
    incommingObj.forEach((el, i) => {
      if (isObj(incommingObj[i]) || isArr(incommingObj[i])) {
        incommingObj[i] = flattenAllArrays(incommingObj[i], opts);
      }
    });
  }
  return incommingObj;
}

export default flattenAllArrays;
