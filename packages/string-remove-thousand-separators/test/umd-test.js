// avanotonly

import test from "ava";
import r1 from "../dist/string-remove-thousand-separators.umd";
import r2 from "../dist/string-remove-thousand-separators.cjs";

const source = "1'000'000.2";
const result = "1000000.20";

test("UMD build works fine", t => {
  t.deepEqual(r1(source), result);
});

test("CJS build works fine", t => {
  t.deepEqual(r2(source), result);
});
