// Convert one apostrophe into an entity

import { strict as assert } from "node:assert";

import { convertOne } from "../dist/string-apostrophes.esm.js";

assert.deepEqual(
  convertOne("test's", {
    from: 4,
    to: 5,
    convertApostrophes: true,
    convertEntities: true,
  }),
  [[4, 5, "&rsquo;"]],
);
