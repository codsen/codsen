// Report the index offsets through a callback

import { strict as assert } from "node:assert";

import { convertOne } from "../dist/string-dashes.esm.js";

let totalOffset = 0;
const ranges = convertOne("1-2", {
  from: 1,
  offsetBy: (amount) => {
    totalOffset += amount;
  },
});

assert.deepEqual(ranges, [[1, 2, "–"]]);
assert.equal(totalOffset, 0);
