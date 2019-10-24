// avanotonly

import test from "ava";
import { find as find1 } from "../dist/ast-monkey.umd";
import { find as find2 } from "../dist/ast-monkey.cjs";

const input = {
  a1: {
    b1: "c1"
  },
  a2: {
    b2: "c2"
  },
  z1: {
    x1: "y1"
  }
};
const intended = [
  {
    index: 1,
    key: "a1",
    val: {
      b1: "c1"
    },
    path: [1]
  },
  {
    index: 3,
    key: "a2",
    val: {
      b2: "c2"
    },
    path: [3]
  }
];

test("UMD build works fine", t => {
  t.deepEqual(find1(input, { key: "a*" }), intended);
});

test("CJS build works fine", t => {
  t.deepEqual(find2(input, { key: "a*" }), intended);
});
