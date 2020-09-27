/**
 * object-fill-missing-keys
 * Add missing keys into plain objects, according to a reference object
 * Version: 7.10.27
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-fill-missing-keys/
 */

import clone from 'lodash.clonedeep';
import merge from 'object-merge-advanced';
import arrayiffyIfString from 'arrayiffy-if-string';
import allValuesEqualTo from 'object-all-values-equal-to';
import isObj from 'lodash.isplainobject';

function typ(something) {
  if (isObj(something)) {
    return "plain object";
  }
  if (Array.isArray(something)) {
    return "array";
  }
  return typeof something;
}
function isStr(something) {
  return typeof something === "string";
}
function existy(x) {
  return x != null;
}
function fillMissingKeys(incompleteOriginal, schema, opts, path = "") {
  const incomplete = clone(incompleteOriginal);
  if (
    existy(incomplete) ||
    !(
      path.length &&
      opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(path) &&
      allValuesEqualTo(incomplete, opts.placeholder)
    )
  ) {
    if (isObj(schema) && isObj(incomplete)) {
      Object.keys(schema).forEach((key) => {
        const currentPath = `${path ? `${path}.` : ""}${key}`;
        if (
          opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(
            currentPath
          )
        ) {
          if (existy(incomplete[key])) {
            if (allValuesEqualTo(incomplete[key], opts.placeholder)) {
              incomplete[key] = opts.placeholder;
            }
          } else {
            incomplete[key] = opts.placeholder;
          }
        }
        if (
          !existy(incomplete[key]) ||
          !(
            opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(
              currentPath
            ) && allValuesEqualTo(incomplete[key], opts.placeholder)
          )
        ) {
          incomplete[key] = fillMissingKeys(
            incomplete[key],
            schema[key],
            opts,
            currentPath
          );
        }
      });
    } else if (Array.isArray(schema) && Array.isArray(incomplete)) {
      if (incomplete.length === 0) {
        return schema;
      }
      if (schema.length > 0) {
        for (let i = incomplete.length; i--; ) {
          const currentPath = `${path ? `${path}.` : ""}0`;
          if (isObj(schema[0]) || Array.isArray(schema[0])) {
            incomplete[i] = fillMissingKeys(
              incomplete[i],
              schema[0],
              opts,
              currentPath
            );
          }
        }
      }
    } else {
      return merge(schema, incomplete, {
        useNullAsExplicitFalse: opts.useNullAsExplicitFalse,
      });
    }
  }
  return incomplete;
}
function fillMissingKeysWrapper(
  originalIncompleteWrapper,
  originalSchemaWrapper,
  originalOptsWrapper
) {
  if (arguments.length === 0) {
    throw new Error(
      "object-fill-missing-keys: [THROW_ID_01] All arguments are missing!"
    );
  }
  if (!isObj(originalIncompleteWrapper)) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_02] First argument, input object must be a plain object. Currently it's type is "${typ(
        originalIncompleteWrapper
      )}" and it's equal to: ${JSON.stringify(
        originalIncompleteWrapper,
        null,
        4
      )}`
    );
  }
  if (!isObj(originalSchemaWrapper)) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_03] Second argument, schema object, must be a plain object. Currently it's type is "${typ(
        originalSchemaWrapper
      )}" and it's equal to: ${JSON.stringify(originalSchemaWrapper, null, 4)}`
    );
  }
  if (
    originalOptsWrapper !== undefined &&
    originalOptsWrapper !== null &&
    !isObj(originalOptsWrapper)
  ) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_04] Third argument, schema object, must be a plain object. Currently it's type is "${typ(
        originalOptsWrapper
      )}" and it's equal to: ${JSON.stringify(originalOptsWrapper, null, 4)}`
    );
  }
  if (originalOptsWrapper === null) {
    originalOptsWrapper = {};
  }
  const defaults = {
    placeholder: false,
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    useNullAsExplicitFalse: true,
  };
  const opts = { ...defaults, ...originalOptsWrapper };
  opts.doNotFillThesePathsIfTheyContainPlaceholders = arrayiffyIfString(
    opts.doNotFillThesePathsIfTheyContainPlaceholders
  );
  let culpritsVal = null;
  let culpritsIndex = null;
  if (
    opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 &&
    !opts.doNotFillThesePathsIfTheyContainPlaceholders.every((key, idx) => {
      if (!isStr(key)) {
        culpritsVal = key;
        culpritsIndex = idx;
        return false;
      }
      return true;
    })
  ) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_06] opts.doNotFillThesePathsIfTheyContainPlaceholders element with an index number "${culpritsIndex}" is not a string! It's ${typ(
        culpritsVal
      )}, equal to:\n${JSON.stringify(culpritsVal, null, 4)}`
    );
  }
  return fillMissingKeys(
    clone(originalIncompleteWrapper),
    clone(originalSchemaWrapper),
    opts
  );
}

export default fillMissingKeysWrapper;
