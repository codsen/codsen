import tap from "tap";
import { pull } from "../dist/array-pull-all-with-glob.umd";

const source = ["one", "two", "three"];
const target = ["something"];
const res = ["one", "two", "three"];

tap.test("UMD build works fine", (t) => {
  t.strictSame(pull(source, target), res, "01");
  t.end();
});
