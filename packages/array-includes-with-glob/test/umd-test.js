import t from "tap";
import i1 from "../dist/array-includes-with-glob.umd";

t.test("UMD build works fine", (t) => {
  t.equal(
    i1("something", ["*thing", "zzz"], { arrayVsArrayAllMustBeFound: "all" }),
    false
  );
  t.end();
});
