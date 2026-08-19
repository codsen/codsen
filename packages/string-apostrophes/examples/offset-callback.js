// Report the index offsets through a callback

import { strict as assert } from "node:assert";

import { convertOne } from "../dist/string-apostrophes.esm.js";

const skippedBy = [];
const ranges = convertOne("Rock ‘n‘ roll", {
  from: 5,
  to: 6,
  convertApostrophes: false,
  convertEntities: false,
  offsetBy: (amount) => skippedBy.push(amount),
});

assert.deepEqual(ranges, [[5, 8, "'n'"]]);
assert.equal(skippedBy.join(","), "2");
