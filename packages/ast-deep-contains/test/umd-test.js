import tap from "tap";
import deepContains1 from "../dist/ast-deep-contains.umd";

tap.test("UMD build works fine", (t) => {
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

  t.same(
    gathered,
    [
      ["1", "1"],
      ["2", "2"],
    ],
    "01.01"
  );
  t.same(errors, [], "01.02");
  t.end();
});
