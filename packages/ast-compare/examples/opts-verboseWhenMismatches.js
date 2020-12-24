// `opts.verboseWhenMismatches`

import { strict as assert } from "assert";
import { compare } from "../dist/ast-compare.esm.js";

// by default, returns a boolean without explanation
assert.equal(
  compare(
    { a: "1", b: "2" },
    { a: "1", b: "2", c: "3" },
    {
      verboseWhenMismatches: false, // <---
    }
  ),
  false
);

assert.equal(
  compare(
    { a: "1", b: "2" },
    { a: "1", b: "2", c: "3" },
    {
      verboseWhenMismatches: true, // <---
    }
  ),
  'The given object has key "c" which the other-one does not have.'
);

// when opts.verboseWhenMismatches is enabled, a negative result is
// string (explanation). A positive result is boolean "true".
assert.equal(
  compare(
    { a: "1", b: "2" },
    { a: "1", b: "2" },
    {
      verboseWhenMismatches: true, // <---
    }
  ),
  true
);
