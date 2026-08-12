// Allow any shape below a schema path

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini(
    { metadata: { deeply: { nested: [1, true, null] } } },
    { metadata: "placeholder" },
    { schema: { metadata: "any" } },
  );
});
