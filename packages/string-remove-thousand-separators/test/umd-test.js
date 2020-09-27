import tap from "tap";
import r1 from "../dist/string-remove-thousand-separators.umd";

const source = "1'000'000.2";
const result = "1000000.20";

tap.test("UMD build works fine", (t) => {
  t.strictSame(r1(source), result, "01");
  t.end();
});
