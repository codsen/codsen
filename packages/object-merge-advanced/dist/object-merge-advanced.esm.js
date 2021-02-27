/**
 * object-merge-advanced
 * Recursively, deeply merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained
 * Version: 12.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-merge-advanced/
 */

import clone from 'lodash.clonedeep';
import lodashIncludes from 'lodash.includes';
import uniq from 'lodash.uniq';
import isObj from 'lodash.isplainobject';
import isDate from 'lodash.isdate';
import { includesWithGlob } from 'array-includes-with-glob';
import { nonEmpty } from 'util-nonempty';

var version$1 = "12.0.3";

/* eslint max-len:0, no-prototype-builtins:0, @typescript-eslint/ban-types: 0, @typescript-eslint/explicit-module-boundary-types: 0 */
const version = version$1;
// F U N C T I O N S

function isStr(something) {
  return typeof something === "string";
}

function isNum(something) {
  return typeof something === "number";
}

function isBool(something) {
  return typeof something === "boolean";
}

const isArr = Array.isArray;

function arrayContainsStr(arr) {
  return !!arr && arr.some(val => typeof val === "string");
}

function equalOrSubsetKeys(obj1, obj2) {
  return Object.keys(obj1).length === 0 || Object.keys(obj2).length === 0 || Object.keys(obj1).every(val => Object.keys(obj2).includes(val)) || Object.keys(obj2).every(val => Object.keys(obj1).includes(val));
}

function getType(something) {
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

const defaults = {
  cb: null,
  mergeObjectsOnlyWhenKeysetMatches: true,
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
  useNullAsExplicitFalse: false
};

function mergeAdvanced(infoObj, input1orig, input2orig, originalOpts) {
  // DEFAULTS
  // ---------------------------------------------------------------------------
  const opts = { ...defaults,
    ...originalOpts
  };

  if (typeof opts.ignoreKeys === "string") {
    opts.ignoreKeys = [opts.ignoreKeys];
  }

  if (typeof opts.hardMergeKeys === "string") {
    opts.hardMergeKeys = [opts.hardMergeKeys];
  } // hardMergeKeys: '*' <===> hardMergeEverything === true
  // also hardMergeKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough


  if (opts.hardMergeKeys.includes("*")) {
    opts.hardMergeEverything = true;
  } // ignoreKeys: '*' <===> ignoreEverything === true
  // also ignoreKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough


  if (opts.ignoreKeys.includes("*")) {
    opts.ignoreEverything = true;
  } // this variable takes "path" coming from input and appends the key
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


  let currPath; // ACTION
  // ---------------------------------------------------------------------------
  // when null is used as explicit false, it overrides everything and anything:

  if (opts.useNullAsExplicitFalse && (input1orig === null || input2orig === null)) {
    if (typeof opts.cb === "function") {
      return opts.cb(input1orig, input2orig, null, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return null;
  } // clone the values to prevent accidental mutations, but only if it makes sense -
  // it applies to arrays and plain objects only (as far as we're concerned here)


  let i1 = isArr(input1orig) || isObj(input1orig) ? clone(input1orig) : input1orig;
  const i2 = isArr(input2orig) || isObj(input2orig) ? clone(input2orig) : input2orig;
  let uniRes;

  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  } // short name to mark unidirectional state


  const uni = opts.hardMergeEverything || opts.ignoreEverything; // console.log(`168 uniRes = ${JSON.stringify(uniRes, null, 4)}`);
  // console.log(`169 uni = ${JSON.stringify(uni, null, 4)}`); // Now the complex part. By this point we know there's a value clash and we need
  // to judge case-by-case. Principle is to aim to retain as much data as possible
  // after merging.

  if (isArr(i1)) {

    if (nonEmpty(i1)) {
      // cases 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      if (isArr(i2) && nonEmpty(i2)) {
        // case 1
        // two array merge
        if (opts.mergeArraysContainingStringsToBeEmpty && (arrayContainsStr(i1) || arrayContainsStr(i2))) {
          const currentResult = uni ? uniRes : [];

          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }

          return currentResult;
        }

        if (opts.hardArrayConcat) {
          const currentResult = uni ? uniRes : i1.concat(i2);

          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }

          return currentResult;
        }

        let temp = [];

        for (let index = 0, len = Math.max(i1.length, i2.length); index < len; index++) {
          // calculate current path
          currPath = infoObj.path && infoObj.path.length ? `${infoObj.path}.${index}` : `${index}`; // calculate the merge outcome:

          if (isObj(i1[index]) && isObj(i2[index]) && (opts.mergeObjectsOnlyWhenKeysetMatches && equalOrSubsetKeys(i1[index], i2[index]) || !opts.mergeObjectsOnlyWhenKeysetMatches)) {
            temp.push(mergeAdvanced({
              path: currPath,
              key: infoObj.key,
              type: [getType(i1), getType(i2)]
            }, i1[index], i2[index], opts));
          } else if (opts.oneToManyArrayObjectMerge && (i1.length === 1 || i2.length === 1) // either of arrays has one elem.
          ) {
              temp.push(i1.length === 1 ? mergeAdvanced({
                path: currPath,
                key: infoObj.key,
                type: [getType(i1), getType(i2)]
              }, i1[0], i2[index], opts) : mergeAdvanced({
                path: currPath,
                key: infoObj.key,
                type: [getType(i1), getType(i2)]
              }, i1[index], i2[0], opts));
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
        } // optionally dedupe:


        if (opts.dedupeStringsInArrayValues && temp.every(el => isStr(el))) {
          temp = uniq(temp).sort();
        }

        i1 = clone(temp);
      } else {
        // cases 2, 3, 4, 5, 6, 7, 8, 9, 10
        const currentResult = uni ? uniRes : i1;

        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return currentResult;
      }
    } else {
      // cases 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
      if (nonEmpty(i2)) {
        // cases 11, 13, 15, 17
        const currentResult = uni ? uniRes : i2;

        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return currentResult;
      } // cases 12, 14, 16, 18, 19, 20


      const currentResult = uni ? uniRes : i1;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: currPath,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    }
  } else if (isObj(i1)) {

    if (nonEmpty(i1)) {
      // cases 21-30
      if (isArr(i2)) {
        // cases 21, 22
        if (nonEmpty(i2)) {
          // case 21
          const currentResult = uni ? uniRes : i2;

          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }

          return currentResult;
        } // case 22


        const currentResult = uni ? uniRes : i1;

        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return currentResult;
      }

      if (isObj(i2)) { // two object merge - we'll consider opts.ignoreEverything & opts.hardMergeEverything too.

        Object.keys(i2).forEach(key => {
          // calculate current path:
          currPath = infoObj.path && infoObj.path.length ? `${infoObj.path}.${key}` : `${key}`; // calculate the merge outcome:

          if (i1.hasOwnProperty(key)) { // key clash

            if (includesWithGlob(key, opts.ignoreKeys)) {
              // set the ignoreEverything for all deeper recursive traversals,
              // otherwise, it will get lost, yet, ignores apply to all children
              // console.log('455. - ignoreEverything')
              i1[key] = mergeAdvanced({
                path: currPath,
                key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], { ...opts,
                ignoreEverything: true
              });
            } else if (includesWithGlob(key, opts.hardMergeKeys)) {
              // set the hardMergeEverything for all deeper recursive traversals.
              // The user requested this key to be hard-merged, but in deeper branches
              // without this switch (opts.hardMergeEverything) we'd lose the visibility
              // of the name of the key; we can't "bubble up" to check all parents' key names,
              // are any of them positive for "hard merge"...
              i1[key] = mergeAdvanced({
                path: currPath,
                key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], { ...opts,
                hardMergeEverything: true
              });
            } else if (includesWithGlob(key, opts.hardArrayConcatKeys)) {
              // set the hardArrayConcat option to true for all deeper values.
              // It will force a concat of both values, as long as they are both arrays
              // No merge will happen.
              // console.log('489. - hardArrayConcat')
              i1[key] = mergeAdvanced({
                path: currPath,
                key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], { ...opts,
                hardArrayConcat: true
              });
            } else {
              i1[key] = mergeAdvanced({
                path: currPath,
                key,
                type: [getType(i1[key]), getType(i2[key])]
              }, i1[key], i2[key], opts);
            }
          } else {
            i1[key] = i2[key]; // key does not exist, so creates it
          }
        });
        const currentResult = uni ? uniRes : i1;

        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return i1;
      } // cases 24, 25, 26, 27, 28, 29, 30


      const currentResult = uni ? uniRes : i1;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    } // i1 is empty obj
    // cases 31-40


    if (isArr(i2) || isObj(i2) || nonEmpty(i2)) {
      // cases 31, 32, 33, 34, 35, 37
      const currentResult = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    } // 36, 38, 39, 40


    const currentResult = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return currentResult;
  } else if (isDate(i1)) {

    if (isFinite(i1)) {

      if (isDate(i2)) {

        if (isFinite(i2)) { // compares dates

          const currentResult = uni ? uniRes : i1 > i2 ? i1 : i2;

          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            });
          }

          return currentResult;
        } // return i1 date

        const currentResult = uni ? uniRes : i1;

        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return currentResult;
      } // if i2 is truthy, return it, otherwise return date at i1

      const currentResult = uni ? uniRes : i2 ? i2 : i1;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    }

    if (isDate(i2)) { // return i2 date

      const currentResult = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    }
    const currentResult = uni ? uniRes : i2;

    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return currentResult;
  } else if (isStr(i1)) {
    if (nonEmpty(i1)) {

      if ((isArr(i2) || isObj(i2) || isStr(i2)) && nonEmpty(i2)) {
        // cases 41, 43, 45
        // take care of hard merge setting cases, opts.hardMergeKeys
        const currentResult = uni ? uniRes : i2;

        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return currentResult;
      } // cases 42, 44, 46, 47, 48, 49, 50


      const currentResult = uni ? uniRes : i1;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    } // i1 is empty string

    if (i2 != null && !isBool(i2)) {
      // cases 51, 52, 53, 54, 55, 56, 57
      const currentResult = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    } // 58, 59, 60


    const currentResult = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return currentResult;
  } else if (isNum(i1)) {

    if (nonEmpty(i2)) {
      // cases 61, 63, 65, 67
      const currentResult = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    } // cases 62, 64, 66, 68, 69, 70


    const currentResult = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return currentResult;
  } else if (isBool(i1)) {

    if (isBool(i2)) {
      // case 78 - two Booleans
      if (opts.mergeBoolsUsingOrNotAnd) {
        const currentResult = uni ? uniRes : i1 || i2; // default - OR

        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }

        return currentResult;
      }

      const currentResult = uni ? uniRes : i1 && i2; // alternative merge using AND

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    }

    if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // cases 71, 72, 73, 74, 75, 76, 77
      const currentResult = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    } // i2 is null or undefined
    // cases 79*, 80


    const currentResult = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return currentResult;
  } else if (i1 === null) {

    if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // case 81, 82, 83, 84, 85, 86, 87, 88*
      const currentResult = uni ? uniRes : i2;

      if (typeof opts.cb === "function") {
        return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        });
      }

      return currentResult;
    } // cases 89, 90


    const currentResult = uni ? uniRes : i1;

    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return currentResult;
  } else {
    const currentResult = uni ? uniRes : i2;

    if (typeof opts.cb === "function") {
      return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }

    return currentResult;
  } // return i1

  const currentResult = uni ? uniRes : i1;

  if (typeof opts.cb === "function") {
    return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
      path: infoObj.path,
      key: infoObj.key,
      type: infoObj.type
    });
  }
  return currentResult;
}
/**
 * Recursively, deeply merge of anything
 */


function externalApi(input1orig, input2orig, originalOpts) {
  if (!arguments.length) {
    throw new TypeError("object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing");
  } // notice we have first argument tracking the current path, which is not
  // exposed to the external API.
  return mergeAdvanced({
    key: null,
    path: "",
    type: [getType(input1orig), getType(input2orig)]
  }, input1orig, input2orig, originalOpts);
}

export { defaults, externalApi as mergeAdvanced, version };
