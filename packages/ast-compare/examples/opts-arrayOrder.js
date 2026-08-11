// `opts.arrayOrder`

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

// Array order stays significant by default, but can be ignored at every depth:
assert.equal(
  compare(["first", "second"], ["second", "first"], {
    arrayOrder: "any",
  }),
  true,
);
