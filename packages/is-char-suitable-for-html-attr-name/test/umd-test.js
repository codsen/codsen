import tap from "tap";
import is from "../dist/is-char-suitable-for-html-attr-name.umd";

tap.test("UMD build works fine", (t) => {
  t.true(is("a"), "01");
  t.true(is("A"), "02");
  t.true(is("1"), "03");
  t.true(is("-"), "04");
  t.true(is(":"), "05");
  t.end();
});
