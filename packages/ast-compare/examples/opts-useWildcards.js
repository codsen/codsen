// `opts.useWildcards`

import { strict as assert } from "assert";

import { compare } from "../dist/ast-compare.esm.js";

// by default, key values are matches as strings
assert.equal(
  compare(
    { a: "1", b: "2a", c: "3" },
    { a: "1", b: "2*" },
    { useWildcards: false }
  ),
  false
);

// once enabled, strings are matched via https://www.npmjs.com/package/matcher
// where "*" means any sequence of characters
assert.equal(
  compare(
    { a: "1", b: "2a", c: "3" },
    { a: "1", b: "2*" },
    { useWildcards: true }
  ),
  true
);
