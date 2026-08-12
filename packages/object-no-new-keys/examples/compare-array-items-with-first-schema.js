// Compare every input array item with the first reference item

import { strict as assert } from "node:assert";

import { noNewKeys } from "../dist/object-no-new-keys.esm.js";

assert.deepEqual(
  noNewKeys(
    {
      rows: [{ name: "Ada" }, { name: "Grace", role: "editor" }],
    },
    {
      rows: [{ name: "" }],
    },
    { mode: 2 },
  ),
  ["rows[1].role"],
);
