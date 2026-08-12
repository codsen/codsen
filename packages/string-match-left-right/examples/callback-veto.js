// Let a callback veto an otherwise successful match

import { strict as assert } from "node:assert";

import { matchLeft } from "../dist/string-match-left-right.esm.js";

assert.equal(matchLeft("<a class=", 8, "class"), "class");
assert.equal(
  matchLeft("<a class=", 8, "class", {
    cb: (characterBefore) => characterBefore === "\n",
  }),
  false,
);
