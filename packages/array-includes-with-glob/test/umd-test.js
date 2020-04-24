import tap from "tap";
import i1 from "../dist/array-includes-with-glob.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(
    i1("something", ["*thing", "zzz"], { arrayVsArrayAllMustBeFound: "all" }),
    false
  );
  t.end();
});
