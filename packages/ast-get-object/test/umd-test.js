// avanotonly

import test from "ava";
import get1 from "../dist/ast-get-object.umd";
import get2 from "../dist/ast-get-object.cjs";

const source = [
  {
    tag: "meta",
    content: "UTF-8",
    something: "else"
  },
  {
    tag: "title",
    attrs: "Text of the title"
  }
];
const target = {
  tag: "meta"
};
const res = [
  {
    tag: "meta",
    content: "UTF-8",
    something: "else"
  }
];

test("UMD build works fine", t => {
  t.deepEqual(get1(source, target), res);
});

test("CJS build works fine", t => {
  t.deepEqual(get2(source, target), res);
});
