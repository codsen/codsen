// Process the whole string when no ranges are supplied

import { strict as assert } from "node:assert";

import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const gathered = [];
rProcessOutside("abc", null, (from, to) => gathered.push([from, to]));

assert.deepEqual(gathered, [
  [0, 1],
  [1, 2],
  [2, 3],
]);
