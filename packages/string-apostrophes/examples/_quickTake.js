// Quick Take

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

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
