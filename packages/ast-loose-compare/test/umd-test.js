import tap from "tap";
import compare1 from "../dist/ast-loose-compare.umd";

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

tap.test("UMD build works fine", (t) => {
  t.false(compare1(source, target), "01");
  t.end();
});
