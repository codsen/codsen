// Match wildcard allow-lists and deny-lists

import { strict as assert } from "node:assert";

import { match } from "../dist/codsen-utils.esm.js";

const patterns = ["src/*.js", "!src/*.test.js"];

assert.equal(match("src/main.js", patterns), true);
assert.equal(match("src/main.test.js", patterns), false);
assert.equal(match("SRC/MAIN.JS", patterns), true);
assert.equal(
  match("SRC/MAIN.JS", patterns, { caseSensitiveMatch: true }),
  false,
);
