const t = require("tap");
const a1 = require("../dist/arrayiffy-if-string.umd");

const source = "aaa";
const res = ["aaa"];

t.test("UMD build works fine", t => {
  t.same(a1(source), res);
  t.end();
});
