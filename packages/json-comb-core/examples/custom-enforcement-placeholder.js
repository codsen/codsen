import { strict as assert } from "node:assert";

import { enforceKeysetSync } from "../dist/json-comb-core.esm.js";

assert.deepEqual(
  enforceKeysetSync(
    { settings: true },
    { settings: { theme: true }, enabled: true },
    {
      placeholder: true,
      doNotFillThesePathsIfTheyContainPlaceholders: ["settings"],
    },
  ),
  { enabled: true, settings: true },
);
