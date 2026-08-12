// Decode healthy named entities

import { strict as assert } from "node:assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

assert.deepEqual(fixEnt("Price: &pound;10", { decode: true }), [[7, 14, "£"]]);
