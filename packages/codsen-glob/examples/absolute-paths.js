// Return absolute paths

import { strict as assert } from "node:assert";
import path from "node:path";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob("src/main.ts", { absolute: true }), [
  path.join(process.cwd(), "src/main.ts"),
]);
