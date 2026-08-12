import { strict as assert } from "node:assert";

import { extract } from "../dist/tsd-extract.esm.js";

const result = extract("interface Present { value: string }", "Missing");

assert.equal(result.error, "not found");
assert.equal(result.value, null);
