/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import clone from "lodash.clonedeep";
import { compare } from "ast-compare";
import { traverse } from "ast-monkey-traverse";
import isObj from "lodash.isplainobject";
import { version as v } from "../package.json";
const version: string = v;

interface UnknownValueObj {
  [key: string]: any;
}

interface Opts {
  matchKeysStrictly?: boolean;
  hungryForWhitespace?: boolean;
}

const defaults: Opts = {
  matchKeysStrictly: false,
  hungryForWhitespace: false,
};

function deleteObj(
  originalInput: any,
  objToDelete: UnknownValueObj,
  originalOpts?: Opts
): any {
  if (!originalInput) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!"
    );
  }
  if (!objToDelete) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!"
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!"
    );
  }

  const opts = { ...defaults, ...originalOpts };

  let input = clone(originalInput);
  let current;

  // compare input itself
  if (
    compare(input, objToDelete, {
      hungryForWhitespace: opts.hungryForWhitespace,
      matchStrictly: opts.matchKeysStrictly,
    })
  ) {
    return {};
  }

  // traversal
  input = traverse(input, (key, val) => {
    current = val !== undefined ? val : key;
    if (isObj(current)) {
      if (
        isObj(objToDelete) &&
        isObj(current) &&
        !Object.keys(objToDelete).length &&
        !Object.keys(current).length
      ) {
        return NaN;
      }
      if (
        compare(current, objToDelete, {
          hungryForWhitespace: opts.hungryForWhitespace,
          matchStrictly: opts.matchKeysStrictly,
        })
      ) {
        return NaN;
      }
    }
    return current;
  });
  return input;
}

export { deleteObj, defaults, version };
