// Sort strings with the shared comparator

import { strict as assert } from "node:assert";

import { compareFn } from "../dist/codsen-utils.esm.js";

assert.deepEqual(["pear", "apple", "orange"].sort(compareFn), [
  "apple",
  "orange",
  "pear",
]);
