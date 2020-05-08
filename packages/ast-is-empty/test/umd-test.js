import tap from "tap";
import isEmpty1 from "../dist/ast-is-empty.umd";

const source = [
  {
    a: [""],
    b: { c: ["", "", { d: [""] }] },
  },
];

tap.test("UMD build works fine", (t) => {
  t.ok(isEmpty1(source), "01");
  t.end();
});
