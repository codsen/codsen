import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    { first: "%%_second_%%", second: "%%_value_%%", value: "x" },
    {
      wrapHeadsWith: "{",
      wrapTailsWith: "}",
      preventDoubleWrapping: false,
    },
  ),
  { first: "{{x}}", second: "{x}", value: "x" },
);
