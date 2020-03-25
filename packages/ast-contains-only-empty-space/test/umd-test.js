const t = require("tap");
const empty1 = require("../dist/ast-contains-only-empty-space.umd");

const source = [
  "   ",
  {
    key2: "   ",
    key3: "   \n   ",
    key4: "   \t   ",
  },
  "\n\n\n\n\n\n   \t   ",
];

t.test("UMD build works fine", (t) => {
  t.ok(empty1(source));
  t.end();
});
