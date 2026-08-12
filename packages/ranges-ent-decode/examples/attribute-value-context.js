// Avoid decoding an ambiguous entity inside an attribute value

import { strict as assert } from "node:assert";

import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

assert.equal(rEntDecode("foo&ampbar", { isAttributeValue: true }), null);
assert.deepEqual(rEntDecode("foo&amp;bar", { isAttributeValue: true }), [
  [3, 8, "&"],
]);
