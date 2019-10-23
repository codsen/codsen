// avanotonly

import test from "ava";
import i1 from "../dist/array-includes-with-glob.umd";
import i2 from "../dist/array-includes-with-glob.cjs";

test("UMD build works fine", t => {
  t.is(
    i1("something", ["*thing", "zzz"], { arrayVsArrayAllMustBeFound: "all" }),
    false
  );
});

test("CJS build works fine", t => {
  t.is(
    i2("something", ["*thing", "zzz"], { arrayVsArrayAllMustBeFound: "all" }),
    false
  );
});
