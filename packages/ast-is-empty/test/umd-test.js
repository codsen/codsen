const t = require("tap");
const isEmpty1 = require("../dist/ast-is-empty.umd");

const source = [
  {
    a: [""],
    b: { c: ["", "", { d: [""] }] }
  }
];

t.test("UMD build works fine", t => {
  t.ok(isEmpty1(source));
  t.end();
});
