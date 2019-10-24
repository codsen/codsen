// avanotonly

import test from "ava";
import isEmpty1 from "../dist/ast-is-empty.umd";
import isEmpty2 from "../dist/ast-is-empty.cjs";

const source = [
  {
    a: [""],
    b: { c: ["", "", { d: [""] }] }
  }
];

test("UMD build works fine", t => {
  t.true(isEmpty1(source));
});

test("CJS build works fine", t => {
  t.true(isEmpty2(source));
});
