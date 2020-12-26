import tap from "tap";
import { rApply } from "../dist/ranges-apply.umd";

const str = "delete me bbb and me too ccc";
const ranges = [
  [0, 10],
  [14, 25],
];
const res = "bbb ccc";

tap.test("UMD build works fine", (t) => {
  t.strictSame(rApply(str, ranges), res, "01");
  t.end();
});
