const t = require("tap");
const splitEasy1 = require("../dist/csv-split-easy.umd");

const input = ",,\na,b,c";
const result = [["a", "b", "c"]];

t.test("UMD build works fine", t => {
  t.same(splitEasy1(input), result);
  t.end();
});
