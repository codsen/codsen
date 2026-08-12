// Decode decimal and hexadecimal numeric entities

import { strict as assert } from "node:assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

assert.deepEqual(fixEnt("&#163; and &#xA3;", { decode: true }), [
  [0, 6, "£"],
  [11, 17, "£"],
]);
