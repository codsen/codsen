// Synchronous globbing

import { strict as assert } from "node:assert";

import { globSync } from "../dist/codsen-glob.esm.js";

assert.deepEqual(globSync("src/*.ts"), ["src/main.ts", "src/picomatch.d.ts"]);
