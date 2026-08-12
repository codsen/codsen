// Disable wrapping across the complete input tree

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { title: "Example" },
    { title: "Reference" },
    { wrapGlobalFlipSwitch: false },
  ),
  { title: "Example" },
);
