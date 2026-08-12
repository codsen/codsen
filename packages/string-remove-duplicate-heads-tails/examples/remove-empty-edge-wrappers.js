// Remove empty marker pairs around meaningful text

import { strict as assert } from "node:assert";

import { remDup } from "../dist/string-remove-duplicate-heads-tails.esm.js";

assert.equal(
  remDup("((())) article ((()))", {
    heads: "(((",
    tails: ")))",
  }),
  "article",
);
