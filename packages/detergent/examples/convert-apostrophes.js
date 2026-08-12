// Normalise typographic apostrophes

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("It’s fine", {
    convertApostrophes: true,
    convertEntities: true,
    removeWidows: false,
  }).res,
  "It&rsquo;s fine",
);
assert.equal(
  det("It’s fine", {
    convertApostrophes: false,
    convertEntities: true,
    removeWidows: false,
  }).res,
  "It's fine",
);
