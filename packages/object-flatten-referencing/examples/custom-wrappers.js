// Wrap flattened string values with custom markers

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { title: "Example" },
    { title: "Reference" },
    { wrapHeadsWith: "{{ ", wrapTailsWith: " }}" },
  ),
  { title: "{{ Example }}" },
);
