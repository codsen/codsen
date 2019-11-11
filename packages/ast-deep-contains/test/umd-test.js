// avanotonly

import test from "ava";
import deepContains1 from "../dist/ast-deep-contains.umd";
import deepContains2 from "../dist/ast-deep-contains.cjs";

test("UMD build works fine", t => {
  const gathered = [];
  const errors = [];

  deepContains1(
    { a: "1", b: "2", c: "3" },
    { a: "1", b: "2" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(gathered, [
    ["1", "1"],
    ["2", "2"]
  ]);
  t.deepEqual(errors, []);
});

test("CJS build works fine", t => {
  const gathered = [];
  const errors = [];

  deepContains2(
    { a: "1", b: "2", c: "3" },
    { a: "1", b: "2" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(gathered, [
    ["1", "1"],
    ["2", "2"]
  ]);
  t.deepEqual(errors, []);
});
