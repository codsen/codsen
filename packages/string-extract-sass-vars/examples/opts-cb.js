/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import extractVars from "../dist/string-extract-sass-vars.esm.js";
// import "color-shorthand-hex-to-six-digit" to convert three-digit colour hex
// codes to six-digit:
import conv from "../../color-shorthand-hex-to-six-digit";

assert.deepEqual(
  extractVars("$blue: #ccc;", {
    throwIfEmpty: true,
    cb: (val) => conv(val), // converts hex codes only, bypasses the rest
  }),
  { blue: "#cccccc" }
);
