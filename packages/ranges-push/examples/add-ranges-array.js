// Add a complete array of ranges in one call

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges();
ranges.add([
  [1, 3, "A"],
  [5, 7, "B"],
]);

assert.deepEqual(ranges.current(), [
  [1, 3, "A"],
  [5, 7, "B"],
]);
