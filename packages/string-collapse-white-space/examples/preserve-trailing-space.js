// Collapse but preserve one trailing space

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(collapse("value   ", { trimEnd: false }).result, "value ");
