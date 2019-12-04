const t = require("tap");
const r1 = require("../dist/string-remove-thousand-separators.umd");

const source = "1'000'000.2";
const result = "1000000.20";

t.test("UMD build works fine", t => {
  t.same(r1(source), result);
  t.end();
});
