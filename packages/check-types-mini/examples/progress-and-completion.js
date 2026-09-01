// Compose progress and inspect completion statistics

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

const progress = [];
let completion;
checkTypesMini(
  { enabled: true, output: "dist" },
  { enabled: false, output: "" },
  {
    reportCompletionFunc(stats) {
      completion = stats;
    },
    reportProgressFunc(percentageDone) {
      progress.push(percentageDone);
    },
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 40,
  },
);

assert.deepEqual(progress, [20, 40]);
assert.equal(completion.objectPropertiesVisited, 2);
assert.equal(typeof completion.timeTakenInMilliseconds, "number");
