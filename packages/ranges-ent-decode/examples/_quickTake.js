// Quick Take

import { strict as assert } from "assert";

import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

// see codsen.com/ranges/
assert.deepEqual(rEntDecode("a &#x26; b &amp; c"), [
  [2, 8, "&"], // <--- that's Ranges notation, instructing to replace
  [11, 16, "&"],
]);
