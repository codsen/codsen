// Carry non-boolean values into every variation

import { strict as assert } from "node:assert";

import { mixer } from "../dist/test-mixer.esm.js";

assert.deepEqual(
  mixer({ requiredValue: "present" }, { enabled: true, mode: "safe" }),
  [
    { enabled: false, mode: "safe", requiredValue: "present" },
    { enabled: true, mode: "safe", requiredValue: "present" },
  ],
);
