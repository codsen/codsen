// Collapse strings containing only whitespace

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

assert.equal(collWhitespace("    "), " ");
assert.equal(collWhitespace("  \n\n  "), "\n");
assert.equal(collWhitespace("  \n\n  ", 2), "\n\n");
