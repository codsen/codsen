// Compose progress into a caller's range

import { strict as assert } from "node:assert";

import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

const progress = [];

assert.equal(
  empty([" ", { nested: ["\n"] }], {
    reportProgressFunc: (percentageDone) => {
      progress.push(percentageDone);
    },
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 80,
  }),
  true,
);
assert.equal(progress[0], 20);
assert.equal(progress[progress.length - 1], 80);
assert.equal(
  progress.every((value, index) => index === 0 || value >= progress[index - 1]),
  true,
);
