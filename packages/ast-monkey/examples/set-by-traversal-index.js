// Set a node's value by its traversal index

import { strict as assert } from "node:assert";

import { set } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  set({ user: { name: "Ada", active: false } }, { index: 2, val: "Grace" }),
  { user: { name: "Grace", active: false } },
);
