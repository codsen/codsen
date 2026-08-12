import { strict as assert } from "node:assert";

import { get } from "../dist/ast-monkey.esm.js";

assert.deepEqual(get({ user: { name: "Ada" } }, { index: 2 }), {
  name: "Ada",
});
