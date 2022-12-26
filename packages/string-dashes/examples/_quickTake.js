// Quick Take

import { strict as assert } from "assert";

import { convertOne, convertAll } from "../dist/string-dashes.esm.js";

assert.deepEqual(
  convertAll(`Dashes come in two sizes - the en dash and the em dash.`, {
    convertDashes: true,
    convertEntities: true,
  }),
  {
    result: "Dashes come in two sizes &mdash; the en dash and the em dash.",
    ranges: [[25, 26, "&mdash;"]],
  }
);

assert.deepEqual(
  convertOne(`Dashes come in two sizes - the en dash and the em dash.`, {
    from: 25,
    convertDashes: true,
    convertEntities: true,
  }),
  [[25, 26, "&mdash;"]]
);
