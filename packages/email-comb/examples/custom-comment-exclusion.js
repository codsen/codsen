import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const source = "<body><!-- keep: legal notice --><!-- remove me --></body>";
const result = comb(source, {
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: "keep:",
}).result;

assert.equal(result.includes("keep: legal notice"), true);
assert.equal(result.includes("remove me"), false);
