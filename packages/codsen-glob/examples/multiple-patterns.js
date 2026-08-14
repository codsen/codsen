// Combine multiple patterns

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob(["src/main.ts", "test/*.js"]), [
  "src/main.ts",
  "test/test.js",
]);
