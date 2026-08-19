// A single replacement value is used only once

import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

assert.deepEqual(
  getByKey(
    {
      first: { status: "pending" },
      second: { status: "pending" },
    },
    "status",
    "done",
  ),
  {
    first: { status: "done" },
    second: { status: "pending" },
  },
);
