import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// normal use cases
// -----------------------------------------------------------------------------

tap.test("01 - empty input", (t) => {
  t.same(stripHtml(""), "", "01");
  t.end();
});

tap.test("02 - whitespace only", (t) => {
  t.same(stripHtml("\t\t\t"), "\t\t\t", "02");
  t.end();
});

tap.test("03 - string is whole (opening) tag - no ignore", (t) => {
  t.same(stripHtml("<a>"), "", "03");
  t.end();
});

tap.test("04 - string is whole (opening) tag - ignore but wrong", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: ["b"],
    }),
    "",
    "04"
  );
  t.end();
});

tap.test("05 - string is whole (opening) tag - ignore", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: ["a"],
    }),
    "<a>",
    "05"
  );
  t.end();
});

tap.test(
  "06 - string is whole (opening) tag - whitespace after opening bracket",
  (t) => {
    t.same(stripHtml("< a>"), "", "06");
    t.end();
  }
);

tap.test(
  "07 - string is whole (opening) tag - whitespace before closing bracket",
  (t) => {
    t.same(stripHtml("<a >"), "", "07");
    t.end();
  }
);

tap.test(
  "08 - string is whole (opening) tag - whitespace inside on both sides",
  (t) => {
    t.same(stripHtml("< a >"), "", "08");
    t.end();
  }
);

tap.test(
  "09 - string is whole (opening) tag - copious whitespace inside on both sides",
  (t) => {
    t.same(stripHtml("<     a     >"), "", "09");
    t.end();
  }
);

tap.test(
  "10 - string is whole (opening) tag - leading space is not retained",
  (t) => {
    t.same(stripHtml(" <a>"), "", "10");
    t.end();
  }
);

tap.test(
  "11 - string is whole (opening) tag - trailing space is not retained",
  (t) => {
    t.same(stripHtml("< a> "), "", "11");
    t.end();
  }
);

tap.test(
  "12 - string is whole (opening) tag - surrounding whitespace outside",
  (t) => {
    t.same(stripHtml("  <a >  "), "", "12");
    t.end();
  }
);

tap.test("13 - string is whole (opening) tag - raw tab in front", (t) => {
  t.same(stripHtml("\t< a >"), "", "13");
  t.end();
});

tap.test(
  "14 - string is whole (opening) tag - lots of different whitespace chars",
  (t) => {
    t.same(stripHtml("    \t   <     a     >      \n\n   "), "", "14");
    t.end();
  }
);

tap.test(
  "15 - string is whole (opening) tag - whitespace between tags is deleted too",
  (t) => {
    t.same(stripHtml("<a>         <a>"), "", "15");
    t.end();
  }
);

tap.test(
  "16 - string is whole (opening) tag - whitespace between tag and text is removed",
  (t) => {
    t.same(stripHtml("<a>         z"), "z", "16");
    t.end();
  }
);

tap.test(
  "17 - string is whole (opening) tag - leading/trailing spaces",
  (t) => {
    t.same(stripHtml("   <b>text</b>   "), "text", "17");
    t.end();
  }
);

tap.test(
  "18 - string is whole (opening) tag - but leading/trailing line breaks are deleted",
  (t) => {
    t.same(stripHtml("\n\n\n<b>text</b>\r\r\r"), "text", "18");
    t.end();
  }
);

tap.test(
  "19 - string is whole (opening) tag - HTML tag with attributes",
  (t) => {
    t.same(
      stripHtml(
        'z<a href="https://codsen.com" target="_blank">z<a href="xxx" target="_blank">z'
      ),
      "z z z",
      "19"
    );
    t.end();
  }
);

tap.test(
  "20 - string is whole (opening) tag - custom tag names, healthy",
  (t) => {
    t.same(stripHtml("<custom>"), "", "20");
    t.end();
  }
);

tap.test(
  "21 - string is whole (opening) tag - custom tag names, missing closing bracket",
  (t) => {
    t.same(stripHtml("<custom"), "", "21");
    t.end();
  }
);

tap.test(
  "22 - string is whole (opening) tag - custom tag names, dash in the name",
  (t) => {
    t.same(stripHtml("<custom-tag>"), "", "22");
    t.end();
  }
);

tap.test(
  "23 - string is whole (opening) tag - dash is name's first character",
  (t) => {
    t.same(stripHtml("<-tag>"), "", "23");
    t.end();
  }
);

tap.test("24 - string is whole (opening) tag - multiple custom", (t) => {
  t.same(stripHtml("<custom><custom><custom>"), "", "24");
  t.end();
});

tap.test(
  "25 - string is whole (opening) tag - multiple custom with dashes",
  (t) => {
    t.same(stripHtml("<custom-tag><custom-tag><custom-tag>"), "", "25");
    t.end();
  }
);

tap.test(
  "26 - string is whole (opening) tag - multiple custom with names starting with dashes",
  (t) => {
    t.same(stripHtml("<-tag><-tag><-tag>"), "", "26");
    t.end();
  }
);

tap.test(
  "27 - string is whole (opening) tag - multiple custom with surroundings",
  (t) => {
    t.same(stripHtml("a<custom><custom><custom>b"), "a b", "27");
    t.end();
  }
);

tap.test(
  "28 - string is whole (opening) tag - multiple custom with surroundings with dashes",
  (t) => {
    t.same(stripHtml("a<custom-tag><custom-tag><custom-tag>b"), "a b", "28");
    t.end();
  }
);

tap.test(
  "29 - string is whole (opening) tag - multiple custom with surroundings starting with dashes",
  (t) => {
    t.same(stripHtml("a<-tag><-tag><-tag>b"), "a b", "29");
    t.end();
  }
);

tap.test(
  "30 - string is whole (opening) tag - self-closing - multiple with surroundings, inner whitespace",
  (t) => {
    t.same(stripHtml("a</custom>< /custom><custom/>b"), "a b", "30");
    t.end();
  }
);

tap.test(
  "31 - string is whole (opening) tag - self-closing - multiple",
  (t) => {
    t.same(
      stripHtml("a<custom-tag /></ custom-tag>< /custom-tag>b"),
      "a b",
      "31"
    );
    t.end();
  }
);

tap.test(
  "32 - string is whole (opening) tag - self-closing - multiple names start with dash",
  (t) => {
    t.same(stripHtml("a</ -tag>< /-tag><-tag / >   b"), "a b", "32");
    t.end();
  }
);

tap.test(
  "33 - string is whole (opening) tag - custom, outer whitespace",
  (t) => {
    t.same(stripHtml("a  </custom>< /custom><custom/>   b"), "a b", "33");
    t.end();
  }
);

tap.test("34 - string is whole (opening) tag - custom, line breaks", (t) => {
  t.same(
    stripHtml("a\n<custom-tag /></ custom-tag>\n< /custom-tag>\n\nb"),
    "a\n\nb",
    "34"
  );
  t.end();
});

tap.test("35 - string is whole (opening) tag - custom, outer tabs", (t) => {
  t.same(stripHtml("a\t\t</ -tag>< /-tag><-tag / >   \t b"), "a b", "35");
  t.end();
});

tap.test("36 - string is whole (closing) tag - self-closing - single", (t) => {
  t.same(stripHtml("</a>"), "", "36");
  t.end();
});

tap.test(
  "37 - string is whole (closing) tag - self-closing - whitespace before slash",
  (t) => {
    t.same(stripHtml("< /a>"), "", "37");
    t.end();
  }
);

tap.test(
  "38 - string is whole (closing) tag - self-closing - whitespace after slash",
  (t) => {
    t.same(stripHtml("</ a>"), "", "38");
    t.end();
  }
);

tap.test(
  "39 - string is whole (closing) tag - self-closing - whitespace after name",
  (t) => {
    t.same(stripHtml("</a >"), "", "39");
    t.end();
  }
);

tap.test(
  "40 - string is whole (closing) tag - self-closing - surrounding whitespace",
  (t) => {
    t.same(stripHtml("< /a >"), "", "40");
    t.end();
  }
);

tap.test(
  "41 - string is whole (closing) tag - self-closing - surrounding whitespace #2",
  (t) => {
    t.same(stripHtml("</ a >"), "", "41");
    t.end();
  }
);

tap.test(
  "42 - string is whole (closing) tag - self-closing - whitespace everywhere",
  (t) => {
    t.same(stripHtml("< / a >"), "", "42");
    t.end();
  }
);

tap.test(
  "43 - string is whole (closing) tag - self-closing - copious whitespace everywhere",
  (t) => {
    t.same(stripHtml("<  /   a     >"), "", "43");
    t.end();
  }
);

tap.test(
  "44 - string is whole (closing) tag - self-closing - leading outside whitespace",
  (t) => {
    t.same(stripHtml(" </a>"), "", "44");
    t.end();
  }
);

tap.test(
  "45 - string is whole (closing) tag - self-closing - trailing outside whitespace",
  (t) => {
    t.same(stripHtml("< /a> "), "", "45");
    t.end();
  }
);

tap.test(
  "46 - string is whole (closing) tag - self-closing - outside whitespace on both sides",
  (t) => {
    t.same(stripHtml("  </a >  "), "", "46");
    t.end();
  }
);

tap.test(
  "47 - string is whole (closing) tag - self-closing - copious outside whitespace on both sides",
  (t) => {
    t.same(stripHtml("\t< /a >"), "", "47");
    t.end();
  }
);

tap.test(
  "48 - string is whole (closing) tag - self-closing - even more copious outside whitespace on both sides",
  (t) => {
    t.same(stripHtml("    \t   <   /  a     >      \n\n   "), "", "48");
    t.end();
  }
);

tap.test("49 - dodgy attribute", (t) => {
  const input = `< abc |>`;
  t.same(stripHtml(input), input, "49");
  t.end();
});

tap.test("50 - dodgy attribute", (t) => {
  const input = `<table .>`;
  t.same(stripHtml(input), "", "50");
  t.end();
});
