import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// opts.ignoreTags
// -----------------------------------------------------------------------------

tap.test(
  "01 - opts.ignoreTags - empty string, whitespace string and null in the array",
  (t) => {
    t.same(
      stripHtml("<a>", {
        ignoreTags: ["", " ", "a", "b", null],
      }),
      "<a>",
      "01"
    );
    t.end();
  }
);

tap.test("02 - opts.ignoreTags - null inside opts.ignoreTags array", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: [null],
    }),
    "",
    "02"
  );
  t.end();
});

tap.test("03 - opts.ignoreTags - null among opts.ignoreTags values", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: [null, "a"],
    }),
    "<a>",
    "03"
  );
  t.end();
});

tap.test(
  "04 - opts.ignoreTags - whitespace-only blanks inside opts.ignoreTags",
  (t) => {
    t.same(
      stripHtml("a<a>", {
        ignoreTags: ["\t", "\n\n"],
      }),
      "a",
      "04"
    );
    t.end();
  }
);

tap.test(
  "05 - opts.ignoreTags - some whitespace-only inside opts.ignoreTags",
  (t) => {
    t.same(
      stripHtml("a<a>", {
        ignoreTags: ["\t", "\n\n", "a", " "],
      }),
      "a<a>",
      "05"
    );
    t.end();
  }
);

tap.test(
  "06 - opts.ignoreTags - space before and after attribute's equal character",
  (t) => {
    t.same(
      stripHtml("<article  whatnot  =  whatyes = >zzz< / article>"),
      "zzz",
      "06"
    );
    t.end();
  }
);

tap.test(
  "07 - opts.ignoreTags - space before and after attribute's equal character",
  (t) => {
    t.same(
      stripHtml(
        "<article  whatnot  =  whatyes = >xxx< / article> yyy <article  whatnot  =  whatyes = >zzz< / article>"
      ),
      "xxx yyy zzz",
      "07"
    );
    t.end();
  }
);

tap.test("08 - opts.ignoreTags - ignores single letter tag", (t) => {
  t.same(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"],
    }),
    "Some <b>text</b> and some more text.",
    "08"
  );
  t.end();
});

tap.test("09 - opts.ignoreTags - ignores singleton tag", (t) => {
  t.same(
    stripHtml("Some text <hr> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    "Some text <hr> some more text.",
    "09"
  );
  t.end();
});

tap.test("10 - opts.ignoreTags - ignores singleton tag, XHTML", (t) => {
  t.same(
    stripHtml("Some text <hr/> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    "Some text <hr/> some more text.",
    "10"
  );
  t.end();
});

tap.test("11 - opts.ignoreTags - ignores singleton tag, spaced XHTML", (t) => {
  t.same(
    stripHtml("Some text <hr / > some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    "Some text <hr / > some more text.",
    "11"
  );
  t.end();
});

tap.test("12 - opts.ignoreTags - ignores single zzz tag", (t) => {
  t.same(
    stripHtml("Some <zzz>text</zzz> and some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }),
    "Some <zzz>text</zzz> and some more text.",
    "12"
  );
  t.end();
});

tap.test("13 - opts.ignoreTags - ignores zzz singleton tag", (t) => {
  t.same(
    stripHtml("Some text <zzz> some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }),
    "Some text <zzz> some more text.",
    "13"
  );
  t.end();
});

tap.test("14 - opts.ignoreTags - ignores default ranged tag", (t) => {
  t.same(
    stripHtml("Some <script>text</script> and some more <i>text</i>.", {
      ignoreTags: ["script"],
    }),
    "Some <script>text</script> and some more text.",
    "14"
  );
  t.end();
});

tap.test(
  "15 - opts.ignoreTags - ignored tag unclosed, ending with EOF",
  (t) => {
    // just for kicks:
    t.same(
      stripHtml("Some <b>text</b", {
        ignoreTags: ["b"],
      }),
      "Some <b>text</b",
      "15 - if user insists, that missing bracket must be intentional"
    );
    t.end();
  }
);

tap.test(
  "16 - opts.ignoreTags - recognised unclosed singleton tag, HTML",
  (t) => {
    t.same(
      stripHtml("Some text <hr", {
        ignoreTags: ["hr"],
      }),
      "Some text <hr",
      "16"
    );
    t.end();
  }
);

tap.test(
  "17 - opts.ignoreTags - recognised unclosed singleton tag, XHTML",
  (t) => {
    t.same(
      stripHtml("Some text <hr/", {
        ignoreTags: ["hr"],
      }),
      "Some text <hr/",
      "17"
    );
    t.end();
  }
);

tap.test(
  "18 - opts.ignoreTags - kept the tag and the slash, just trimmed",
  (t) => {
    t.same(
      stripHtml("Some text <hr / ", {
        ignoreTags: ["hr"],
      }),
      "Some text <hr /",
      "18"
    );
    t.end();
  }
);

tap.test(
  "19 - opts.ignoreTags - ignores unclosed self-closing zzz tag",
  (t) => {
    t.same(
      stripHtml("Some <zzz>text</zzz", {
        ignoreTags: ["zzz"],
      }),
      "Some <zzz>text</zzz",
      "19"
    );
    t.end();
  }
);

tap.test("20 - opts.ignoreTags - ignores unclosed zzz singleton tag", (t) => {
  t.same(
    stripHtml("Some text <zzz", {
      ignoreTags: ["zzz"],
    }),
    "Some text <zzz",
    "20"
  );
  t.end();
});

tap.test("21 - opts.ignoreTags - ignores default unclosed ranged tag", (t) => {
  t.same(
    stripHtml("Some <script>text</script", {
      ignoreTags: ["script"],
    }),
    "Some <script>text</script",
    "21"
  );
  t.end();
});
