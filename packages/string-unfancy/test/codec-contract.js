import { test } from "uvu";
import { equal } from "uvu/assert";
import { unfancy } from "../dist/string-unfancy.esm.js";

test("01 - repeatedly decodes before simplifying typography", () => {
  equal(
    unfancy("&amp;amp;ldquo;Hi&amp;rdquo;&nbsp;&mdash;&hellip;"),
    '"Hi" -...',
    "01.01",
  );
  equal(unfancy("&amp;#38;lt;"), "<", "01.02");
  equal(unfancy("&nbsq; &unknown;"), "&nbsq; &unknown;", "01.03");
});

test("02 - keeps text context and WHATWG numeric recovery", () => {
  equal(unfancy("&notit; &copy=1"), "¬it; ©=1", "02.01");
  equal(
    unfancy("&#0; &#128; &#xD800; &#x10FFFF;"),
    "� € � \u{10ffff}",
    "02.02",
  );
  equal(unfancy("&NotEqualTilde; &Afr;"), "≂̸ 𝔄", "02.03");
});

test.run();
