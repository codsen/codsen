// avanotonly

import test from "ava";
import traverse1 from "../dist/ast-monkey-traverse.umd";
import traverse2 from "../dist/ast-monkey-traverse.cjs";

const input = {
  a: "a",
  b: "b",
  c: "c"
};
const intended = {
  b: "b",
  c: "c"
};

test("UMD build works fine", t => {
  const actual = traverse1(Object.assign({}, input), (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (current === "a") {
      return NaN;
    }
    return current;
  });
  t.deepEqual(actual, intended);
});

test("CJS build works fine", t => {
  const actual = traverse2(Object.assign({}, input), (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (current === "a") {
      return NaN;
    }
    return current;
  });
  t.deepEqual(actual, intended);
});
