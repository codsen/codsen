// Combine multiple patterns

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob(["src/main.ts", "src/*.d.ts"]), [
  "src/main.ts",
  "src/picomatch.d.ts",
]);
