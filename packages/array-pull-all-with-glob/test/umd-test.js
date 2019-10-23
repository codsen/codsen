// avanotonly

import test from "ava";
import pull1 from "../dist/array-pull-all-with-glob.umd";
import pull2 from "../dist/array-pull-all-with-glob.cjs";

const source = ["one", "two", "three"];
const target = ["something"];
const res = ["one", "two", "three"];

test("UMD build works fine", t => {
  t.deepEqual(pull1(source, target), res);
});

test("CJS build works fine", t => {
  t.deepEqual(pull2(source, target), res);
});
