// Clone nested values for every generated variation

import { strict as assert } from "node:assert";

import { mixer } from "../dist/test-mixer.esm.js";

const defaults = { enabled: true, metadata: { mode: "safe" } };
const result = mixer({}, defaults);

defaults.metadata.mode = "changed";

assert.equal(result[0].metadata.mode, "safe");
assert.equal(result[1].metadata.mode, "safe");

result[0].metadata.mode = "changed in the first row";

assert.equal(result[1].metadata.mode, "safe");
