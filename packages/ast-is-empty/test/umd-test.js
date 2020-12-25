import tap from "tap";
import { isEmpty } from "../dist/ast-is-empty.umd";

const source = [
  {
    a: [""],
    b: { c: ["", "", { d: [""] }] },
  },
];

tap.test("UMD build works fine", (t) => {
  t.ok(isEmpty(source), "01");
  t.end();
});
