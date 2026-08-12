// Apply ranges whose indexes arrive as numeric strings

import { strict as assert } from "node:assert";

import { rApply } from "../dist/ranges-apply.esm.js";

assert.equal(rApply("abcdef", [["1", "3", "X"]]), "aXdef");
