const t = require("tap");
const strip1 = require("../dist/string-strip-html.umd");

const source = "a<custom-tag /></ custom-tag>< /custom-tag>b";
const res = "a b";

t.test("UMD build works fine", (t) => {
  t.same(strip1(source), res);
  t.end();
});
