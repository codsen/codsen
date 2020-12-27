import tap from "tap";
import { Ranges } from "../dist/ranges-push.umd";

tap.test("UMD build works fine", (t) => {
  const ranges = new Ranges();
  ranges.push(1, 2);
  ranges.push(3, 4);
  t.strictSame(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "01"
  );
  t.end();
});
