// Delete nodes by value

import { strict as assert } from "node:assert";

import { del } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  del(
    {
      primary: { status: "ready" },
      fallback: { status: "waiting" },
    },
    { val: { status: "ready" } },
  ),
  { fallback: { status: "waiting" } },
);
