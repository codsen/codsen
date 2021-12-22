// Quick Take

import { strict as assert } from "assert";

import { getObj } from "../dist/ast-get-object.esm.js";

// get - two input arguments
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
    }
  ),
  [
    {
      tag: "meta",
      content: "UTF-8",
      something: "else",
    },
  ]
);

// set - three input arguments
assert.deepEqual(
  getObj(
    [
      {
        tag: ["two", "values"],
        content: "UTF-8",
        something: "else",
      },
      {
        tag: "title",
        attrs: "Text of the title",
      },
    ],
    {
      tag: ["two", "values"],
    },
    [
      {
        tag: ["three", "values", "here"],
        content: "UTF-8",
        something: "else",
      },
    ]
  ),
  [
    {
      tag: ["three", "values", "here"], // <--- got updated
      content: "UTF-8",
      something: "else",
    },
    {
      tag: "title",
      attrs: "Text of the title",
    },
  ]
);
