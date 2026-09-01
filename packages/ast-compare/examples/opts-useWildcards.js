// `opts.useWildcards`

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

// By default, string values are compared literally.
assert.equal(
  compare(
    { a: "1", b: "2a", c: "3" },
    { a: "1", b: "2*" },
    { useWildcards: false },
  ),
  false,
);

// once enabled, strings use wildcard matching, where "*" means any sequence
// of characters
assert.equal(
  compare(
    { a: "1", b: "2a", c: "3" },
    { a: "1", b: "2*" },
    { useWildcards: true },
  ),
  true,
);
