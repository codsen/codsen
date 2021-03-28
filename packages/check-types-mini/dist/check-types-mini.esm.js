/**
 * check-types-mini
 * Validate options object
 * Version: 6.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/check-types-mini/
 */

import typ from 'type-detect';
import pullAll from 'lodash.pullall';
import { traverse } from 'ast-monkey-traverse';
import intersection from 'lodash.intersection';
import { arrayiffy } from 'arrayiffy-if-string';
import objectPath from 'object-path';
import matcher from 'matcher';

const defaults = {
  ignoreKeys: [],
  ignorePaths: [],
  acceptArrays: false,
  acceptArraysIgnore: [],
  enforceStrictKeyset: true,
  schema: {},
  msg: "check-types-mini",
  optsVarName: "opts"
};
function internalApi(obj, ref, originalOptions) {
  function existy(something) {
    return something != null;
  }
  function isObj(something) {
    return typ(something) === "Object";
  }
  function pullAllWithGlob(originalInput, toBeRemoved) {
    if (typeof toBeRemoved === "string") {
      toBeRemoved = arrayiffy(toBeRemoved);
    }
    return Array.from(originalInput).filter(originalVal => !toBeRemoved.some(remVal => matcher.isMatch(originalVal, remVal, {
      caseSensitive: true
    })));
  }
  const hasKey = Object.prototype.hasOwnProperty;
  const NAMESFORANYTYPE = ["any", "anything", "every", "everything", "all", "whatever", "whatevs"];
  if (!existy(obj)) {
    throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");
  }
  const opts = { ...defaults,
    ...originalOptions
  };
  if (typeof opts.ignoreKeys === "string") {
    opts.ignoreKeys = [opts.ignoreKeys];
  }
  if (typeof opts.ignorePaths === "string") {
    opts.ignorePaths = [opts.ignorePaths];
  }
  if (typeof opts.acceptArraysIgnore === "string") {
    opts.acceptArraysIgnore = [opts.acceptArraysIgnore];
  }
  opts.msg = `${opts.msg}`.trim();
  if (opts.msg[opts.msg.length - 1] === ":") {
    opts.msg = opts.msg.slice(0, opts.msg.length - 1).trim();
  }
  if (isObj(opts.schema)) {
    Object.keys(opts.schema).forEach(oneKey => {
      if (isObj(opts.schema[oneKey])) {
        const tempObj = {};
        traverse(opts.schema[oneKey], (key, val, innerObj) => {
          const current = val !== undefined ? val : key;
          if (!Array.isArray(current) && !isObj(current)) {
            tempObj[`${oneKey}.${innerObj.path}`] = current;
          }
          return current;
        });
        delete opts.schema[oneKey];
        opts.schema = { ...opts.schema,
          ...tempObj
        };
      }
    });
    Object.keys(opts.schema).forEach(oneKey => {
      if (!Array.isArray(opts.schema[oneKey])) {
        opts.schema[oneKey] = [opts.schema[oneKey]];
      }
      opts.schema[oneKey] = opts.schema[oneKey].map(el => `${el}`.toLowerCase().trim());
    });
  } else if (opts.schema != null) {
    throw new Error(`check-types-mini: opts.schema was customised to ${JSON.stringify(opts.schema, null, 0)} which is not object but ${typeof opts.schema}`);
  }
  if (!existy(ref)) {
    ref = {};
  }
  if (opts.enforceStrictKeyset) {
    if (existy(opts.schema) && Object.keys(opts.schema).length > 0) {
      if (ref && pullAllWithGlob(pullAll(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema))), opts.ignoreKeys).length) {
        const keys = pullAll(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema)));
        throw new TypeError(`${opts.msg}: ${opts.optsVarName}.enforceStrictKeyset is on and the following key${keys.length > 1 ? "s" : ""} ${keys.length > 1 ? "are" : "is"} not covered by schema and/or reference objects: ${keys.join(", ")}`);
      }
    } else if (isObj(ref) && Object.keys(ref).length > 0) {
      if (pullAllWithGlob(pullAll(Object.keys(obj), Object.keys(ref)), opts.ignoreKeys).length !== 0) {
        const keys = pullAll(Object.keys(obj), Object.keys(ref));
        throw new TypeError(`${opts.msg}: The input object has key${keys.length > 1 ? "s" : ""} which ${keys.length > 1 ? "are" : "is"} not covered by the reference object: ${keys.join(", ")}`);
      } else if (pullAllWithGlob(pullAll(Object.keys(ref), Object.keys(obj)), opts.ignoreKeys).length !== 0) {
        const keys = pullAll(Object.keys(ref), Object.keys(obj));
        throw new TypeError(`${opts.msg}: The reference object has key${keys.length > 1 ? "s" : ""} which ${keys.length > 1 ? "are" : "is"} not present in the input object: ${keys.join(", ")}`);
      }
    } else {
      throw new TypeError(`${opts.msg}: Both ${opts.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`);
    }
  }
  const ignoredPathsArr = [];
  traverse(obj, (key, val, innerObj) => {
    let current = val;
    let objKey = key;
    if (innerObj.parentType === "array") {
      objKey = undefined;
      current = key;
    }
    if (Array.isArray(ignoredPathsArr) && ignoredPathsArr.length && ignoredPathsArr.some(path => innerObj.path.startsWith(path))) {
      return current;
    }
    if (objKey && opts.ignoreKeys.some(oneOfKeysToIgnore => matcher.isMatch(objKey, oneOfKeysToIgnore))) {
      return current;
    }
    if (opts.ignorePaths.some(oneOfPathsToIgnore => matcher.isMatch(innerObj.path, oneOfPathsToIgnore))) {
      return current;
    }
    const isNotAnArrayChild = !(!isObj(current) && !Array.isArray(current) && Array.isArray(innerObj.parent));
    let optsSchemaHasThisPathDefined = false;
    if (isObj(opts.schema) && hasKey.call(opts.schema, innerObj.path)) {
      optsSchemaHasThisPathDefined = true;
    }
    let refHasThisPathDefined = false;
    if (isObj(ref) && objectPath.has(ref, innerObj.path)) {
      refHasThisPathDefined = true;
    }
    if (opts.enforceStrictKeyset && isNotAnArrayChild && !optsSchemaHasThisPathDefined && !refHasThisPathDefined) {
      throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${innerObj.path} is neither covered by reference object (second input argument), nor ${opts.optsVarName}.schema! To stop this error, turn off ${opts.optsVarName}.enforceStrictKeyset or provide some type reference (2nd argument or ${opts.optsVarName}.schema).\n\nDebug info:\n
obj = ${JSON.stringify(obj, null, 4)}\n
ref = ${JSON.stringify(ref, null, 4)}\n
innerObj = ${JSON.stringify(innerObj, null, 4)}\n
opts = ${JSON.stringify(opts, null, 4)}\n
current = ${JSON.stringify(current, null, 4)}\n\n`);
    } else if (optsSchemaHasThisPathDefined) {
      const currentKeysSchema = arrayiffy(opts.schema[innerObj.path]).map(el => `${el}`.toLowerCase());
      objectPath.set(opts.schema, innerObj.path, currentKeysSchema);
      if (!intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
        if (current !== true && current !== false && !currentKeysSchema.includes(typ(current).toLowerCase()) || (current === true || current === false) && !currentKeysSchema.includes(String(current)) && !currentKeysSchema.includes("boolean")) {
          if (Array.isArray(current) && opts.acceptArrays) {
            for (let i = 0, len = current.length; i < len; i++) {
              if (!currentKeysSchema.includes(typ(current[i]).toLowerCase())) {
                throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${innerObj.path}.${i}, the ${i}th element (equal to ${JSON.stringify(current[i], null, 0)}) is of a type ${typ(current[i]).toLowerCase()}, but only the following are allowed by the ${opts.optsVarName}.schema: ${currentKeysSchema.join(", ")}`);
              }
            }
          } else {
            throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${innerObj.path} was customised to ${typ(current) !== "string" ? '"' : ""}${JSON.stringify(current, null, 0)}${typ(current) !== "string" ? '"' : ""} (type: ${typ(current).toLowerCase()}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(currentKeysSchema, null, 0)})`);
          }
        }
      } else {
        ignoredPathsArr.push(innerObj.path);
      }
    } else if (ref && isObj(ref) && refHasThisPathDefined) {
      const compareTo = objectPath.get(ref, innerObj.path);
      if (opts.acceptArrays && Array.isArray(current) && !opts.acceptArraysIgnore.includes(key)) {
        const allMatch = current.every(el => typ(el).toLowerCase() === typ(ref[key]).toLowerCase());
        if (!allMatch) {
          throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${innerObj.path} was customised to be array, but not all of its elements are ${typ(ref[key]).toLowerCase()}-type`);
        }
      } else if (typ(current) !== typ(compareTo)) {
        throw new TypeError(`${opts.msg}: ${opts.optsVarName}.${innerObj.path} was customised to ${typ(current).toLowerCase() === "string" ? "" : '"'}${JSON.stringify(current, null, 0)}${typ(current).toLowerCase() === "string" ? "" : '"'} which is not ${typ(compareTo).toLowerCase()} but ${typ(current).toLowerCase()}`);
      }
    } else ;
    return current;
  });
}
function checkTypesMini(obj, ref, originalOptions) {
  return internalApi(obj, ref, originalOptions);
}

export { checkTypesMini };
