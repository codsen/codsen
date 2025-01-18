import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { detectIsItHTMLOrXhtml as detect } from "../dist/detect-is-it-html-or-xhtml.esm.js";

// ==============================
// Undecided and can't-identify cases
// ==============================

test("01 - no tags at all, text string only", () => {
  equal(
    detect(
      "fhgkd  gjflkgjhlfjl gh;kj;lghj;jklkdjgj hsdkffj jagfg hdkghjkdfhg khkfg sjdgfg gfjdsgfjdhgj kf gfjhk fgkj",
    ),
    null,
    "01.01",
  );
});

test("02 - unrecognised meta tag - counts as HTML", () => {
  equal(detect("<!DOCTYPE rubbish>"), "html", "02.01");
});

test("03 - no meta tag, no single tags", () => {
  equal(detect("<table><tr><td>text</td></tr></table>"), null, "03.01");
});

test("04 - missing input", () => {
  equal(detect(), null, "04.01");
});

test("05 - input is not string - throws", () => {
  throws(
    () => {
      detect({
        a: "a",
      });
    },
    /THROW_ID_01/g,
    "05.01",
  );
});

test.run();
