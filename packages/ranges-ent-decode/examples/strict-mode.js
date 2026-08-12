// Reject a malformed entity in strict mode

import { strict as assert } from "node:assert";

import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

assert.throws(() => rEntDecode("foo&ampbar", { strict: true }), /Parse error/u);
