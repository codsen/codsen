// Use HTML rather than XHTML line-break syntax

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { lines: ["one", "two"] },
    { lines: "Reference" },
    { xhtml: false },
  ),
  { lines: "%%_one_%%<br>%%_two_%%" },
);
