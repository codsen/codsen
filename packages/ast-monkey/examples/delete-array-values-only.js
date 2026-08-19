// Delete matches from arrays only

import { strict as assert } from "node:assert";

import { del } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  del(
    { status: "draft", history: ["draft", "published"] },
    {
      key: "draft",
      only: "array",
    },
  ),
  { status: "draft", history: ["published"] },
);
