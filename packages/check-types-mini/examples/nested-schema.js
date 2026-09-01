// Use a nested schema object

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini({ build: { target: ["es2022", "node18"] } }, null, {
    acceptArrays: true,
    schema: { build: { target: "string" } },
  });
});
