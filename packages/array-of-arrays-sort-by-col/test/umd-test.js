import tap from "tap";
import sortByCol1 from "../dist/array-of-arrays-sort-by-col.umd";

const source = [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]];
const idx = "1";
const res = [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]];

tap.test("UMD build works fine", (t) => {
  t.same(sortByCol1(source, idx), res);
  t.end();
});
