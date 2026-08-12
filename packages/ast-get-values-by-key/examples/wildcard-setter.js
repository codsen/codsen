import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

const source = {
  popsicles: 1,
  tentacles: 0,
  nested: [{ cutticles: "yes" }],
};

assert.deepEqual(getByKey(source, ["*cles"], ["a", "b", "c"]), {
  popsicles: "a",
  tentacles: "b",
  nested: [{ cutticles: "c" }],
});
