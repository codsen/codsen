// avanotonly

import test from "ava";
import c1 from "../dist/string-collapse-white-space.umd";
import c2 from "../dist/string-collapse-white-space.cjs";

test("UMD build works fine", t => {
  t.is(c1("\ta b\t", { trimEnd: false }), "a b\t");
});

test("CJS build works fine", t => {
  t.is(c2("\ta b\t", { trimEnd: false }), "a b\t");
});
