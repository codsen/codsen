// Report each array position when the reference is not an array

import { strict as assert } from "node:assert";

import { noNewKeys } from "../dist/object-no-new-keys.esm.js";

assert.deepEqual(noNewKeys({ rows: ["one", "two"] }, { rows: "" }), [
  "rows[0]",
  "rows[1]",
]);
