import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

assert.deepEqual(getByKey({ tag: "lower", Tag: "upper" }, "tag"), [
  { val: "lower", path: "tag" },
]);
