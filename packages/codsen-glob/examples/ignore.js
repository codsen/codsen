// Veto matches with ignore patterns

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob("src/*.ts", { ignore: "**/*.d.ts" }), [
  "src/main.ts",
]);
