import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// strips tag pairs including content in-between
// -----------------------------------------------------------------------------

tap.test(
  "01 - tag pairs including content - healthy, typical style tag pair",
  (t) => {
    t.same(
      stripHtml(`<html><head>
<style type="text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
      "aaa",
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - tag pairs including content - mismatching quotes "text/css'`,
  (t) => {
    // Ranged tags are sensitive to slash detection.
    // Slash detection works checking is slash not within quoted attribute values.
    // Messed up, unmatching attribute quotes can happen too.
    // Let's see what happens!
    t.same(
      stripHtml(`<html><head>
<style type="text/css'>#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
      "aaa",
      `02`
    );
    t.end();
  }
);

tap.test(
  `03 - tag pairs including content - mismatching quotes 'text/css"`,
  (t) => {
    t.same(
      stripHtml(`<html><head>
<style type='text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
      "aaa",
      "03"
    );
    t.end();
  }
);

tap.test(
  "04 - tag pairs including content - via opts.stripTogetherWithTheirContents - tight inside",
  (t) => {
    t.same(
      stripHtml("a<b>c</b>d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "04"
    );
    t.end();
  }
);

tap.test(
  "05 - tag pairs including content - via opts.stripTogetherWithTheirContents - copious inner whitespace",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   /   b   >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "05 - whitespace within the tag"
    );
    t.end();
  }
);

tap.test(
  "06 - tag pairs including content - via opts.stripTogetherWithTheirContents - closing slash wrong side",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<     b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "06"
    );
    t.end();
  }
);

tap.test(
  "07 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "07 - two closing slashes"
    );
    t.end();
  }
);

tap.test(
  "08 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   //    b   //    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "08 - multiple duplicated closing slashes"
    );
    t.end();
  }
);

tap.test(
  "09 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   //  <  b   // >   >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "09 - multiple duplicated closing slashes"
    );
    t.end();
  }
);

tap.test(
  "10 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "10 - no closing slashes"
    );
    t.end();
  }
);

tap.test(
  "11 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a\n\nd",
      "11 - no closing slashes"
    );
    t.end();
  }
);

tap.test(
  "12 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<b>c</b>d<e>f</e>g", {
        stripTogetherWithTheirContents: ["b", "e"],
      }),
      "a d g",
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<bro>c</bro>d<e>f</e>g", {
        stripTogetherWithTheirContents: ["b", "e"],
      }),
      "a c d g",
      "13 - sneaky similarity, bro starts with b"
    );
    t.end();
  }
);

tap.test("14 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ),
    "Text and some more.",
    "14 - strips with attributes. Now resembling real life."
  );
  t.end();
});

tap.test("15 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ),
    "Text and some more.",
    "15 - lots of spaces within tags"
  );
  t.end();
});

tap.test("16 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: [],
    }),
    "a c d",
    "16 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("17 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null,
    }),
    "a c d",
    "17 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("18 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false,
    }),
    "a c d",
    "18 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("19 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b",
    }),
    "a d",
    "19 - opts.stripTogetherWithTheirContents is not array but string"
  );
  t.end();
});

tap.test("20 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b",
      }
    ),
    "a d",
    "20"
  );
  t.end();
});

tap.test("21 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"],
    }),
    "a c",
    "21 - single custom range tag"
  );
  t.end();
});

tap.test("22 - tag pairs including content - ", (t) => {
  t.throws(() => {
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: ["zzz", true, "b"],
      }
    );
  }, "22");
  t.end();
});
