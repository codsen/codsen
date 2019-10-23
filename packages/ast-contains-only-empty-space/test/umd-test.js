// avanotonly

import test from "ava";
import empty1 from "../dist/ast-contains-only-empty-space.umd";
import empty2 from "../dist/ast-contains-only-empty-space.cjs";

const source = [
  "   ",
  {
    key2: "   ",
    key3: "   \n   ",
    key4: "   \t   "
  },
  "\n\n\n\n\n\n   \t   "
];

test("UMD build works fine", t => {
  t.true(empty1(source));
});

test("CJS build works fine", t => {
  t.true(empty2(source));
});
