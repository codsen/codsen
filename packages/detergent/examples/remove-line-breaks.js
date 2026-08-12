// Collapse line breaks to spaces

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("one\ntwo", {
    removeLineBreaks: true,
    replaceLineBreaks: false,
    removeWidows: false,
  }).res,
  "one two",
);
