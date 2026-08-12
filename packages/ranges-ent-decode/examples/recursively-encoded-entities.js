// Decode entities that were encoded more than once

import { strict as assert } from "node:assert";

import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

assert.deepEqual(rEntDecode("a &amp;amp;pound; b"), [[2, 17, "£"]]);
