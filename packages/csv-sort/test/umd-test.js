import tap from "tap";
import csvSort1 from "../dist/csv-sort.umd";

tap.test("UMD build works fine", (t) => {
  t.strictSame(csvSort1(""), [[""]], "01");
  t.end();
});
