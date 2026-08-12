// Keep the last two words together

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("clean this text now", { removeWidows: true }).res,
  "clean this text&nbsp;now",
);
assert.equal(
  det("clean this text now", { removeWidows: false }).res,
  "clean this text now",
);
