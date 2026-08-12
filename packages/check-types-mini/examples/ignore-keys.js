// Ignore a key wherever it occurs

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini(
    { first: { metadata: "text" }, second: { metadata: 123 } },
    { first: { metadata: false }, second: { metadata: false } },
    { ignoreKeys: "metadata" },
  );
});
