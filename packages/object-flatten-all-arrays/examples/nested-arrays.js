// Merge objects in arrays at every nesting level

import { strict as assert } from "node:assert";

import { flattenAllArrays } from "../dist/object-flatten-all-arrays.esm.js";

assert.deepEqual(
  flattenAllArrays({
    groups: [
      [{ a: 1 }, { b: 2 }],
      [{ c: 3 }, { d: 4 }],
    ],
  }),
  { groups: [[{ a: 1, b: 2 }], [{ c: 3, d: 4 }]] },
);
