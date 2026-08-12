// Allow multiple types through a schema

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini({ cache: null, output: "dist" }, null, {
    schema: {
      cache: ["boolean", "null"],
      output: "string",
    },
  });
});
