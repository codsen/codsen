const t = require("tap");
const groupStr = require("../dist/array-group-str-omit-num-char.cjs");

t.test("UMD build works fine", (t) => {
  t.same(groupStr(["aaa", "bbb"], true), {
    aaa: 1,
    bbb: 1,
  });
  t.end();
});
