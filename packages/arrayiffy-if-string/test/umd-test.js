import tap from "tap";
import a1 from "../dist/arrayiffy-if-string.umd";

const source = "aaa";
const res = ["aaa"];

tap.test("UMD build works fine", (t) => {
  t.strictSame(a1(source), res, "01");
  t.end();
});
