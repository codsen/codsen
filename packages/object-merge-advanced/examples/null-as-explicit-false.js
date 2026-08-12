// Let null explicitly override another value

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { enabled: true },
    { enabled: null },
    { useNullAsExplicitFalse: true },
  ),
  { enabled: null },
);
