// `entEndsWith`

import { strict as assert } from "assert";
import { entEndsWith } from "../dist/all-named-html-entities.esm.js";

// here's list of named HTML entities which end with character "2":
assert.deepEqual(entEndsWith["2"], {
  1: ["blk12", "frac12"],
  p: ["sup2"],
});

// query directly
assert.equal(entEndsWith["2"].p[0], "sup2");
