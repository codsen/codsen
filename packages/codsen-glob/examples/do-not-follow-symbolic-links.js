// Disable symbolic-link traversal

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob("src/**/*.ts", { followSymbolicLinks: false }), [
  "src/main.ts",
  "src/picomatch.d.ts",
]);
