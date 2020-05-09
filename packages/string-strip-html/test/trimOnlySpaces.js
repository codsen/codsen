import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// opts.trimOnlySpaces
// -----------------------------------------------------------------------------

tap.test(
  "01 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all",
  (t) => {
    t.same(stripHtml("\xa0 a \xa0"), "a", "01");
    t.end();
  }
);

tap.test(
  "02 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all, trailing whitespace",
  (t) => {
    t.same(stripHtml(" \xa0 a \xa0 "), "a", "02");
    t.end();
  }
);

tap.test("03 - opts.trimOnlySpaces - opts.trimOnlySpaces = on", (t) => {
  t.same(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "03"
  );
  t.end();
});

tap.test("04 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, loose", (t) => {
  t.same(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "04"
  );
  t.end();
});

tap.test("05 - opts.trimOnlySpaces - default", (t) => {
  t.same(stripHtml("\xa0 <article> \xa0"), "", "05");
  t.end();
});

tap.test("06 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, tag", (t) => {
  t.same(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: true }),
    "\xa0\xa0",
    "06"
  );
  t.end();
});

tap.test(
  "07 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, two tags",
  (t) => {
    t.same(
      stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: true }),
      "\xa0 \xa0",
      "07"
    );
    t.end();
  }
);

tap.test("08 - opts.trimOnlySpaces - whitespace around", (t) => {
  t.same(stripHtml(" \xa0 <article> \xa0 "), "", "08");
  t.end();
});

tap.test(
  "09 - opts.trimOnlySpaces - whitespace around, trimOnlySpaces = on",
  (t) => {
    t.same(
      stripHtml(" \xa0 <article> \xa0 ", { trimOnlySpaces: true }),
      "\xa0\xa0",
      "09"
    );
    t.end();
  }
);

tap.test(
  "10 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all",
  (t) => {
    t.same(stripHtml(" \t a \n "), "a", "10");
    t.end();
  }
);

tap.test(
  "11 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - trimOnlySpaces = on",
  (t) => {
    t.same(stripHtml(" \t a \n ", { trimOnlySpaces: true }), "\t a \n", "11");
    t.end();
  }
);

tap.test(
  "12 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - CRLF",
  (t) => {
    t.same(
      stripHtml(" \t\n a \r\n ", { trimOnlySpaces: true }),
      "\t\n a \r\n",
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - tag",
  (t) => {
    t.same(stripHtml("\t\r\n <article> \t\r\n"), "", "13");
    t.end();
  }
);

tap.test("14 - opts.trimOnlySpaces - tabs and CRLF", (t) => {
  t.same(
    stripHtml("\t\r\n <article> \t\r\n", { trimOnlySpaces: true }),
    "\t\r\n\t\r\n",
    "14"
  );
  t.end();
});

tap.test(
  "15 - opts.trimOnlySpaces - spaced tabs and CRs, trimOnlySpaces = on",
  (t) => {
    t.same(
      stripHtml(" \t \r \n <article> \t \r \n ", { trimOnlySpaces: true }),
      "\t \r \n\t \r \n",
      "15"
    );
    t.end();
  }
);

tap.test(
  "16 - opts.trimOnlySpaces - combos of tags and whitespace, trimOnlySpaces = on",
  (t) => {
    t.same(
      stripHtml(" \n <article> \xa0 <div> \xa0 </article> \t ", {
        trimOnlySpaces: true,
      }),
      "\n \t",
      "16"
    );
    t.end();
  }
);

tap.test("17 - opts.trimOnlySpaces - tags, trimOnlySpaces = on", (t) => {
  t.same(
    stripHtml(" \na<article> \xa0 <div> \xa0 </article>b\t ", {
      trimOnlySpaces: true,
    }),
    "\na b\t",
    "17"
  );
  t.end();
});

tap.test("18 - opts.trimOnlySpaces - letters around are retained", (t) => {
  t.same(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
    }),
    "\n a b \t",
    "18"
  );
  t.end();
});

tap.test("19 - opts.trimOnlySpaces - opts.ignoreTags combo", (t) => {
  t.same(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"],
    }),
    "\n a <div> b \t",
    "19"
  );
  t.end();
});

tap.test(
  "20 - opts.trimOnlySpaces - opts.ignoreTags combo - plausible but recognised",
  (t) => {
    t.same(
      stripHtml(" \n a <article> \xa0 < div> \xa0 </article> b \t ", {
        trimOnlySpaces: true,
        ignoreTags: ["div"],
      }),
      "\n a < div> b \t",
      "20"
    );
    t.end();
  }
);
