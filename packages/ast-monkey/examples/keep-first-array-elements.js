// Keep only the first element of every array

import { strict as assert } from "node:assert";

import { arrayFirstOnly } from "../dist/ast-monkey.esm.js";

assert.deepEqual(
  arrayFirstOnly({
    users: [
      { name: "Ada", roles: ["admin", "author"] },
      { name: "Grace", roles: ["reader"] },
    ],
  }),
  { users: [{ name: "Ada", roles: ["admin"] }] },
);
