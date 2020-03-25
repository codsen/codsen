const t = require("tap");
const deepContains1 = require("../dist/ast-deep-contains.umd");

t.test("UMD build works fine", (t) => {
  const gathered = [];
  const errors = [];

  deepContains1(
    { a: "1", b: "2", c: "3" },
    { a: "1", b: "2" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    }
  );

  t.same(gathered, [
    ["1", "1"],
    ["2", "2"],
  ]);
  t.same(errors, []);
  t.end();
});
