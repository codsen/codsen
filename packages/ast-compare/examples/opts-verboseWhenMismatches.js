// `opts.verboseWhenMismatches`

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

// by default, returns a boolean without explanation
assert.equal(
  compare(
    { a: "1", b: "2" },
    { a: "1", b: "2", c: "3" },
    {
      verboseWhenMismatches: false, // <---
    },
  ),
  false,
);

const mismatch = compare(
  { a: "1", b: "2" },
  { a: "1", b: "2", c: "3" },
  {
    verboseWhenMismatches: true, // <---
  },
);
assert.equal(typeof mismatch, "string");

// when opts.verboseWhenMismatches is enabled, a negative result is
// string (explanation). A positive result is boolean "true".
assert.equal(
  compare(
    { a: "1", b: "2" },
    { a: "1", b: "2" },
    {
      verboseWhenMismatches: true, // <---
    },
  ),
  true,
);
