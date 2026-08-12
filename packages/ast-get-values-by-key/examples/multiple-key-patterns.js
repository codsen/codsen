import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

assert.deepEqual(
  getByKey(
    {
      firstName: "Ada",
      lastName: "Lovelace",
      age: 36,
    },
    ["firstName", "lastName"],
  ),
  [
    { val: "Ada", path: "firstName" },
    { val: "Lovelace", path: "lastName" },
  ],
);
