import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

assert.equal(
  convertAll("It\u2019s called \u2018alpha\u2019.", {
    convertApostrophes: false,
  }).result,
  "It's called 'alpha'.",
);
