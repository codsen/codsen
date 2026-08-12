// Ignore variables inside both Sass comment styles

import { strict as assert } from "node:assert";

import { extractVars } from "../dist/string-extract-sass-vars.esm.js";

assert.deepEqual(
  extractVars(`// $disabled: red;
/* $also-disabled: blue; */
$enabled: green;`),
  { enabled: "green" },
);
