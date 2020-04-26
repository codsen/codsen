import tap from "tap";
import check1 from "../dist/check-types-mini.umd";

const obj1 = {
  option1: "setting1",
  option2: "setting2",
  option3: false,
};

const obj2 = {
  option1: "setting1",
  option2: "setting2",
  option3: false,
};

const opts = {
  msg: 1,
  optsVarName: "zzz",
};

tap.test("UMD build works fine", (t) => {
  const err = t.throws(() => {
    check1(obj1, obj2, opts);
  });
  t.match(err.message, /opts\.msg/g);
  t.end();
});
