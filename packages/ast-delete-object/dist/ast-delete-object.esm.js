/**
 * ast-delete-object
 * Delete all plain objects in AST if they contain a certain key/value pair
 * Version: 1.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-delete-object/
 */

import clone from 'lodash.clonedeep';
import { compare } from 'ast-compare';
import { traverse } from 'ast-monkey-traverse';
import isObj from 'lodash.isplainobject';

var version = "1.10.1";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const version$1 = version;
const defaults = {
  matchKeysStrictly: false,
  hungryForWhitespace: false
};

function deleteObj(originalInput, objToDelete, originalOpts) {
  if (!originalInput) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!");
  }

  if (!objToDelete) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!");
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!");
  }

  const opts = { ...defaults,
    ...originalOpts
  };
  let input = clone(originalInput);
  let current; // compare input itself

  if (compare(input, objToDelete, {
    hungryForWhitespace: opts.hungryForWhitespace,
    matchStrictly: opts.matchKeysStrictly
  })) {
    return {};
  } // traversal


  input = traverse(input, (key, val) => {
    current = val !== undefined ? val : key;

    if (isObj(current)) {
      if (isObj(objToDelete) && isObj(current) && !Object.keys(objToDelete).length && !Object.keys(current).length) {
        return NaN;
      }

      if (compare(current, objToDelete, {
        hungryForWhitespace: opts.hungryForWhitespace,
        matchStrictly: opts.matchKeysStrictly
      })) {
        return NaN;
      }
    }

    return current;
  });
  return input;
}

export { defaults, deleteObj, version$1 as version };
