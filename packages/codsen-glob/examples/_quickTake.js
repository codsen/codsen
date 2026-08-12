// Quick Take

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob("src/**/*.ts"), [
  "src/main.ts",
  "src/picomatch.d.ts",
]);
