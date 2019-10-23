// avanotonly

import test from "ava";
import Ranges1 from "../dist/ranges-push.umd";
import Ranges2 from "../dist/ranges-push.cjs";

test("UMD build works fine", t => {
  const ranges = new Ranges1();
  ranges.push(1, 2);
  ranges.push(3, 4);
  t.deepEqual(ranges.current(), [[1, 2], [3, 4]]);
});

test("CJS build works fine", t => {
  const ranges = new Ranges2();
  ranges.push(1, 2);
  ranges.push(3, 4);
  t.deepEqual(ranges.current(), [[1, 2], [3, 4]]);
});
