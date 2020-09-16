/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import { convertOne, convertAll } from "../dist/string-apostrophes.esm.js";

assert.deepEqual(
  convertAll(`In the '60s, rock 'n' roll`, {
    convertApostrophes: 1,
    convertEntities: 0,
  }),
  {
    result: "In the ’60s, rock ’n ’ roll",
    ranges: [
      [7, 8, "’"],
      [18, 19, "’"],
      [20, 21, "’"],
    ],
  }
);

assert.deepEqual(
  convertOne(`test's`, {
    from: 4,
    to: 5,
    convertApostrophes: true,
    convertEntities: false,
  }),
  [[4, 5, "&rsquo;"]]
);
