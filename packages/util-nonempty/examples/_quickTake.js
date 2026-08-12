// Quick Take

import { strict as assert } from "node:assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

assert.equal(nonEmpty("z"), true);
assert.equal(nonEmpty(""), false);
