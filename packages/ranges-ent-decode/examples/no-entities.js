// Return null when no replacement ranges are needed

import { strict as assert } from "node:assert";

import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

assert.equal(rEntDecode("plain text"), null);
assert.equal(rEntDecode(""), null);
