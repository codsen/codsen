// Convert number-only Sass values to JavaScript numbers

import { strict as assert } from "node:assert";

import { extractVars } from "../dist/string-extract-sass-vars.esm.js";

assert.deepEqual(extractVars("$columns: 12;\n$offset: -1.5;"), {
  columns: 12,
  offset: -1.5,
});
