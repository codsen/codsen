// Choose whether to strip HTML tags

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

const source = "Before <p>inside</p> after";

assert.equal(
  det(source, { stripHtml: true, removeWidows: false }).res,
  "Before inside after",
);
assert.equal(
  det(source, { stripHtml: false, removeWidows: false }).res,
  source,
);
