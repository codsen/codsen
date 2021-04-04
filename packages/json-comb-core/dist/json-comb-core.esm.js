/**
 * @name json-comb-core
 * @fileoverview The inner core of json-comb
 * @version 6.8.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/json-comb-core/}
 */

import { flattenAllArrays } from 'object-flatten-all-arrays';
import { fillMissing } from 'object-fill-missing-keys';
import { setAllValuesTo } from 'object-set-all-values-to';
import { mergeAdvanced } from 'object-merge-advanced';
import compareVersions from 'compare-versions';
import includes from 'lodash.includes';
import { noNewKeys } from 'object-no-new-keys';
import clone from 'lodash.clonedeep';
import sortKeys from 'sort-keys';
import pReduce from 'p-reduce';
import typ from 'type-detect';
import pOne from 'p-one';

var version$1 = "6.8.13";

const version = version$1;
function existy(x) {
  return x != null;
}
function isObj(something) {
  return typ(something) === "Object";
}
function isStr(something) {
  return typeof something === "string";
}
const isArr = Array.isArray;
function toString(obj) {
  if (obj === null) {
    return "null";
  }
  if (typeof obj === "boolean" || typeof obj === "number") {
    return obj.toString();
  }
  if (typeof obj === "string") {
    return obj;
  }
  if (typeof obj === "symbol") {
    throw new TypeError();
  }
  return obj.toString();
}
function defaultCompare(x, y) {
  if (x === undefined && y === undefined) {
    return 0;
  }
  if (x === undefined) {
    return 1;
  }
  if (y === undefined) {
    return -1;
  }
  const xString = toString(x);
  const yString = toString(y);
  if (xString < yString) {
    return -1;
  }
  if (xString > yString) {
    return 1;
  }
  return 0;
}
function compare(firstEl, secondEl) {
  const semverRegex = /^\d+\.\d+\.\d+$/g;
  if (firstEl.match(semverRegex) && secondEl.match(semverRegex)) {
    return compareVersions(firstEl, secondEl);
  }
  return defaultCompare(firstEl, secondEl);
}
function sortAllObjectsSync(input) {
  if (isObj(input) || isArr(input)) {
    return sortKeys(input, {
      deep: true,
      compare
    });
  }
  return input;
}
function getKeyset(arrOfPromises, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!");
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(`json-comb-core/getKeysetSync(): [THROW_ID_12] Options object must be a plain object! Currently it's: ${typeof originalOpts}, equal to: ${JSON.stringify(originalOpts, null, 4)}`);
  }
  const defaults = {
    placeholder: false
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  let culpritIndex;
  let culpritVal;
  return new Promise((resolve, reject) => {
    pOne(arrOfPromises, (element, index) => {
      if (!isObj(element)) {
        culpritIndex = index;
        culpritVal = element;
        return true;
      }
      return false;
    }).then(res => {
      if (res) {
        return reject(Error(`json-comb-core/getKeyset(): [THROW_ID_13] Oops! ${culpritIndex}th element resolved not to a plain object but to a ${typeof culpritVal}\n${JSON.stringify(culpritVal, null, 4)}`));
      }
      return pReduce(arrOfPromises,
      (previousValue, currentValue) => mergeAdvanced(flattenAllArrays(previousValue, {
        flattenArraysContainingStringsToBeEmpty: true
      }), flattenAllArrays(currentValue, {
        flattenArraysContainingStringsToBeEmpty: true
      }), {
        mergeArraysContainingStringsToBeEmpty: true
      }),
      {}
      ).then(res2 => {
        resolve(setAllValuesTo(res2, opts.placeholder));
      });
    });
  });
}
function getKeysetSync(arrOriginal, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_21] Inputs missing!");
  }
  if (!isArr(arrOriginal)) {
    throw new Error(`json-comb-core/getKeysetSync(): [THROW_ID_22] Input must be array! Currently it's: ${typeof arrOriginal}`);
  }
  if (arrOriginal.length === 0) {
    throw new Error("json-comb-core/getKeysetSync(): [THROW_ID_23] Input array is empty!");
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(`json-comb-core/getKeysetSync(): [THROW_ID_24] Options object must be a plain object! Currently it's: ${typeof originalOpts}, equal to: ${JSON.stringify(originalOpts, null, 4)}`);
  }
  let schemaObj = {};
  const arr = clone(arrOriginal);
  const defaults = {
    placeholder: false
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  };
  arr.forEach((obj, i) => {
    if (!isObj(obj)) {
      throw new TypeError(`json-comb-core/getKeysetSync(): [THROW_ID_25] Non-object (${typeof obj}) detected within an array! It's the ${i}th element: ${JSON.stringify(obj, null, 4)}`);
    }
    schemaObj = mergeAdvanced(flattenAllArrays(schemaObj, fOpts), flattenAllArrays(obj, fOpts), {
      mergeArraysContainingStringsToBeEmpty: true
    });
  });
  schemaObj = sortAllObjectsSync(setAllValuesTo(schemaObj, opts.placeholder));
  return schemaObj;
}
function enforceKeyset(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_31] Inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("json-comb-core/enforceKeyset(): [THROW_ID_32] Second arg missing!");
  }
  const defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(val => isStr(val))) {
    throw new Error(`json-comb-core/enforceKeyset(): [THROW_ID_33] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4)}`);
  }
  return new Promise((resolve, reject) => {
    Promise.all([obj, schemaKeyset]).then(([objResolved, schemaKeysetResolved]) => {
      if (!isObj(obj)) {
        return reject(Error(`json-comb-core/enforceKeyset(): [THROW_ID_34] Input must resolve to a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(obj, null, 4)}`));
      }
      if (!isObj(schemaKeyset)) {
        return reject(Error(`json-comb-core/enforceKeyset(): [THROW_ID_35] Schema, 2nd arg, must resolve to a plain object! Currently it's resolving to: ${typeof schemaKeyset}, equal to: ${JSON.stringify(schemaKeyset, null, 4)}`));
      }
      return resolve(sortAllObjectsSync(clone(fillMissing(clone(objResolved), clone(schemaKeysetResolved), opts))));
    });
  });
}
function enforceKeysetSync(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_41] Inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("json-comb-core/enforceKeysetSync(): [THROW_ID_42] Second arg missing!");
  }
  if (!isObj(obj)) {
    throw new Error(`json-comb-core/enforceKeysetSync(): [THROW_ID_43] Input must be a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(obj, null, 4)}`);
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(`json-comb-core/enforceKeysetSync(): [THROW_ID_44] Schema object must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${JSON.stringify(schemaKeyset, null, 4)}`);
  }
  const defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(val => isStr(val))) {
    throw new Error(`json-comb-core/enforceKeyset(): [THROW_ID_45] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4)}`);
  }
  return sortAllObjectsSync(fillMissing(clone(obj), schemaKeyset, opts));
}
function noNewKeysSync(obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_51] All inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("json-comb-core/noNewKeysSync(): [THROW_ID_52] Schema object is missing!");
  }
  if (!isObj(obj)) {
    throw new Error(`json-comb-core/noNewKeysSync(): [THROW_ID_53] Main input (1st arg.) must be a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(obj, null, 4)}`);
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(`json-comb-core/noNewKeysSync(): [THROW_ID_54] Schema input (2nd arg.) must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${JSON.stringify(schemaKeyset, null, 4)}`);
  }
  return noNewKeys(obj, schemaKeyset);
}
function findUnusedSync(arrOriginal, originalOpts) {
  if (isArr(arrOriginal)) {
    if (arrOriginal.length === 0) {
      return [];
    }
  } else {
    throw new TypeError(`json-comb-core/findUnusedSync(): [THROW_ID_61] The first argument should be an array. Currently it's: ${typeof arrOriginal}`);
  }
  if (arguments.length > 1 && !isObj(originalOpts)) {
    throw new TypeError(`json-comb-core/findUnusedSync(): [THROW_ID_62] The second argument, options object, must be a plain object, not ${typeof originalOpts}`);
  }
  const defaults = {
    placeholder: false,
    comments: "__comment__"
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  if (!opts.comments) {
    opts.comments = "";
  }
  const arr = clone(arrOriginal);
  function removeLeadingDot(something) {
    return something.map(finding => finding.charAt(0) === "." ? finding.slice(1) : finding);
  }
  function findUnusedSyncInner(arr1, opts1, res = [], path = "") {
    if (isArr(arr1) && arr1.length === 0) {
      return res;
    }
    let keySet;
    if (arr1.every(el => isObj(el))) {
      keySet = getKeysetSync(arr1);
      if (arr1.length > 1) {
        const unusedKeys = Object.keys(keySet).filter(key => arr1.every(obj => (opts1 && obj[key] === opts1.placeholder || obj[key] === undefined) && (!opts1 || !opts1.comments || !includes(key, opts1.comments))));
        res = res.concat(unusedKeys.map(el => `${path}.${el}`));
      }
      const keys = [].concat(...Object.keys(keySet).filter(key => isObj(keySet[key]) || isArr(keySet[key])));
      const keysContents = keys.map(key => typ(keySet[key]));
      const extras = keys.map(el => [].concat(...arr1.reduce((res1, obj) => {
        if (obj && existy(obj[el]) && (!opts1 || obj[el] !== opts1.placeholder)) {
          if (!opts1 || !opts1.comments || !includes(obj[el], opts1.comments)) {
            res1.push(obj[el]);
          }
        }
        return res1;
      }, [])));
      let appendix = "";
      let innerDot = "";
      if (extras.length > 0) {
        extras.forEach((singleExtra, i) => {
          if (keysContents[i] === "Array") {
            appendix = `[${i}]`;
          }
          innerDot = ".";
          res = findUnusedSyncInner(singleExtra, opts1, res, path + innerDot + keys[i] + appendix);
        });
      }
    } else if (arr1.every(el => isArr(el))) {
      arr1.forEach((singleArray, i) => {
        res = findUnusedSyncInner(singleArray, opts1, res, `${path}[${i}]`);
      });
    }
    return removeLeadingDot(res);
  }
  return findUnusedSyncInner(arr, opts);
}

export { enforceKeyset, enforceKeysetSync, findUnusedSync, getKeyset, getKeysetSync, noNewKeysSync, sortAllObjectsSync, version };
