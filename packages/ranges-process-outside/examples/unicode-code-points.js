// Process Unicode code points without splitting surrogate pairs

import { strict as assert } from "node:assert";

import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const gathered = [];
rProcessOutside("a😀b", null, (from, to) => gathered.push([from, to]));

assert.deepEqual(gathered, [
  [0, 1],
  [1, 3],
  [3, 4],
]);
