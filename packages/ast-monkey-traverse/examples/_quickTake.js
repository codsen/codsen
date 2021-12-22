// Quick Take

import { strict as assert } from "assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const paths = [];
const source = {
  a: {
    foo: {
      bar: [
        {
          foo: "c",
        },
      ],
      d: {
        e: {
          foo: "f",
        },
      },
    },
  },
};

traverse(source, (key, val, innerObj) => {
  // if currently an object is traversed, you get both "key" and "val"
  // if it's array, only "key" is present, "val" is undefined
  let current = val !== undefined ? val : key;
  if (
    // it's object (not array)
    val !== undefined &&
    // and has the key we need
    key === "foo"
  ) {
    // push the path to array in the outer scope
    paths.push(innerObj.path);
  }
  return current;
});

// notice object-path notation "a.foo.bar.0.foo" - array segments use dots too:
assert.deepEqual(paths, ["a.foo", "a.foo.bar.0.foo", "a.foo.d.e.foo"]);
