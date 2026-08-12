// Choose HTML or XHTML break-tag syntax

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("one\ntwo", {
    replaceLineBreaks: true,
    useXHTML: true,
    removeWidows: false,
  }).res,
  "one<br/>\ntwo",
);
assert.equal(
  det("one\ntwo", {
    replaceLineBreaks: true,
    useXHTML: false,
    removeWidows: false,
  }).res,
  "one<br>\ntwo",
);
