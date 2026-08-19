// Ignore data containers

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    {
      name: "Root",
      card: { title: "%%_name_%%" },
      card_data: { name: "Local" },
    },
    { lookForDataContainers: false },
  ),
  {
    name: "Root",
    card: { title: "Root" },
    card_data: { name: "Local" },
  },
);
