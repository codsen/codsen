import tap from "tap";
import splitEasy1 from "../dist/csv-split-easy.umd";

const input = ",,\na,b,c";
const result = [["a", "b", "c"]];

tap.test("UMD build works fine", (t) => {
  t.same(splitEasy1(input), result);
  t.end();
});
