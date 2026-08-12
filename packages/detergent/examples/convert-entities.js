// Choose whether to encode HTML entities

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("Cost £5", { convertEntities: true, removeWidows: false }).res,
  "Cost &pound;5",
);
assert.equal(
  det("Cost £5", { convertEntities: false, removeWidows: false }).res,
  "Cost £5",
);
