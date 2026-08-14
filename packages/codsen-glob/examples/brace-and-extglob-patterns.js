// Brace expansion and extglobs

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

assert.deepEqual(await glob("{src,test}/@(main|test).@(ts|js)"), [
  "src/main.ts",
  "test/test.js",
]);
