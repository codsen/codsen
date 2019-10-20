// avanotonly

import test from "ava";
import {
  comb as comb1,
  defaults as defaults1,
  version as version1
} from "../dist/email-comb.umd";
import {
  comb as comb2,
  defaults as defaults2,
  version as version2
} from "../dist/email-comb.cjs";

test("UMD build works fine", t => {
  t.is(comb1("").result, "");
  t.regex(version1, /\d+\.\d+\.\d+/);
  t.truthy(Object.keys(defaults1).length);
});

test("CJS build works fine", t => {
  t.is(comb2("").result, "");
  t.regex(version2, /\d+\.\d+\.\d+/);
  t.truthy(Object.keys(defaults2).length);
});
