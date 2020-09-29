import tap from "tap";
import c1 from "../dist/string-collapse-white-space.umd";

tap.test("UMD build works fine", (t) => {
  t.strictSame(
    c1("\ta b\t", { trimEnd: false }),
    { result: "a b\t", ranges: [[0, 1]] },
    "01"
  );
  t.end();
});
