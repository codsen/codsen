const t = require("tap");
const c1 = require("../dist/string-collapse-white-space.umd");

t.test("UMD build works fine", t => {
  t.equal(c1("\ta b\t", { trimEnd: false }), "a b\t");
  t.end();
});
