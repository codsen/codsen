// Add missing spaces after sentence punctuation

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("Hello.World", { addMissingSpaces: true, removeWidows: false }).res,
  "Hello. World",
);
assert.equal(
  det("Hello.World", { addMissingSpaces: false, removeWidows: false }).res,
  "Hello.World",
);
