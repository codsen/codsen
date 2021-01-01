import tap from "tap";
import { splitEasy } from "../dist/csv-split-easy.umd";

const input = ",,\na,b,c";
const result = [["a", "b", "c"]];

tap.test("UMD build works fine", (t) => {
  t.strictSame(splitEasy(input), result, "01");
  t.end();
});
