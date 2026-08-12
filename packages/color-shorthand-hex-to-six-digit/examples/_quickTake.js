// Quick Take

import { strict as assert } from "node:assert";

import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

// converts shorthand hex color codes within strings (imagine that could be
// email template source code):
assert.equal(
  conv("aaaa #f0c zzzz\n\t\t\t#fc0"),
  "aaaa #ff00cc zzzz\n\t\t\t#ffcc00",
);
