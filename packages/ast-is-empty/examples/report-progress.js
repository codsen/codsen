// Compose progress reporting into a caller's range

import { strict as assert } from "node:assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

const progress = [];
assert.equal(
  isEmpty(["", { value: "" }], {
    reportProgressFunc(percentageDone) {
      progress.push(percentageDone);
    },
    reportProgressFuncFrom: 25,
    reportProgressFuncTo: 50,
  }),
  true,
);
assert.equal(progress[0], 25);
assert.equal(progress[progress.length - 1], 50);
