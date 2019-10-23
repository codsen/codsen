// avanotonly

import test from "ava";
import c1 from "../dist/ast-compare.umd";
import c2 from "../dist/ast-compare.cjs";

const source1 = { a: "1", b: "2", c: "3" };
const source2 = { a: "1", b: "2" };

test("UMD build works fine", t => {
  t.true(c1(source1, source2));
});

test("CJS build works fine", t => {
  t.true(c2(source1, source2));
});
