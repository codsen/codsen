// Access canonical marker names

import { strict as assert } from "node:assert";

import { headsAndTails } from "../dist/generate-atomic-css.esm.js";

assert.equal(headsAndTails.CONFIGHEAD, "GENERATE-ATOMIC-CSS-CONFIG-STARTS");
assert.equal(headsAndTails.CONTENTTAIL, "GENERATE-ATOMIC-CSS-CONTENT-ENDS");
