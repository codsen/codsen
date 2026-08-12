// Remove mixed outer wrappers while preserving inner variables

import { strict as assert } from "node:assert";

import { remDup } from "../dist/string-remove-duplicate-heads-tails.esm.js";

assert.equal(
  remDup("?? ((( ?? first !! ?? last !! ))) !!", {
    heads: ["??", "((("],
    tails: ["!!", ")))"],
  }),
  "?? first !! ?? last !!",
);
