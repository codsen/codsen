import { includesWithGlob } from "array-includes-with-glob";
import {
  deepClone as clone,
  compareFn,
  deepCloneWithMetadata,
  existy,
  formatDiagnosticValue,
  hasOwnProp,
  isBool,
  isDate,
  isNum,
  isPlainObject as isObj,
  isStr,
} from "codsen-utils";
import { nonEmpty } from "util-nonempty";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// ===================================
// T S

export type argType =
  | "date"
  | "object"
  | "array"
  | "string"
  | "number"
  | "function"
  | "bigint"
  | "boolean"
  | "symbol"
  | "null"
  | "undefined";

export type PathSegment = string | number;

export interface InfoObj {
  path: string;
  pathSegments: readonly PathSegment[];
  key: string | null;
  type: [argType, argType];
}

export interface Opts {
  cb: null | ((input1: any, input2: any, result: any, infoObj: InfoObj) => any); // cb(input1, input2, result)
  mergeObjectsOnlyWhenKeysetMatches: boolean;
  ignoreKeys: string | readonly string[];
  hardMergeKeys: string | readonly string[];
  hardArrayConcatKeys: string | readonly string[];
  mergeArraysContainingStringsToBeEmpty: boolean;
  oneToManyArrayObjectMerge: boolean;
  hardMergeEverything: boolean;
  hardArrayConcat: boolean;
  ignoreEverything: boolean;
  concatInsteadOfMerging: boolean;
  dedupeStringsInArrayValues: boolean;
  mergeBoolsUsingOrNotAnd: boolean;
  useNullAsExplicitFalse: boolean;
  /** Reuse exclusively owned input trees without repeated references. Inputs may be mutated. */
  reuseInputs: boolean;
}

export type InputOpts = {
  [Key in keyof Opts]?: Opts[Key] | undefined;
};

// ===================================
// F U N C T I O N S

const isArr = Array.isArray;
const isEnumerableOwn = Object.prototype.propertyIsEnumerable;
function arrayContainsStr(arr: any): boolean {
  return !!arr && arr.some((val: any) => typeof val === "string");
}
function equalOrSubsetKeys(obj1: object, obj2: object): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length === 0 || keys2.length === 0) {
    return true;
  }

  const keysToCheck = keys1.length <= keys2.length ? keys1 : keys2;
  const objectToCheck = keys1.length <= keys2.length ? obj2 : obj1;

  for (let i = 0; i < keysToCheck.length; i++) {
    if (!isEnumerableOwn.call(objectToCheck, keysToCheck[i])) {
      return false;
    }
  }

  return true;
}

function getType(something: any): argType {
  if (something === null) {
    return "null";
  }
  if (isDate(something)) {
    return "date";
  }
  if (isObj(something)) {
    return "object";
  }
  if (isArr(something)) {
    return "array";
  }
  return typeof something;
}

const emptySelector: readonly string[] = Object.freeze([]);

const defaults: Readonly<Opts> = Object.freeze({
  cb: null, // cb(input1, input2, result)
  mergeObjectsOnlyWhenKeysetMatches: true, // otherwise, concatenation will be preferred
  ignoreKeys: emptySelector,
  hardMergeKeys: emptySelector,
  hardArrayConcatKeys: emptySelector,
  mergeArraysContainingStringsToBeEmpty: false,
  oneToManyArrayObjectMerge: false,
  hardMergeEverything: false,
  hardArrayConcat: false,
  ignoreEverything: false,
  concatInsteadOfMerging: true,
  dedupeStringsInArrayValues: false,
  mergeBoolsUsingOrNotAnd: true,
  useNullAsExplicitFalse: false,
  reuseInputs: false,
});

interface PairEntry {
  active: boolean;
  pristine1: any;
  pristine2: any;
  result: any;
}

interface MergeState {
  memoizePairs: boolean;
  pairs?: WeakMap<object, WeakMap<object, Map<number, PairEntry>>>;
  reuseCallerInputs: boolean;
  reportMetadata: boolean;
}

function optionState(opts: Opts): number {
  return (
    (opts.ignoreEverything ? 1 : 0) |
    (opts.hardMergeEverything ? 2 : 0) |
    (opts.hardArrayConcat ? 4 : 0)
  );
}

function getPairEntry(
  state: MergeState,
  input1: object,
  input2: object,
  opts: Opts,
): PairEntry | undefined {
  return state.pairs?.get(input1)?.get(input2)?.get(optionState(opts));
}

function setPairEntry(
  state: MergeState,
  input1: object,
  input2: object,
  opts: Opts,
  entry: PairEntry,
): void {
  state.pairs ||= new WeakMap();
  let bySecond = state.pairs.get(input1);
  if (!bySecond) {
    bySecond = new WeakMap();
    state.pairs.set(input1, bySecond);
  }
  let byOptions = bySecond.get(input2);
  if (!byOptions) {
    byOptions = new Map();
    bySecond.set(input2, byOptions);
  }
  byOptions.set(optionState(opts), entry);
}

function setOwn(
  target: Record<string, any>,
  key: string,
  value: any,
  requireDescriptor = false,
): void {
  if (!requireDescriptor && key !== "__proto__") {
    target[key] = value;
    return;
  }
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

function shallowCloneContainer(value: any): any {
  if (isArr(value)) {
    const result: any[] = [];
    result.length = value.length;
    for (const key of Object.keys(value)) {
      setOwn(result, key, (value as any)[key], true);
    }
    return result;
  }
  const result = Object.create(Object.getPrototypeOf(value));
  for (const key of Object.keys(value)) {
    setOwn(result, key, value[key], true);
  }
  return result;
}

function mergeAdvanced(
  infoObj: InfoObj,
  input1: any,
  input2: any,
  opts: Opts,
  state: MergeState,
  reuseInput1 = false,
  reuseInput2 = false,
  rootCall = false,
): any {
  // DEFAULTS
  // ---------------------------------------------------------------------------

  // this variable takes "path" coming from input and appends the key
  // name following object-path notation.
  // https://github.com/mariocasciaro/object-path
  // Basically, arrays are marked with dot, same like object keys, only the
  // key is the index number of the element.
  //
  // For example: key1.key2.0.key3.
  // That zero means first element of the array. It also means that key "key1"
  // had value of a plain object-type, which had a key "key2" which value was
  // an array. That's array's first element (at zero'th index) was a plain object.
  // That object had key "key3", which we reference here by "key1.key2.0.key3".
  let currPath = infoObj.path;
  let currPathSegments = infoObj.pathSegments;

  const existingPair =
    state.memoizePairs && isObj(input1) && isObj(input2)
      ? getPairEntry(state, input1, input2, opts)
      : undefined;
  if (existingPair?.active) {
    if (typeof opts.cb === "function") {
      return opts.cb(
        clone(existingPair.pristine1),
        clone(existingPair.pristine2),
        existingPair.result,
        infoObj,
      );
    }
    return existingPair.result;
  }
  if (existingPair && typeof opts.cb !== "function") {
    return existingPair.result;
  }

  // ACTION
  // ---------------------------------------------------------------------------

  // when null is used as explicit false, it overrides everything and anything:
  if (opts.useNullAsExplicitFalse && (input1 === null || input2 === null)) {
    if (typeof opts.cb === "function") {
      const callbackResult = opts.cb(
        clone(input1),
        clone(input2),
        null,
        infoObj,
      );
      DEV && console.log("RET", callbackResult);
      return callbackResult;
    }
    return null;
  }

  // clone the values to prevent accidental mutations, but only if it makes sense -
  // it applies to arrays and plain objects only (as far as we're concerned here)
  let i1 = input1;
  if ((isArr(input1) || isObj(input1)) && !reuseInput1) {
    if (rootCall) {
      const cloned = deepCloneWithMetadata(input1);
      i1 = cloned.value;
      state.memoizePairs ||= cloned.hasRepeatedReferences;
      reuseInput1 =
        typeof opts.cb !== "function" &&
        !opts.oneToManyArrayObjectMerge &&
        !cloned.hasRepeatedReferences;
    } else {
      i1 = shallowCloneContainer(input1);
    }
  }
  let i2 = input2;
  if ((isArr(input2) || isObj(input2)) && !reuseInput2) {
    if (rootCall) {
      const cloned = deepCloneWithMetadata(input2);
      i2 = cloned.value;
      state.memoizePairs ||= cloned.hasRepeatedReferences;
      reuseInput2 =
        typeof opts.cb !== "function" &&
        !opts.oneToManyArrayObjectMerge &&
        !cloned.hasRepeatedReferences;
    } else {
      i2 = shallowCloneContainer(input2);
    }
  }

  let currentPair: PairEntry | undefined;
  if (state.memoizePairs && isObj(i1) && nonEmpty(i1) && isObj(i2)) {
    currentPair = {
      active: true,
      pristine1: input1,
      pristine2: input2,
      result: i1,
    };
    setPairEntry(state, input1, input2, opts, currentPair);
    if (input1 !== i1 || input2 !== i2) {
      setPairEntry(state, i1, i2, opts, currentPair);
    }
  }

  let uniRes;
  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  }

  // short name to mark unidirectional state
  let uni = opts.hardMergeEverything || opts.ignoreEverything;

  DEV &&
    console.log(
      `\u001b[${32}m${"========================================================"}\u001b[${39}m`,
    );
  DEV && console.log(`\u001b[${36}mi1 =\u001b[${39}m`, i1);
  DEV && console.log(`\u001b[${36}mi2 =\u001b[${39}m`, i2);
  // DEV && console.log(`168 uniRes = ${JSON.stringify(uniRes, null, 4)}`);
  // DEV && console.log(`169 uni = ${JSON.stringify(uni, null, 4)}`);

  DEV &&
    console.log(
      `received ${`\u001b[${33}m${`infoObj`}\u001b[${39}m`} =`,
      infoObj,
    );

  // Now the complex part. By this point we know there's a value clash and we need
  // to judge case-by-case. Principle is to aim to retain as much data as possible
  // after merging.
  if (isArr(i1)) {
    DEV && console.log(`i1 is array, cases 1-20`);
    if (nonEmpty(i1)) {
      // cases 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      if (isArr(i2) && nonEmpty(i2)) {
        // case 1
        // two array merge
        if (
          opts.mergeArraysContainingStringsToBeEmpty &&
          (arrayContainsStr(i1) || arrayContainsStr(i2))
        ) {
          let currentResult = uni ? uniRes : [];

          if (typeof opts.cb === "function") {
            return opts.cb(
              clone(input1),
              clone(input2),
              currentResult,
              infoObj,
            );
          }
          return currentResult;
        }
        if (opts.hardArrayConcat) {
          let currentResult = uni ? uniRes : i1.concat(i2);
          if (typeof opts.cb === "function") {
            return opts.cb(
              clone(input1),
              clone(input2),
              currentResult,
              infoObj,
            );
          }
          return currentResult;
        }
        let temp = [];
        const leftValues = opts.concatInsteadOfMerging
          ? undefined
          : new Set(i1);
        for (
          let index = 0, len = Math.max(i1.length, i2.length);
          index < len;
          index++
        ) {
          // calculate current path
          if (state.reportMetadata) {
            currPath = infoObj.path.length
              ? `${infoObj.path}.${index}`
              : `${index}`;
            currPathSegments = [...infoObj.pathSegments, index];
          }
          DEV &&
            console.log(
              `${`\u001b[${35}m${`currPath`}\u001b[${39}m`} = ${currPath}`,
            );

          // calculate the merge outcome:
          if (
            isObj(i1[index]) &&
            isObj(i2[index]) &&
            ((opts.mergeObjectsOnlyWhenKeysetMatches &&
              equalOrSubsetKeys(i1[index], i2[index])) ||
              !opts.mergeObjectsOnlyWhenKeysetMatches)
          ) {
            temp.push(
              mergeAdvanced(
                state.reportMetadata
                  ? {
                      path: currPath,
                      pathSegments: currPathSegments,
                      key: infoObj.key,
                      type: [getType(i1[index]), getType(i2[index])],
                    }
                  : infoObj,
                i1[index],
                i2[index],
                opts,
                state,
                reuseInput1,
                reuseInput2,
              ),
            );
          } else if (
            opts.oneToManyArrayObjectMerge &&
            (i1.length === 1 || i2.length === 1) // either of arrays has one element
          ) {
            temp.push(
              i1.length === 1
                ? mergeAdvanced(
                    state.reportMetadata
                      ? {
                          path: currPath,
                          pathSegments: currPathSegments,
                          key: infoObj.key,
                          type: [getType(i1[0]), getType(i2[index])],
                        }
                      : infoObj,
                    i1[0],
                    i2[index],
                    opts,
                    state,
                    reuseInput1,
                    reuseInput2,
                  )
                : mergeAdvanced(
                    state.reportMetadata
                      ? {
                          path: currPath,
                          pathSegments: currPathSegments,
                          key: infoObj.key,
                          type: [getType(i1[index]), getType(i2[0])],
                        }
                      : infoObj,
                    i1[index],
                    i2[0],
                    opts,
                    state,
                    reuseInput1,
                    reuseInput2,
                  ),
            );
          } else if (opts.concatInsteadOfMerging) {
            // case1 - concatenation no matter what contents
            if (index < i1.length) {
              temp.push(i1[index]);
            }
            if (index < i2.length) {
              temp.push(i2[index]);
            }
          } else {
            // case2 - merging, evaluating contents

            // push each element of i1 into temp
            if (index < i1.length) {
              temp.push(i1[index]);
            }
            if (index < i2.length && !leftValues?.has(i2[index])) {
              temp.push(i2[index]);
            }
          }
        }
        // optionally dedupe:
        if (opts.dedupeStringsInArrayValues && temp.every((el) => isStr(el))) {
          temp = [...new Set(temp)].sort(compareFn);
        }
        i1 = clone(temp);
      } else {
        // cases 2, 3, 4, 5, 6, 7, 8, 9, 10
        let currentResult = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
        }
        return currentResult;
      }
    } else {
      // cases 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
      if (nonEmpty(i2)) {
        // cases 11, 13, 15, 17
        let currentResult = uni ? uniRes : i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
        }
        return currentResult;
      }
      // cases 12, 14, 16, 18, 19, 20
      let currentResult = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
  } else if (isObj(i1)) {
    DEV && console.log(`i1 is object, cases 21-40`);
    if (nonEmpty(i1)) {
      // cases 21-30
      if (isArr(i2)) {
        // cases 21, 22
        if (nonEmpty(i2)) {
          // case 21
          let currentResult = uni ? uniRes : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(
              clone(input1),
              clone(input2),
              currentResult,
              infoObj,
            );
          }
          return currentResult;
        }
        // case 22
        let currentResult = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
        }
        return currentResult;
      }
      if (isObj(i2)) {
        DEV && console.log(`case 23 - both objects`);
        // two object merge - we'll consider opts.ignoreEverything & opts.hardMergeEverything too.
        Object.keys(i2).forEach((key) => {
          // calculate current path:
          if (state.reportMetadata) {
            currPath = infoObj.path.length
              ? `${infoObj.path}.${key}`
              : `${key}`;
            currPathSegments = [...infoObj.pathSegments, key];
          }
          DEV &&
            console.log(
              `${`\u001b[${35}m${`currPath`}\u001b[${39}m`} = ${currPath}`,
            );

          // calculate the merge outcome:
          if (hasOwnProp(i1, key)) {
            const leftValue = i1[key];
            const rightValue = i2[key];
            DEV && console.log(`working on i1 and i2 objects' keys "${key}"`);
            // key clash
            if (
              opts.ignoreKeys.length > 0 &&
              includesWithGlob(key, opts.ignoreKeys)
            ) {
              // set the ignoreEverything for all deeper recursive traversals,
              // otherwise, it will get lost, yet, ignores apply to all children
              // DEV && console.log('455. - ignoreEverything')
              DEV && console.log(`- 1st Recursion, key=${key}`);
              setOwn(
                i1,
                key,
                mergeAdvanced(
                  state.reportMetadata
                    ? {
                        path: currPath,
                        pathSegments: currPathSegments,
                        key,
                        type: [getType(leftValue), getType(rightValue)],
                      }
                    : infoObj,
                  leftValue,
                  rightValue,
                  { ...opts, ignoreEverything: true },
                  state,
                  reuseInput1,
                  reuseInput2,
                ),
                state.reuseCallerInputs,
              );
            } else if (
              opts.hardMergeKeys.length > 0 &&
              includesWithGlob(key, opts.hardMergeKeys)
            ) {
              // set the hardMergeEverything for all deeper recursive traversals.
              // The user requested this key to be hard-merged, but in deeper branches
              // without this switch (opts.hardMergeEverything) we'd lose the visibility
              // of the name of the key; we can't "bubble up" to check all parents' key names,
              // are any of them positive for "hard merge"...
              DEV && console.log("- hardMergeEverything");
              DEV && console.log(`- 2nd Recursion, key=${key}`);
              setOwn(
                i1,
                key,
                mergeAdvanced(
                  state.reportMetadata
                    ? {
                        path: currPath,
                        pathSegments: currPathSegments,
                        key,
                        type: [getType(leftValue), getType(rightValue)],
                      }
                    : infoObj,
                  leftValue,
                  rightValue,
                  { ...opts, hardMergeEverything: true },
                  state,
                  reuseInput1,
                  reuseInput2,
                ),
                state.reuseCallerInputs,
              );
              DEV && console.log(`continuing after recursion`);
            } else if (
              opts.hardArrayConcatKeys.length > 0 &&
              includesWithGlob(key, opts.hardArrayConcatKeys)
            ) {
              // set the hardArrayConcat option to true for all deeper values.
              // It will force a concat of both values, as long as they are both arrays
              // No merge will happen.
              // DEV && console.log('489. - hardArrayConcat')
              DEV && console.log(`- 3rd Recursion, key=${key}`);
              setOwn(
                i1,
                key,
                mergeAdvanced(
                  state.reportMetadata
                    ? {
                        path: currPath,
                        pathSegments: currPathSegments,
                        key,
                        type: [getType(leftValue), getType(rightValue)],
                      }
                    : infoObj,
                  leftValue,
                  rightValue,
                  { ...opts, hardArrayConcat: true },
                  state,
                  reuseInput1,
                  reuseInput2,
                ),
                state.reuseCallerInputs,
              );
            } else {
              DEV && console.log("regular merge");
              DEV && console.log("4th Recursion");
              DEV &&
                console.log(
                  `${`\u001b[${33}m${`infoObj`}\u001b[${39}m`} =`,
                  state.reportMetadata
                    ? {
                        path: currPath,
                        pathSegments: currPathSegments,
                        key,
                        type: [getType(leftValue), getType(rightValue)],
                      }
                    : infoObj,
                  `${`\u001b[${33}m${`i1[${key}]`}\u001b[${39}m`} =`,
                  leftValue,
                  `${`\u001b[${33}m${`i2[${key}]`}\u001b[${39}m`} =`,
                  rightValue,
                );
              setOwn(
                i1,
                key,
                mergeAdvanced(
                  {
                    path: currPath,
                    pathSegments: currPathSegments,
                    key,
                    type: [getType(leftValue), getType(rightValue)],
                  },
                  leftValue,
                  rightValue,
                  opts,
                  state,
                  reuseInput1,
                  reuseInput2,
                ),
                state.reuseCallerInputs,
              );

              DEV && console.log();
              DEV && console.log();
              DEV && console.log();
              DEV && console.log();
              DEV &&
                console.log(
                  `███████████████████████████████████████ AFTER RECURSION i1[${key}] =`,
                  i1[key],
                );
            }
            DEV && console.log();
          } else {
            // The key can still exist on a custom prototype as a setter. Define an
            // own data property so merging cannot invoke inherited code or lose data.
            setOwn(i1, key, i2[key], true);
          }
        });

        DEV && console.log();

        let currentResult = i1;
        if (currentPair) {
          currentPair.active = false;
          currentPair.result = currentResult;
        }
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
        }

        DEV && console.log(`- return i1 =`, i1);

        return i1;
      }
      // cases 24, 25, 26, 27, 28, 29, 30
      let currentResult = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    // i1 is empty obj
    // cases 31-40
    if (isArr(i2) || isObj(i2) || nonEmpty(i2)) {
      // cases 31, 32, 33, 34, 35, 37
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    // 36, 38, 39, 40
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
    }
    return currentResult;
  } else if (isDate(i1)) {
    DEV && console.log(`██ i1 is date`);

    if (Number.isFinite(+i1)) {
      DEV && console.log(`i1 is a finite date`);

      if (isDate(i2)) {
        DEV && console.log(`i2 is date`);
        if (Number.isFinite(+i2)) {
          DEV && console.log(`i2 is a finite date`);

          // compares dates
          let currentResult = uni ? uniRes : i1 > i2 ? i1 : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(
              clone(input1),
              clone(input2),
              currentResult,
              infoObj,
            );
          }
          return currentResult;
        }

        DEV && console.log(`i2 is not a finite date`);
        // return i1 date
        let currentResult = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
        }
        return currentResult;
      }
      DEV && console.log(`i2 is not a date`);

      // if i2 is truthy, return it, otherwise return date at i1
      let currentResult = uni ? uniRes : i2 || i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    DEV && console.log(`i1 is not a finite date`);

    if (isDate(i2)) {
      DEV && console.log(`i2 is date`);
      // return i2 date
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    DEV && console.log(`i2 is not a date`);

    let currentResult = uni ? uniRes : i2;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
    }
    return currentResult;
  } else if (isStr(i1)) {
    if (nonEmpty(i1)) {
      DEV && console.log(`i1 non-empty, cases 41-50`);
      if ((isArr(i2) || isObj(i2) || isStr(i2)) && nonEmpty(i2)) {
        // cases 41, 43, 45
        // take care of hard merge setting cases, opts.hardMergeKeys
        let currentResult = uni ? uniRes : i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
        }
        return currentResult;
      }
      // cases 42, 44, 46, 47, 48, 49, 50
      let currentResult = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    // i1 is empty string
    DEV && console.log(`671, i1 is empty string, cases 51-60`);
    if (existy(i2) && !isBool(i2)) {
      // cases 51, 52, 53, 54, 55, 56, 57
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    // 58, 59, 60
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
    }
    return currentResult;
  } else if (isNum(i1)) {
    DEV && console.log(`i1 is number cases 61-70`);
    if (nonEmpty(i2)) {
      // cases 61, 63, 65, 67
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    // cases 62, 64, 66, 68, 69, 70
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
    }
    return currentResult;
  } else if (isBool(i1)) {
    DEV && console.log(`i1 is bool, cases 71-80`);
    if (isBool(i2)) {
      // case 78 - two Booleans
      if (opts.mergeBoolsUsingOrNotAnd) {
        let currentResult = uni ? uniRes : i1 || i2; // default - OR
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
        }
        return currentResult;
      }
      let currentResult = uni ? uniRes : i1 && i2; // alternative merge using AND
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    if (existy(i2)) {
      // DELIBERATE LOOSE EQUAL - existy()
      // cases 71, 72, 73, 74, 75, 76, 77
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    // i2 is null or undefined
    // cases 79*, 80
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
    }
    return currentResult;
  } else if (i1 === null) {
    DEV && console.log(`cases 81-90`);
    if (existy(i2)) {
      // case 81, 82, 83, 84, 85, 86, 87, 88*
      let currentResult = uni ? uniRes : i2;
      DEV &&
        console.log(
          `\u001b[${32}m${`currentResult`}\u001b[${39}m = ${currentResult}`,
        );
      DEV &&
        console.log(`\u001b[${32}m${`opts.cb`}\u001b[${39}m = ${!!opts.cb}`);
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
      }
      return currentResult;
    }
    // cases 89, 90
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
    }
    return currentResult;
  } else {
    DEV && console.log(`cases 91-100`);
    let currentResult = uni ? uniRes : i2 === undefined ? i1 : i2;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
    }
    return currentResult;
  }
  DEV && console.log(`FINAL ROW - i1=`, i1);
  DEV && console.log(`FINAL ROW - i2=`, i2);

  // return i1

  let currentResult = uni ? uniRes : i1;
  DEV && console.log(`FINAL ROW - currentResult =`, currentResult);
  DEV && console.log(`FINAL ROW - uni =`, uni);
  DEV && console.log(`FINAL ROW - uniRes =`, uniRes);

  if (typeof opts.cb === "function") {
    DEV && console.log(`RETURN`);
    return opts.cb(clone(input1), clone(input2), currentResult, infoObj);
  }

  DEV && console.log(`RETURN`, currentResult);
  return currentResult;
}

function isValidSelector(value: unknown): value is string | readonly string[] {
  if (typeof value === "string") {
    return true;
  }
  if (!isArr(value)) {
    return false;
  }
  for (let index = 0; index < value.length; index++) {
    if (!hasOwnProp(value, index) || typeof value[index] !== "string") {
      return false;
    }
  }
  return true;
}

/**
 * Recursively, deeply merge of anything
 */
function externalApi(
  input1: unknown,
  input2?: unknown,
  opts?: InputOpts | null,
): any {
  // biome-ignore lint/complexity/noArguments: distinguish no arguments from explicit undefined
  if (!arguments.length) {
    throw new TypeError(
      "object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing",
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(
      `object-merge-advanced/mergeAdvanced(): [THROW_ID_02] The optional options object should be a plain object, currently it's ${formatDiagnosticValue(opts, 4)} (type ${typeof opts})`,
    );
  }
  DEV &&
    console.log(
      `${`\u001b[${33}m${`getType(input1)`}\u001b[${39}m`} = ${JSON.stringify(
        getType(input1),
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`getType(input2)`}\u001b[${39}m`} = ${JSON.stringify(
        getType(input2),
        null,
        4,
      )}`,
    );

  const resolvedOpts: Opts = opts ? { ...defaults } : defaults;
  if (opts) {
    for (const key of Object.keys(defaults) as (keyof Opts)[]) {
      if (hasOwnProp(opts, key)) {
        const value = opts[key];
        if (value !== undefined) {
          (resolvedOpts as Record<keyof Opts, Opts[keyof Opts]>)[key] = value;
        }
      }
    }
    if (resolvedOpts.cb !== null && typeof resolvedOpts.cb !== "function") {
      throw new TypeError(
        `object-merge-advanced/mergeAdvanced(): [THROW_ID_03] opts.cb must be a function, null, or undefined; received ${formatDiagnosticValue(resolvedOpts.cb, 4)}.`,
      );
    }
    if (!isValidSelector(resolvedOpts.ignoreKeys)) {
      throw new TypeError(
        `object-merge-advanced/mergeAdvanced(): [THROW_ID_04] opts.ignoreKeys must be a string or an array of strings without holes; received ${formatDiagnosticValue(resolvedOpts.ignoreKeys, 4)}.`,
      );
    }
    if (!isValidSelector(resolvedOpts.hardMergeKeys)) {
      throw new TypeError(
        `object-merge-advanced/mergeAdvanced(): [THROW_ID_05] opts.hardMergeKeys must be a string or an array of strings without holes; received ${formatDiagnosticValue(resolvedOpts.hardMergeKeys, 4)}.`,
      );
    }
    if (!isValidSelector(resolvedOpts.hardArrayConcatKeys)) {
      throw new TypeError(
        `object-merge-advanced/mergeAdvanced(): [THROW_ID_06] opts.hardArrayConcatKeys must be a string or an array of strings without holes; received ${formatDiagnosticValue(resolvedOpts.hardArrayConcatKeys, 4)}.`,
      );
    }

    const booleanOptions: readonly (keyof Opts)[] = [
      "mergeObjectsOnlyWhenKeysetMatches",
      "mergeArraysContainingStringsToBeEmpty",
      "oneToManyArrayObjectMerge",
      "hardMergeEverything",
      "hardArrayConcat",
      "ignoreEverything",
      "concatInsteadOfMerging",
      "dedupeStringsInArrayValues",
      "mergeBoolsUsingOrNotAnd",
      "useNullAsExplicitFalse",
      "reuseInputs",
    ];
    for (const optionName of booleanOptions) {
      if (typeof resolvedOpts[optionName] !== "boolean") {
        throw new TypeError(
          `object-merge-advanced/mergeAdvanced(): [THROW_ID_07] opts.${optionName} must be a Boolean; received ${formatDiagnosticValue(resolvedOpts[optionName], 4)}.`,
        );
      }
    }
  }

  // notice we have first argument tracking the current path, which is not
  // exposed to the external API.
  const reuseInputs =
    resolvedOpts.reuseInputs &&
    !resolvedOpts.oneToManyArrayObjectMerge &&
    typeof resolvedOpts.cb !== "function";
  return mergeAdvanced(
    {
      key: null,
      path: "",
      pathSegments: [],
      type: [getType(input1), getType(input2)],
    },
    input1,
    input2,
    resolvedOpts,
    {
      memoizePairs: reuseInputs,
      reuseCallerInputs: reuseInputs,
      reportMetadata: DEV || typeof resolvedOpts.cb === "function",
    },
    reuseInputs,
    reuseInputs,
    true,
  );
}

export { defaults, externalApi as mergeAdvanced, version };
