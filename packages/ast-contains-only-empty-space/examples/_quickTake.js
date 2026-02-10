// Quick Take

import { strict as assert } from "node:assert";

import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

assert.equal(
  empty({
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
  true,
);
