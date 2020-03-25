const t = require("tap");
const Ranges1 = require("../dist/ranges-push.umd");

t.test("UMD build works fine", (t) => {
  const ranges = new Ranges1();
  ranges.push(1, 2);
  ranges.push(3, 4);
  t.same(ranges.current(), [
    [1, 2],
    [3, 4],
  ]);
  t.end();
});
