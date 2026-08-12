// Exclude a template variable range from the returned words

import { strict as assert } from "node:assert";

import { splitByW } from "../dist/string-split-by-whitespace.esm.js";

assert.deepEqual(
  splitByW("before {{ full name }} after", {
    ignoreRanges: [[7, 22]],
  }),
  ["before", "after"],
);
