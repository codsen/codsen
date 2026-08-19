// Convert measurement primes

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

assert.equal(
  convertAll("The board is 6' long.").result,
  "The board is 6\u2032 long.",
);
