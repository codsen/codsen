// Quick Take

import { strict as assert } from "node:assert";

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
  // Objects supply a property key and value; arrays supply the element as key.
  let current = innerObj.parentType === "object" ? val : key;
  if (
    // it's object (not array)
    innerObj.parentType === "object" &&
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
