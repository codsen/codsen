// Repair an alt attribute that has no value

import { strict as assert } from "node:assert";

import { alts } from "../dist/html-img-alt.esm.js";

assert.equal(alts("<img alt=>"), '<img alt="" >');
