// Merge Boolean clashes with AND instead of the default OR

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { enabled: true },
    { enabled: false },
    { mergeBoolsUsingOrNotAnd: false },
  ),
  { enabled: false },
);
