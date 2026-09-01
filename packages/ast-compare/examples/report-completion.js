// Report deterministic work and elapsed time

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

let completion;
assert.equal(
  compare(["alpha", "beta"], ["beta", "alpha"], {
    arrayOrder: "any",
    reportCompletionFunc: (stats) => {
      completion = stats;
    },
  }),
  true,
);
assert.equal(completion.candidateComparisons, 4);
assert.equal(completion.comparisons, 5);
assert.equal(completion.matchingEdges, 2);
assert.equal(typeof completion.timeTakenInMilliseconds, "number");
