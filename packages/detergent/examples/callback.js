// Transform text outside HTML tags with a callback

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("before <b>inside</b> after", {
    cb: (text) => text.toUpperCase(),
    removeWidows: false,
  }).res,
  "BEFORE <b>INSIDE</b> AFTER",
);
