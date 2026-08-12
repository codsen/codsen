import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

const result = jVar({ total: "%%_count_%%", count: 42 });

assert.equal(result.total, 42);
assert.equal(typeof result.total, "number");
