import flattenAllArrays from "object-flatten-all-arrays";
import fillMissingKeys from "object-fill-missing-keys";
import setAllValuesTo from "object-set-all-values-to";
import mergeAdvanced from "object-merge-advanced";
import compareVersions from "compare-versions";
import includes from "lodash.includes";
import nnk from "object-no-new-keys";
import clone from "lodash.clonedeep";
import sortKeys from "sort-keys";
import pReduce from "p-reduce";
import typ from "type-detect";
import pOne from "p-one";

// -----------------------------------------------------------------------------

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function isObj(something) {
  return typ(something) === "Object";
}
function isStr(something) {
  return typeof something === "string";
}
const isArr = Array.isArray;

// -----------------------------------------------------------------------------
// SORT THEM THINGIES

//INFO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
//ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare
// from https://stackoverflow.com/a/47349064/3943954
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

//ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-tostring
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

// compareFunction
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters
function compare(firstEl, secondEl) {
  const semverRegex = /^\d+\.\d+\.\d+$/g;
  if (firstEl.match(semverRegex) && secondEl.match(semverRegex)) {
    return compareVersions(firstEl, secondEl);
  }
  return defaultCompare(firstEl, secondEl);
}

function sortAllObjectsSync(input) {
  if (isObj(input) || isArr(input)) {
    return sortKeys(input, { deep: true, compare });
  }
  return input;
}

// -----------------------------------------------------------------------------

function getKeyset(arrOfPromises, originalOpts) {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!"
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(
      `json-comb-core/getKeysetSync(): [THROW_ID_12] Options object must be a plain object! Currently it's: ${typeof originalOpts}, equal to: ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const defaults = {
    placeholder: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  console.log(
    `113 CALLING check-types-mini:\nopts = ${JSON.stringify(
      opts,
      null,
      4
    )}\ndefaults = ${JSON.stringify(
      defaults,
      null,
      4
    )}\nopts = ${JSON.stringify(
      {
        msg: "json-comb-core/getKeyset(): [THROW_ID_10*]",
        schema: {
          placeholder: ["null", "number", "string", "boolean", "object"]
        }
      },
      null,
      4
    )}`
  );
  let culpritIndex;
  let culpritVal;

  return new Promise((resolve, reject) => {
    // Map over input array of promises. If any resolve to non-plain-object,
    // final returned promise will resolve to true. Otherwise, false.
    pOne(arrOfPromises, (element, index) => {
      if (!isObj(element)) {
        culpritIndex = index;
        culpritVal = element;
        return true;
      }
      return false;
    }).then(res => {
      // truthy option means previous check detected a promise within
      // "arrOfPromises" which doesn't resolve to a plain object
      if (res) {
        return reject(
          Error(
            `json-comb-core/getKeyset(): [THROW_ID_13] Oops! ${culpritIndex}th element resolved not to a plain object but to a ${typeof culpritVal}\n${JSON.stringify(
              culpritVal,
              null,
              4
            )}`
          )
        );
      }
      return pReduce(
        arrOfPromises, // input
        (previousValue, currentValue) =>
          mergeAdvanced(
            flattenAllArrays(previousValue, {
              flattenArraysContainingStringsToBeEmpty: true
            }),
            flattenAllArrays(currentValue, {
              flattenArraysContainingStringsToBeEmpty: true
            }),
            {
              mergeArraysContainingStringsToBeEmpty: true
            }
          ), // reducer
        {} // initialValue
      ).then(res2 => {
        resolve(setAllValuesTo(res2, opts.placeholder));
      });
    });
  });
}

// -----------------------------------------------------------------------------

function getKeysetSync(arrOriginal, originalOpts) {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/getKeysetSync(): [THROW_ID_21] Inputs missing!"
    );
  }
  if (!isArr(arrOriginal)) {
    throw new Error(
      `json-comb-core/getKeysetSync(): [THROW_ID_22] Input must be array! Currently it's: ${typeof arrOriginal}`
    );
  }
  if (arrOriginal.length === 0) {
    throw new Error(
      "json-comb-core/getKeysetSync(): [THROW_ID_23] Input array is empty!"
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(
      `json-comb-core/getKeysetSync(): [THROW_ID_24] Options object must be a plain object! Currently it's: ${typeof originalOpts}, equal to: ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  let schemaObj = {};
  const arr = clone(arrOriginal);
  const defaults = {
    placeholder: false
  };
  const opts = Object.assign({}, defaults, originalOpts);

  const fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  };

  arr.forEach((obj, i) => {
    if (!isObj(obj)) {
      throw new TypeError(
        `json-comb-core/getKeysetSync(): [THROW_ID_25] Non-object (${typeof obj}) detected within an array! It's the ${i}th element: ${JSON.stringify(
          obj,
          null,
          4
        )}`
      );
    }
    schemaObj = mergeAdvanced(
      flattenAllArrays(schemaObj, fOpts),
      flattenAllArrays(obj, fOpts),
      {
        mergeArraysContainingStringsToBeEmpty: true
      }
    );
  });
  schemaObj = sortAllObjectsSync(setAllValuesTo(schemaObj, opts.placeholder));
  return schemaObj;
}

// -----------------------------------------------------------------------------

function enforceKeyset(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/enforceKeyset(): [THROW_ID_31] Inputs missing!"
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/enforceKeyset(): [THROW_ID_32] Second arg missing!"
    );
  }
  const defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (
    opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 &&
    !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(val => isStr(val))
  ) {
    throw new Error(
      `json-comb-core/enforceKeyset(): [THROW_ID_33] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${JSON.stringify(
        opts.doNotFillThesePathsIfTheyContainPlaceholders,
        null,
        4
      )}`
    );
  }
  return new Promise((resolve, reject) => {
    Promise.all([obj, schemaKeyset]).then(
      ([objResolved, schemaKeysetResolved]) => {
        if (!isObj(obj)) {
          return reject(
            Error(
              `json-comb-core/enforceKeyset(): [THROW_ID_34] Input must resolve to a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(
                obj,
                null,
                4
              )}`
            )
          );
        }
        if (!isObj(schemaKeyset)) {
          return reject(
            Error(
              `json-comb-core/enforceKeyset(): [THROW_ID_35] Schema, 2nd arg, must resolve to a plain object! Currently it's resolving to: ${typeof schemaKeyset}, equal to: ${JSON.stringify(
                schemaKeyset,
                null,
                4
              )}`
            )
          );
        }
        return resolve(
          sortAllObjectsSync(
            clone(
              fillMissingKeys(
                clone(objResolved),
                clone(schemaKeysetResolved),
                opts
              )
            )
          )
        );
      }
    );
  });
}

// -----------------------------------------------------------------------------

function enforceKeysetSync(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/enforceKeysetSync(): [THROW_ID_41] Inputs missing!"
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/enforceKeysetSync(): [THROW_ID_42] Second arg missing!"
    );
  }
  if (!isObj(obj)) {
    throw new Error(
      `json-comb-core/enforceKeysetSync(): [THROW_ID_43] Input must be a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(
        obj,
        null,
        4
      )}`
    );
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(
      `json-comb-core/enforceKeysetSync(): [THROW_ID_44] Schema object must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${JSON.stringify(
        schemaKeyset,
        null,
        4
      )}`
    );
  }
  const defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (
    opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 &&
    !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(val => isStr(val))
  ) {
    throw new Error(
      `json-comb-core/enforceKeyset(): [THROW_ID_45] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${JSON.stringify(
        opts.doNotFillThesePathsIfTheyContainPlaceholders,
        null,
        4
      )}`
    );
  }
  return sortAllObjectsSync(fillMissingKeys(clone(obj), schemaKeyset, opts));
}

// -----------------------------------------------------------------------------

// no news is good news - when keyset is ok, empty array is returned
// when there are rogue keys, array of paths is returned
function noNewKeysSync(obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/noNewKeysSync(): [THROW_ID_51] All inputs missing!"
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/noNewKeysSync(): [THROW_ID_52] Schema object is missing!"
    );
  }
  if (!isObj(obj)) {
    throw new Error(
      `json-comb-core/noNewKeysSync(): [THROW_ID_53] Main input (1st arg.) must be a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(
        obj,
        null,
        4
      )}`
    );
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(
      `json-comb-core/noNewKeysSync(): [THROW_ID_54] Schema input (2nd arg.) must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${JSON.stringify(
        schemaKeyset,
        null,
        4
      )}`
    );
  }
  return nnk(obj, schemaKeyset);
}

// -----------------------------------------------------------------------------

function findUnusedSync(arrOriginal, originalOpts) {
  //
  // PREPARATIONS AND TYPE CHECKS
  // ============================

  if (isArr(arrOriginal)) {
    if (arrOriginal.length === 0) {
      return [];
    }
  } else {
    throw new TypeError(
      `json-comb-core/findUnusedSync(): [THROW_ID_61] The first argument should be an array. Currently it's: ${typeof arrOriginal}`
    );
  }
  if (arguments.length > 1 && !isObj(originalOpts)) {
    throw new TypeError(
      `json-comb-core/findUnusedSync(): [THROW_ID_62] The second argument, options object, must be a plain object, not ${typeof originalOpts}`
    );
  }
  const defaults = {
    placeholder: false,
    comments: "__comment__"
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (opts.comments === 1 || opts.comments === "1") {
    throw new TypeError(
      "json-comb-core/findUnusedSync(): [THROW_ID_63] opts.comments was set to Number 1, but it does not make sense. Either it's string or falsey. Please fix."
    );
  }
  if (opts.comments === true || opts.comments === "true") {
    throw new TypeError(
      'json-comb-core/findUnusedSync(): [THROW_ID_63] opts.comments was set to Boolean "true", but it does not make sense. Either it\'s string or falsey. Please fix.'
    );
  }
  if (!truthy(opts.comments) || opts.comments === 0) {
    opts.comments = false;
  }
  if (opts.comments === "") {
    opts.comments = false;
  }
  const arr = clone(arrOriginal);

  // ---------------------------------------------------------------------------

  function removeLeadingDot(something) {
    return something.map(finding =>
      finding.charAt(0) === "." ? finding.slice(1) : finding
    );
  }

  function findUnusedSyncInner(arr1, opts1, res, path) {
    if (isArr(arr1) && arr1.length === 0) {
      return res;
    }
    if (res === undefined) {
      res = [];
    }
    if (path === undefined) {
      path = "";
    }
    let keySet;
    if (arr1.every(el => isObj(el))) {
      keySet = getKeysetSync(arr1);
      //
      // ------ PART 1 ------
      // iterate all objects within given arr1ay, find unused keys
      //
      if (arr1.length > 1) {
        const unusedKeys = Object.keys(keySet).filter(key =>
          arr1.every(
            obj =>
              (obj[key] === opts1.placeholder || obj[key] === undefined) &&
              (!opts1.comments || !includes(key, opts1.comments))
          )
        );
        // console.log(`unusedKeys = ${JSON.stringify(unusedKeys, null, 4)}`)
        res = res.concat(unusedKeys.map(el => `${path}.${el}`));
        // console.log(`res = ${JSON.stringify(res, null, 4)}`)
      }
      // ------ PART 2 ------
      // no matter how many objects are there within our array, if any values
      // contain objects or arrays, traverse them recursively
      //
      const keys = [].concat(
        ...Object.keys(keySet).filter(
          key => isObj(keySet[key]) || isArr(keySet[key])
        )
      );
      const keysContents = keys.map(key => typ(keySet[key]));

      // can't use map() because we want to prevent nulls being written.
      // hence the reduce() contraption
      const extras = keys.map(el =>
        [].concat(
          ...arr1.reduce((res1, obj) => {
            if (existy(obj[el]) && obj[el] !== opts1.placeholder) {
              if (!opts1.comments || !includes(obj[el], opts1.comments)) {
                res1.push(obj[el]);
              }
            }
            return res1;
          }, [])
        )
      );
      let appendix = "";
      let innerDot = "";

      if (extras.length > 0) {
        extras.forEach((singleExtra, i) => {
          if (keysContents[i] === "Array") {
            appendix = `[${i}]`;
          }
          innerDot = ".";
          res = findUnusedSyncInner(
            singleExtra,
            opts1,
            res,
            path + innerDot + keys[i] + appendix
          );
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

// -----------------------------------------------------------------------------

export {
  getKeysetSync,
  getKeyset,
  enforceKeyset,
  enforceKeysetSync,
  sortAllObjectsSync,
  noNewKeysSync,
  findUnusedSync
};
