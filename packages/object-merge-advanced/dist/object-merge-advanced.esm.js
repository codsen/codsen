/**
 * object-merge-advanced
 * Recursive, deep merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained
 * Version: 10.11.19
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/object-merge-advanced
 */

import clone from 'lodash.clonedeep';
import includes from 'array-includes-with-glob';
import lodashIncludes from 'lodash.includes';
import uniq from 'lodash.uniq';
import arrayiffyString from 'arrayiffy-if-string';
import nonEmpty from 'util-nonempty';
import includesAll from 'array-includes-all';

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
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
const isArr = Array.isArray;
function arrayContainsStr(arr) {
  return !!arr && arr.some((val) => typeof val === "string");
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
  }
  if (isArr(something)) {
    return "array";
  }
  return typeof something;
}
function mergeAdvanced(infoObj, input1orig, input2orig, originalOpts = {}) {
  if (!isObj(originalOpts)) {
    throw new TypeError(
      "object-merge-advanced/mergeAdvanced(): [THROW_ID_02] Options object, the third argument, must be a plain object"
    );
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
    useNullAsExplicitFalse: false,
  };
  const opts = Object.assign(clone(defaults), originalOpts);
  opts.ignoreKeys = arrayiffyString(opts.ignoreKeys);
  opts.hardMergeKeys = arrayiffyString(opts.hardMergeKeys);
  if (opts.hardMergeKeys.includes("*")) {
    opts.hardMergeEverything = true;
  }
  if (opts.ignoreKeys.includes("*")) {
    opts.ignoreEverything = true;
  }
  let currPath;
  if (
    opts.useNullAsExplicitFalse &&
    (input1orig === null || input2orig === null)
  ) {
    return isFun(opts.cb)
      ? opts.cb(input1orig, input2orig, null, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        })
      : null;
  }
  let i1 =
    isArr(input1orig) || isObj(input1orig) ? clone(input1orig) : input1orig;
  const i2 =
    isArr(input2orig) || isObj(input2orig) ? clone(input2orig) : input2orig;
  let uniRes;
  if (opts.ignoreEverything) {
    uniRes = i1;
  } else if (opts.hardMergeEverything) {
    uniRes = i2;
  }
  const uni = opts.hardMergeEverything || opts.ignoreEverything;
  if (isArr(i1)) {
    if (nonEmpty(i1)) {
      if (isArr(i2) && nonEmpty(i2)) {
        if (
          opts.mergeArraysContainingStringsToBeEmpty &&
          (arrayContainsStr(i1) || arrayContainsStr(i2))
        ) {
          const currentResult = uni ? uniRes : [];
          return isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: currPath,
                key: infoObj.key,
                type: infoObj.type,
              })
            : currentResult;
        }
        if (opts.hardArrayConcat) {
          const currentResult = uni ? uniRes : i1.concat(i2);
          return isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: currPath,
                key: infoObj.key,
                type: infoObj.type,
              })
            : currentResult;
        }
        let temp = [];
        for (
          let index = 0, len = Math.max(i1.length, i2.length);
          index < len;
          index++
        ) {
          currPath = infoObj.path.length
            ? `${infoObj.path}.${index}`
            : `${index}`;
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
            (i1.length === 1 || i2.length === 1)
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
            if (index < i1.length) {
              temp.push(i1[index]);
            }
            if (index < i2.length) {
              temp.push(i2[index]);
            }
          } else {
            if (index < i1.length) {
              temp.push(i1[index]);
            }
            if (index < i2.length && !lodashIncludes(i1, i2[index])) {
              temp.push(i2[index]);
            }
          }
        }
        if (opts.dedupeStringsInArrayValues && temp.every((el) => isStr(el))) {
          temp = uniq(temp).sort();
        }
        i1 = clone(temp);
      } else {
        const currentResult = uni ? uniRes : i1;
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type,
            })
          : currentResult;
      }
    } else {
      if (nonEmpty(i2)) {
        const currentResult = uni ? uniRes : i2;
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type,
            })
          : currentResult;
      }
      const currentResult = uni ? uniRes : i1;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
  } else if (isObj(i1)) {
    if (nonEmpty(i1)) {
      if (isArr(i2)) {
        if (nonEmpty(i2)) {
          const currentResult = uni ? uniRes : i2;
          return isFun(opts.cb)
            ? opts.cb(i1, i2, currentResult, {
                path: currPath,
                key: infoObj.key,
                type: infoObj.type,
              })
            : currentResult;
        }
        const currentResult = uni ? uniRes : i1;
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type,
            })
          : currentResult;
      }
      if (isObj(i2)) {
        Object.keys(i2).forEach((key) => {
          currPath =
            infoObj.path && infoObj.path.length
              ? `${infoObj.path}.${key}`
              : `${key}`;
          if (i1.hasOwnProperty(key)) {
            if (includes(key, opts.ignoreKeys)) {
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
            } else if (includes(key, opts.hardMergeKeys)) {
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
            } else if (includes(key, opts.hardArrayConcatKeys)) {
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
              i1[key] = mergeAdvanced(
                {
                  path: currPath,
                  key,
                  type: [getType(i1), getType(i2)],
                },
                i1[key],
                i2[key],
                opts
              );
            }
          } else {
            i1[key] = i2[key];
          }
        });
        return i1;
      }
      const currentResult = uni ? uniRes : i1;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    if (isArr(i2) || isObj(i2) || nonEmpty(i2)) {
      const currentResult = uni ? uniRes : i2;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    const currentResult = uni ? uniRes : i1;
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        })
      : currentResult;
  } else if (isStr(i1)) {
    if (nonEmpty(i1)) {
      if ((isArr(i2) || isObj(i2) || isStr(i2)) && nonEmpty(i2)) {
        const currentResult = uni ? uniRes : i2;
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type,
            })
          : currentResult;
      }
      const currentResult = uni ? uniRes : i1;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    if (i2 != null && !isBool(i2)) {
      const currentResult = uni ? uniRes : i2;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    const currentResult = uni ? uniRes : i1;
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        })
      : currentResult;
  } else if (isNum(i1)) {
    if (nonEmpty(i2)) {
      const currentResult = uni ? uniRes : i2;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    const currentResult = uni ? uniRes : i1;
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        })
      : currentResult;
  } else if (isBool(i1)) {
    if (isBool(i2)) {
      if (opts.mergeBoolsUsingOrNotAnd) {
        const currentResult = uni ? uniRes : i1 || i2;
        return isFun(opts.cb)
          ? opts.cb(i1, i2, currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type,
            })
          : currentResult;
      }
      const currentResult = uni ? uniRes : i1 && i2;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    if (i2 != null) {
      const currentResult = uni ? uniRes : i2;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    const currentResult = uni ? uniRes : i1;
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        })
      : currentResult;
  } else if (i1 === null) {
    if (i2 != null) {
      const currentResult = uni ? uniRes : i2;
      return isFun(opts.cb)
        ? opts.cb(i1, i2, currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type,
          })
        : currentResult;
    }
    const currentResult = uni ? uniRes : i1;
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        })
      : currentResult;
  } else {
    const currentResult = uni ? uniRes : i2;
    return isFun(opts.cb)
      ? opts.cb(i1, i2, currentResult, {
          path: infoObj.path,
          key: infoObj.key,
          type: infoObj.type,
        })
      : currentResult;
  }
  const currentResult = uni ? uniRes : i1;
  return isFun(opts.cb)
    ? opts.cb(i1, i2, currentResult, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type,
      })
    : currentResult;
}
function externalApi(input1orig, input2orig, originalOpts) {
  if (arguments.length === 0) {
    throw new TypeError(
      "object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing"
    );
  }
  return mergeAdvanced(
    { key: null, path: "", type: [getType(input1orig), getType(input2orig)] },
    input1orig,
    input2orig,
    originalOpts
  );
}

export default externalApi;
