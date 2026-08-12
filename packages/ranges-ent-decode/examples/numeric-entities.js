// Decode decimal and hexadecimal character references

import { strict as assert } from "node:assert";

import { rEntDecode } from "../dist/ranges-ent-decode.esm.js";

assert.deepEqual(rEntDecode("A: &#65;, B: &#x42;"), [
  [3, 8, "A"],
  [13, 19, "B"],
]);
