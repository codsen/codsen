// Wrap an already wrapped value when prevention is disabled

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { title: "%%_Example_%%" },
    { title: "Reference" },
    { preventDoubleWrapping: false },
  ),
  { title: "%%_%%_Example_%%_%%" },
);
