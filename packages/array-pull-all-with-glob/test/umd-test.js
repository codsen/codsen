const t = require("tap");
const pull1 = require("../dist/array-pull-all-with-glob.umd");

const source = ["one", "two", "three"];
const target = ["something"];
const res = ["one", "two", "three"];

t.test("UMD build works fine", (t) => {
  t.same(pull1(source, target), res);
  t.end();
});
