import tap from "tap";
import { checkTypesMini } from "../dist/check-types-mini.umd";

const obj1 = {
  option1: "setting1",
  option2: "setting2",
  option3: false,
};

const obj2 = {
  option1: "setting1",
  option2: false,
  option3: false,
};

const opts = {
  msg: 1,
  optsVarName: "zzz",
};

tap.test("UMD build works fine", (t) => {
  t.throws(() => {
    checkTypesMini(obj1, obj2, opts);
  }, /zzz\.option2 was customised to "setting2" which is not boolean but string/g);

  t.end();
});
