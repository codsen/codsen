// Supply the apostrophe value separately

import { strict as assert } from "node:assert";

import { convertOne } from "../dist/string-apostrophes.esm.js";

assert.deepEqual(
  convertOne("Its ready", {
    from: 2,
    to: 2,
    value: "'",
    convertEntities: true,
  }),
  [[2, 2, "&rsquo;"]],
);
