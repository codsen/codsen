import tap from "tap";
import { collapse } from "../dist/string-collapse-white-space.umd";

tap.test("UMD build works fine", (t) => {
  t.strictSame(
    collapse("\ta b\t", { trimEnd: false }),
    { result: "a b\t", ranges: [[0, 1]] },
    "01"
  );
  t.end();
});
