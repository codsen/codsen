// Convert three dots to an ellipsis entity

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("Wait... now", {
    convertDotsToEllipsis: true,
    removeWidows: false,
  }).res,
  "Wait&hellip; now",
);
assert.equal(
  det("Wait... now", {
    convertDotsToEllipsis: false,
    removeWidows: false,
  }).res,
  "Wait... now",
);
