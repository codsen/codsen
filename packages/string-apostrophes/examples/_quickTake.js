// Quick Take

import { strict as assert } from "node:assert";

import { convertAll, convertOne } from "../dist/string-apostrophes.esm.js";

assert.deepEqual(
  convertAll("In the '60s, rock 'n' roll", {
    convertApostrophes: true,
    convertEntities: false,
  }),
  {
    result: "In the ’60s, rock ’n’ roll",
    ranges: [
      [7, 8, "’"],
      [18, 21, "’n’"],
    ],
  },
);

assert.deepEqual(
  convertOne("test's", {
    from: 4,
    to: 5,
    convertApostrophes: true,
    convertEntities: true,
  }),
  [[4, 5, "&rsquo;"]],
);
