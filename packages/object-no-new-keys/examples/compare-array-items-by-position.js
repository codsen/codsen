// Compare each input array item with the reference item at the same index

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
    { mode: 1 },
  ),
  ["rows[1].name", "rows[1].role"],
);
