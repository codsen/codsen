import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    {
      card: { title: "%%_name_%%" },
      card_vars: { name: "Ada" },
    },
    { dataContainerIdentifierTails: "_vars" },
  ),
  {
    card: { title: "Ada" },
    card_vars: { name: "Ada" },
  },
);
