const t = require("tap");
const c1 = require("../dist/ast-compare.umd");

const source1 = { a: "1", b: "2", c: "3" };
const source2 = { a: "1", b: "2" };

t.test("UMD build works fine", t => {
  t.ok(c1(source1, source2));
  t.end();
});
