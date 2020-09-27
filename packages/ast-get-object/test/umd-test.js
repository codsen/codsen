import tap from "tap";
import get1 from "../dist/ast-get-object.umd";

const source = [
  {
    tag: "meta",
    content: "UTF-8",
    something: "else",
  },
  {
    tag: "title",
    attrs: "Text of the title",
  },
];
const target = {
  tag: "meta",
};
const res = [
  {
    tag: "meta",
    content: "UTF-8",
    something: "else",
  },
];

tap.test("UMD build works fine", (t) => {
  t.strictSame(get1(source, target), res, "01");
  t.end();
});
