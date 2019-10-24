// avanotonly

import test from "ava";
import splitEasy1 from "../dist/csv-split-easy.umd";
import splitEasy2 from "../dist/csv-split-easy.cjs";

const input = ",,\na,b,c";
const result = [["a", "b", "c"]];

test("UMD build works fine", t => {
  t.deepEqual(splitEasy1(input), result);
});

test("CJS build works fine", t => {
  t.deepEqual(splitEasy2(input), result);
});
