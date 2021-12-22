/* eslint-disable no-unused-vars */
// Quick Take

import { strict as assert } from "assert";

import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "../dist/generate-atomic-css.esm.js";

assert.deepEqual(
  genAtomic(
    `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`,
    {
      includeConfig: false,
      includeHeadsAndTails: false,
    }
  ),
  {
    log: { count: 8 },
    result: `a

.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }

z
`,
  }
);
