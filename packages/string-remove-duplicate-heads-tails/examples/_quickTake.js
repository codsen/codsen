// Quick Take

import { strict as assert } from "assert";

import { remDup } from "../dist/string-remove-duplicate-heads-tails.esm.js";

assert.equal(
  remDup("{{ Hi {{ first_name }}! }}", {
    heads: "{{ ",
    tails: " }}",
  }),
  "Hi {{ first_name }}!"
);
