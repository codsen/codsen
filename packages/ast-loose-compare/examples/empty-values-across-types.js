// Treat structurally different empty values as equivalent

import { strict as assert } from "node:assert";

import { looseCompare } from "../dist/ast-loose-compare.esm.js";

assert.equal(looseCompare([], {}), true);
