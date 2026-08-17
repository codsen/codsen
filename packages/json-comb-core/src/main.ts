/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import {
  deepClone as clone,
  existy,
  formatDiagnosticValue,
  isPlainObject as isObj,
  isStr,
  type Obj,
} from "codsen-utils";
import { includes } from "lodash-es";
import { fillMissing } from "object-fill-missing-keys";
import { flattenAllArrays } from "object-flatten-all-arrays";
import { mergeAdvanced } from "object-merge-advanced";
import { noNewKeys } from "object-no-new-keys";
import { setAllValuesTo } from "object-set-all-values-to";
import pOne from "p-one";
import pReduce from "p-reduce";
import semverCompare from "semver-compare";
import sortKeys from "sort-keys";
import typ from "type-detect";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// -----------------------------------------------------------------------------

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
  let xString = String(x);
  let yString = String(y);
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
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/getKeyset(): [THROW_ID_01] Inputs missing!",
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(
      `json-comb-core/getKeyset(): [THROW_ID_02] Options object must be a plain object! Currently it's: ${typeof opts}, equal to: ${formatDiagnosticValue(opts, 4)}`,
    );
  }
  let defaults: GetKeysetOpts = {
    placeholder: false,
  };
  let resolvedOpts: GetKeysetOpts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `CALLING check-types-mini:\nopts = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}\ndefaults = ${JSON.stringify(
        defaults,
        null,
        4,
      )}\nopts = ${JSON.stringify(
        {
          msg: "json-comb-core/getKeyset(): [THROW_ID_03]",
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
            `json-comb-core/getKeyset(): [THROW_ID_04] Oops! ${culpritIndex}th element resolved not to a plain object but to a ${typeof culpritVal}\n${JSON.stringify(
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
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/getKeysetSync(): [THROW_ID_05] Inputs missing!",
    );
  }
  if (!Array.isArray(arr)) {
    throw new Error(
      `json-comb-core/getKeysetSync(): [THROW_ID_06] Input must be array! Currently it's: ${typeof arr}`,
    );
  }
  if (arr.length === 0) {
    throw new Error(
      "json-comb-core/getKeysetSync(): [THROW_ID_07] Input array is empty!",
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(
      `json-comb-core/getKeysetSync(): [THROW_ID_08] Options object must be a plain object! Currently it's: ${typeof opts}, equal to: ${formatDiagnosticValue(opts, 4)}`,
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
        `json-comb-core/getKeysetSync(): [THROW_ID_09] Non-object (${typeof obj}) detected within an array! It's the ${i}th element: ${formatDiagnosticValue(obj, 4)}`,
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
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/enforceKeyset(): [THROW_ID_10] Inputs missing!",
    );
  }
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/enforceKeyset(): [THROW_ID_11] Second arg missing!",
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
      `json-comb-core/enforceKeyset(): [THROW_ID_12] Array resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${formatDiagnosticValue(resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders, 4)}`,
    );
  }
  return new Promise((resolve, reject) => {
    if (!isObj(obj)) {
      reject(
        Error(
          `json-comb-core/enforceKeyset(): [THROW_ID_13] Input must resolve to a plain object! Currently it's: ${typeof obj}, equal to: ${JSON.stringify(
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
          `json-comb-core/enforceKeyset(): [THROW_ID_14] Schema, 2nd arg, must resolve to a plain object! Currently it's resolving to: ${typeof schemaKeyset}, equal to: ${JSON.stringify(
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
        clone(fillMissing(clone(obj), clone(schemaKeyset), resolvedOpts)),
      ),
    );
  });
}

// -----------------------------------------------------------------------------

function enforceKeysetSync(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: Partial<EnforceKeysetOpts>,
): Obj {
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/enforceKeysetSync(): [THROW_ID_15] Inputs missing!",
    );
  }
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/enforceKeysetSync(): [THROW_ID_16] Second arg missing!",
    );
  }
  if (!isObj(obj)) {
    throw new Error(
      `json-comb-core/enforceKeysetSync(): [THROW_ID_17] Input must be a plain object! Currently it's: ${typeof obj}, equal to: ${formatDiagnosticValue(obj, 4)}`,
    );
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(
      `json-comb-core/enforceKeysetSync(): [THROW_ID_18] Schema object must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${formatDiagnosticValue(schemaKeyset, 4)}`,
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
      `json-comb-core/enforceKeysetSync(): [THROW_ID_19] Array resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n${formatDiagnosticValue(resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders, 4)}`,
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
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 0) {
    throw new Error(
      "json-comb-core/noNewKeysSync(): [THROW_ID_20] All inputs missing!",
    );
  }
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length === 1) {
    throw new Error(
      "json-comb-core/noNewKeysSync(): [THROW_ID_21] Schema object is missing!",
    );
  }
  if (!isObj(obj)) {
    throw new Error(
      `json-comb-core/noNewKeysSync(): [THROW_ID_22] Main input (1st arg.) must be a plain object! Currently it's: ${typeof obj}, equal to: ${formatDiagnosticValue(obj, 4)}`,
    );
  }
  if (!isObj(schemaKeyset)) {
    throw new Error(
      `json-comb-core/noNewKeysSync(): [THROW_ID_23] Schema input (2nd arg.) must be a plain object! Currently it's: ${typeof schemaKeyset}, equal to: ${formatDiagnosticValue(schemaKeyset, 4)}`,
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
      `json-comb-core/findUnusedSync(): [THROW_ID_24] The first argument should be an array. Currently it's: ${typeof arr}`,
    );
  }
  // biome-ignore lint/complexity/noArguments: just ignore
  if (arguments.length > 1 && !isObj(opts)) {
    throw new TypeError(
      `json-comb-core/findUnusedSync(): [THROW_ID_25] The second argument, options object, must be a plain object, not ${typeof opts}`,
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
              (obj[key] === opts1?.placeholder || obj[key] === undefined) &&
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
  enforceKeyset,
  enforceKeysetSync,
  findUnusedSync,
  getKeyset,
  getKeysetSync,
  noNewKeysSync,
  sortAllObjectsSync,
  version,
};
