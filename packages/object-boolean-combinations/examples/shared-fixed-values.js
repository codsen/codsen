// Fixed nested values are shared between generated rows

import { strict as assert } from "node:assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

const settings = { mode: "safe" };
const rows = combinations({ cache: false, settings: null }, { settings });

assert.notEqual(rows[0].settings, settings);
assert.equal(rows[0].settings, rows[1].settings);

rows[0].settings.mode = "strict";
assert.equal(rows[1].settings.mode, "strict");
