// avanotonly

import test from "ava";
import csvSort1 from "../dist/csv-sort.umd";
import csvSort2 from "../dist/csv-sort.cjs";

test("UMD build works fine", t => {
  t.deepEqual(csvSort1(""), [[""]]);
});

test("CJS build works fine", t => {
  t.deepEqual(csvSort2(""), [[""]]);
});
