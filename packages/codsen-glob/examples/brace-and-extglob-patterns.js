// Brace expansion and extglobs

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob(["src/*.{js,ts}", "src/@(main|missing).ts"]), [
  "src/main.ts",
  "src/picomatch.d.ts",
]);
