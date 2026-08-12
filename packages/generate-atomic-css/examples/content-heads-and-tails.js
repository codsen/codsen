// Wrap generated content in marker comments

import { strict as assert } from "node:assert";

import { genAtomic } from "../dist/generate-atomic-css.esm.js";

assert.equal(
  genAtomic(".m$$$ { margin: $$$px; } | 1 | 2", {
    includeConfig: false,
    includeHeadsAndTails: true,
    pad: false,
  }).result,
  `/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.m1 { margin: 1px; }
.m2 { margin: 2px; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`,
);
