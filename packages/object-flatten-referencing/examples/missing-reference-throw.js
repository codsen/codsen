// Throw when an input key is absent from the reference

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.throws(
  () =>
    flattenReferencing(
      { title: "Example", extra: "unexpected" },
      { title: "Reference" },
      { whatToDoWhenReferenceIsMissing: 1 },
    ),
  /THROW_ID_04/u,
);
