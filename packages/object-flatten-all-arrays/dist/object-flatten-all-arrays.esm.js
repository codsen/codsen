/**
 * object-flatten-all-arrays
 * Merge and flatten any arrays found in all values within plain objects
 * Version: 5.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-flatten-all-arrays/
 */

import merge from 'lodash.merge';
import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';

var version$1 = "5.0.13";

const version = version$1;
function flattenAllArrays(originalIncommingObj, originalOpts) {
  function arrayContainsStr(arr) {
    return arr.some(val => typeof val === "string");
  }
  const defaults = {
    flattenArraysContainingStringsToBeEmpty: false
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const incommingObj = clone(originalIncommingObj);
  let isFirstObj;
  let combinedObj;
  let firstObjIndex;
  if (Array.isArray(incommingObj)) {
    if (opts.flattenArraysContainingStringsToBeEmpty && arrayContainsStr(incommingObj)) {
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
  if (isObj(incommingObj)) {
    Object.keys(incommingObj).forEach(key => {
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
