import tap from "tap";
import is1 from "../dist/is-html-attribute-closing.umd";

tap.test("UMD build works fine", (t) => {
  const str = `<a href="zzz" target="_blank" style="color: black;">`;
  // 1. starting at the opening of "href":
  t.false(is1(str, 8, 8), "01.01");
  t.true(is1(str, 8, 12), "01.02");
  t.false(is1(str, 8, 21), "01.03");
  t.false(is1(str, 8, 28), "01.04");
  t.false(is1(str, 8, 36), "01.05");
  t.false(is1(str, 8, 50), "01.06");

  // 2. starting at the opening of "target":
  t.false(is1(str, 21, 8), "01.07");
  t.false(is1(str, 21, 12), "01.08");
  t.false(is1(str, 21, 21), "01.09");
  t.true(is1(str, 21, 28), "01.10");
  t.false(is1(str, 21, 36), "01.11");
  t.false(is1(str, 21, 50), "01.12");

  // 3. starting at the opening of "style":
  t.false(is1(str, 36, 8), "01.13");
  t.false(is1(str, 36, 12), "01.14");
  t.false(is1(str, 36, 21), "01.15");
  t.false(is1(str, 36, 28), "01.16");
  t.false(is1(str, 36, 36), "01.17");
  t.true(is1(str, 36, 50), "01.18");

  // fin.
  t.end();
});
