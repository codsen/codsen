// Array primitives stay unchanged

import { strict as assert } from "node:assert";

import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

assert.deepEqual(setAllValuesTo(["keep", { change: "me" }, 42]), [
  "keep",
  { change: false },
  42,
]);
