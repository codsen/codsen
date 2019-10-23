// avanotonly

import test from "ava";
import strip1 from "../dist/string-strip-html.umd";
import strip2 from "../dist/string-strip-html.cjs";

const source = "a<custom-tag /></ custom-tag>< /custom-tag>b";
const res = "a b";

test("UMD build works fine", t => {
  t.deepEqual(strip1(source), res);
});

test("CJS build works fine", t => {
  t.deepEqual(strip2(source), res);
});
