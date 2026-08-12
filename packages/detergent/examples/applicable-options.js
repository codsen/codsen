// Discover which cleanup rules apply to an input

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

const { applicableOpts } = det("Cost £5");

assert.equal(applicableOpts.convertEntities, true);
assert.equal(applicableOpts.stripHtml, false);
assert.equal(applicableOpts.convertDashes, false);
