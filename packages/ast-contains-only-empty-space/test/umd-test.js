import tap from "tap";
import empty1 from "../dist/ast-contains-only-empty-space.umd";

const source = [
  "   ",
  {
    key2: "   ",
    key3: "   \n   ",
    key4: "   \t   ",
  },
  "\n\n\n\n\n\n   \t   ",
];

tap.test("UMD build works fine", (t) => {
  t.ok(empty1(source));
  t.end();
});
