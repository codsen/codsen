const t = require("tap");
const is1 = require("../dist/is-html-attribute-closing.umd");

t.test("UMD build works fine", (t) => {
  const str = `<a href="zzz" target="_blank" style="color: black;">`;
  // 1. starting at the opening of "href":
  t.false(is1(str, 8, 8), "01");
  t.true(is1(str, 8, 12), "02");
  t.false(is1(str, 8, 21), "03");
  t.false(is1(str, 8, 28), "04");
  t.false(is1(str, 8, 36), "05");
  t.false(is1(str, 8, 50), "06");

  // 2. starting at the opening of "target":
  t.false(is1(str, 21, 8), "07");
  t.false(is1(str, 21, 12), "08");
  t.false(is1(str, 21, 21), "09");
  t.true(is1(str, 21, 28), "10");
  t.false(is1(str, 21, 36), "11");
  t.false(is1(str, 21, 50), "12");

  // 3. starting at the opening of "style":
  t.false(is1(str, 36, 8), "13");
  t.false(is1(str, 36, 12), "14");
  t.false(is1(str, 36, 21), "15");
  t.false(is1(str, 36, 28), "16");
  t.false(is1(str, 36, 36), "17");
  t.true(is1(str, 36, 50), "18");

  // fin.
  t.end();
});
