import { strict as assert } from "node:assert";

import { getKeyset } from "../dist/json-comb-core.esm.js";

const schema = await getKeyset(
  [Promise.resolve({ name: "Ada" }), Promise.resolve({ role: "admin" })],
  { placeholder: "missing" },
);

assert.deepEqual(schema, { name: "missing", role: "missing" });
