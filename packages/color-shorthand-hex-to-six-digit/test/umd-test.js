const t = require("tap");
const c1 = require("../dist/color-shorthand-hex-to-six-digit.umd");

const input = "aaaa #ccc zzzz\n\t\t\t#000.";
const result = "aaaa #cccccc zzzz\n\t\t\t#000000.";

t.test("UMD build works fine", t => {
  t.same(c1(input), result);
  t.end();
});
