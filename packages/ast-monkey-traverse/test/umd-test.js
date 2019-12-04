const t = require("tap");
const traverse1 = require("../dist/ast-monkey-traverse.umd");

const input = {
  a: "a",
  b: "b",
  c: "c"
};
const intended = {
  b: "b",
  c: "c"
};

t.test("UMD build works fine", t => {
  const actual = traverse1(Object.assign({}, input), (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (current === "a") {
      return NaN;
    }
    return current;
  });
  t.same(actual, intended);
  t.end();
});
