import tap from "tap";
import c1 from "../dist/color-shorthand-hex-to-six-digit.umd";

const input = "aaaa #ccc zzzz\n\t\t\t#000.";
const result = "aaaa #cccccc zzzz\n\t\t\t#000000.";

tap.test("UMD build works fine", (t) => {
  t.same(c1(input), result);
  t.end();
});
