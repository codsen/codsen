// Quick Take

import { strict as assert } from "assert";

import { rIterate } from "../dist/ranges-iterate.esm.js";

// Ranges in the following example "punches out" a "hole" from `a` to `g`
// (included), replacing it with `xyz`. That's what gets iterated.

const gathered = [];

// a callback-based interface:
rIterate("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
  gathered.push(`i = ${i}; val = ${val}`);
});

assert.deepEqual(gathered, [
  "i = 0; val = x",
  "i = 1; val = y",
  "i = 2; val = z",
  "i = 3; val = h",
  "i = 4; val = i",
  "i = 5; val = j",
]);
