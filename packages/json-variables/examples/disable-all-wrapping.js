import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    { greeting: "Hello %%_name_%%", name: "Ada" },
    {
      wrapHeadsWith: "<",
      wrapTailsWith: ">",
      wrapGlobalFlipSwitch: false,
    },
  ),
  { greeting: "Hello Ada", name: "Ada" },
);
