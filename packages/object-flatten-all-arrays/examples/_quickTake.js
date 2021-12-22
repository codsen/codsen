// Quick Take

import { strict as assert } from "assert";

import { flattenAllArrays } from "../dist/object-flatten-all-arrays.esm.js";

assert.deepEqual(
  flattenAllArrays({
    a: "a",
    b: "b",
    c: [
      {
        b: "b",
        a: "a",
      },
      {
        d: "d",
        c: "c",
      },
    ],
  }),
  {
    a: "a",
    b: "b",
    c: [
      {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
      },
    ],
  }
);
