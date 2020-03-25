const t = require("tap");
const is1 = require("../dist/is-html-tag-opening.umd");

t.test("UMD build works fine", (t) => {
  t.ok(is1("<a>", 0));
  t.end();
});
