import clone from "lodash.clonedeep";
import { compare } from "ast-compare";
import { traverse } from "ast-monkey-traverse";
import isObj from "lodash.isplainobject";

import { version as v } from "../package.json";

const version: string = v;

// From "type-fest" by Sindre Sorhus:
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = JsonValue[];

interface Opts {
  matchKeysStrictly: boolean;
  hungryForWhitespace: boolean;
}

const defaults: Opts = {
  matchKeysStrictly: false,
  hungryForWhitespace: false,
};

/**
 * Delete all plain objects in AST if they contain a certain key/value pair
 */
function deleteObj<T extends JsonValue>(
  input: T,
  objToDelete: JsonObject,
  opts?: Partial<Opts>
): T {
  if (!input) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_01] Missing resolvedInput!"
    );
  }
  if (!objToDelete) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!"
    );
  }
  if (opts && !isObj(opts)) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!"
    );
  }

  let resolvedOpts = { ...defaults, ...opts };

  let resolvedInput = clone(input);
  let current;

  // compare resolvedInput itself
  if (
    isObj(resolvedInput) &&
    isObj(objToDelete) &&
    compare(resolvedInput, objToDelete, {
      hungryForWhitespace: resolvedOpts.hungryForWhitespace,
      matchStrictly: resolvedOpts.matchKeysStrictly,
    })
  ) {
    return {} as any;
  }

  // traversal
  resolvedInput = traverse(resolvedInput, (key, val) => {
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
          hungryForWhitespace: resolvedOpts.hungryForWhitespace,
          matchStrictly: resolvedOpts.matchKeysStrictly,
        })
      ) {
        return NaN;
      }
    }
    return current;
  });
  return resolvedInput;
}

export { deleteObj, defaults, version };
