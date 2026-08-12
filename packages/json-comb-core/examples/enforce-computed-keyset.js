import { strict as assert } from "node:assert";

import {
  enforceKeysetSync,
  getKeysetSync,
} from "../dist/json-comb-core.esm.js";

const objects = [
  { a: "a", b: "b", c: { d: "d", e: "e" } },
  { a: "a" },
  { c: { f: "f" } },
];
const schema = getKeysetSync(objects);

assert.deepEqual(enforceKeysetSync(objects[1], schema), {
  a: "a",
  b: false,
  c: { d: false, e: false, f: false },
});
