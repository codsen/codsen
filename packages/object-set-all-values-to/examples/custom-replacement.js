import { strict as assert } from "node:assert";

import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

assert.deepEqual(setAllValuesTo({ a: "a", b: "b", c: "c", d: "d" }, "x"), {
  a: "x",
  b: "x",
  c: "x",
  d: "x",
});
