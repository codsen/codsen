// Skip ahead from inside the callback

import { strict as assert } from "node:assert";

import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const gathered = [];
rProcessOutside("abcdef", null, (from, to, offset) => {
  gathered.push([from, to]);
  if (from === 0) offset(2);
});

assert.deepEqual(gathered, [
  [0, 1],
  [3, 4],
  [4, 5],
  [5, 6],
]);
