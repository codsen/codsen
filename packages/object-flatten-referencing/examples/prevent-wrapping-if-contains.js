// Leave templating statements unwrapped

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { statement: "{% if enabled %}" },
    { statement: "Reference" },
    {
      wrapHeadsWith: "{{ ",
      wrapTailsWith: " }}",
      preventWrappingIfContains: ["{%"],
    },
  ),
  { statement: "{% if enabled %}" },
);
