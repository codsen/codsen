// Empty arrays that contain any string value

import { strict as assert } from "node:assert";

import { flattenAllArrays } from "../dist/object-flatten-all-arrays.esm.js";

assert.deepEqual(
  flattenAllArrays(
    {
      keep: [{ a: "a" }, { b: "b" }],
      remove: [{ a: "a" }, "text", { b: "b" }],
    },
    { flattenArraysContainingStringsToBeEmpty: true },
  ),
  {
    keep: [{ a: "a", b: "b" }],
    remove: [],
  },
);
