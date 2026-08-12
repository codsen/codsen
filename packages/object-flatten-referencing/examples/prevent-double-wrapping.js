// Keep values that already contain the wrapping markers

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { title: "%%_Example_%%" },
    { title: "Reference" },
    { preventDoubleWrapping: true },
  ),
  { title: "%%_Example_%%" },
);
