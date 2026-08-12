// Preserve or encode non-Latin characters

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(det("Привет", { dontEncodeNonLatin: true }).res, "Привет");
assert.equal(
  det("Привет", { dontEncodeNonLatin: false }).res,
  "&#x41F;&#x440;&#x438;&#x432;&#x435;&#x442;",
);
