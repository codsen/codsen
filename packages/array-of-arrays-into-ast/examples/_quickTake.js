// Quick Take

import { strict as assert } from "assert";
import { generateAst } from "../dist/array-of-arrays-into-ast.esm.js";

assert.deepEqual(generateAst([[1, 2, 3], [1, 2], [5]]), {
  1: [
    {
      2: [
        {
          3: [null],
        },
        null,
      ],
    },
  ],
  5: [null],
});
