import tap from "tap";
import c1 from "../dist/string-collapse-white-space.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(c1("\ta b\t", { trimEnd: false }), "a b\t");
  t.end();
});
