/**
 * object-merge-advanced
 * Recursively, deeply merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained
 * Version: 12.0.5
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

var version$1 = "12.0.5";

const version = version$1;
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
  const opts = { ...defaults,
    ...originalOpts
  };
  if (typeof opts.ignoreKeys === "string") {
    opts.ignoreKeys = [opts.ignoreKeys];
  }
  if (typeof opts.hardMergeKeys === "string") {
    opts.hardMergeKeys = [opts.hardMergeKeys];
  }
  if (opts.hardMergeKeys.includes("*")) {
    opts.hardMergeEverything = true;
  }
  if (opts.ignoreKeys.includes("*")) {
    opts.ignoreEverything = true;
  }
  let currPath;
  if (opts.useNullAsExplicitFalse && (input1orig === null || input2orig === null)) {
    if (typeof opts.cb === "function") {
      return opts.cb(input1orig, input2orig, null, {
        path: infoObj.path,
        key: infoObj.key,
        type: infoObj.type
      });
    }
    return null;
  }
  let i1 = isArr(input1orig) || isObj(input1orig) ? clone(input1orig) : input1orig;
  const i2 = isArr(input2orig) || isObj(input2orig) ? clone(input2orig) : input2orig;
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
          currPath = infoObj.path && infoObj.path.length ? `${infoObj.path}.${index}` : `${index}`;
          if (isObj(i1[index]) && isObj(i2[index]) && (opts.mergeObjectsOnlyWhenKeysetMatches && equalOrSubsetKeys(i1[index], i2[index]) || !opts.mergeObjectsOnlyWhenKeysetMatches)) {
            temp.push(mergeAdvanced({
              path: currPath,
              key: infoObj.key,
              type: [getType(i1), getType(i2)]
            }, i1[index], i2[index], opts));
          } else if (opts.oneToManyArrayObjectMerge && (i1.length === 1 || i2.length === 1)
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
        if (opts.dedupeStringsInArrayValues && temp.every(el => isStr(el))) {
          temp = uniq(temp).sort();
        }
        i1 = clone(temp);
      } else {
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
      if (nonEmpty(i2)) {
        const currentResult = uni ? uniRes : i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: currPath,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return currentResult;
      }
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
      if (isArr(i2)) {
        if (nonEmpty(i2)) {
          const currentResult = uni ? uniRes : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
              path: currPath,
              key: infoObj.key,
              type: infoObj.type
            });
          }
          return currentResult;
        }
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
      if (isObj(i2)) {
        Object.keys(i2).forEach(key => {
          currPath = infoObj.path && infoObj.path.length ? `${infoObj.path}.${key}` : `${key}`;
          if (i1.hasOwnProperty(key)) {
            if (includesWithGlob(key, opts.ignoreKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], { ...opts,
                ignoreEverything: true
              });
            } else if (includesWithGlob(key, opts.hardMergeKeys)) {
              i1[key] = mergeAdvanced({
                path: currPath,
                key,
                type: [getType(i1), getType(i2)]
              }, i1[key], i2[key], { ...opts,
                hardMergeEverything: true
              });
            } else if (includesWithGlob(key, opts.hardArrayConcatKeys)) {
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
            i1[key] = i2[key];
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
      }
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
    if (isArr(i2) || isObj(i2) || nonEmpty(i2)) {
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
        if (isFinite(i2)) {
          const currentResult = uni ? uniRes : i1 > i2 ? i1 : i2;
          if (typeof opts.cb === "function") {
            return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
              path: infoObj.path,
              key: infoObj.key,
              type: infoObj.type
            });
          }
          return currentResult;
        }
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
    if (isDate(i2)) {
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
    if (i2 != null && !isBool(i2)) {
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
      if (opts.mergeBoolsUsingOrNotAnd) {
        const currentResult = uni ? uniRes : i1 || i2;
        if (typeof opts.cb === "function") {
          return opts.cb(clone(input1orig), clone(input2orig), currentResult, {
            path: infoObj.path,
            key: infoObj.key,
            type: infoObj.type
          });
        }
        return currentResult;
      }
      const currentResult = uni ? uniRes : i1 && i2;
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
  }
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
function externalApi(input1orig, input2orig, originalOpts) {
  if (!arguments.length) {
    throw new TypeError("object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing");
  }
  return mergeAdvanced({
    key: null,
    path: "",
    type: [getType(input1orig), getType(input2orig)]
  }, input1orig, input2orig, originalOpts);
}

export { defaults, externalApi as mergeAdvanced, version };
