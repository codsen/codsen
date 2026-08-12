// Set the end-of-line sequence inserted after HTML break tags

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

const common = { replaceLineBreaks: true, removeWidows: false };

assert.equal(det("one\ntwo", { ...common, eol: "lf" }).res, "one<br/>\ntwo");
assert.equal(
  det("one\ntwo", { ...common, eol: "crlf" }).res,
  "one<br/>\r\ntwo",
);
assert.equal(det("one\ntwo", { ...common, eol: "cr" }).res, "one<br/>\rtwo");
