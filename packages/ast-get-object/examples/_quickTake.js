// Quick Take

import { strict as assert } from "node:assert";

import { getObj } from "../dist/ast-get-object.esm.js";

// Get matching objects using two input arguments
assert.deepEqual(
  getObj(
    [
      // <- search in this, the first argument, in this case, a nested array
      {
        tag: "meta",
        content: "UTF-8",
        something: "else",
      },
      {
        tag: "title",
        attrs: "Text of the title",
      },
    ],
    {
      // <- search for this object, the second argument
      tag: "meta",
    },
  ),
  [
    {
      tag: "meta",
      content: "UTF-8",
      something: "else",
    },
  ],
);
