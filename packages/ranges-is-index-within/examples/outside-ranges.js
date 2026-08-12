// Return false when an index is outside every range

import { strict as assert } from "node:assert";

import { isIndexWithin } from "../dist/ranges-is-index-within.esm.js";

assert.equal(
  isIndexWithin(12, [
    [1, 2],
    [5, 10],
  ]),
  false,
);
