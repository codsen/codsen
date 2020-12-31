import tap from "tap";
import { isAttrNameChar } from "../dist/is-char-suitable-for-html-attr-name.umd";

tap.test("UMD build works fine", (t) => {
  t.true(isAttrNameChar("a"), "01.01");
  t.true(isAttrNameChar("A"), "01.02");
  t.true(isAttrNameChar("1"), "01.03");
  t.true(isAttrNameChar("-"), "01.04");
  t.true(isAttrNameChar(":"), "01.05");
  t.end();
});
