import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

assert.equal(
  compare(
    { dataPrimary: 1, dataSecondary: 2, title: "Example" },
    { "data*": 999 },
    { useWildcards: true },
  ),
  true,
);
