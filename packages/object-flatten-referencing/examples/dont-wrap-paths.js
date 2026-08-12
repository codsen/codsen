// Skip wrapping only at an exact nested path

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { header: { title: "One" }, footer: { title: "Two" } },
    { header: { title: "" }, footer: { title: "" } },
    { dontWrapPaths: ["header.title"] },
  ),
  {
    header: { title: "One" },
    footer: { title: "%%_Two_%%" },
  },
);
