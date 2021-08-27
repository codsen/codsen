import tap from "tap";
import { detectIsItHTMLOrXhtml as detect } from "../dist/detect-is-it-html-or-xhtml.esm.js";

// ==============================
// Undecided and can't-identify cases
// ==============================

tap.test("01 - no tags at all, text string only", (t) => {
  t.equal(
    detect(
      "fhgkd  gjflkgjhlfjl gh;kj;lghj;jklkdjgj hsdkffj jagfg hdkghjkdfhg khkfg sjdgfg gfjdsgfjdhgj kf gfjhk fgkj"
    ),
    null,
    "01"
  );
  t.end();
});

tap.test("02 - unrecognised meta tag - counts as HTML", (t) => {
  t.equal(detect("<!DOCTYPE rubbish>"), "html", "02");
  t.end();
});

tap.test("03 - no meta tag, no single tags", (t) => {
  t.equal(detect("<table><tr><td>text</td></tr></table>"), null, "03");
  t.end();
});

tap.test("04 - missing input", (t) => {
  t.equal(detect(), null, "04");
  t.end();
});

tap.test("05 - input is not string - throws", (t) => {
  t.throws(() => {
    detect({
      a: "a",
    });
  }, /THROW_ID_01/g);
  t.end();
});
