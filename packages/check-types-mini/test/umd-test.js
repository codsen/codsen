// avanotonly

import test from "ava";
import check1 from "../dist/check-types-mini.umd";
import check2 from "../dist/check-types-mini.cjs";

const obj1 = {
  option1: "setting1",
  option2: "setting2",
  option3: false
};

const obj2 = {
  option1: "setting1",
  option2: "setting2",
  option3: false
};

const opts = {
  msg: 1,
  optsVarName: "zzz"
};

test("UMD build works fine", t => {
  const err = t.throws(() => {
    check1(obj1, obj2, opts);
  });
  t.regex(err.message, /opts\.msg/g);
});

test("CJS build works fine", t => {
  const err = t.throws(() => {
    check2(obj1, obj2, opts);
  });
  t.regex(err.message, /opts\.msg/g);
});
