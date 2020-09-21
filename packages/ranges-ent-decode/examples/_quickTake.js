/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import decode from "../dist/ranges-ent-decode.esm.js";

// see codsen.com/ranges/
assert.deepEqual(decode("a &#x26; b &amp; c"), [
  [2, 8, "&"], // <--- that's Ranges notation, instructing to replace
  [11, 16, "&"],
]);
