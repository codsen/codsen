// Allow missing and additional keys

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini(
    { known: true, additional: "value" },
    { known: false, omitted: 0 },
    { enforceStrictKeyset: false },
  );
});
