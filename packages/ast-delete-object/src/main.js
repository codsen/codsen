import clone from "lodash.clonedeep";
import compare from "ast-compare";
import traverse from "ast-monkey-traverse";

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

function deleteObj(originalInput, objToDelete, originalOpts) {
  function existy(x) {
    return x != null;
  }

  if (!existy(originalInput)) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!"
    );
  }
  if (!existy(objToDelete)) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!"
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(
      "ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!"
    );
  }

  const defaults = {
    matchKeysStrictly: false,
    hungryForWhitespace: false
  };
  const opts = Object.assign({}, defaults, originalOpts);

  let input = clone(originalInput);
  let current;

  // compare input itself
  if (
    compare(input, objToDelete, {
      hungryForWhitespace: opts.hungryForWhitespace,
      matchStrictly: opts.matchKeysStrictly
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
        Object.keys(objToDelete).length === 0 &&
        isObj(current) &&
        Object.keys(current).length === 0
      ) {
        return NaN;
      } else if (
        compare(current, objToDelete, {
          hungryForWhitespace: opts.hungryForWhitespace,
          matchStrictly: opts.matchKeysStrictly
        })
      ) {
        return NaN;
      }
    }
    return current;
  });
  return input;
}

export default deleteObj;
