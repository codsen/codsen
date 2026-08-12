// Quick Take

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-dashes.esm.js";

assert.deepEqual(
  convertAll("Dashes come in two sizes - the en dash and the em dash.", {
    convertDashes: true,
    convertEntities: true,
  }),
  {
    result: "Dashes come in two sizes &mdash; the en dash and the em dash.",
    ranges: [[25, 26, "&mdash;"]],
  },
);
