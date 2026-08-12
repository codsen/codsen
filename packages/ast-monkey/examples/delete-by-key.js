import { strict as assert } from "node:assert";

import { del } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  del(
    {
      user: { password: "secret", name: "Ada" },
      metadata: { password: "legacy" },
    },
    { key: "password" },
  ),
  {
    user: { name: "Ada" },
    metadata: {},
  },
);
