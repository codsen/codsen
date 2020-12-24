import tap from "tap";
import { compare } from "../dist/ast-compare.umd";

const source1 = { a: "1", b: "2", c: "3" };
const source2 = { a: "1", b: "2" };

tap.test("UMD build works fine", (t) => {
  t.ok(compare(source1, source2), "01");
  t.end();
});
