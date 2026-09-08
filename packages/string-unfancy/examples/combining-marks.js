// Preserve combining marks while simplifying punctuation when requested

import { strict as assert } from "node:assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

assert.equal(unfancy("…q\u0313r—"), "...q'r-");
assert.equal(
  unfancy("…q\u0313r—", { preserveCombiningMarks: true }),
  "...q\u0313r-",
);
