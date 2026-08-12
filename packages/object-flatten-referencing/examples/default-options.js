// Inspect the exported flattening defaults

import { strict as assert } from "node:assert";

import { defaults } from "../dist/object-flatten-referencing.esm.js";

assert.equal(defaults.wrapHeadsWith, "%%_");
assert.equal(defaults.wrapTailsWith, "_%%");
assert.equal(defaults.xhtml, true);
assert.equal(defaults.enforceStrictKeyset, true);
