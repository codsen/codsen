// Normalise a dash according to the conversion setting

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("one — two", { convertDashes: true, removeWidows: false }).res,
  "one &mdash; two",
);
assert.equal(
  det("one — two", { convertDashes: false, removeWidows: false }).res,
  "one - two",
);
