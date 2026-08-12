// Match without case sensitivity

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob("SRC/MAIN.TS", { caseSensitiveMatch: false }), [
  "SRC/MAIN.TS",
]);
