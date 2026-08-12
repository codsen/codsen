// Align generated declarations

import { strict as assert } from "node:assert";

import { genAtomic } from "../dist/generate-atomic-css.esm.js";

const source = ".m$$$ { margin: $$$px; } | 9 | 10";

assert.equal(
  genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false,
    pad: true,
  }).result,
  ".m9  { margin:  9px; }\n.m10 { margin: 10px; }\n",
);

assert.equal(
  genAtomic(source, {
    includeConfig: false,
    includeHeadsAndTails: false,
    pad: false,
  }).result,
  ".m9 { margin: 9px; }\n.m10 { margin: 10px; }\n",
);
