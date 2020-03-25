const t = require("tap");
const r1 = require("../dist/ranges-apply.umd");

const str = "delete me bbb and me too ccc";
const ranges = [
  [0, 10],
  [14, 25],
];
const res = "bbb ccc";

t.test("UMD build works fine", (t) => {
  t.same(r1(str, ranges), res);
  t.end();
});
