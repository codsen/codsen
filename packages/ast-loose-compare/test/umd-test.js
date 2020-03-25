const t = require("tap");
const compare1 = require("../dist/ast-loose-compare.umd");

const source = {
  a: "a",
  b: {
    c: "c",
  },
};

const target = {
  a: "a",
  b: undefined,
};

t.test("UMD build works fine", (t) => {
  t.false(compare1(source, target));
  t.end();
});
