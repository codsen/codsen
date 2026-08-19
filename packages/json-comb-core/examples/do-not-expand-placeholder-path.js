// Leave the chosen placeholder paths unexpanded

import { strict as assert } from "node:assert";

import { enforceKeysetSync } from "../dist/json-comb-core.esm.js";

const schema = { name: false, settings: { theme: false } };

assert.deepEqual(
  enforceKeysetSync({ name: "Ada", settings: false }, schema, {
    doNotFillThesePathsIfTheyContainPlaceholders: ["settings"],
  }),
  { name: "Ada", settings: false },
);
