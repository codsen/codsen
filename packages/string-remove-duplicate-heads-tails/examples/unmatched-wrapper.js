// Leave content intact unless both outer markers match

import { strict as assert } from "node:assert";

import { remDup } from "../dist/string-remove-duplicate-heads-tails.esm.js";

assert.equal(
  remDup("{{ customer", {
    heads: "{{",
    tails: "}}",
  }),
  "{{ customer",
);
