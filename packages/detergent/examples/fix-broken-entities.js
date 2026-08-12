// Fix misspelled named HTML entities

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("one &nsp; two", {
    fixBrokenEntities: true,
    removeWidows: false,
  }).res,
  "one &nbsp; two",
);
assert.equal(
  det("one &nsp; two", {
    fixBrokenEntities: false,
    removeWidows: false,
  }).res,
  "one &amp;nsp; two",
);
