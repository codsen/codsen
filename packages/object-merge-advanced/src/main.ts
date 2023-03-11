import lodashIncludes from "lodash.includes";
import { nonEmpty } from "util-nonempty";
import isFinite from "lodash.isfinite";
import clone from "lodash.clonedeep";
import isDate from "lodash.isdate";
import {
  isPlainObject as isObj,
  hasOwnProp,
  existy,
  isStr,
  isNum,
  isBool,
} from "codsen-utils";

import { version as v } from "../package.json";
import { includesWithGlob } from "./includesWithGlob";

const version: string = v;

declare let DEV: boolean;

// ===================================
// T S

export type argType =
  | "date"
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

export interface InfoObj {
  path: string | undefined;
  key: string | null;
  type: [argType, argType];
}

export interface Opts {
  cb:
    | null
    | ((input1: any, input2: any, result: any, infoObj?: InfoObj) => any); // cb(input1, input2, result)
  mergeObjectsOnlyWhenKeysetMatches: boolean;
  ignoreKeys: string | string[];
  hardMergeKeys: string | string[];
  hardArrayConcatKeys: string[];
  mergeArraysContainingStringsToBeEmpty: boolean;
  oneToManyArrayObjectMerge: boolean;
  hardMergeEverything: boolean;
  hardArrayConcat: boolean;
  ignoreEverything: boolean;
  concatInsteadOfMerging: boolean;
  dedupeStringsInArrayValues: boolean;
  mergeBoolsUsingOrNotAnd: boolean;
  useNullAsExplicitFalse: boolean;
}

// ===================================
// F U N C T I O N S

const isArr = Array.isArray;
function arrayContainsStr(arr: any): boolean {
  return !!arr && arr.some((val: any) => typeof val === "string");
}
function equalOrSubsetKeys(obj1: object, obj2: object): boolean {
  return (
    Object.keys(obj1).length === 0 ||
    Object.keys(obj2).length === 0 ||
    Object.keys(obj1).every((val) => Object.keys(obj2).includes(val)) ||
    Object.keys(obj2).every((val) => Object.keys(obj1).includes(val))
  );
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

const defaults: Opts = {
  cb: null, // cb(input1, input2, result)
  mergeObjectsOnlyWhenKeysetMatches: true, // otherwise, concatenation will be preferred
  ignoreKeys: [],
  hardMergeKeys: [],
  hardArrayConcatKeys: [],
  mergeArraysContainingStringsToBeEmpty: false,
  oneToManyArrayObjectMerge: false,
  hardMergeEverything: false,
  hardArrayConcat: false,
  ignoreEverything: false,
  concatInsteadOfMerging: true,
  dedupeStringsInArrayValues: false,
  mergeBoolsUsingOrNotAnd: true,
  useNullAsExplicitFalse: false,
};

function mergeAdvanced(
  infoObj: InfoObj,
  input1: any,
  input2: any,
  opts: Opts
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
  let currPath;

  // ACTION
  // ---------------------------------------------------------------------------

  // when null is used as explicit false, it overrides everything and anything:
  if (opts.useNullAsExplicitFalse && (input1 === null || input2 === null)) {
    if (typeof opts.cb === "function") {
      DEV &&
        console.log(
          `143 RET ${JSON.stringify(
            opts.cb(input1, input2, null, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type,
            }),
            null,
            4
          )}`
        );
      return opts.cb(input1, input2, null, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return null;
  }

  // clone the values to prevent accidental mutations, but only if it makes sense -
  // it applies to arrays and plain objects only (as far as we're concerned here)
  let i1 = isArr(input1) || isObj(input1) ? clone(input1) : input1;
  let i2 = isArr(input2) || isObj(input2) ? clone(input2) : input2;

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
      `\u001b[${32}m${"========================================================"}\u001b[${39}m`
    );
  DEV &&
    console.log(
      `183 \u001b[${36}m${`i1 = ${JSON.stringify(i1, null, 0)}`}\u001b[${39}m`
    );
  DEV &&
    console.log(
      `187 \u001b[${36}m${`i2 = ${JSON.stringify(i2, null, 0)}`}\u001b[${39}m`
    );
  // DEV && console.log(`168 uniRes = ${JSON.stringify(uniRes, null, 4)}`);
  // DEV && console.log(`169 uni = ${JSON.stringify(uni, null, 4)}`);

  DEV &&
    console.log(
      `194 received ${`\u001b[${33}m${`infoObj`}\u001b[${39}m`} = ${JSON.stringify(
        infoObj,
        null,
        4
      )}`
    );

  // Now the complex part. By this point we know there's a value clash and we need
  // to judge case-by-case. Principle is to aim to retain as much data as possible
  // after merging.
  if (isArr(i1)) {
    DEV && console.log(`205 i1 is array, cases 1-20`);
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
            return opts.cb(clone(input1), clone(input2), currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type,
            });
          }
          return currentResult;
        }
        if (opts.hardArrayConcat) {
          let currentResult = uni ? uniRes : i1.concat(i2);
          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1), clone(input2), currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type,
            });
          }
          return currentResult;
        }
        let temp = [];
        for (
          let index = 0, len = Math.max(i1.length, i2.length);
          index < len;
          index++
        ) {
          // calculate current path
          currPath = infoObj.path?.length
            ? `${infoObj.path}.${index}`
            : `${index}`;
          DEV &&
            console.log(
              `249 ${`\u001b[${35}m${`currPath`}\u001b[${39}m`} = ${currPath}`
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
                {
                  path: currPath,
                  key: infoObj.key,
                  type: [getType(i1), getType(i2)],
                },
                i1[index],
                i2[index],
                opts
              )
            );
          } else if (
            opts.oneToManyArrayObjectMerge &&
            (i1.length === 1 || i2.length === 1) // either of arrays has one elem.
          ) {
            temp.push(
              i1.length === 1
                ? mergeAdvanced(
                    {
                      path: currPath,
                      key: infoObj.key,
                      type: [getType(i1), getType(i2)],
                    },
                    i1[0],
                    i2[index],
                    opts
                  )
                : mergeAdvanced(
                    {
                      path: currPath,
                      key: infoObj.key,
                      type: [getType(i1), getType(i2)],
                    },
                    i1[index],
                    i2[0],
                    opts
                  )
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
            if (index < i2.length && !lodashIncludes(i1, i2[index])) {
              temp.push(i2[index]);
            }
          }
        }
        // optionally dedupe:
        if (opts.dedupeStringsInArrayValues && temp.every((el) => isStr(el))) {
          temp = [...new Set(temp)].sort();
        }
        i1 = clone(temp);
      } else {
        // cases 2, 3, 4, 5, 6, 7, 8, 9, 10
        let currentResult = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type,
          });
        }
        return currentResult;
      }
    } else {
      // cases 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
      if (nonEmpty(i2)) {
        // cases 11, 13, 15, 17
        let currentResult = uni ? uniRes : i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type,
          });
        }
        return currentResult;
      }
      // cases 12, 14, 16, 18, 19, 20
      let currentResult = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: currPath,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
  } else if (isObj(i1)) {
    DEV && console.log(`362 i1 is object, cases 21-40`);
    if (nonEmpty(i1)) {
      // cases 21-30
      if (isArr(i2)) {
        // cases 21, 22
        if (nonEmpty(i2)) {
          // case 21
          let currentResult = uni ? uniRes : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1), clone(input2), currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type,
            });
          }
          return currentResult;
        }
        // case 22
        let currentResult = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type,
          });
        }
        return currentResult;
      }
      if (isObj(i2)) {
        DEV && console.log(`391 case 23 - both objects`);
        // two object merge - we'll consider opts.ignoreEverything & opts.hardMergeEverything too.
        Object.keys(i2).forEach((key) => {
          // calculate current path:
          currPath = infoObj.path?.length ? `${infoObj.path}.${key}` : `${key}`;
          DEV &&
            console.log(
              `398 ${`\u001b[${35}m${`currPath`}\u001b[${39}m`} = ${currPath}`
            );

          // calculate the merge outcome:
          if (hasOwnProp(i1, key)) {
            DEV &&
              console.log(`404 working on i1 and i2 objects' keys "${key}"`);
            // key clash
            if (includesWithGlob(key, opts.ignoreKeys)) {
              // set the ignoreEverything for all deeper recursive traversals,
              // otherwise, it will get lost, yet, ignores apply to all children
              // DEV && console.log('455. - ignoreEverything')
              DEV && console.log(`410 - 1st Recursion, key=${key}`);
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key,
                  type: [getType(i1), getType(i2)],
                },
                i1[key],
                i2[key],
                { ...opts, ignoreEverything: true }
              );
            } else if (includesWithGlob(key, opts.hardMergeKeys)) {
              // set the hardMergeEverything for all deeper recursive traversals.
              // The user requested this key to be hard-merged, but in deeper branches
              // without this switch (opts.hardMergeEverything) we'd lose the visibility
              // of the name of the key; we can't "bubble up" to check all parents' key names,
              // are any of them positive for "hard merge"...
              DEV && console.log("427 - hardMergeEverything");
              DEV && console.log(`428 - 2nd Recursion, key=${key}`);
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key,
                  type: [getType(i1), getType(i2)],
                },
                i1[key],
                i2[key],
                { ...opts, hardMergeEverything: true }
              );
              DEV && console.log(`439 continuing after recursion`);
            } else if (includesWithGlob(key, opts.hardArrayConcatKeys)) {
              // set the hardArrayConcat option to true for all deeper values.
              // It will force a concat of both values, as long as they are both arrays
              // No merge will happen.
              // DEV && console.log('489. - hardArrayConcat')
              DEV && console.log(`445 - 3rd Recursion, key=${key}`);
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key,
                  type: [getType(i1), getType(i2)],
                },
                i1[key],
                i2[key],
                { ...opts, hardArrayConcat: true }
              );
            } else {
              DEV && console.log("457 regular merge");
              DEV && console.log("458 4th Recursion");
              DEV &&
                console.log(
                  `461 ${`\u001b[${33}m${`infoObj`}\u001b[${39}m`} = ${JSON.stringify(
                    {
                      path: currPath,
                      key,
                      type: [getType(i1), getType(i2)],
                    },
                    null,
                    4
                  )}; ${`\u001b[${33}m${`i1[${key}]`}\u001b[${39}m`} = ${JSON.stringify(
                    i1[key],
                    null,
                    4
                  )}; ${`\u001b[${33}m${`i2[${key}]`}\u001b[${39}m`} = ${JSON.stringify(
                    i2[key],
                    null,
                    4
                  )}`
                );
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key,
                  type: [getType(i1[key]), getType(i2[key])],
                },
                i1[key],
                i2[key],
                opts
              );

              DEV && console.log(" ");
              DEV && console.log(" ");
              DEV && console.log(" ");
              DEV && console.log(" ");
              DEV &&
                console.log(
                  `496 ███████████████████████████████████████ AFTER RECURSION i1[${key}] = ${JSON.stringify(
                    i1[key],
                    null,
                    4
                  )}`
                );
            }
            DEV && console.log(`503`);
          } else {
            i1[key] = i2[key]; // key does not exist, so creates it
          }
        });

        DEV && console.log(`509`);

        let currentResult = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          });
        }

        DEV && console.log(`520 - return i1 = ${JSON.stringify(i1, null, 4)}`);

        return i1;
      }
      // cases 24, 25, 26, 27, 28, 29, 30
      let currentResult = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    // i1 is empty obj
    // cases 31-40
    if (isArr(i2) || isObj(i2) || nonEmpty(i2)) {
      // cases 31, 32, 33, 34, 35, 37
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    // 36, 38, 39, 40
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return currentResult;
  } else if (isDate(i1)) {
    DEV && console.log(`560 ██ i1 is date`);

    if (isFinite(+i1)) {
      DEV && console.log(`563 i1 is a finite date`);

      if (isDate(i2)) {
        DEV && console.log(`566 i2 is date`);
        if (isFinite(+i2)) {
          DEV && console.log(`568 i2 is a finite date`);

          // compares dates
          let currentResult = uni ? uniRes : i1 > i2 ? i1 : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1), clone(input2), currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type,
            });
          }
          return currentResult;
        }

        DEV && console.log(`582 i2 is not a finite date`);
        // return i1 date
        let currentResult = uni ? uniRes : i1;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          });
        }
        return currentResult;
      }
      DEV && console.log(`594 i2 is not a date`);

      // if i2 is truthy, return it, otherwise return date at i1
      let currentResult = uni ? uniRes : i2 || i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    DEV && console.log(`607 i1 is not a finite date`);

    if (isDate(i2)) {
      DEV && console.log(`610 i2 is date`);
      // return i2 date
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    DEV && console.log(`622 i2 is not a date`);

    let currentResult = uni ? uniRes : i2;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return currentResult;
  } else if (isStr(i1)) {
    if (nonEmpty(i1)) {
      DEV && console.log(`635 i1 non-empty, cases 41-50`);
      if ((isArr(i2) || isObj(i2) || isStr(i2)) && nonEmpty(i2)) {
        // cases 41, 43, 45
        // take care of hard merge setting cases, opts.hardMergeKeys
        let currentResult = uni ? uniRes : i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          });
        }
        return currentResult;
      }
      // cases 42, 44, 46, 47, 48, 49, 50
      let currentResult = uni ? uniRes : i1;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    // i1 is empty string
    DEV && console.log(`661, i1 is empty string, cases 51-60`);
    if (existy(i2) && !isBool(i2)) {
      // cases 51, 52, 53, 54, 55, 56, 57
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    // 58, 59, 60
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return currentResult;
  } else if (isNum(i1)) {
    DEV && console.log(`685 i1 is number cases 61-70`);
    if (nonEmpty(i2)) {
      // cases 61, 63, 65, 67
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    // cases 62, 64, 66, 68, 69, 70
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return currentResult;
  } else if (isBool(i1)) {
    DEV && console.log(`709 i1 is bool, cases 71-80`);
    if (isBool(i2)) {
      // case 78 - two Booleans
      if (opts.mergeBoolsUsingOrNotAnd) {
        let currentResult = uni ? uniRes : i1 || i2; // default - OR
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1), clone(input2), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          });
        }
        return currentResult;
      }
      let currentResult = uni ? uniRes : i1 && i2; // alternative merge using AND
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    if (existy(i2)) {
      // DELIBERATE LOOSE EQUAL - existy()
      // cases 71, 72, 73, 74, 75, 76, 77
      let currentResult = uni ? uniRes : i2;
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    // i2 is null or undefined
    // cases 79*, 80
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return currentResult;
  } else if (i1 === null) {
    DEV && console.log(`cases 81-90`);
    if (existy(i2)) {
      // case 81, 82, 83, 84, 85, 86, 87, 88*
      let currentResult = uni ? uniRes : i2;
      DEV &&
        console.log(
          `764 \u001b[${32}m${`currentResult`}\u001b[${39}m = ${currentResult}`
        );
      DEV &&
        console.log(
          `768 \u001b[${32}m${`opts.cb`}\u001b[${39}m = ${!!opts.cb}`
        );
      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1), clone(input2), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        });
      }
      return currentResult;
    }
    // cases 89, 90
    let currentResult = uni ? uniRes : i1;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return currentResult;
  } else {
    DEV && console.log(`790 cases 91-100`);
    let currentResult = uni ? uniRes : i2;
    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1), clone(input2), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      });
    }
    return currentResult;
  }
  DEV && console.log(`801 FINAL ROW - i1=${JSON.stringify(i1, null, 4)}`);
  DEV && console.log(`802 FINAL ROW - i2=${JSON.stringify(i2, null, 4)}`);

  // return i1

  let currentResult = uni ? uniRes : i1;
  DEV &&
    console.log(
      `809 FINAL ROW - currentResult = ${JSON.stringify(
        currentResult,
        null,
        4
      )}`
    );
  DEV && console.log(`815 FINAL ROW - uni = ${JSON.stringify(uni, null, 4)}`);
  DEV &&
    console.log(
      `818 FINAL ROW - uniRes = ${JSON.stringify(uniRes, null, 4)}\n\n\n`
    );

  if (typeof opts.cb === "function") {
    DEV && console.log(`822 RETURN`);
    return opts.cb(clone(input1), clone(input2), currentResult, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type,
    });
  }

  DEV && console.log(`830 RETURN ${JSON.stringify(currentResult, null, 4)}`);
  return currentResult;
}

/**
 * Recursively, deeply merge of anything
 */
function externalApi(
  input1: unknown,
  input2: unknown,
  opts?: Partial<Opts>
): any {
  if (!arguments.length) {
    throw new TypeError(
      "object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing"
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(
      `object-merge-advanced/mergeAdvanced(): [THROW_ID_02] The optional options object should be a plain object, currently it's ${JSON.stringify(
        opts,
        null,
        4
      )} (type ${typeof opts})`
    );
  }

  DEV &&
    console.log(
      `${`\u001b[${33}m${`getType(input1)`}\u001b[${39}m`} = ${JSON.stringify(
        getType(input1),
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`getType(input2)`}\u001b[${39}m`} = ${JSON.stringify(
        getType(input2),
        null,
        4
      )}`
    );

  let resolvedOpts: Opts = { ...defaults, ...opts };
  if (typeof resolvedOpts.ignoreKeys === "string") {
    resolvedOpts.ignoreKeys = [resolvedOpts.ignoreKeys];
  }
  if (typeof resolvedOpts.hardMergeKeys === "string") {
    resolvedOpts.hardMergeKeys = [resolvedOpts.hardMergeKeys];
  }

  // hardMergeKeys: '*' <===> hardMergeEverything === true
  // also hardMergeKeys: ['whatnotKeyName', ... '*' ... ] - just one occurrence is enough
  if (resolvedOpts?.hardMergeKeys?.includes("*")) {
    resolvedOpts.hardMergeEverything = true;
  }

  // ignoreKeys: '*' <===> ignoreEverything === true
  // also ignoreKeys: ['whatnotKeyName', ... '*' ... ] - just one occurrence is enough
  if (resolvedOpts?.ignoreKeys?.includes("*")) {
    resolvedOpts.ignoreEverything = true;
  }

  // notice we have first argument tracking the current path, which is not
  // exposed to the external API.
  return mergeAdvanced(
    { key: null, path: "", type: [getType(input1), getType(input2)] },
    input1,
    input2,
    resolvedOpts
  );
}

export { externalApi as mergeAdvanced, version, defaults };
