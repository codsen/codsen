// avanotonly

import test from "ava";
import compare1 from "../dist/ast-loose-compare.umd";
import compare2 from "../dist/ast-loose-compare.cjs";

const source = {
  a: "a",
  b: {
    c: "c"
  }
};

const target = {
  a: "a",
  b: undefined
};

test("UMD build works fine", t => {
  t.false(compare1(source, target));
});

test("CJS build works fine", t => {
  t.false(compare2(source, target));
});
