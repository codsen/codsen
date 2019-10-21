// avanotonly

import test from "ava";
import groupStr1 from "../dist/array-group-str-omit-num-char.umd";
import groupStr2 from "../dist/array-group-str-omit-num-char.cjs";

test("UMD build works fine", t => {
  t.deepEqual(groupStr1(["aaa", "bbb"], true), {
    aaa: 1,
    bbb: 1
  });
});

test("CJS build works fine", t => {
  t.deepEqual(groupStr2(["aaa", "bbb"], true), {
    aaa: 1,
    bbb: 1
  });
});
