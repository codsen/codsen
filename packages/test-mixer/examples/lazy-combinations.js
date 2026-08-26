// Process combinations lazily and stop when enough rows have been handled

import { strict as assert } from "node:assert";

import { mixerLazy } from "../dist/test-mixer.esm.js";

const handled = [];
for (const row of mixerLazy({}, { first: true, second: false, third: true })) {
  handled.push(row);
  if (handled.length === 3) {
    break;
  }
}

assert.deepEqual(handled, [
  { first: false, second: false, third: false },
  { first: true, second: false, third: false },
  { first: false, second: true, third: false },
]);
