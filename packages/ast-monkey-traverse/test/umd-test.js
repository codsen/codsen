import tap from "tap";
import traverse1 from "../dist/ast-monkey-traverse.umd";

const input = {
  a: "a",
  b: "b",
  c: "c",
};
const intended = {
  b: "b",
  c: "c",
};

tap.test("UMD build works fine", (t) => {
  const actual = traverse1({ ...input }, (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (current === "a") {
      return NaN;
    }
    return current;
  });
  t.same(actual, intended);
  t.end();
});
