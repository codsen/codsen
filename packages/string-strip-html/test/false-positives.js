import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// false positives
// -----------------------------------------------------------------------------

tap.test(
  "01 - false positives - equations: very sneaky considering b is a legit tag name",
  (t) => {
    t.same(
      stripHtml("Equations are: a < b and c > d"),
      "Equations are: a < b and c > d",
      "01"
    );
    t.end();
  }
);

tap.test("02 - false positives - inwards-pointing arrows", (t) => {
  t.same(stripHtml("Look here: ---> a <---"), "Look here: ---> a <---", "02");
  t.end();
});

tap.test("03 - false positives - arrows mixed with tags", (t) => {
  t.same(
    stripHtml(
      "Look here: ---> a <--- and here: ---> b <--- oh, and few tags: <div><article>\nzz</article></div>"
    ),
    "Look here: ---> a <--- and here: ---> b <--- oh, and few tags:\nzz",
    "03"
  );
  t.end();
});

tap.test("04 - false positives - opening bracket", (t) => {
  t.same(stripHtml("<"), "<", "04");
  t.end();
});

tap.test("05 - false positives - closing bracket", (t) => {
  t.same(stripHtml(">"), ">", "05");
  t.end();
});

tap.test("06 - false positives - three openings", (t) => {
  t.same(stripHtml(">>>"), ">>>", "06");
  t.end();
});

tap.test("07 - false positives - three closings", (t) => {
  t.same(stripHtml("<<<"), "<<<", "07");
  t.end();
});

tap.test("08 - false positives - spaced three openings", (t) => {
  t.same(stripHtml(" <<< "), "<<<", "08");
  t.end();
});

tap.test(
  "09 - false positives - tight recognised opening tag name, missing closing",
  (t) => {
    t.same(stripHtml("<a"), "", "09");
    t.end();
  }
);

tap.test(
  "10 - false positives - unrecognised opening tag, missing closing",
  (t) => {
    t.same(stripHtml("<yo"), "", "10");
    t.end();
  }
);

tap.test("11 - false positives - missing opening, recognised tag", (t) => {
  t.same(stripHtml("a>"), "a>", "11");
  t.end();
});

tap.test("12 - false positives - missing opening, unrecognised tag", (t) => {
  t.same(stripHtml("yo>"), "yo>", "12");
  t.end();
});

tap.test(
  "13 - false positives - conditionals that appear on Outlook only",
  (t) => {
    t.same(
      stripHtml(`<!--[if (gte mso 9)|(IE)]>
  <table width="540" align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
<![endif]-->
zzz
<!--[if (gte mso 9)|(IE)]>
      </td>
    </tr>
  </table>
<![endif]-->`),
      "zzz",
      "13"
    );
    t.end();
  }
);

tap.test(
  "14 - false positives - conditionals that are visible for Outlook only",
  (t) => {
    t.same(
      stripHtml(`<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->`),
      "shown for everything except Outlook",
      "14 - checking also for whitespace control"
    );
    t.end();
  }
);

tap.test(
  "15 - false positives - conditionals that are visible for Outlook only",
  (t) => {
    t.same(
      stripHtml(`a<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->b`),
      "a\nshown for everything except Outlook\nb",
      "15 - checking also for whitespace control"
    );
    t.end();
  }
);

tap.test(
  "16 - false positives - conditionals that are visible for Outlook only",
  (t) => {
    t.same(
      stripHtml(`<!--[if !mso]><!--><table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        shown for everything except Outlook
      </td>
    </tr>
  </table><!--<![endif]-->`),
      "shown for everything except Outlook",
      "16 - all those line breaks in-between the tags need to be taken care of too"
    );
    t.end();
  }
);

tap.test("17 - false positives - consecutive tags", (t) => {
  t.same(
    stripHtml(
      "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after"
    ),
    "Text First point Second point Third point Text straight after",
    "17"
  );
  t.end();
});

tap.test(
  "18 - digit is the first character following the opening bracket, quote",
  (t) => {
    const input = `"<5 text here`;
    t.same(stripHtml(input), input, "18");
    t.end();
  }
);

tap.test(
  "19 - digit is the first character following the opening bracket",
  (t) => {
    const input = `<5 text here`;
    t.same(stripHtml(input), input, "19");
    t.end();
  }
);

tap.test(
  "20 - digit is the first character following the opening bracket",
  (t) => {
    const input = `< 5 text here`;
    t.same(stripHtml(input), input, "20");
    t.end();
  }
);

tap.test("21 - numbers compared", (t) => {
  const input = `1 < 5 for sure`;
  t.same(stripHtml(input), input, "21");
  t.end();
});
