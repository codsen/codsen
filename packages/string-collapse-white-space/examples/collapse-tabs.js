// Collapse a run containing tabs

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(collapse("   \t\t\t   aaa   \t\t\t   ").result, "aaa");
