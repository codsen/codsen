// Leave CSS without generator placeholders unchanged

import { strict as assert } from "node:assert";

import { genAtomic } from "../dist/generate-atomic-css.esm.js";

assert.deepEqual(genAtomic("body { color: red; }"), {
  log: { count: 0 },
  result: "body { color: red; }",
});
