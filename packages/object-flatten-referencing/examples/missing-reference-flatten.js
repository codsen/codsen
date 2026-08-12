// Flatten input keys even when the reference has no matching key

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { title: "Example", extra: ["one", "two"] },
    { title: "Reference" },
    { whatToDoWhenReferenceIsMissing: 2 },
  ),
  { title: "%%_Example_%%", extra: "%%_one_%%<br />%%_two_%%" },
);
