import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar({
    card: { title: "%%_name_%%" },
    card_data: { name: "Ada" },
  }),
  {
    card: { title: "Ada" },
    card_data: { name: "Ada" },
  },
);
