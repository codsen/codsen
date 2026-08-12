// Ignore only selected nested paths

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini(
    { first: { value: "custom" }, second: { value: 123 } },
    { first: { value: false }, second: { value: false } },
    { ignorePaths: ["first.*", "second.value"] },
  );
});
