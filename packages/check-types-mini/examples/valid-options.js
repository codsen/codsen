// Validate an options object against defaults

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini(
    { minify: true, output: "dist" },
    { minify: false, output: "build" },
  );
});
