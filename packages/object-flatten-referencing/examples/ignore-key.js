// Leave an ignored key and its nested value unchanged

import { strict as assert } from "node:assert";

import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenReferencing(
    { raw: ["one", "two"], title: "Example" },
    { raw: "Reference", title: "Reference" },
    { ignore: ["raw"] },
  ),
  { raw: ["one", "two"], title: "%%_Example_%%" },
);
