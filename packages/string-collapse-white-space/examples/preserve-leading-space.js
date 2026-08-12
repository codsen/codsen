// Collapse but preserve one leading space

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(collapse("   value", { trimStart: false }).result, " value");
