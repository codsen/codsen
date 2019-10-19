// avanotonly

import test from "ava";
import {
  det as det1,
  opts as exportedOptsObj1,
  version as version1
} from "../dist/detergent.umd";
import {
  det as det2,
  opts as exportedOptsObj2,
  version as version2
} from "../dist/detergent.cjs";

test("UMD build works fine", t => {
  t.is(det1("").res, "");
  t.is(det1("£").res, "&pound;");
  t.regex(version1, /\d+\.\d+\.\d+/);
  t.truthy(Object.keys(exportedOptsObj1).length);
});

test("CJS build works fine", t => {
  t.is(det2("").res, "");
  t.is(det2("£").res, "&pound;");
  t.regex(version2, /\d+\.\d+\.\d+/);
  t.truthy(Object.keys(exportedOptsObj2).length);
});
