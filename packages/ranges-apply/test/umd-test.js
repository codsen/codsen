// avanotonly

import test from "ava";
import r1 from "../dist/ranges-apply.umd";
import r2 from "../dist/ranges-apply.cjs";

const str = "delete me bbb and me too ccc";
const ranges = [[0, 10], [14, 25]];
const res = "bbb ccc";

test("UMD build works fine", t => {
  t.deepEqual(r1(str, ranges), res);
});

test("CJS build works fine", t => {
  t.deepEqual(r2(str, ranges), res);
});
