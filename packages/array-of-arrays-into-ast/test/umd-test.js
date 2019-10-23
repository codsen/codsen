// avanotonly

import test from "ava";
import a1 from "../dist/array-of-arrays-into-ast.umd";
import a2 from "../dist/array-of-arrays-into-ast.cjs";

const source = [[5], [1, 2, 3], [1, 2]];
const result = {
  1: [
    {
      2: [
        {
          3: [null]
        },
        null
      ]
    }
  ],
  5: [null]
};

test("UMD build works fine", t => {
  t.deepEqual(a1(source), result);
});

test("CJS build works fine", t => {
  t.deepEqual(a2(source), result);
});
