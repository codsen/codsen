// Exclude matches with a negative pattern

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob(["src/*.ts", "!src/picomatch.d.ts"]), [
  "src/main.ts",
]);
