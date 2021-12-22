// Convert 3-digit color hex codes to 6-digit

import { strict as assert } from "assert";
import { conv } from "color-shorthand-hex-to-six-digit";

import { extractVars } from "../dist/string-extract-sass-vars.esm.js";
// import "color-shorthand-hex-to-six-digit" to convert three-digit colour hex
// codes to six-digit:

assert.deepEqual(
  extractVars("$blue: #2af;", {
    throwIfEmpty: true,
    cb: (val) => conv(val), // converts hex codes only, bypasses the rest
  }),
  { blue: "#22aaff" }
);
