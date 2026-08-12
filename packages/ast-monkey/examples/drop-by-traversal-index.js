import { strict as assert } from "node:assert";

import { drop } from "../dist/ast-monkey.esm.js";

assert.deepEqual(drop({ user: { name: "Ada", active: false } }, { index: 2 }), {
  user: { active: false },
});
