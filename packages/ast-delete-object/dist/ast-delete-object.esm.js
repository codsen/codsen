/**
 * @name ast-delete-object
 * @fileoverview Delete all plain objects in AST if they contain a certain key/value pair
 * @version 3.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-delete-object/}
 */

import clone from 'lodash.clonedeep';
import { compare } from 'ast-compare';
import { traverse } from 'ast-monkey-traverse';
import isObj from 'lodash.isplainobject';

var version$1 = "3.0.5";

const version = version$1;
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
  let current;
  if (compare(input, objToDelete, {
    hungryForWhitespace: opts.hungryForWhitespace,
    matchStrictly: opts.matchKeysStrictly
  })) {
    return {};
  }
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

export { defaults, deleteObj, version };
