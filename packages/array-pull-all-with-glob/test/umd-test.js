import tap from "tap";
import pull1 from "../dist/array-pull-all-with-glob.umd";

const source = ["one", "two", "three"];
const target = ["something"];
const res = ["one", "two", "three"];

tap.test("UMD build works fine", (t) => {
  t.same(pull1(source, target), res, "01");
  t.end();
});
