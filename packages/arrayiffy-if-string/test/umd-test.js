// avanotonly

import test from "ava";
import a1 from "../dist/arrayiffy-if-string.umd";
import a2 from "../dist/arrayiffy-if-string.cjs";

const source = "aaa";
const res = ["aaa"];

test("UMD build works fine", t => {
  t.deepEqual(a1(source), res);
});

test("CJS build works fine", t => {
  t.deepEqual(a2(source), res);
});
