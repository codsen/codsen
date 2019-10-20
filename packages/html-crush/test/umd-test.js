// avanotonly

import test from "ava";
import {
  crush as crush1,
  defaults as defaults1,
  version as version1
} from "../dist/html-crush.umd";
import {
  crush as crush2,
  defaults as defaults2,
  version as version2
} from "../dist/html-crush.cjs";

test("UMD build works fine", t => {
  t.is(crush1("<div>   <div>").result, "<div> <div>");
  t.regex(version1, /\d+\.\d+\.\d+/);
  t.truthy(Object.keys(defaults1).length);
});

test("CJS build works fine", t => {
  t.is(crush2("<div>   <div>").result, "<div> <div>");
  t.regex(version2, /\d+\.\d+\.\d+/);
  t.truthy(Object.keys(defaults2).length);
});
