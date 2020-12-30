import tap from "tap";
import { remSep } from "../dist/string-remove-thousand-separators.umd";

const source = "1'000'000.2";
const result = "1000000.20";

tap.test("UMD build works fine", (t) => {
  t.strictSame(remSep(source), result, "01");
  t.end();
});
