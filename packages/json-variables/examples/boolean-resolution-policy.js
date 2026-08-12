import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    {
      result: "%%_enabled_%% then %%_disabled_%%",
      enabled: true,
      disabled: false,
    },
    { resolveToFalseIfAnyValuesContainBool: false },
  ),
  { result: true, enabled: true, disabled: false },
);
