import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// opts.stripTogetherWithTheirContents - edge cases

tap.test("01 - wrong opts.stripTogetherWithTheirContents value", (t) => {
  t.hasStrict(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: true,
    }),
    { result: "a c d" },
    "01"
  );
  t.end();
});

tap.test("02 - wrong opts.stripTogetherWithTheirContents value", (t) => {
  t.hasStrict(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: false,
    }),
    { result: "a c d" },
    "02"
  );
  t.end();
});

tap.test("03 - wrong opts.stripTogetherWithTheirContents value", (t) => {
  t.hasStrict(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: null,
    }),
    { result: "a c d" },
    "03"
  );
  t.end();
});

tap.test("04 - wrong opts.stripTogetherWithTheirContents value", (t) => {
  t.hasStrict(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: undefined,
    }),
    { result: "a c d" },
    "04"
  );
  t.end();
});

tap.test("05 - wrong opts.stripTogetherWithTheirContents value", (t) => {
  t.hasStrict(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: "",
    }),
    { result: "a c d" },
    "05"
  );
  t.end();
});

tap.test("06 - no mutations!", (t) => {
  const originalOpts = {
    stripTogetherWithTheirContents: "b",
  };
  // opts object's mutation would happen here:
  t.hasStrict(
    stripHtml("a<b>c</b>d", originalOpts),
    { result: "a d" },
    "06.01"
  );

  // now the actual check:
  t.strictSame(
    originalOpts,
    {
      stripTogetherWithTheirContents: "b",
    },
    "06.02"
  );
  t.end();
});

// strips tag pairs including content in-between
// -----------------------------------------------------------------------------

tap.test(
  "07 - tag pairs including content - healthy, typical style tag pair",
  (t) => {
    t.hasStrict(
      stripHtml(`<html><head>
<style type="text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
      { result: "aaa" },
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - tag pairs including content - mismatching quotes "text/css'`,
  (t) => {
    // Ranged tags are sensitive to slash detection.
    // Slash detection works checking is slash not within quoted attribute values.
    // Messed up, unmatching attribute quotes can happen too.
    // Let's see what happens!
    t.hasStrict(
      stripHtml(`<html><head>
<style type="text/css'>#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
      { result: "aaa" },
      `08`
    );
    t.end();
  }
);

tap.test(
  `09 - tag pairs including content - mismatching quotes 'text/css"`,
  (t) => {
    t.hasStrict(
      stripHtml(`<html><head>
<style type='text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
      { result: "aaa" },
      "09"
    );
    t.end();
  }
);

tap.test(
  "10 - tag pairs including content - via opts.stripTogetherWithTheirContents - tight inside",
  (t) => {
    t.hasStrict(
      stripHtml("a<b>c</b>d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a d" },
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - tag pairs including content - via opts.stripTogetherWithTheirContents - copious inner whitespace",
  (t) => {
    t.hasStrict(
      stripHtml("a<    b    >c<   /   b   >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a d" },
      "11 - whitespace within the tag"
    );
    t.end();
  }
);

tap.test(
  "12 - tag pairs including content - via opts.stripTogetherWithTheirContents - closing slash wrong side",
  (t) => {
    t.hasStrict(
      stripHtml("a<    b    >c<     b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a d" },
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.hasStrict(
      stripHtml("a<    b    >c<   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a d" },
      "13 - two closing slashes"
    );
    t.end();
  }
);

tap.test(
  "14 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.hasStrict(
      stripHtml("a<    b    >c<   //    b   //    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a d" },
      "14 - multiple duplicated closing slashes"
    );
    t.end();
  }
);

tap.test(
  "15 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.hasStrict(
      stripHtml("a<    b    >c<   //  <  b   // >   >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a d" },
      "15 - multiple duplicated closing slashes"
    );
    t.end();
  }
);

tap.test(
  "16 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.hasStrict(
      stripHtml("a<    b    >c<   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a d" },
      "16 - no closing slashes"
    );
    t.end();
  }
);

tap.test(
  "17 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.hasStrict(
      stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      { result: "a\n\nd" },
      "17 - no closing slashes"
    );
    t.end();
  }
);

tap.test(
  "18 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.hasStrict(
      stripHtml("a<b>c</b>d<e>f</e>g", {
        stripTogetherWithTheirContents: ["b", "e"],
      }),
      { result: "a d g" },
      "18"
    );
    t.end();
  }
);

tap.test(
  "19 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.hasStrict(
      stripHtml("a<bro>c</bro>d<e>f</e>g", {
        stripTogetherWithTheirContents: ["b", "e"],
      }),
      { result: "a c d g" },
      "19 - sneaky similarity, bro starts with b"
    );
    t.end();
  }
);

tap.test("20 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ),
    { result: "Text and some more." },
    "20 - strips with attributes. Now resembling real life."
  );
  t.end();
});

tap.test("21 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ),
    { result: "Text and some more." },
    "21 - lots of spaces within tags"
  );
  t.end();
});

tap.test("22 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: [],
    }),
    { result: "a c d" },
    "22 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("23 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null,
    }),
    { result: "a c d" },
    "23 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("24 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false,
    }),
    { result: "a c d" },
    "24 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("25 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b",
    }),
    { result: "a d" },
    "25 - opts.stripTogetherWithTheirContents is not array but string"
  );
  t.end();
});

tap.test("26 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b",
      }
    ),
    { result: "a d" },
    "26"
  );
  t.end();
});

tap.test("27 - tag pairs including content", (t) => {
  t.hasStrict(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"],
    }),
    { result: "a c" },
    "27 - single custom range tag"
  );
  t.end();
});

tap.test("28 - tag pairs including content", (t) => {
  t.throws(
    () => {
      stripHtml(
        'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
        {
          stripTogetherWithTheirContents: ["zzz", true, "b"],
        }
      );
    },
    /THROW_ID_05/,
    "28"
  );
  t.end();
});

tap.test("29 - third, rogue <style> causes chopping off the remainder", (t) => {
  t.hasStrict(stripHtml("a<style>b</style>c"), { result: "a c" }, "29.01");
  t.hasStrict(stripHtml("a<style>b<style>c"), { result: "a b c" }, "29.02");
  t.hasStrict(stripHtml("a</style>b</style>c"), { result: "a b c" }, "29.03");

  t.hasStrict(
    stripHtml("a<style>b</style>c<div>z</div>"),
    { result: "a c z" },
    "29.04"
  );
  t.hasStrict(
    stripHtml("a<style>b<style>c<div>z</div>"),
    { result: "a b c z" },
    "29.05"
  );
  t.hasStrict(
    stripHtml("a</style>b</style>c<div>z</div>"),
    { result: "a b c z" },
    "29.06"
  );

  t.hasStrict(
    stripHtml("a<style>b</style>c<style>d"),
    { result: "a c d" },
    "29.07"
  );
  t.hasStrict(
    stripHtml("a<style>b</style>c</style>d"),
    { result: "a c d" },
    "29.08"
  );
  t.hasStrict(
    stripHtml("a<style>b</style>c<style>d<div>z</div>"),
    { result: "a c d z" },
    "29.09"
  );
  t.hasStrict(
    stripHtml("a<style>b</style>c</style>d<div>z</div>"),
    { result: "a c d z" },
    "29.10"
  );

  t.hasStrict(
    stripHtml("a<style>b<style>c<style>d"),
    { result: "a b c d" },
    "29.11"
  );
  t.hasStrict(
    stripHtml("a<style>b<style>c</style>d"),
    { result: "a b d" },
    "29.12"
  );
  t.hasStrict(
    stripHtml("a<style>b<style>c<style>d<div>z</div>"),
    { result: "a b c d z" },
    "29.13"
  );
  t.hasStrict(
    stripHtml("a<style>b<style>c</style>d<div>z</div>"),
    { result: "a b d z" },
    "29.14"
  );

  t.hasStrict(
    stripHtml("a</style>b</style>c<style>d"),
    { result: "a b c d" },
    "29.15"
  );
  t.hasStrict(
    stripHtml("a</style>b</style>c</style>d"),
    { result: "a b c d" },
    "29.16"
  );
  t.hasStrict(
    stripHtml("a</style>b</style>c<style>d<div>z</div>"),
    { result: "a b c d z" },
    "29.17"
  );
  t.hasStrict(
    stripHtml("a</style>b</style>c</style>d<div>z</div>"),
    { result: "a b c d z" },
    "29.18"
  );
  t.end();
});
