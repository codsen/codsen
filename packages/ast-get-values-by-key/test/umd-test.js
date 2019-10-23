// avanotonly

import test from "ava";
import get1 from "../dist/ast-get-values-by-key.umd";
import get2 from "../dist/ast-get-values-by-key.cjs";

const source = [
  {
    tag: ["html1"],
    attrs: {
      lang: "en"
    },
    content: ["\n"]
  },
  {
    tag: { html2: "html2" },
    attrs: {
      lang: "en"
    },
    content: ["\n"]
  },
  {
    tag: "html3",
    attrs: {
      lang: "en"
    },
    content: ["\n"]
  }
];
const target = "tag";
const res = [
  { val: ["html1"], path: "0.tag" },
  { val: { html2: "html2" }, path: "1.tag" },
  { val: "html3", path: "2.tag" }
];

test("UMD build works fine", t => {
  t.deepEqual(get1(source, target), res);
});

test("CJS build works fine", t => {
  t.deepEqual(get2(source, target), res);
});
