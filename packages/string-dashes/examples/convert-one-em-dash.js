// Convert one em dash into an entity

import { strict as assert } from "node:assert";

import { convertOne } from "../dist/string-dashes.esm.js";

assert.deepEqual(
  convertOne("Dashes come in two sizes - the en dash and the em dash.", {
    from: 25,
    convertDashes: true,
    convertEntities: true,
  }),
  [[25, 26, "&mdash;"]],
);
