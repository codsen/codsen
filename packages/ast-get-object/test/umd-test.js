const t = require("tap");
const get1 = require("../dist/ast-get-object.umd");

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

t.test("UMD build works fine", t => {
  t.same(get1(source, target), res);
  t.end();
});
