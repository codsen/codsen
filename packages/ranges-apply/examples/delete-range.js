// Delete a range by omitting its replacement value

import { strict as assert } from "node:assert";

import { rApply } from "../dist/ranges-apply.esm.js";

assert.equal(rApply("abcdef", [1, 3]), "adef");
