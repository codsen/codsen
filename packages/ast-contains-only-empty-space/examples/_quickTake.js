/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import containsOnlyEmptySpace from "../dist/ast-contains-only-empty-space.esm.js";

assert.equal(
  containsOnlyEmptySpace({
    a: [
      {
        x: {
          y: [
            {
              z: ["\n"],
            },
          ],
        },
      },
    ],
    b: ["\t\t\t  "],
    c: ["\n \n\n"],
    d: ["\t   "],
  }),
  true
);
