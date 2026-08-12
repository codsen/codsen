// Skip wrapping for keys that match a glob

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { title: "Example", rawSlug: "example" },
    { title: "Reference", rawSlug: "reference" },
    { dontWrapKeys: ["raw*"] },
  ),
  { title: "%%_Example_%%", rawSlug: "example" },
);
