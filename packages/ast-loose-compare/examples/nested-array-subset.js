// Compare objects nested inside arrays as subsets

import { strict as assert } from "node:assert";

import { looseCompare } from "../dist/ast-loose-compare.esm.js";

assert.equal(
  looseCompare(
    [{ type: "link", url: "/docs", title: "Documentation" }],
    [{ type: "link", url: "/docs" }],
  ),
  true,
);
