// Report comparison progress

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

const progress = [];
assert.equal(
  compare(["alpha", "beta"], ["beta", "alpha"], {
    arrayOrder: "any",
    reportProgressFunc: (percentageDone) => progress.push(percentageDone),
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 40,
  }),
  true,
);
assert.deepEqual(progress, [20, 40]);
