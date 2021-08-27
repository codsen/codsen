import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// opts.ignoreTags
// -----------------------------------------------------------------------------

tap.test(
  "01 - opts.ignoreTags - empty string, whitespace string and null in the array",
  (t) => {
    t.match(
      stripHtml("<a>", {
        ignoreTags: ["", " ", "a", "b", null],
      }),
      { result: "<a>" },
      "01.01"
    );
    t.match(
      stripHtml("zzz", {
        ignoreTags: ["", " ", "a", "b", null],
      }),
      { result: "zzz" },
      "01.02"
    );
    t.end();
  }
);

tap.test("02 - opts.ignoreTags - null inside opts.ignoreTags array", (t) => {
  t.match(
    stripHtml("<a>", {
      ignoreTags: [null],
    }),
    { result: "" },
    "02.01"
  );
  t.match(
    stripHtml("zzz", {
      ignoreTags: [null],
    }),
    { result: "zzz" },
    "02.02"
  );
  t.end();
});

tap.test("03 - opts.ignoreTags - empty str", (t) => {
  t.match(
    stripHtml("<a>", {
      ignoreTags: [""],
    }),
    { result: "" },
    "03.01"
  );
  t.match(
    stripHtml("zzz", {
      ignoreTags: [""],
    }),
    { result: "zzz" },
    "03.02"
  );
  t.end();
});

tap.test("04 - opts.ignoreTags - empty str", (t) => {
  t.match(
    stripHtml("<a>", {
      ignoreTags: "",
    }),
    { result: "" },
    "04.01"
  );
  t.match(
    stripHtml("zz", {
      ignoreTags: "",
    }),
    { result: "zz" },
    "04.02"
  );
  t.end();
});

tap.test("05 - opts.ignoreTags - empty str", (t) => {
  t.match(
    stripHtml("<a>", {
      ignoreTags: "a",
    }),
    { result: "<a>" },
    "05.01"
  );
  t.match(
    stripHtml("zzz", {
      ignoreTags: "a",
    }),
    { result: "zzz" },
    "05.02"
  );
  t.end();
});

tap.test("06 - opts.ignoreTags - null among opts.ignoreTags values", (t) => {
  t.match(
    stripHtml("<a>", {
      ignoreTags: [null, "a"],
    }),
    { result: "<a>" },
    "06.01"
  );
  t.match(
    stripHtml("zzz", {
      ignoreTags: [null, "a"],
    }),
    { result: "zzz" },
    "06.02"
  );
  t.end();
});

tap.test(
  "07 - opts.ignoreTags - whitespace-only blanks inside opts.ignoreTags",
  (t) => {
    t.match(
      stripHtml("a<a>", {
        ignoreTags: ["\t", "\n\n"],
      }),
      { result: "a" },
      "07.01"
    );
    t.match(
      stripHtml("a z", {
        ignoreTags: ["\t", "\n\n"],
      }),
      { result: "a z" },
      "07.02"
    );
    t.end();
  }
);

tap.test("08 - opts.ignoreTags - tabs", (t) => {
  t.match(
    stripHtml("a<a>", {
      ignoreTags: "\t",
    }),
    { result: "a" },
    "08.01"
  );
  t.match(
    stripHtml("a z", {
      ignoreTags: "\t",
    }),
    { result: "a z" },
    "08.02"
  );
  t.end();
});

tap.test(
  "09 - opts.ignoreTags - some whitespace-only inside opts.ignoreTags",
  (t) => {
    t.match(
      stripHtml("a<a>", {
        ignoreTags: ["\t", "\n\n", "a", " "],
      }),
      { result: "a<a>" },
      "09.01"
    );
    t.match(
      stripHtml("zzz", {
        ignoreTags: ["\t", "\n\n", "a", " "],
      }),
      { result: "zzz" },
      "09.02"
    );
    t.end();
  }
);

tap.test(
  "10 - opts.ignoreTags - space before and after attribute's equal character",
  (t) => {
    t.match(
      stripHtml("<article  whatnot  =  whatyes = >zzz< / article>"),
      { result: "zzz" },
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - opts.ignoreTags - space before and after attribute's equal character",
  (t) => {
    t.match(
      stripHtml(
        "<article  whatnot  =  whatyes = >xxx< / article> yyy <article  whatnot  =  whatyes = >zzz< / article>"
      ),
      { result: "xxx yyy zzz" },
      "11"
    );
    t.end();
  }
);

tap.test("12 - opts.ignoreTags - ignores single letter tag", (t) => {
  t.match(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"],
    }),
    { result: "Some <b>text</b> and some more text." },
    "12"
  );
  t.end();
});

tap.test("13 - opts.ignoreTags - ignores singleton tag", (t) => {
  t.match(
    stripHtml("Some text <hr> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    { result: "Some text <hr> some more text." },
    "13"
  );
  t.end();
});

tap.test("14 - opts.ignoreTags - ignores singleton tag, XHTML", (t) => {
  t.match(
    stripHtml("Some text <hr/> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    { result: "Some text <hr/> some more text." },
    "14"
  );
  t.end();
});

tap.test("15 - opts.ignoreTags - ignores singleton tag, spaced XHTML", (t) => {
  t.match(
    stripHtml("Some text <hr / > some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    { result: "Some text <hr / > some more text." },
    "15"
  );
  t.end();
});

tap.test("16 - opts.ignoreTags - ignores single zzz tag", (t) => {
  t.match(
    stripHtml("Some <zzz>text</zzz> and some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }),
    { result: "Some <zzz>text</zzz> and some more text." },
    "16"
  );
  t.end();
});

tap.test("17 - opts.ignoreTags - ignores zzz singleton tag", (t) => {
  t.match(
    stripHtml("Some text <zzz> some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }),
    { result: "Some text <zzz> some more text." },
    "17"
  );
  t.end();
});

tap.test("18 - opts.ignoreTags - ignores default ranged tag", (t) => {
  t.match(
    stripHtml("Some <script>text</script> and some more <i>text</i>.", {
      ignoreTags: ["script"],
    }),
    { result: "Some <script>text</script> and some more text." },
    "18"
  );
  t.end();
});

tap.test(
  "19 - opts.ignoreTags - ignored tag unclosed, ending with EOF",
  (t) => {
    // just for kicks:
    t.match(
      stripHtml("Some <b>text</b", {
        ignoreTags: ["b"],
      }),
      { result: "Some <b>text</b" },
      "19 - if user insists, that missing bracket must be intentional"
    );
    t.end();
  }
);

tap.test(
  "20 - opts.ignoreTags - recognised unclosed singleton tag, HTML",
  (t) => {
    t.match(
      stripHtml("Some text <hr", {
        ignoreTags: ["hr"],
      }),
      { result: "Some text <hr" },
      "20"
    );
    t.end();
  }
);

tap.test(
  "21 - opts.ignoreTags - recognised unclosed singleton tag, XHTML",
  (t) => {
    t.match(
      stripHtml("Some text <hr/", {
        ignoreTags: ["hr"],
      }),
      { result: "Some text <hr/" },
      "21"
    );
    t.end();
  }
);

tap.test(
  "22 - opts.ignoreTags - kept the tag and the slash, just trimmed",
  (t) => {
    t.match(
      stripHtml("Some text <hr / ", {
        ignoreTags: ["hr"],
      }),
      { result: "Some text <hr /" },
      "22"
    );
    t.end();
  }
);

tap.test(
  "23 - opts.ignoreTags - ignores unclosed self-closing zzz tag",
  (t) => {
    t.match(
      stripHtml("Some <zzz>text</zzz", {
        ignoreTags: ["zzz"],
      }),
      { result: "Some <zzz>text</zzz" },
      "23"
    );
    t.end();
  }
);

tap.test("24 - opts.ignoreTags - ignores unclosed zzz singleton tag", (t) => {
  t.match(
    stripHtml("Some text <zzz", {
      ignoreTags: ["zzz"],
    }),
    { result: "Some text <zzz" },
    "24"
  );
  t.end();
});

tap.test("25 - opts.ignoreTags - ignores default unclosed ranged tag", (t) => {
  t.match(
    stripHtml("Some <script>text</script", {
      ignoreTags: ["script"],
    }),
    { result: "Some <script>text</script" },
    "25"
  );
  t.end();
});

tap.test("26 - opts.ignoreTags - throws because of wrong type", (t) => {
  t.throws(
    () => {
      stripHtml("<a>", {
        ignoreTags: 1,
      });
    },
    /THROW_ID_03/,
    "26"
  );
  t.end();
});
