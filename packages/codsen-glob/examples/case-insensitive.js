// Match without case sensitivity

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

// the file on disk is "src/main.ts", so an uppercase extension misses by default
assert.deepEqual(await glob("src/*.TS"), []);

// mind you, only the matched part is case-insensitive - the static "src/"
// prefix locates the search root, so the filesystem resolves it as-is
assert.deepEqual(await glob("src/*.TS", { caseSensitiveMatch: false }), [
  "src/main.ts",
]);
