// Leave an unmatched input key unchanged

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { title: "Example", extra: ["one", "two"] },
    { title: "Reference" },
    { whatToDoWhenReferenceIsMissing: 0 },
  ),
  { title: "%%_Example_%%", extra: ["one", "two"] },
);
