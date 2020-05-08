import tap from "tap";
import is from "../dist/is-char-suitable-for-html-attr-name.umd";

tap.test("UMD build works fine", (t) => {
  t.true(is("a"), "01.01");
  t.true(is("A"), "01.02");
  t.true(is("1"), "01.03");
  t.true(is("-"), "01.04");
  t.true(is(":"), "01.05");
  t.end();
});
