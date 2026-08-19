// Resolve booleans to empty text

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    { message: "before %%_flag_%% after", flag: false },
    { resolveToBoolIfAnyValuesContainBool: false },
  ),
  { message: "before  after", flag: false },
);
