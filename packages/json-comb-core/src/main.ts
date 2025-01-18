/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { flattenAllArrays } from "object-flatten-all-arrays";
import { setAllValuesTo } from "object-set-all-values-to";
import { fillMissing } from "object-fill-missing-keys";
import { mergeAdvanced } from "object-merge-advanced";
import { noNewKeys } from "object-no-new-keys";
import { existy, isStr, isPlainObject as isObj, Obj } from "codsen-utils";
import semverCompare from "semver-compare";
import { includes } from "lodash-es";
import rfdc from "rfdc";

const clone = rfdc();
import sortKeys from "sort-keys";
import pReduce from "p-reduce";
import typ from "type-detect";
import pOne from "p-one";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// -----------------------------------------------------------------------------

// ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-tostring
function toString(obj: unknown): string {
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
  return `${obj}`;
}

// -----------------------------------------------------------------------------
// SORT THEM THINGIES

// INFO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare
// from https://stackoverflow.com/a/47349064/3943954
function defaultCompare(x: any, y: any) {
  if (x === undefined && y === undefined) {
    return 0;
  }
  if (x === undefined) {
    return 1;
  }
  if (y === undefined) {
    return -1;
  }
  let xString = toString(x);
  let yString = toString(y);
  if (xString < yString) {
    return -1;
  }
  if (xString > yString) {
    return 1;
  }
  return 0;
}

// compareFunction
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters
function compare(firstEl: string, secondEl: string) {
  let semverRegex = /^\d+\.\d+\.\d+$/g;
  if (firstEl.match(semverRegex) && secondEl.match(semverRegex)) {
    return semverCompare(firstEl, secondEl);
  }
  return defaultCompare(firstEl, secondEl);
}

function sortAllObjectsSync(input: any): any {
  if (isObj(input) || Array.isArray(input)) {
    return sortKeys(input, { deep: true, compare });
  }
  return input;
}

// -----------------------------------------------------------------------------

function getKeyset(
  arrOfPromises: Iterable<PromiseLike<Obj> | Obj>,
  opts?: Partial<GetKeysetOpts>,
): Promise<Obj> {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!",
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(
      `json-comb-core/getKeysetSync(): [THROW_ID_12] Options object must be a plain object! Currently it's: ${typeof opts}, equal to: ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  }
  let defaults: GetKeysetOpts = {
    placeholder: false,
  };
  let resolvedOpts: GetKeysetOpts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `116 CALLING check-types-mini:\nopts = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}\ndefaults = ${JSON.stringify(
        defaults,
        null,
        4,
      )}\nopts = ${JSON.stringify(
        {
          msg: "json-comb-core/getKeyset(): [THROW_ID_10*]",
          schema: {
            placeholder: ["null", "number", "string", "boolean", "object"],
          },
        },
        null,
        4,
      )}`,
    );
  let culpritIndex: any;
  let culpritVal: any;

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
    }).then((res) => {
      // truthy option means previous check detected a promise within
      // "arrOfPromises" which doesn't resolve to a plain object
      if (res) {
        reject(
          Error(
            `json-comb-core/getKeyset(): [THROW_ID_13] Oops! ${culpritIndex}th element resolved not to a plain object but to a ${typeof culpritVal}\n${JSON.stringify(
              culpritVal,
              null,
              4,
            )}`,
          ),
        );
        return;
      }
      return pReduce(
        arrOfPromises, // input
        (previousValue, currentValue: Obj) =>
          mergeAdvanced(
            flattenAllArrays(previousValue, {
              flattenArraysContainingStringsToBeEmpty: true,
            }),
            flattenAllArrays(currentValue, {
              flattenArraysContainingStringsToBeEmpty: true,
            }),
            {
              mergeArraysContainingStringsToBeEmpty: true,
            },
          ), // reducer
        {}, // initialValue
      ).then((res2) => {
        resolve(setAllValuesTo(res2, resolvedOpts.placeholder));
      });
    });
  });
}

// -----------------------------------------------------------------------------

interface GetKeysetOpts {
  placeholder: any;
}
function getKeysetSync(arr: Obj[], opts?: Partial<GetKeysetOpts>): Obj {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/getKeysetSync(): [THROW_ID_21] Inputs missing!",
    );
  }
  if (!Array.isArray(arr)) {
    throw new Error(
      `json-comb-core/getKeysetSync(): [THROW_ID_22] Input must be array! Currently it's: ${typeof arr}`,
    );
  }
  if (arr.length === 0) {
    throw new Error(
      "json-comb-core/getKeysetSync(): [THROW_ID_23] Input array is empty!",
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(
      `json-comb-core/getKeysetSync(): [THROW_ID_24] Options object must be a plain object! Currently it's: ${typeof opts}, equal to: ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  }

  let schemaObj = {};
  let resolvedArr = clone(arr);
  let defaults: GetKeysetOpts = {
    placeholder: false,
  };
  let resolvedOpts: GetKeysetOpts = { ...defaults, ...opts };

  let fOpts = {
    flattenArraysContainingStringsToBeEmpty: true,
  };

  resolvedArr.forEach((obj, i) => {
    if (!isObj(obj)) {
      throw new TypeError(
        `json-comb-core/getKeysetSync(): [THROW_ID_25] Non-object (${typeof obj}) detected within an array! It's the ${i}th element: ${JSON.stringify(
          obj,
          null,
          4,
        )}`,
      );
    }
    schemaObj = mergeAdvanced(
      flattenAllArrays(schemaObj, fOpts),
      flattenAllArrays(obj, fOpts),
      {
        mergeArraysContainingStringsToBeEmpty: true,
      },
    );
  });
  schemaObj = sortAllObjectsSync(
    setAllValuesTo(schemaObj, resolvedOpts.placeholder),
  );
  return schemaObj;
}

// -----------------------------------------------------------------------------

interface EnforceKeysetOpts {
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  placeholder: boolean;
  useNullAsExplicitFalse: boolean;
}
function enforceKeyset(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: Partial<EnforceKeysetOpts>,
): Promise<Obj> {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/enforceKeyset(): [THROW_ID_31] Inputs missing!",
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/enforceKeyset(): [THROW_ID_32] Second arg missing!",
    );
  }
  let defaults: EnforceKeysetOpts = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true,
  };
  let resolvedOpts: EnforceKeysetOpts = { ...defaults, ...opts };
  if (
    resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.length &&
    !resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.every((val) =>
      isStr(val),
    )
  ) {
    throw new Error(
      `json-comb-core/enforceKeyset(): [THROW_ID_33] Array resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${JSON.stringify(
        resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders,
        null,
        4,
      )}`,
    );
  }
  return new Promise((resolve, reject) => {
    Promise.all([obj, schemaKeyset]).then(
      ([objResolved, schemaKeysetResolved]) => {
        if (!isObj(obj)) {
          reject(
            Error(
              `json-comb-core/enforceKeyset(): [THROW_ID_34] Input must resolve to a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(
                obj,
                null,
                4,
              )}`,
            ),
          );
          return;
        }
        if (!isObj(schemaKeyset)) {
          reject(
            Error(
              `json-comb-core/enforceKeyset(): [THROW_ID_35] Schema, 2nd arg, must resolve to a plain object! Currently it's resolving to: ${typeof schemaKeyset}, equal to: ${JSON.stringify(
                schemaKeyset,
                null,
                4,
              )}`,
            ),
          );
          return;
        }
        resolve(
          sortAllObjectsSync(
            clone(
              fillMissing(
                clone(objResolved),
                clone(schemaKeysetResolved),
                resolvedOpts,
              ),
            ),
          ),
        );
      },
    );
  });
}

// -----------------------------------------------------------------------------

function enforceKeysetSync(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: Partial<EnforceKeysetOpts>,
): Obj {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/enforceKeysetSync(): [THROW_ID_41] Inputs missing!",
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/enforceKeysetSync(): [THROW_ID_42] Second arg missing!",
    );
  }
  if (!isObj(obj)) {
    throw new Error(
      `json-comb-core/enforceKeysetSync(): [THROW_ID_43] Input must be a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(
        obj,
        null,
        4,
      )}`,
    );
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(
      `json-comb-core/enforceKeysetSync(): [THROW_ID_44] Schema object must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${JSON.stringify(
        schemaKeyset,
        null,
        4,
      )}`,
    );
  }
  let defaults: EnforceKeysetOpts = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false,
    useNullAsExplicitFalse: true,
  };
  let resolvedOpts: EnforceKeysetOpts = { ...defaults, ...opts };
  if (
    resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.length &&
    !resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.every((val) =>
      isStr(val),
    )
  ) {
    throw new Error(
      `json-comb-core/enforceKeyset(): [THROW_ID_45] Array resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${JSON.stringify(
        resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders,
        null,
        4,
      )}`,
    );
  }
  return sortAllObjectsSync(
    fillMissing(clone(obj), schemaKeyset, resolvedOpts),
  );
}

// -----------------------------------------------------------------------------

// no news is good news - when keyset is ok, empty array is returned
// when there are rogue keys, array of paths is returned
type NoNewKeysSyncRes = string[];
function noNewKeysSync(obj: Obj, schemaKeyset: Obj): NoNewKeysSyncRes {
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/noNewKeysSync(): [THROW_ID_51] All inputs missing!",
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/noNewKeysSync(): [THROW_ID_52] Schema object is missing!",
    );
  }
  if (!isObj(obj)) {
    throw new Error(
      `json-comb-core/noNewKeysSync(): [THROW_ID_53] Main input (1st arg.) must be a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(
        obj,
        null,
        4,
      )}`,
    );
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(
      `json-comb-core/noNewKeysSync(): [THROW_ID_54] Schema input (2nd arg.) must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${JSON.stringify(
        schemaKeyset,
        null,
        4,
      )}`,
    );
  }
  return noNewKeys(obj, schemaKeyset);
}

// -----------------------------------------------------------------------------

interface FindUnusedSyncOpts {
  placeholder: boolean;
  comments: string;
}
function findUnusedSync(
  arr: any[],
  opts?: Partial<FindUnusedSyncOpts>,
): string[] {
  //
  // PREPARATIONS AND TYPE CHECKS
  // ============================

  if (Array.isArray(arr)) {
    if (arr.length === 0) {
      return [];
    }
  } else {
    throw new TypeError(
      `json-comb-core/findUnusedSync(): [THROW_ID_61] The first argument should be an array. Currently it's: ${typeof arr}`,
    );
  }
  if (arguments.length > 1 && !isObj(opts)) {
    throw new TypeError(
      `json-comb-core/findUnusedSync(): [THROW_ID_62] The second argument, options object, must be a plain object, not ${typeof opts}`,
    );
  }
  let defaults = {
    placeholder: false,
    comments: "__comment__",
  };
  let resolvedOpts = { ...defaults, ...opts };
  if (!resolvedOpts.comments) {
    resolvedOpts.comments = "";
  }
  let resolvedArr = clone(arr);

  // ---------------------------------------------------------------------------

  function removeLeadingDot(something: string[]) {
    return something.map((finding) =>
      finding.charAt(0) === "." ? finding.slice(1) : finding,
    );
  }

  function findUnusedSyncInner(
    arr1: Obj[],
    opts1: FindUnusedSyncOpts,
    res: string[] = [],
    path = "",
  ) {
    if (Array.isArray(arr1) && arr1.length === 0) {
      return res;
    }
    let keySet: Obj;
    if (arr1.every((el) => isObj(el))) {
      keySet = getKeysetSync(arr1);
      //
      // ------ PART 1 ------
      // iterate all objects within given arr1ay, find unused keys
      //
      if (arr1.length > 1) {
        let unusedKeys = Object.keys(keySet).filter((key) =>
          arr1.every(
            (obj) =>
              ((opts1 && obj[key] === opts1.placeholder) ||
                obj[key] === undefined) &&
              (!opts1?.comments || !includes(key, opts1.comments)),
          ),
        );
        // DEV && console.log(`unusedKeys = ${JSON.stringify(unusedKeys, null, 4)}`)
        res = res.concat(unusedKeys.map((el) => `${path}.${el}`));
        // DEV && console.log(`res = ${JSON.stringify(res, null, 4)}`)
      }
      // ------ PART 2 ------
      // no matter how many objects are there within our array, if any values
      // contain objects or arrays, traverse them recursively
      //
      let keys: string[] = [].concat(
        ...(Object.keys(keySet) as any[]).filter(
          (key) => isObj(keySet[key]) || Array.isArray(keySet[key]),
        ),
      );
      let keysContents = keys.map((key) => typ(keySet[key]));

      // can't use map() because we want to prevent nulls being written.
      // hence the reduce() contraption
      let extras = keys.map((el) =>
        [].concat(
          ...(arr1 as any[]).reduce((res1, obj) => {
            if (
              obj &&
              existy(obj[el]) &&
              (!opts1 || obj[el] !== opts1.placeholder)
            ) {
              if (!opts1?.comments || !includes(obj[el], opts1.comments)) {
                res1.push(obj[el]);
              }
            }
            return res1;
          }, []),
        ),
      );
      let appendix = "";
      let innerDot = "";

      if (extras.length) {
        extras.forEach((singleExtra, i) => {
          if (keysContents[i] === "Array") {
            appendix = `[${i}]`;
          }
          innerDot = ".";
          res = findUnusedSyncInner(
            singleExtra,
            opts1,
            res,
            path + innerDot + keys[i] + appendix,
          );
        });
      }
    } else if (arr1.every((el) => Array.isArray(el))) {
      (arr1 as any as any[][]).forEach((singleArray, i) => {
        res = findUnusedSyncInner(singleArray, opts1, res, `${path}[${i}]`);
      });
    }

    return removeLeadingDot(res);
  }

  return findUnusedSyncInner(resolvedArr, resolvedOpts);
}

// -----------------------------------------------------------------------------

export {
  getKeysetSync,
  getKeyset,
  enforceKeyset,
  enforceKeysetSync,
  sortAllObjectsSync,
  noNewKeysSync,
  findUnusedSync,
  version,
};
