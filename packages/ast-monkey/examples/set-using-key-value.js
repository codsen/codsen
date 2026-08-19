// Set a node using `key` instead of `val`

import { strict as assert } from "node:assert";

import { set } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  set({ user: { name: "Ada", active: false } }, { index: "2", key: "Grace" }),
  { user: { name: "Grace", active: false } },
);
