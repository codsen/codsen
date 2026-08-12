import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar({ message: "Hello %%_missing_%%" }, { allowUnresolved: "unknown" }),
  { message: "Hello unknown" },
);
