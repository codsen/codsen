// Replace line breaks with HTML break tags

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("one\ntwo", { replaceLineBreaks: true, removeWidows: false }).res,
  "one<br/>\ntwo",
);
assert.equal(
  det("one\ntwo", { replaceLineBreaks: false, removeWidows: false }).res,
  "one\ntwo",
);
