// avanotonly

import test from "ava";
import sortByCol1 from "../dist/array-of-arrays-sort-by-col.umd";
import sortByCol2 from "../dist/array-of-arrays-sort-by-col.cjs";

const source = [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]];
const idx = "1";
const res = [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]];

test("UMD build works fine", t => {
  t.deepEqual(sortByCol1(source, idx), res);
});

test("CJS build works fine", t => {
  t.deepEqual(sortByCol2(source, idx), res);
});
