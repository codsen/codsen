// avanotonly

import test from "ava";
import is1 from "../dist/is-html-tag-opening.umd";
import is2 from "../dist/is-html-tag-opening.cjs";

test("UMD build works fine", t => {
  t.true(is1("<a>", 0));
});

test("CJS build works fine", t => {
  t.true(is2("<a>", 0));
});
