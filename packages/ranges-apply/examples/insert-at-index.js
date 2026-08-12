// Insert text with a zero-width range

import { strict as assert } from "node:assert";

import { rApply } from "../dist/ranges-apply.esm.js";

assert.equal(rApply("abcdef", [3, 3, "-"]), "abc-def");
