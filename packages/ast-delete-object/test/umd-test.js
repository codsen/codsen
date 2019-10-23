// avanotonly

import test from "ava";
import del1 from "../dist/ast-delete-object.umd";
import del2 from "../dist/ast-delete-object.cjs";

const source = [
  "elem1",
  {
    key2: "val2",
    key3: "val3",
    key4: "val4"
  },
  "elem4"
];
const target = {
  key2: "val2",
  key3: "val3"
};
const opts = { matchKeysStrictly: false, hungryForWhitespace: false };
const res = ["elem1", "elem4"];

test("UMD build works fine", t => {
  t.deepEqual(del1(source, target, opts), res);
});

test("CJS build works fine", t => {
  t.deepEqual(del2(source, target, opts), res);
});
