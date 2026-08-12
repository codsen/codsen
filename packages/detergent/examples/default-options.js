// Inspect the exported default options

import { strict as assert } from "node:assert";

import { opts } from "../dist/detergent.esm.js";

assert.equal(opts.stripHtml, true);
assert.equal(opts.convertEntities, true);
assert.equal(opts.removeWidows, true);
assert.equal(opts.eol, "lf");
