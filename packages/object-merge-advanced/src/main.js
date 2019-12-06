/* eslint max-len:0, no-prototype-builtins:0 */

// ===================================
// V A R S

import isObj from "lodash.isplainobject";
import clone from "lodash.clonedeep";
import includes from "array-includes-with-glob";
import lodashIncludes from "lodash.includes";
import uniq from "lodash.uniq";
import arrayiffyString from "arrayiffy-if-string";
import nonEmpty from "util-nonempty";
import includesAll from "array-includes-all";

// ===================================
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
function isFun(something) {
  return typeof something === "function";
}
const isArr = Array.isArray;
function arrayContainsStr(arr) {
  return !!arr && arr.some(val => typeof val === "string");
}
function equalOrSubsetKeys(obj1, obj2) {
  return (
    Object.keys(obj1).length === 0 ||
    Object.keys(obj2).length === 0 ||
    includesAll(Object.keys(obj1), Object.keys(obj2)) ||
    includesAll(Object.keys(obj2), Object.keys(obj1))
  );
}

function getType(something) {
  if (isObj(something)) {
    return "object";
  } else if (isArr(something)) {
    return "array";
  }
  return typeof something;
}

function mergeAdvanced(infoObj, input1orig, input2orig, originalOpts = {}) {
  //
  // VARS AND PRECAUTIONS
  // ---------------------------------------------------------------------------

  if (!isObj(originalOpts)) {
    throw new TypeError(
      "object-merge-advanced/mergeAdvanced(): [THROW_ID_02] Options object, the third argument, must be a plain object"
    );
  }

  // DEFAULTS
  // ---------------------------------------------------------------------------

  const defaults = {
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
    useNullAsExplicitFalse: false
  };
  const opts = Object.assign(clone(defaults), originalOpts);
  opts.ignoreKeys = arrayiffyString(opts.ignoreKeys);
  opts.hardMergeKeys = arrayiffyString(opts.hardMergeKeys);

  // hardMergeKeys: '*' <===> hardMergeEverything === true
  // also hardMergeKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough
  if (opts.hardMergeKeys.includes("*")) {
    opts.hardMergeEverything = true;
  }

  // ignoreKeys: '*' <===> ignoreEverything === true
  // also ignoreKeys: ['whatnotKeyName', ... '*' ... ] - just one occurence is enough
  if (opts.ignoreKeys.includes("*")) {
    opts.ignoreEverything = true;
  }

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
  if (
    opts.useNullAsExplicitFalse &&
    (input1orig === null || input2orig === null)
  ) {
    console.log(
      `\u001b[${33}m${`120 RET: ${
        isFun(opts.cb)
          ? opts.cb(input1orig, input2orig, null, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : null
      }`}\u001b[${39}m`
    );
    return isFun(opts.cb)
      ? opts.cb(input1orig, input2orig, null, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        })
      : null;
  }

  // clone the values to prevent accidental mutations, but only if it makes sense -
  // it applies to arrays and plain objects only (as far as we're concerned here)
  let i1 =
    isArr(input1orig) || isObj(input1orig) ? clone(input1orig) : input1orig;
  const i2 =
    isArr(input2orig) || isObj(input2orig) ? clone(input2orig) : input2orig;

  // // if the unidirectional merging is set, that's a quick ending because the values
  // // don't matter

  let uniRes;
  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  }

  // short name to mark unidirectional state
  const uni = opts.hardMergeEverything || opts.ignoreEverything;

  console.log(
    `\u001b[${32}m${"========================================================"}\u001b[${39}m`
  );
  console.log(
    `163 \u001b[${36}m${`i1 = ${JSON.stringify(i1, null, 0)}`}\u001b[${39}m`
  );
  console.log(
    `166 \u001b[${36}m${`i2 = ${JSON.stringify(i2, null, 0)}`}\u001b[${39}m`
  );
  // console.log(`168 uniRes = ${JSON.stringify(uniRes, null, 4)}`);
  // console.log(`169 uni = ${JSON.stringify(uni, null, 4)}`);

  console.log(
    `172 received ${`\u001b[${33}m${`infoObj`}\u001b[${39}m`} = ${JSON.stringify(
      infoObj,
      null,
      4
    )}`
  );

  // Now the complex part. By this point we know there's a value clash and we need
  // to judge case-by-case. Principle is to aim to retain as much data as possible
  // after merging.
  if (isArr(i1)) {
    // cases 1-20
    if (nonEmpty(i1)) {
      // cases 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      if (isArr(i2) && nonEmpty(i2)) {
        // case 1
        // two array merge
        if (
          opts.mergeArraysContainingStringsToBeEmpty &&
          (arrayContainsStr(i1) || arrayContainsStr(i2))
        ) {
          const currentResult = uni ? uniRes : [];
          console.log(
            `\u001b[${33}m${`195 RET: ${
              isFun(opts.cb)
                ? opts.cb(i1, i2, currentResult, {
                    path: currPath,
                    key: infoObj.key,
                    type: infoObj.type
                  })
                : currentResult
            }`}\u001b[${39}m`
          );
          return isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: currPath,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult;
        }
        if (opts.hardArrayConcat) {
          const currentResult = uni ? uniRes : i1.concat(i2);
          console.log(
            `\u001b[${33}m${`216 RET: ${
              isFun(opts.cb)
                ? opts.cb(i1, i2, currentResult, {
                    path: currPath,
                    key: infoObj.key,
                    type: infoObj.type
                  })
                : currentResult
            }`}\u001b[${39}m`
          );
          return isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: currPath,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult;
        }
        let temp = [];
        for (
          let index = 0, len = Math.max(i1.length, i2.length);
          index < len;
          index++
        ) {
          // calculate current path
          currPath = infoObj.path.length
            ? `${infoObj.path}.${index}`
            : `${index}`;
          console.log(
            `245 ${`\u001b[${35}m${`currPath`}\u001b[${39}m`} = ${currPath}`
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
                  type: [getType(i1), getType(i2)]
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
                      type: [getType(i1), getType(i2)]
                    },
                    i1[0],
                    i2[index],
                    opts
                  )
                : mergeAdvanced(
                    {
                      path: currPath,
                      key: infoObj.key,
                      type: [getType(i1), getType(i2)]
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
        if (opts.dedupeStringsInArrayValues && temp.every(el => isStr(el))) {
          temp = uniq(temp).sort();
        }
        i1 = clone(temp);
      } else {
        // cases 2, 3, 4, 5, 6, 7, 8, 9, 10
        const currentResult = uni ? uniRes : i1;
        console.log(
          `\u001b[${33}m${`324 RET: ${
            isFun(opts.cb)
              ? opts.cb(i1, i2, currentResult, {
                  path: currPath,
                  key: infoObj.key,
                  type: infoObj.type
                })
              : currentResult
          }`}\u001b[${39}m`
        );
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult;
      }
    } else {
      // cases 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
      if (nonEmpty(i2)) {
        // cases 11, 13, 15, 17
        const currentResult = uni ? uniRes : i2;
        console.log(
          `\u001b[${33}m${`348 RET: ${
            isFun(opts.cb)
              ? opts.cb(i1, i2, currentResult, {
                  path: currPath,
                  key: infoObj.key,
                  type: infoObj.type
                })
              : currentResult
          }`}\u001b[${39}m`
        );
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult;
      }
      // cases 12, 14, 16, 18, 19, 20
      const currentResult = uni ? uniRes : i1;
      console.log(
        `\u001b[${33}m${`369 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: currPath,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
  } else if (isObj(i1)) {
    // cases 21-40
    if (nonEmpty(i1)) {
      // cases 21-30
      if (isArr(i2)) {
        // cases 21, 22
        if (nonEmpty(i2)) {
          // case 21
          const currentResult = uni ? uniRes : i2;
          console.log(
            `\u001b[${33}m${`397 RET: ${
              isFun(opts.cb)
                ? opts.cb(i1, i2, currentResult, {
                    path: currPath,
                    key: infoObj.key,
                    type: infoObj.type
                  })
                : currentResult
            }`}\u001b[${39}m`
          );
          return isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: currPath,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult;
        }
        // case 22
        const currentResult = uni ? uniRes : i1;
        console.log(
          `\u001b[${33}m${`418 RET: ${
            isFun(opts.cb)
              ? opts.cb(i1, i2, currentResult, {
                  path: currPath,
                  key: infoObj.key,
                  type: infoObj.type
                })
              : currentResult
          }`}\u001b[${39}m`
        );
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult;
      } else if (isObj(i2)) {
        // case 23
        // two object merge - we'll consider opts.ignoreEverything & opts.hardMergeEverything too.
        Object.keys(i2).forEach(key => {
          // calculate current path:
          currPath =
            infoObj.path && infoObj.path.length
              ? `${infoObj.path}.${key}`
              : `${key}`;
          console.log(
            `445 ${`\u001b[${35}m${`currPath`}\u001b[${39}m`} = ${currPath}`
          );

          // calculate the merge outcome:
          if (i1.hasOwnProperty(key)) {
            console.log(`450 working on i1 and i2 objects' keys "${key}"`);
            // key clash
            if (includes(key, opts.ignoreKeys)) {
              // set the ignoreEverything for all deeper recursive traversals,
              // otherwise, it will get lost, yet, ignores apply to all children
              // console.log('455. - ignoreEverything')
              console.log(`456st Recursion @299, key=${key}`);
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key: key,
                  type: [getType(i1), getType(i2)]
                },
                i1[key],
                i2[key],
                Object.assign({}, opts, { ignoreEverything: true })
              );
            } else if (includes(key, opts.hardMergeKeys)) {
              // set the hardMergeEverything for all deeper recursive traversals.
              // The user requested this key to be hard-merged, but in deeper branches
              // without this switch (opts.hardMergeEverything) we'd lose the visibility
              // of the name of the key; we can't "bubble up" to check all parents' key names,
              // are any of them positive for "hard merge"...
              // console.log('473. - hardMergeEverything')
              console.log(`474nd Recursion @312, key=${key}`);
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key: key,
                  type: [getType(i1), getType(i2)]
                },
                i1[key],
                i2[key],
                Object.assign({}, opts, { hardMergeEverything: true })
              );
            } else if (includes(key, opts.hardArrayConcatKeys)) {
              // set the hardArrayConcat option to true for all deeper values.
              // It will force a concat of both values, as long as they are both arrays
              // No merge will happen.
              // console.log('489. - hardArrayConcat')
              console.log(`490rd Recursion @323, key=${key}`);
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key: key,
                  type: [getType(i1), getType(i2)]
                },
                i1[key],
                i2[key],
                Object.assign({}, opts, { hardArrayConcat: true })
              );
            } else {
              // regular merge
              // console.log('503.')
              console.log("504 4th Recursion");
              console.log(
                `\n506 ${`\u001b[${33}m${`infoObj`}\u001b[${39}m`} = ${JSON.stringify(
                  {
                    path: currPath,
                    key: key,
                    type: [getType(i1), getType(i2)]
                  },
                  null,
                  4
                )};\n${`\u001b[${33}m${`i1[${key}]`}\u001b[${39}m`} = ${JSON.stringify(
                  i1[key],
                  null,
                  4
                )};\n${`\u001b[${33}m${`i2[${key}]`}\u001b[${39}m`} = ${JSON.stringify(
                  i2[key],
                  null,
                  4
                )}`
              );
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key: key,
                  type: [getType(i1), getType(i2)]
                },
                i1[key],
                i2[key],
                opts
              );
              console.log(
                `535 AFTER RECURSION i1[${key}] = ${JSON.stringify(
                  i1[key],
                  null,
                  4
                )}`
              );
            }
          } else {
            i1[key] = i2[key]; // key does not exist, so creates it
          }
        });
        return i1;
      }
      // cases 24, 25, 26, 27, 28, 29, 30
      const currentResult = uni ? uniRes : i1;
      console.log(
        `\u001b[${33}m${`551 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
    // i1 is empty obj
    // cases 31-40
    if (isArr(i2) || isObj(i2) || nonEmpty(i2)) {
      // cases 31, 32, 33, 34, 35, 37
      const currentResult = uni ? uniRes : i2;
      console.log(
        `\u001b[${33}m${`575 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
    // 36, 38, 39, 40
    const currentResult = uni ? uniRes : i1;
    console.log(
      `\u001b[${33}m${`596 RET: ${
        isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult
      }`}\u001b[${39}m`
    );
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        })
      : currentResult;
  } else if (isStr(i1)) {
    if (nonEmpty(i1)) {
      // cases 41-50
      if ((isArr(i2) || isObj(i2) || isStr(i2)) && nonEmpty(i2)) {
        // cases 41, 43, 45
        // take care of hard merge setting cases, opts.hardMergeKeys
        const currentResult = uni ? uniRes : i2;
        console.log(
          `\u001b[${33}m${`621 RET: ${
            isFun(opts.cb)
              ? opts.cb(i1, i2, currentResult, {
                  path: infoObj.path,
                  key: infoObj.key,
                  type: infoObj.type
                })
              : currentResult
          }`}\u001b[${39}m`
        );
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult;
      }
      // cases 42, 44, 46, 47, 48, 49, 50
      const currentResult = uni ? uniRes : i1;
      console.log(
        `\u001b[${33}m${`642 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
    // i1 is empty string
    // cases 51-60
    if (i2 != null && !isBool(i2)) {
      // cases 51, 52, 53, 54, 55, 56, 57
      const currentResult = uni ? uniRes : i2;
      console.log(
        `\u001b[${33}m${`666 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
    // 58, 59, 60
    const currentResult = uni ? uniRes : i1;
    console.log(
      `\u001b[${33}m${`687 RET: ${
        isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult
      }`}\u001b[${39}m`
    );
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        })
      : currentResult;
  } else if (isNum(i1)) {
    // cases 61-70
    if (nonEmpty(i2)) {
      // cases 61, 63, 65, 67
      const currentResult = uni ? uniRes : i2;
      console.log(
        `\u001b[${33}m${`710 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
    // cases 62, 64, 66, 68, 69, 70
    const currentResult = uni ? uniRes : i1;
    console.log(
      `\u001b[${33}m${`731 RET: ${
        isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult
      }`}\u001b[${39}m`
    );
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        })
      : currentResult;
  } else if (isBool(i1)) {
    // cases 71-80
    if (isBool(i2)) {
      // case 78 - two Booleans
      if (opts.mergeBoolsUsingOrNotAnd) {
        const currentResult = uni ? uniRes : i1 || i2; // default - OR
        console.log(
          `\u001b[${33}m${`755 RET: ${
            isFun(opts.cb)
              ? opts.cb(i1, i2, currentResult, {
                  path: infoObj.path,
                  key: infoObj.key,
                  type: infoObj.type
                })
              : currentResult
          }`}\u001b[${39}m`
        );
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult;
      }
      const currentResult = uni ? uniRes : i1 && i2; // alternative merge using AND
      console.log(
        `\u001b[${33}m${`775 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    } else if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // cases 71, 72, 73, 74, 75, 76, 77
      const currentResult = uni ? uniRes : i2;
      console.log(
        `\u001b[${33}m${`797 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
    // i2 is null or undefined
    // cases 79*, 80
    const currentResult = uni ? uniRes : i1;
    console.log(
      `\u001b[${33}m${`819 RET: ${
        isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult
      }`}\u001b[${39}m`
    );
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        })
      : currentResult;
  } else if (i1 === null) {
    // cases 81-90
    if (i2 != null) {
      // DELIBERATE LOOSE EQUAL - existy()
      // case 81, 82, 83, 84, 85, 86, 87, 88*
      const currentResult = uni ? uniRes : i2;
      console.log(
        `843 \u001b[${32}m${`currentResult`}\u001b[${39}m = ${currentResult}`
      );
      console.log(`\u001b[${32}m${`opts.cb`}\u001b[${39}m = ${!!opts.cb}`);
      console.log(
        `\u001b[${33}m${`847 RET: ${
          isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: infoObj.path,
                key: infoObj.key,
                type: infoObj.type
              })
            : currentResult
        }`}\u001b[${39}m`
      );
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult;
    }
    // cases 89, 90
    const currentResult = uni ? uniRes : i1;
    console.log(
      `\u001b[${33}m${`868 RET: ${
        isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult
      }`}\u001b[${39}m`
    );
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        })
      : currentResult;
  } else {
    // cases 91-100
    const currentResult = uni ? uniRes : i2;
    console.log(
      `\u001b[${33}m${`889 RET: ${
        isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            })
          : currentResult
      }`}\u001b[${39}m`
    );
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type
        })
      : currentResult;
  }
  console.log(`\n\n\nFINAL ROW 914 - i1=${JSON.stringify(i1, null, 4)}`);
  console.log(`FINAL ROW 915 - i2=${JSON.stringify(i2, null, 4)}`);

  // return i1

  const currentResult = uni ? uniRes : i1;
  console.log(
    `FINAL ROW - currentResult = ${JSON.stringify(currentResult, null, 4)}`
  );
  console.log(`FINAL ROW - uni = ${JSON.stringify(uni, null, 4)}`);
  console.log(`FINAL ROW - uniRes = ${JSON.stringify(uniRes, null, 4)}\n\n\n`);

  console.log(
    `\u001b[${33}m${`920 RET: ${JSON.stringify(
      isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          })
        : currentResult,
      null,
      4
    )}`}\u001b[${39}m`
  );
  return isFun(opts.cb)
    ? opts.cb(i1, i2, currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      })
    : currentResult;
}

function externalApi(input1orig, input2orig, originalOpts) {
  if (arguments.length === 0) {
    throw new TypeError(
      "object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing"
    );
  }
  console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
  // notice we have first argument tracking the current path, which is not
  // exposed to the external API.
  return mergeAdvanced(
    { key: null, path: "", type: [getType(input1orig), getType(input2orig)] },
    input1orig,
    input2orig,
    originalOpts
  );
}

export default externalApi;
