// Accept arrays of the reference value's type

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.doesNotThrow(() => {
  checkTypesMini(
    { extensions: ["js", "ts"] },
    { extensions: "js" },
    { acceptArrays: true },
  );
});
