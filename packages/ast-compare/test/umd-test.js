import tap from "tap";
import c1 from "../dist/ast-compare.umd";

const source1 = { a: "1", b: "2", c: "3" };
const source2 = { a: "1", b: "2" };

tap.test("UMD build works fine", (t) => {
  t.ok(c1(source1, source2), "01");
  t.end();
});
