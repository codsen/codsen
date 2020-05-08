import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// ==============================
// normal use cases
// ==============================

tap.test("01 - string is whole (opening) tag - no ignore", (t) => {
  t.same(stripHtml("<a>"), "", "01");
  t.end();
});

tap.test("02 - string is whole (opening) tag - ignore but wrong", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: ["b"],
    }),
    "",
    "02"
  );
  t.end();
});

tap.test("03 - string is whole (opening) tag - ignore", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: ["a"],
    }),
    "<a>",
    "03"
  );
  t.end();
});

tap.test(
  "04 - string is whole (opening) tag - whitespace after opening bracket",
  (t) => {
    t.same(stripHtml("< a>"), "", "04");
    t.end();
  }
);

tap.test(
  "05 - string is whole (opening) tag - whitespace before closing bracket",
  (t) => {
    t.same(stripHtml("<a >"), "", "05");
    t.end();
  }
);

tap.test(
  "06 - string is whole (opening) tag - whitespace inside on both sides",
  (t) => {
    t.same(stripHtml("< a >"), "", "06");
    t.end();
  }
);

tap.test(
  "07 - string is whole (opening) tag - copious whitespace inside on both sides",
  (t) => {
    t.same(stripHtml("<     a     >"), "", "07");
    t.end();
  }
);

tap.test(
  "08 - string is whole (opening) tag - leading space is not retained",
  (t) => {
    t.same(stripHtml(" <a>"), "", "08");
    t.end();
  }
);

tap.test(
  "09 - string is whole (opening) tag - trailing space is not retained",
  (t) => {
    t.same(stripHtml("< a> "), "", "09");
    t.end();
  }
);

tap.test(
  "10 - string is whole (opening) tag - surrounding whitespace outside",
  (t) => {
    t.same(stripHtml("  <a >  "), "", "10");
    t.end();
  }
);

tap.test("11 - string is whole (opening) tag - raw tab in front", (t) => {
  t.same(stripHtml("\t< a >"), "", "11");
  t.end();
});

tap.test(
  "12 - string is whole (opening) tag - lots of different whitespace chars",
  (t) => {
    t.same(stripHtml("    \t   <     a     >      \n\n   "), "", "12");
    t.end();
  }
);

tap.test(
  "13 - string is whole (opening) tag - whitespace between tags is deleted too",
  (t) => {
    t.same(stripHtml("<a>         <a>"), "", "13");
    t.end();
  }
);

tap.test(
  "14 - string is whole (opening) tag - whitespace between tag and text is removed",
  (t) => {
    t.same(stripHtml("<a>         z"), "z", "14");
    t.end();
  }
);

tap.test(
  "15 - string is whole (opening) tag - leading/trailing spaces",
  (t) => {
    t.same(stripHtml("   <b>text</b>   "), "text", "15");
    t.end();
  }
);

tap.test(
  "16 - string is whole (opening) tag - but leading/trailing line breaks are deleted",
  (t) => {
    t.same(stripHtml("\n\n\n<b>text</b>\r\r\r"), "text", "16");
    t.end();
  }
);

tap.test(
  "17 - string is whole (opening) tag - HTML tag with attributes",
  (t) => {
    t.same(
      stripHtml(
        'z<a href="https://codsen.com" target="_blank">z<a href="xxx" target="_blank">z'
      ),
      "z z z",
      "17"
    );
    t.end();
  }
);

tap.test(
  "18 - string is whole (opening) tag - custom tag names, healthy",
  (t) => {
    t.same(stripHtml("<custom>"), "", "18");
    t.end();
  }
);

tap.test(
  "19 - string is whole (opening) tag - custom tag names, missing closing bracket",
  (t) => {
    t.same(stripHtml("<custom"), "", "19");
    t.end();
  }
);

tap.test(
  "20 - string is whole (opening) tag - custom tag names, dash in the name",
  (t) => {
    t.same(stripHtml("<custom-tag>"), "", "20");
    t.end();
  }
);

tap.test(
  "21 - string is whole (opening) tag - dash is name's first character",
  (t) => {
    t.same(stripHtml("<-tag>"), "", "21");
    t.end();
  }
);

tap.test("22 - string is whole (opening) tag - multiple custom", (t) => {
  t.same(stripHtml("<custom><custom><custom>"), "", "22");
  t.end();
});

tap.test(
  "23 - string is whole (opening) tag - multiple custom with dashes",
  (t) => {
    t.same(stripHtml("<custom-tag><custom-tag><custom-tag>"), "", "23");
    t.end();
  }
);

tap.test(
  "24 - string is whole (opening) tag - multiple custom with names starting with dashes",
  (t) => {
    t.same(stripHtml("<-tag><-tag><-tag>"), "", "24");
    t.end();
  }
);

tap.test(
  "25 - string is whole (opening) tag - multiple custom with surroundings",
  (t) => {
    t.same(stripHtml("a<custom><custom><custom>b"), "a b", "25");
    t.end();
  }
);

tap.test(
  "26 - string is whole (opening) tag - multiple custom with surroundings with dashes",
  (t) => {
    t.same(stripHtml("a<custom-tag><custom-tag><custom-tag>b"), "a b", "26");
    t.end();
  }
);

tap.test(
  "27 - string is whole (opening) tag - multiple custom with surroundings starting with dashes",
  (t) => {
    t.same(stripHtml("a<-tag><-tag><-tag>b"), "a b", "27");
    t.end();
  }
);

tap.test(
  "28 - string is whole (opening) tag - self-closing - multiple with surroundings, inner whitespace",
  (t) => {
    t.same(stripHtml("a</custom>< /custom><custom/>b"), "a b", "28");
    t.end();
  }
);

tap.test(
  "29 - string is whole (opening) tag - self-closing - multiple",
  (t) => {
    t.same(
      stripHtml("a<custom-tag /></ custom-tag>< /custom-tag>b"),
      "a b",
      "29"
    );
    t.end();
  }
);

tap.test(
  "30 - string is whole (opening) tag - self-closing - multiple names start with dash",
  (t) => {
    t.same(stripHtml("a</ -tag>< /-tag><-tag / >   b"), "a b", "30");
    t.end();
  }
);

tap.test(
  "31 - string is whole (opening) tag - custom, outer whitespace",
  (t) => {
    t.same(stripHtml("a  </custom>< /custom><custom/>   b"), "a b", "31");
    t.end();
  }
);

tap.test("32 - string is whole (opening) tag - custom, line breaks", (t) => {
  t.same(
    stripHtml("a\n<custom-tag /></ custom-tag>\n< /custom-tag>\n\nb"),
    "a\n\nb",
    "32"
  );
  t.end();
});

tap.test("33 - string is whole (opening) tag - custom, outer tabs", (t) => {
  t.same(stripHtml("a\t\t</ -tag>< /-tag><-tag / >   \t b"), "a b", "33");
  t.end();
});

tap.test("34 - string is whole (closing) tag - self-closing - single", (t) => {
  t.same(stripHtml("</a>"), "", "34");
  t.end();
});

tap.test(
  "35 - string is whole (closing) tag - self-closing - whitespace before slash",
  (t) => {
    t.same(stripHtml("< /a>"), "", "35");
    t.end();
  }
);

tap.test(
  "36 - string is whole (closing) tag - self-closing - whitespace after slash",
  (t) => {
    t.same(stripHtml("</ a>"), "", "36");
    t.end();
  }
);

tap.test(
  "37 - string is whole (closing) tag - self-closing - whitespace after name",
  (t) => {
    t.same(stripHtml("</a >"), "", "37");
    t.end();
  }
);

tap.test(
  "38 - string is whole (closing) tag - self-closing - surrounding whitespace",
  (t) => {
    t.same(stripHtml("< /a >"), "", "38");
    t.end();
  }
);

tap.test(
  "39 - string is whole (closing) tag - self-closing - surrounding whitespace #2",
  (t) => {
    t.same(stripHtml("</ a >"), "", "39");
    t.end();
  }
);

tap.test(
  "40 - string is whole (closing) tag - self-closing - whitespace everywhere",
  (t) => {
    t.same(stripHtml("< / a >"), "", "40");
    t.end();
  }
);

tap.test(
  "41 - string is whole (closing) tag - self-closing - copious whitespace everywhere",
  (t) => {
    t.same(stripHtml("<  /   a     >"), "", "41");
    t.end();
  }
);

tap.test(
  "42 - string is whole (closing) tag - self-closing - leading outside whitespace",
  (t) => {
    t.same(stripHtml(" </a>"), "", "42");
    t.end();
  }
);

tap.test(
  "43 - string is whole (closing) tag - self-closing - trailing outside whitespace",
  (t) => {
    t.same(stripHtml("< /a> "), "", "43");
    t.end();
  }
);

tap.test(
  "44 - string is whole (closing) tag - self-closing - outside whitespace on both sides",
  (t) => {
    t.same(stripHtml("  </a >  "), "", "44");
    t.end();
  }
);

tap.test(
  "45 - string is whole (closing) tag - self-closing - copious outside whitespace on both sides",
  (t) => {
    t.same(stripHtml("\t< /a >"), "", "45");
    t.end();
  }
);

tap.test(
  "46 - string is whole (closing) tag - self-closing - even more copious outside whitespace on both sides",
  (t) => {
    t.same(stripHtml("    \t   <   /  a     >      \n\n   "), "", "46");
    t.end();
  }
);

// 02. tag pairs vs content
// -----------------------------------------------------------------------------

tap.test("47 - single tag pair - tight", (t) => {
  t.same(stripHtml("<a>zzz</a>"), "zzz", "47");
  t.end();
});

tap.test("48 - single tag pair - outer whitespace", (t) => {
  t.same(stripHtml(" <a>zzz</a> "), "zzz", "48");
  t.end();
});

tap.test("49 - single tag pair - inner and outer whitespace", (t) => {
  t.same(stripHtml(" <a> zzz </a> "), "zzz", "49");
  t.end();
});

tap.test("50 - single tag pair - inner line break retained", (t) => {
  t.same(stripHtml(" <a> zz\nz </a> "), "zz\nz", "50");
  t.end();
});

tap.test("51 - multiple tag pairs - adds spaces - #1", (t) => {
  t.same(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu"),
    "rrr zzz something\nelse zzz yyy uuu",
    "51"
  );
  t.end();
});

tap.test("52 - multiple tag pairs - adds spaces - #2", (t) => {
  t.same(stripHtml("aaaaaaa<a>bbbbbbbb"), "aaaaaaa bbbbbbbb", "52");
  t.end();
});

tap.test("53 - multiple tag pairs - adds spaces - #2", (t) => {
  t.same(stripHtml("<a>bbbbbbbb"), "bbbbbbbb", "53");
  t.end();
});

tap.test("54 - multiple tag pairs - adds spaces - #2", (t) => {
  t.same(stripHtml("aaaaaaa<a>"), "aaaaaaa", "54");
  t.end();
});

tap.test(
  "55 - deletion while being on sensitive mode - recognised tag name, pair",
  (t) => {
    t.same(stripHtml("< div >x</div>"), "x", "55");
    t.end();
  }
);

tap.test(
  "56 - deletion while being on sensitive mode - recognised tag name, singleton",
  (t) => {
    t.same(stripHtml("aaaaaaa< br >bbbbbbbb"), "aaaaaaa bbbbbbbb", "56");
    t.end();
  }
);

tap.test(
  "57 - deletion while being on sensitive mode - recognised tag name, pair, tight outer content",
  (t) => {
    t.same(stripHtml("aaaaaaa< div >x</div>"), "aaaaaaa x", "57");
    t.end();
  }
);

tap.test(
  "58 - deletion while being on sensitive mode - recognised tag name, pair, spaced outer content",
  (t) => {
    t.same(stripHtml("aaaaaaa < div >x</div>"), "aaaaaaa x", "58");
    t.end();
  }
);

tap.test(
  "59 - deletion while being on sensitive mode - recognised tag name, pair, trailing whitespace",
  (t) => {
    t.same(stripHtml("aaaaaaa< div >x</div> "), "aaaaaaa x", "59");
    t.end();
  }
);

tap.test("60 - tags with attributes - tight inside tag", (t) => {
  t.same(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "60"
  );
  t.end();
});

tap.test("61 - tags with attributes - rogue spaces inside tag", (t) => {
  t.same(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "61"
  );
  t.end();
});

tap.test("62 - tags with attributes - rogue spaces inside tag, pair", (t) => {
  t.same(stripHtml('aaaaaaa< div class="zzzz">x</div>'), "aaaaaaa x", "62");
  t.end();
});

tap.test("63 - tags with attributes", (t) => {
  t.same(stripHtml('aaaaaaa < div class="zzzz">x</div>'), "aaaaaaa x", "63");
  t.end();
});

tap.test("64 - tags with attributes", (t) => {
  t.same(stripHtml('aaaaaaa< div class="zzzz">x</div>'), "aaaaaaa x", "64");
  t.end();
});

tap.test("65 - tags with attributes", (t) => {
  t.same(stripHtml('< div class="zzzz">x</div>'), "x", "65");
  t.end();
});

tap.test("66 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb"),
    "aaaa something bbbbb",
    "66"
  );
  t.end();
});

tap.test("67 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb"),
    "aaaa something bbbbb",
    "67"
  );
  t.end();
});

tap.test("68 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "68"
  );
  t.end();
});

tap.test("69 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "69"
  );
  t.end();
});

tap.test("70 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "70"
  );
  t.end();
});

tap.test("71 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "71"
  );
  t.end();
});

tap.test("72 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "72"
  );
  t.end();
});

tap.test("73 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "73"
  );
  t.end();
});

tap.test("74 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"],
    }),
    "x z",
    "74"
  );
  t.end();
});

tap.test("75 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "75"
  );
  t.end();
});

tap.test("76 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "76"
  );
  t.end();
});

tap.test("77 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text'
    ),
    "some text more text",
    "77 - sneaky HTML character-encoded brackets"
  );
  t.end();
});

// 03. strips tag pairs including content in-between
// -----------------------------------------------------------------------------

tap.test(
  "78 - tag pairs including content - healthy, typical style tag pair",
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
      "78"
    );
    t.end();
  }
);

tap.test(
  `79 - tag pairs including content - mismatching quotes "text/css'`,
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
      `79`
    );
    t.end();
  }
);

tap.test(
  `80 - tag pairs including content - mismatching quotes 'text/css"`,
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
      "80"
    );
    t.end();
  }
);

tap.test(
  "81 - tag pairs including content - via opts.stripTogetherWithTheirContents - tight inside",
  (t) => {
    t.same(
      stripHtml("a<b>c</b>d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "81"
    );
    t.end();
  }
);

tap.test(
  "82 - tag pairs including content - via opts.stripTogetherWithTheirContents - copious inner whitespace",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   /   b   >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "82 - whitespace within the tag"
    );
    t.end();
  }
);

tap.test(
  "83 - tag pairs including content - via opts.stripTogetherWithTheirContents - closing slash wrong side",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<     b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "83"
    );
    t.end();
  }
);

tap.test(
  "84 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "84 - two closing slashes"
    );
    t.end();
  }
);

tap.test(
  "85 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   //    b   //    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "85 - multiple duplicated closing slashes"
    );
    t.end();
  }
);

tap.test(
  "86 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   //  <  b   // >   >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "86 - multiple duplicated closing slashes"
    );
    t.end();
  }
);

tap.test(
  "87 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >c<   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a d",
      "87 - no closing slashes"
    );
    t.end();
  }
);

tap.test(
  "88 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
        stripTogetherWithTheirContents: ["e", "b"],
      }),
      "a\n\nd",
      "88 - no closing slashes"
    );
    t.end();
  }
);

tap.test(
  "89 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<b>c</b>d<e>f</e>g", {
        stripTogetherWithTheirContents: ["b", "e"],
      }),
      "a d g",
      "89"
    );
    t.end();
  }
);

tap.test(
  "90 - tag pairs including content - via opts.stripTogetherWithTheirContents",
  (t) => {
    t.same(
      stripHtml("a<bro>c</bro>d<e>f</e>g", {
        stripTogetherWithTheirContents: ["b", "e"],
      }),
      "a c d g",
      "90 - sneaky similarity, bro starts with b"
    );
    t.end();
  }
);

tap.test("91 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ),
    "Text and some more.",
    "91 - strips with attributes. Now resembling real life."
  );
  t.end();
});

tap.test("92 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ),
    "Text and some more.",
    "92 - lots of spaces within tags"
  );
  t.end();
});

tap.test("93 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: [],
    }),
    "a c d",
    "93 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("94 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null,
    }),
    "a c d",
    "94 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("95 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false,
    }),
    "a c d",
    "95 - override stripTogetherWithTheirContents to an empty array"
  );
  t.end();
});

tap.test("96 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b",
    }),
    "a d",
    "96 - opts.stripTogetherWithTheirContents is not array but string"
  );
  t.end();
});

tap.test("97 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b",
      }
    ),
    "a d",
    "97"
  );
  t.end();
});

tap.test("98 - tag pairs including content - ", (t) => {
  t.same(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"],
    }),
    "a c",
    "98 - single custom range tag"
  );
  t.end();
});

tap.test("99 - tag pairs including content - ", (t) => {
  t.throws(() => {
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: ["zzz", true, "b"],
      }
    );
  }, "99");
  t.end();
});

// 04. whacky inputs
// -----------------------------------------------------------------------------

tap.test("100 - whacky - sequence of empty <> - single", (t) => {
  t.same(stripHtml("<>"), "<>", "100");
  t.end();
});

tap.test("101 - whacky - sequence of empty <> - tight outside EOL", (t) => {
  t.same(stripHtml("<><>"), "<><>", "101");
  t.end();
});

tap.test(
  "102 - whacky - sequence of empty <> - tight outside, content",
  (t) => {
    t.same(stripHtml("a<><>b"), "a<><>b", "102");
    t.end();
  }
);

tap.test("103 - whacky - sequence of empty <> - just trimmed", (t) => {
  t.same(stripHtml("\na<><>b\n"), "a<><>b", "103");
  t.end();
});

tap.test(
  "104 - whacky - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(stripHtml("text <<<<<<<<<<< text"), "text <<<<<<<<<<< text", "104");
    t.end();
  }
);

tap.test(
  "105 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(
      stripHtml("text <<<<<<<<<<< text <<<<<<<<<<< text"),
      "text <<<<<<<<<<< text <<<<<<<<<<< text",
      "105"
    );
    t.end();
  }
);

tap.test(
  "106 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(
      stripHtml("<article> text <<<<<<<<<<< text </article>"),
      "text <<<<<<<<<<< text",
      "106"
    );
    t.end();
  }
);

tap.test(
  "107 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    // will not remove
    t.same(
      stripHtml("text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3"),
      "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3",
      "107"
    );
    t.end();
  }
);

tap.test(
  "108 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(
      stripHtml("<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>"),
      "text1 <<<<<<<<<<< text2 >>>>>>>>> text3",
      "108"
    );
    t.end();
  }
);

// 05. multiple ranged tags
// -----------------------------------------------------------------------------

tap.test("109 - multiple ranged tags - with text in between", (t) => {
  t.same(
    stripHtml(
      "code here and here <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more"
    ),
    "code here and here and also some here and finally here some more and also some here and finally here some more and also some here and finally here some more",
    "109"
  );
  t.end();
});

tap.test("110 - multiple ranged tags - tags touching each other", (t) => {
  t.same(
    stripHtml(
      "code here and here <style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script> and finally here some more"
    ),
    "code here and here and finally here some more",
    "110"
  );
  t.end();
});

tap.test(
  "111 - multiple ranged tags - lots of dodgy slashes around and within tags",
  (t) => {
    t.same(
      stripHtml(
        "///</a>///<a/>///</ a>///< /a></ a>///< /a>///</ a />///</a/>///< / a / >///"
      ),
      "/// /// /// /// /// /// /// /// ///",
      "111"
    );
    t.end();
  }
);

tap.test(
  "112 - multiple ranged tags - this time repeated slashes inside",
  (t) => {
    t.same(
      stripHtml(
        "///<///a>///<a/////>///<//// a>///< ///a><// a>///< ///a>///<// a //>///<///a///>///< //// a //// >///"
      ),
      "/// /// /// /// /// /// /// /// ///",
      "112"
    );
    t.end();
  }
);

tap.test(
  "113 - multiple ranged tags - and the same but with bunch of line breaks and tabs",
  (t) => {
    // line breaks within tag doesn't count - the new line breaks should not be introduced!
    t.same(
      stripHtml(
        "///</\n/\n/\ta>///<a\n///\n//\t>///<\n////\t a>///< /\n//\na><// \ta>///<\n\n\n\n ///a>///<\t\t\t\t// \n\n\na //>///<\n\n\n///a\n///\n>///<\n //// \na\n //// \n>///"
      ),
      "/// /// /// /// /// /// /// /// ///",
      "113"
    );
    t.end();
  }
);

tap.test(
  "114 - multiple ranged tags - lots of dodgy exclamation marks around and within tags",
  (t) => {
    t.same(
      stripHtml(
        "zzz<!a>zzz<a!>zzz<! a>zzz< !a><! a>zzz< !a>zzz<! a !>zzz<!a!>zzz< ! a ! >zzz"
      ),
      "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
      "114"
    );
    t.end();
  }
);

tap.test(
  "115 - multiple ranged tags - this time repeated exclamation marks inside",
  (t) => {
    t.same(
      stripHtml(
        "zzz<!!!a>zzz<a!!!!!>zzz<!!!! a>zzz< !!!a><!! a>zzz< !!!a>zzz<!! a !!>zzz<!!!a!!!>zzz< !!!! a !!!! >zzz"
      ),
      "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
      "115"
    );
    t.end();
  }
);

tap.test(
  "116 - multiple ranged tags - and the same but with bunch of line breaks and tabs",
  (t) => {
    t.same(
      stripHtml(
        "zzz<!\n!\n!\ta>zzz<a\n!!!\n!!\t>zzz<\n!!!!\t a>zzz< !\n!!\na><!! \ta>zzz<\n\n\n\n !!!a>zzz<\t\t\t\t!! \n\n\na !!>zzz<\n\n\n!!!a\n!!!\n>zzz<\n !!!! \na\n !!!! \n>zzz"
      ),
      "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
      "116"
    );
    t.end();
  }
);

// 06. whitespace control
// -----------------------------------------------------------------------------

tap.test("117 - whitespace control - line breaks between tags", (t) => {
  t.same(
    stripHtml("something <a> \n\n to <a> put here to test"),
    "something\n\nto put here to test",
    "117"
  );
  t.end();
});

tap.test("118 - whitespace control - line breaks within tag", (t) => {
  t.same(
    stripHtml("something <a\n\n>  to <a> put here to test"),
    "something to put here to test",
    "118"
  );
  t.end();
});

tap.test("119 - whitespace control - leading inner tag linebreaks", (t) => {
  t.same(
    stripHtml("something <\n\na>  to <a> put here to test"),
    "something to put here to test",
    "119"
  );
  t.end();
});

tap.test(
  "120 - whitespace control - multiple tags, inner trailing linebreaks",
  (t) => {
    t.same(
      stripHtml("something <a>  to <a\n\n> put here to test"),
      "something to put here to test",
      "120"
    );
    t.end();
  }
);

tap.test(
  "121 - whitespace control - multiple tags, inner leading linebreaks",
  (t) => {
    t.same(
      stripHtml("something <a>  to <\n\na> put here to test"),
      "something to put here to test",
      "121"
    );
    t.end();
  }
);

tap.test(
  "122 - whitespace control - tabs and linebreaks inside, multiple tags",
  (t) => {
    t.same(
      stripHtml("something <\t\na\n>  to <a\n\n> put here to test"),
      "something to put here to test",
      "122"
    );
    t.end();
  }
);

tap.test("123 - whitespace control - even this", (t) => {
  t.same(
    stripHtml("something <\n\na\t>\t\t\t\t\t  to \t<\n\na\t> put here to test"),
    "something to put here to test",
    "123"
  );
  t.end();
});

// 07. CDATA
// -----------------------------------------------------------------------------

tap.test("124 - CDATA - tight", (t) => {
  // surroundings are not a linebreaks
  t.same(
    stripHtml(`a<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>b`),
    "a b",
    "124"
  );
  t.end();
});

tap.test("125 - CDATA - normal", (t) => {
  t.same(
    stripHtml(`a <![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]> b`),
    "a b",
    "125"
  );
  t.end();
});

tap.test("126 - CDATA - loose", (t) => {
  t.same(
    stripHtml(`a \t\t<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>       b`),
    "a b",
    "126"
  );
  t.end();
});

tap.test("127 - CDATA - single linebreaks", (t) => {
  // surroundings are linebreaks
  t.same(
    stripHtml(`a\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\nb`),
    "a\n\nb",
    "127"
  );
  t.end();
});

tap.test("128 - CDATA - excessive linebreaks", (t) => {
  t.same(
    stripHtml(`a\n\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\nb`),
    "a\n\nb",
    "128"
  );
  t.end();
});

tap.test("129 - CDATA - mixed linebreaks", (t) => {
  t.same(
    stripHtml(`a\n \t\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\n\t b`),
    "a\n\nb",
    "129"
  );
  t.end();
});

// 08. punctuation
// -----------------------------------------------------------------------------

tap.test("130 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c"), "a? c", "130");
  t.end();
});

tap.test("131 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c", { trimOnlySpaces: true }), "a? c", "131");
  t.end();
});

tap.test("132 - punctuation after tag - simplified, question mark", (t) => {
  t.same(
    stripHtml("a<b>?</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a? c",
    "132"
  );
  t.end();
});

tap.test("133 - punctuation after tag - simplified, question mark", (t) => {
  t.same(
    stripHtml("a<b>?</b> c", { stripTogetherWithTheirContents: false }),
    "a? c",
    "133"
  );
  t.end();
});

tap.test("134 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c", { ignoreTags: ["zzz"] }), "a? c", "134");
  t.end();
});

tap.test("135 - punctuation after tag - simplified, question mark", (t) => {
  t.same(
    stripHtml("a<b>?</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [5, 10, " "],
    ],
    "135"
  );
  t.end();
});

tap.test("136 - punctuation after tag - simplified, question mark", (t) => {
  t.same(stripHtml("a<b>?</b> c", { ignoreTags: null }), "a? c", "136");
  t.end();
});

tap.test("137 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b> c"), "a! c", "137");
  t.end();
});

tap.test("138 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b> c", { trimOnlySpaces: true }), "a! c", "138");
  t.end();
});

tap.test("139 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml(" \t a<b>!</b> c \t ", { trimOnlySpaces: true }),
    "\t a! c \t",
    "139"
  );
  t.end();
});

tap.test("140 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml("a<b>!</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a! c",
    "140"
  );
  t.end();
});

tap.test("141 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml("a<b>!</b> c", { stripTogetherWithTheirContents: false }),
    "a! c",
    "141"
  );
  t.end();
});

tap.test("142 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b> c", { ignoreTags: ["zzz"] }), "a! c", "142");
  t.end();
});

tap.test("143 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(
    stripHtml("a<b>!</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [5, 10, " "],
    ],
    "143"
  );
  t.end();
});

tap.test("144 - punctuation after tag - simplified, exclamation mark", (t) => {
  t.same(stripHtml("a<b>!</b>c"), "a! c", "144");
  t.end();
});

tap.test("145 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(stripHtml("a<b>...</b> c"), "a... c", "145");
  t.end();
});

tap.test("146 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(stripHtml("a<b>...</b> c", { trimOnlySpaces: true }), "a... c", "146");
  t.end();
});

tap.test("147 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(
    stripHtml("a<b>...</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a... c",
    "147"
  );
  t.end();
});

tap.test("148 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(
    stripHtml("a<b>...</b> c", { stripTogetherWithTheirContents: false }),
    "a... c",
    "148"
  );
  t.end();
});

tap.test("149 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(stripHtml("a<b>...</b> c", { ignoreTags: ["zzz"] }), "a... c", "149");
  t.end();
});

tap.test("150 - punctuation after tag - simplified, ellipsis", (t) => {
  t.same(
    stripHtml("a<b>...</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [7, 12, " "],
    ],
    "150"
  );
  t.end();
});

tap.test("151 - punctuation after tag - real-life", (t) => {
  // control
  t.same(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      '
    ),
    "Hi! Would you like to shop now?",
    "151"
  );
  t.end();
});

tap.test("152 - punctuation after tag - real-life", (t) => {
  t.same(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
    ),
    "Hi! Please shop now!",
    "152"
  );
  t.end();
});

tap.test("153 - punctuation after tag - real-life", (t) => {
  // opts.trimOnlySpaces
  t.same(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Would you like to shop now?      \u00A0",
    "153"
  );
  t.end();
});

tap.test("154 - punctuation after tag - real-life", (t) => {
  t.same(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Please shop now!      \u00A0",
    "154"
  );
  t.end();
});

// 09. opts.ignoreTags
// -----------------------------------------------------------------------------

tap.test(
  "155 - opts.ignoreTags - empty string, whitespace string and null in the array",
  (t) => {
    t.same(
      stripHtml("<a>", {
        ignoreTags: ["", " ", "a", "b", null],
      }),
      "<a>",
      "155"
    );
    t.end();
  }
);

tap.test("156 - opts.ignoreTags - null inside opts.ignoreTags array", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: [null],
    }),
    "",
    "156"
  );
  t.end();
});

tap.test("157 - opts.ignoreTags - null among opts.ignoreTags values", (t) => {
  t.same(
    stripHtml("<a>", {
      ignoreTags: [null, "a"],
    }),
    "<a>",
    "157"
  );
  t.end();
});

tap.test(
  "158 - opts.ignoreTags - whitespace-only blanks inside opts.ignoreTags",
  (t) => {
    t.same(
      stripHtml("a<a>", {
        ignoreTags: ["\t", "\n\n"],
      }),
      "a",
      "158"
    );
    t.end();
  }
);

tap.test(
  "159 - opts.ignoreTags - some whitespace-only inside opts.ignoreTags",
  (t) => {
    t.same(
      stripHtml("a<a>", {
        ignoreTags: ["\t", "\n\n", "a", " "],
      }),
      "a<a>",
      "159"
    );
    t.end();
  }
);

tap.test(
  "160 - opts.ignoreTags - space before and after attribute's equal character",
  (t) => {
    t.same(
      stripHtml("<article  whatnot  =  whatyes = >zzz< / article>"),
      "zzz",
      "160"
    );
    t.end();
  }
);

tap.test(
  "161 - opts.ignoreTags - space before and after attribute's equal character",
  (t) => {
    t.same(
      stripHtml(
        "<article  whatnot  =  whatyes = >xxx< / article> yyy <article  whatnot  =  whatyes = >zzz< / article>"
      ),
      "xxx yyy zzz",
      "161"
    );
    t.end();
  }
);

// 10. XML (sprinkled within HTML)
// -----------------------------------------------------------------------------

tap.test("162 - strips XML - strips Outlook XML fix block, tight", (t) => {
  t.same(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    "abc def",
    "162"
  );
  t.end();
});

tap.test(
  "163 - strips XML - strips Outlook XML fix block, leading space",
  (t) => {
    t.same(
      stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
      "abc def",
      "163"
    );
    t.end();
  }
);

tap.test(
  "164 - strips XML - strips Outlook XML fix block, trailing space",
  (t) => {
    t.same(
      stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
      "abc def",
      "164"
    );
    t.end();
  }
);

tap.test(
  "165 - strips XML - strips Outlook XML fix block, spaces around",
  (t) => {
    t.same(
      stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
      "abc def",
      "165"
    );
    t.end();
  }
);

tap.test("166 - strips XML - generous trailing space", (t) => {
  t.same(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`),
    "abc\n\ndef",
    "166"
  );
  t.end();
});

tap.test("167 - strips XML - trailing linebreaks", (t) => {
  t.same(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `),
    "abc",
    "167"
  );
  t.end();
});

tap.test("168 - strips XML - leading content", (t) => {
  t.same(
    stripHtml(`abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `),
    "abc",
    "168"
  );
  t.end();
});

tap.test("169 - strips XML - leading content", (t) => {
  t.same(
    stripHtml(`      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`),
    "abc",
    "169"
  );
  t.end();
});

// 11. false positives
// -----------------------------------------------------------------------------

tap.test(
  "170 - false positives - equations: very sneaky considering b is a legit tag name",
  (t) => {
    t.same(
      stripHtml("Equations are: a < b and c > d"),
      "Equations are: a < b and c > d",
      "170"
    );
    t.end();
  }
);

tap.test("171 - false positives - inwards-pointing arrows", (t) => {
  t.same(stripHtml("Look here: ---> a <---"), "Look here: ---> a <---", "171");
  t.end();
});

tap.test("172 - false positives - arrows mixed with tags", (t) => {
  t.same(
    stripHtml(
      "Look here: ---> a <--- and here: ---> b <--- oh, and few tags: <div><article>\nzz</article></div>"
    ),
    "Look here: ---> a <--- and here: ---> b <--- oh, and few tags:\nzz",
    "172"
  );
  t.end();
});

tap.test("173 - false positives - opening bracket", (t) => {
  t.same(stripHtml("<"), "<", "173");
  t.end();
});

tap.test("174 - false positives - closing bracket", (t) => {
  t.same(stripHtml(">"), ">", "174");
  t.end();
});

tap.test("175 - false positives - three openings", (t) => {
  t.same(stripHtml(">>>"), ">>>", "175");
  t.end();
});

tap.test("176 - false positives - three closings", (t) => {
  t.same(stripHtml("<<<"), "<<<", "176");
  t.end();
});

tap.test("177 - false positives - spaced three openings", (t) => {
  t.same(stripHtml(" <<< "), "<<<", "177");
  t.end();
});

tap.test(
  "178 - false positives - tight recognised opening tag name, missing closing",
  (t) => {
    t.same(stripHtml("<a"), "", "178");
    t.end();
  }
);

tap.test(
  "179 - false positives - unrecognised opening tag, missing closing",
  (t) => {
    t.same(stripHtml("<yo"), "", "179");
    t.end();
  }
);

tap.test("180 - false positives - missing opening, recognised tag", (t) => {
  t.same(stripHtml("a>"), "a>", "180");
  t.end();
});

tap.test("181 - false positives - missing opening, unrecognised tag", (t) => {
  t.same(stripHtml("yo>"), "yo>", "181");
  t.end();
});

tap.test(
  "182 - false positives - conditionals that appear on Outlook only",
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
      "182"
    );
    t.end();
  }
);

tap.test(
  "183 - false positives - conditionals that are visible for Outlook only",
  (t) => {
    t.same(
      stripHtml(`<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->`),
      "shown for everything except Outlook",
      "183 - checking also for whitespace control"
    );
    t.end();
  }
);

tap.test(
  "184 - false positives - conditionals that are visible for Outlook only",
  (t) => {
    t.same(
      stripHtml(`a<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->b`),
      "a\nshown for everything except Outlook\nb",
      "184 - checking also for whitespace control"
    );
    t.end();
  }
);

tap.test(
  "185 - false positives - conditionals that are visible for Outlook only",
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
      "185 - all those line breaks in-between the tags need to be taken care of too"
    );
    t.end();
  }
);

tap.test("186 - false positives - consecutive tags", (t) => {
  t.same(
    stripHtml(
      "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after"
    ),
    "Text First point Second point Third point Text straight after",
    "186"
  );
  t.end();
});

// ==============================
// 12. opts.ignoreTags
// ==============================

tap.test("187 - opts.ignoreTags - ignores single letter tag", (t) => {
  t.same(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"],
    }),
    "Some <b>text</b> and some more text.",
    "187"
  );
  t.end();
});

tap.test("188 - opts.ignoreTags - ignores singleton tag", (t) => {
  t.same(
    stripHtml("Some text <hr> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    "Some text <hr> some more text.",
    "188"
  );
  t.end();
});

tap.test("189 - opts.ignoreTags - ignores singleton tag, XHTML", (t) => {
  t.same(
    stripHtml("Some text <hr/> some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    "Some text <hr/> some more text.",
    "189"
  );
  t.end();
});

tap.test("190 - opts.ignoreTags - ignores singleton tag, spaced XHTML", (t) => {
  t.same(
    stripHtml("Some text <hr / > some more <i>text</i>.", {
      ignoreTags: ["hr"],
    }),
    "Some text <hr / > some more text.",
    "190"
  );
  t.end();
});

tap.test("191 - opts.ignoreTags - ignores single zzz tag", (t) => {
  t.same(
    stripHtml("Some <zzz>text</zzz> and some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }),
    "Some <zzz>text</zzz> and some more text.",
    "191"
  );
  t.end();
});

tap.test("192 - opts.ignoreTags - ignores zzz singleton tag", (t) => {
  t.same(
    stripHtml("Some text <zzz> some more <i>text</i>.", {
      ignoreTags: ["zzz"],
    }),
    "Some text <zzz> some more text.",
    "192"
  );
  t.end();
});

tap.test("193 - opts.ignoreTags - ignores default ranged tag", (t) => {
  t.same(
    stripHtml("Some <script>text</script> and some more <i>text</i>.", {
      ignoreTags: ["script"],
    }),
    "Some <script>text</script> and some more text.",
    "193"
  );
  t.end();
});

tap.test(
  "194 - opts.ignoreTags - ignored tag unclosed, ending with EOF",
  (t) => {
    // just for kicks:
    t.same(
      stripHtml("Some <b>text</b", {
        ignoreTags: ["b"],
      }),
      "Some <b>text</b",
      "194 - if user insists, that missing bracket must be intentional"
    );
    t.end();
  }
);

tap.test(
  "195 - opts.ignoreTags - recognised unclosed singleton tag, HTML",
  (t) => {
    t.same(
      stripHtml("Some text <hr", {
        ignoreTags: ["hr"],
      }),
      "Some text <hr",
      "195"
    );
    t.end();
  }
);

tap.test(
  "196 - opts.ignoreTags - recognised unclosed singleton tag, XHTML",
  (t) => {
    t.same(
      stripHtml("Some text <hr/", {
        ignoreTags: ["hr"],
      }),
      "Some text <hr/",
      "196"
    );
    t.end();
  }
);

tap.test(
  "197 - opts.ignoreTags - kept the tag and the slash, just trimmed",
  (t) => {
    t.same(
      stripHtml("Some text <hr / ", {
        ignoreTags: ["hr"],
      }),
      "Some text <hr /",
      "197"
    );
    t.end();
  }
);

tap.test(
  "198 - opts.ignoreTags - ignores unclosed self-closing zzz tag",
  (t) => {
    t.same(
      stripHtml("Some <zzz>text</zzz", {
        ignoreTags: ["zzz"],
      }),
      "Some <zzz>text</zzz",
      "198"
    );
    t.end();
  }
);

tap.test("199 - opts.ignoreTags - ignores unclosed zzz singleton tag", (t) => {
  t.same(
    stripHtml("Some text <zzz", {
      ignoreTags: ["zzz"],
    }),
    "Some text <zzz",
    "199"
  );
  t.end();
});

tap.test("200 - opts.ignoreTags - ignores default unclosed ranged tag", (t) => {
  t.same(
    stripHtml("Some <script>text</script", {
      ignoreTags: ["script"],
    }),
    "Some <script>text</script",
    "200"
  );
  t.end();
});

// ==============================
// 13. whitespace control
// ==============================

tap.test(
  "201 - whitespace control - adds a space in place of stripped tags, tight",
  (t) => {
    t.same(stripHtml("a<div>b</div>c"), "a b c", "201");
    t.end();
  }
);

tap.test(
  "202 - whitespace control - adds a space in place of stripped tags, loose",
  (t) => {
    t.same(
      stripHtml("a <div>   b    </div>    c"),
      "a b c",
      "202 - stays on one line because it was on one line"
    );
    t.end();
  }
);

tap.test(
  "203 - whitespace control - adds a space in place of stripped tags, tabs and LF's",
  (t) => {
    t.same(
      stripHtml("\t\t\ta <div>   b    </div>    c\n\n\n"),
      "a b c",
      "203 - like 02 above but with trimming"
    );
    t.end();
  }
);

tap.test(
  "204 - whitespace control - adds a linebreak between each substring piece",
  (t) => {
    t.same(
      stripHtml(`a


  <div>
    b
  </div>
c`),
      "a\n\nb\n\nc",
      "204"
    );
    t.end();
  }
);

tap.test("205 - whitespace control - multiple tag combo case #1", (t) => {
  t.same(stripHtml("z<a><b>c</b></a>y"), "z c y", "205");
  t.end();
});

tap.test("206 - whitespace control - multiple tag combo case #2", (t) => {
  t.same(
    stripHtml(`
      z
        <a>
          <b class="something anything">
            c
          </b>
        </a>
      y`),
    "z\n\nc\n\ny",
    "206"
  );
  t.end();
});

tap.test("207 - whitespace control - dirty html, trailing space", (t) => {
  t.same(
    stripHtml("something <article>article> here"),
    "something here",
    "207"
  );
  t.end();
});

tap.test("208 - whitespace control - dirty html, few trailing spaces", (t) => {
  t.same(
    stripHtml("something <article>article>   here"),
    "something here",
    "208"
  );
  t.end();
});

// 14. comments
// -----------------------------------------------------------------------------

tap.test("209 - strips HTML comments", (t) => {
  // group #1. spaces on both outsides
  t.same(
    stripHtml("aaa <!-- <tr> --> bbb"),
    "aaa bbb",
    "209.01 - double space"
  );
  t.same(stripHtml("aaa <!-- <tr>--> bbb"), "aaa bbb", "209.02 - single space");
  t.same(stripHtml("aaa <!--<tr> --> bbb"), "aaa bbb", "209.03 - single space");
  t.same(stripHtml("aaa <!--<tr>--> bbb"), "aaa bbb", "209.04 - no space");

  // group #2. spaces on right only
  t.same(stripHtml("aaa<!-- <tr> --> bbb"), "aaa bbb", "209.05 - double space");
  t.same(stripHtml("aaa<!-- <tr>--> bbb"), "aaa bbb", "209.06 - single space");
  t.same(stripHtml("aaa<!--<tr> --> bbb"), "aaa bbb", "209.07 - single space");
  t.same(stripHtml("aaa<!--<tr>--> bbb"), "aaa bbb", "209.08 - no space");

  // group #3. spaces on left only
  t.same(stripHtml("aaa <!-- <tr> -->bbb"), "aaa bbb", "209.09 - double space");
  t.same(stripHtml("aaa <!-- <tr>-->bbb"), "aaa bbb", "209.10 - single space");
  t.same(stripHtml("aaa <!--<tr> -->bbb"), "aaa bbb", "209.11 - single space");
  t.same(stripHtml("aaa <!--<tr>-->bbb"), "aaa bbb", "209.12 - no space");

  // group #4. no spaces outside
  t.same(stripHtml("aaa<!-- <tr> -->bbb"), "aaa bbb", "209.13 - double space");
  t.same(stripHtml("aaa<!-- <tr>-->bbb"), "aaa bbb", "209.14 - single space");
  t.same(stripHtml("aaa<!--<tr> -->bbb"), "aaa bbb", "209.15 - single space");
  t.same(stripHtml("aaa<!--<tr>-->bbb"), "aaa bbb", "209.16 - no space");
  t.end();
});

tap.test("210 - HTML comments around string edges", (t) => {
  t.same(stripHtml("aaa <!-- <tr> --> "), "aaa", "210.01");
  t.same(stripHtml("aaa <!-- <tr> -->"), "aaa", "210.02");

  t.same(stripHtml(" <!-- <tr> --> aaa"), "aaa", "210.03");
  t.same(stripHtml("<!-- <tr> -->aaa"), "aaa", "210.04");

  t.same(stripHtml(" <!-- <tr> --> aaa <!-- <tr> -->"), "aaa", "210.05");
  t.same(stripHtml("<!-- <tr> -->aaa<!-- <tr> -->"), "aaa", "210.06");
  t.same(stripHtml("   <!-- <tr> -->aaa<!-- <tr> -->   "), "aaa", "210.07");
  t.end();
});

tap.test("211 - range tag is unclosed", (t) => {
  // no content besides ranged tag:
  t.same(stripHtml('<script>alert("123")</script'), "", "211.01");
  t.same(stripHtml("<script>alert('123')</script"), "", "211.02");
  t.same(stripHtml('<script>alert("123")<script'), "", "211.03");
  t.same(stripHtml("<script>alert('123')<script"), "", "211.04");
  t.same(stripHtml('<script>alert("123")</ script'), "", "211.05");
  t.same(stripHtml("<script>alert('123')</ script"), "", "211.06");

  // single letter left:
  t.same(stripHtml('a<script>alert("123")</script'), "a", "211.07");
  t.same(stripHtml("a<script>alert('123')</script"), "a", "211.08");
  t.same(stripHtml('a<script>alert("123")<script'), "a", "211.09");
  t.same(stripHtml("a<script>alert('123')<script"), "a", "211.10");
  t.same(stripHtml('a<script>alert("123")</ script'), "a", "211.11");
  t.same(stripHtml("a<script>alert('123')</ script"), "a", "211.12");

  // script excluded from ranged tags, so now only tags are removed, no contents between:
  t.same(
    stripHtml('a<script>alert("123")</script', {
      stripTogetherWithTheirContents: [],
    }),
    'a alert("123")',
    "211.13"
  );
  t.same(
    stripHtml("a<script>alert('123')</script", {
      stripTogetherWithTheirContents: [],
    }),
    "a alert('123')",
    "211.14"
  );
  t.same(
    stripHtml('a<script>alert("123")<script', {
      stripTogetherWithTheirContents: [],
    }),
    'a alert("123")',
    "211.15"
  );
  t.same(
    stripHtml("a<script>alert('123')<script", {
      stripTogetherWithTheirContents: [],
    }),
    "a alert('123')",
    "211.16"
  );
  t.same(
    stripHtml('a<script>alert("123")</ script', {
      stripTogetherWithTheirContents: [],
    }),
    'a alert("123")',
    "211.17"
  );
  t.same(
    stripHtml("a<script>alert('123')</ script", {
      stripTogetherWithTheirContents: [],
    }),
    "a alert('123')",
    "211.18"
  );

  // script tag ignored and left intact (opts.ignoreTags):
  t.same(
    stripHtml('a<script>alert("123")</script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</script',
    "211.19"
  );
  t.same(
    stripHtml("a<script>alert('123')</script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</script",
    "211.20"
  );
  t.same(
    stripHtml('a<script>alert("123")<script', { ignoreTags: ["script"] }),
    'a<script>alert("123")<script',
    "211.21"
  );
  t.same(
    stripHtml("a<script>alert('123')<script", { ignoreTags: ["script"] }),
    "a<script>alert('123')<script",
    "211.22"
  );
  t.same(
    stripHtml('a<script>alert("123")</ script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</ script',
    "211.23"
  );
  t.same(
    stripHtml("a<script>alert('123')</ script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</ script",
    "211.24"
  );
  t.end();
});

tap.test("212 - false positives #1 - Nunjucks code", (t) => {
  t.same(stripHtml("a< 2zzz==>b"), "a< 2zzz==>b", "212");
  t.end();
});

tap.test("213 - unclosed tag followed by another tag - range tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script<body>'), "", "213");
  t.end();
});

tap.test("214 - unclosed tag followed by self-closing tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script</body>'), "", "214");
  t.end();
});

tap.test("215 - unclosed tag followed by another tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script</ body>'), "", "215");
  t.end();
});

tap.test("216 - unclosed tag followed by another tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script<body/>'), "", "216");
  t.end();
});

tap.test("217 - unclosed tag followed by another unclosed tag", (t) => {
  t.same(stripHtml('<script>alert("123")</script<body'), "", "217");
  t.end();
});

tap.test("218 - unclosed tag followed by another tag - non-range tag", (t) => {
  t.same(stripHtml("<article>text here</article<body>"), "text here", "218");
  t.end();
});

tap.test(
  "219 - unclosed tag followed by another tag - non-range, self-closing tag",
  (t) => {
    t.same(stripHtml("<article>text here</article</body>"), "text here", "219");
    t.end();
  }
);

tap.test(
  "220 - unclosed tag followed by another tag - self-closing, inner whitespace",
  (t) => {
    t.same(
      stripHtml("<article>text here</article</ body>"),
      "text here",
      "220"
    );
    t.end();
  }
);

tap.test(
  "221 - unclosed tag followed by another tag - with closing slash",
  (t) => {
    t.same(stripHtml("<article>text here</article<body/>"), "text here", "221");
    t.end();
  }
);

tap.test("222 - unclosed tag followed by another tag - html", (t) => {
  t.same(stripHtml("<article>text here</article<body"), "text here", "222");
  t.end();
});

tap.test(
  "223 - unclosed tag followed by another tag - strips many tags",
  (t) => {
    t.same(stripHtml("a<something<anything<whatever<body<html"), "a", "223");
    t.end();
  }
);

tap.test(
  "224 - unclosed tag followed by another tag - bails because of spaces",
  (t) => {
    t.same(
      stripHtml("a < something < anything < whatever < body < html"),
      "a < something < anything < whatever < body < html",
      "224"
    );
    t.end();
  }
);

tap.test(
  "225 - range tags are overlapping - both default known range tags",
  (t) => {
    t.same(
      stripHtml("<script>tra la <style>la</script>la la</style> rr"),
      "rr",
      "225"
    );
    t.end();
  }
);

tap.test(
  "226 - range tags are overlapping - both were just custom-set",
  (t) => {
    t.same(
      stripHtml("<zzz>tra la <yyy>la</zzz>la la</yyy> rr", {
        stripTogetherWithTheirContents: ["zzz", "yyy"],
      }),
      "rr",
      "226"
    );
    t.end();
  }
);

tap.test("227 - range tags are overlapping - nested", (t) => {
  t.same(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"],
    }),
    "rr",
    "227"
  );
  t.end();
});

// 15. opts.returnRangesOnly
// -----------------------------------------------------------------------------

tap.test("228 - opts.returnRangesOnly - anchor wrapping text", (t) => {
  // both default known range tags
  t.same(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "228.01 - default"
  );
  t.same(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "228.02 - hardcoded defaults"
  );
  t.same(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.',
      { returnRangesOnly: true }
    ),
    [
      [9, 43, " "],
      [51, 56, " "],
    ],
    "228.03 - opts"
  );
  t.end();
});

tap.test("229 - opts.returnRangesOnly - no tags were present at all", (t) => {
  // t.same(stripHtml("Some text"), "Some text", "15.02.01 - control");
  t.same(
    stripHtml("Some text", {
      returnRangesOnly: true,
    }),
    [],
    "229 - returns empty array (no ranges inside)"
  );
  t.end();
});

// 16. opts.trimOnlySpaces
// -----------------------------------------------------------------------------

tap.test(
  "230 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all",
  (t) => {
    t.same(stripHtml("\xa0 a \xa0"), "a", "230");
    t.end();
  }
);

tap.test(
  "231 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all, trailing whitespace",
  (t) => {
    t.same(stripHtml(" \xa0 a \xa0 "), "a", "231");
    t.end();
  }
);

tap.test("232 - opts.trimOnlySpaces - opts.trimOnlySpaces = on", (t) => {
  t.same(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "232"
  );
  t.end();
});

tap.test("233 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, loose", (t) => {
  t.same(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "233"
  );
  t.end();
});

tap.test("234 - opts.trimOnlySpaces - default", (t) => {
  t.same(stripHtml("\xa0 <article> \xa0"), "", "234");
  t.end();
});

tap.test("235 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, tag", (t) => {
  t.same(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: true }),
    "\xa0\xa0",
    "235"
  );
  t.end();
});

tap.test(
  "236 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, two tags",
  (t) => {
    t.same(
      stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: true }),
      "\xa0 \xa0",
      "236"
    );
    t.end();
  }
);

tap.test("237 - opts.trimOnlySpaces - whitespace around", (t) => {
  t.same(stripHtml(" \xa0 <article> \xa0 "), "", "237");
  t.end();
});

tap.test(
  "238 - opts.trimOnlySpaces - whitespace around, trimOnlySpaces = on",
  (t) => {
    t.same(
      stripHtml(" \xa0 <article> \xa0 ", { trimOnlySpaces: true }),
      "\xa0\xa0",
      "238"
    );
    t.end();
  }
);

tap.test(
  "239 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all",
  (t) => {
    t.same(stripHtml(" \t a \n "), "a", "239");
    t.end();
  }
);

tap.test(
  "240 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - trimOnlySpaces = on",
  (t) => {
    t.same(stripHtml(" \t a \n ", { trimOnlySpaces: true }), "\t a \n", "240");
    t.end();
  }
);

tap.test(
  "241 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - CRLF",
  (t) => {
    t.same(
      stripHtml(" \t\n a \r\n ", { trimOnlySpaces: true }),
      "\t\n a \r\n",
      "241"
    );
    t.end();
  }
);

tap.test(
  "242 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - tag",
  (t) => {
    t.same(stripHtml("\t\r\n <article> \t\r\n"), "", "242");
    t.end();
  }
);

tap.test("243 - opts.trimOnlySpaces - tabs and CRLF", (t) => {
  t.same(
    stripHtml("\t\r\n <article> \t\r\n", { trimOnlySpaces: true }),
    "\t\r\n\t\r\n",
    "243"
  );
  t.end();
});

tap.test(
  "244 - opts.trimOnlySpaces - spaced tabs and CRs, trimOnlySpaces = on",
  (t) => {
    t.same(
      stripHtml(" \t \r \n <article> \t \r \n ", { trimOnlySpaces: true }),
      "\t \r \n\t \r \n",
      "244"
    );
    t.end();
  }
);

tap.test(
  "245 - opts.trimOnlySpaces - combos of tags and whitespace, trimOnlySpaces = on",
  (t) => {
    t.same(
      stripHtml(" \n <article> \xa0 <div> \xa0 </article> \t ", {
        trimOnlySpaces: true,
      }),
      "\n \t",
      "245"
    );
    t.end();
  }
);

tap.test("246 - opts.trimOnlySpaces - tags, trimOnlySpaces = on", (t) => {
  t.same(
    stripHtml(" \na<article> \xa0 <div> \xa0 </article>b\t ", {
      trimOnlySpaces: true,
    }),
    "\na b\t",
    "246"
  );
  t.end();
});

tap.test("247 - opts.trimOnlySpaces - letters around are retained", (t) => {
  t.same(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
    }),
    "\n a b \t",
    "247"
  );
  t.end();
});

tap.test("248 - opts.trimOnlySpaces - opts.ignoreTags combo", (t) => {
  t.same(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"],
    }),
    "\n a <div> b \t",
    "248"
  );
  t.end();
});

tap.test(
  "249 - opts.trimOnlySpaces - opts.ignoreTags combo - plausible but recognised",
  (t) => {
    t.same(
      stripHtml(" \n a <article> \xa0 < div> \xa0 </article> b \t ", {
        trimOnlySpaces: true,
        ignoreTags: ["div"],
      }),
      "\n a < div> b \t",
      "249"
    );
    t.end();
  }
);

// 17. opts.dumpLinkHrefsNearby
// -----------------------------------------------------------------------------

tap.test("250 - opts.dumpLinkHrefsNearby - clean code, double quotes", (t) => {
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening'
    ),
    "Let's watch RT news this evening",
    "250.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "250.02 - control, hardcoded default"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "250.03 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@thesun.co.uk" target="_blank">The Sun</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "250.04 - mailto links without customisation"
  );
  t.same(
    stripHtml(
      'Here\'s the <a href="mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night" target="_blank">chief editor\'s</a> email.',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "250.05 - mailto links with customisation"
  );
  t.end();
});

tap.test("251 - opts.dumpLinkHrefsNearby - clean code, single quotes", (t) => {
  t.same(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening"
    ),
    "Let's watch RT news this evening",
    "251.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "251.02 - control, hardcoded default"
  );
  t.same(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "251.03 - control, default behaviour"
  );
  t.same(
    stripHtml(
      "Let's sell some juicy gossip to the <a href='mailto:gossip@thesun.co.uk' target='_blank'>The Sun</a> right now!",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "251.04 - mailto links without customisation"
  );
  t.same(
    stripHtml(
      "Here's the <a href='mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night' target='_blank'>chief editor's</a> email.",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "251.05 - mailto links with customisation"
  );
  t.end();
});

tap.test(
  "252 - opts.dumpLinkHrefsNearby - dirty code, HTML is chopped but href captured",
  (t) => {
    t.same(
      stripHtml('Let\'s watch <a href="https://www.rt.com/" targ'),
      "Let's watch",
      "252.01 - control, default behaviour"
    );
    t.same(
      stripHtml('Let\'s watch <a href="https://www.rt.com/" targ', {
        dumpLinkHrefsNearby: { enabled: true },
      }),
      "Let's watch https://www.rt.com/",
      "252.02 - only href contents are left after stripping"
    );
    t.end();
  }
);

tap.test("253 - opts.dumpLinkHrefsNearby - linked image", (t) => {
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "253.01 - control, default"
  );
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "a b",
    "253.02 - control, hardcoded default"
  );
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "a https://codsen.com b",
    "253.03 - dumps href of a linked image"
  );
  t.end();
});

tap.test("254 - opts.dumpLinkHrefsNearby - .putOnNewLine", (t) => {
  // control
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "254.01 - control, default, off"
  );

  // control
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: false, // <-------------   !
        },
      }
    ),
    "a https://codsen.com b",
    "254.02 - dumpLinkHrefsNearby = on; putOnNewLine = off"
  );

  // control
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true, // <-------------   !
        },
      }
    ),
    "a\n\nhttps://codsen.com\n\nb",
    "254.03 - dumpLinkHrefsNearby = on; putOnNewLine = on"
  );

  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true,
          wrapHeads: "[", // <------------   !
          wrapTails: "]", // <-------------   !
        },
      }
    ),
    "a\n\n[https://codsen.com]\n\nb",
    "254.04 - dumpLinkHrefsNearby = on; putOnNewLine = on; wrapHeads = on; wrapTails = on;"
  );
  t.end();
});

tap.test("255 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails", (t) => {
  // control
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`
    ),
    "a z b",
    "255.01 - control, default"
  );

  // default dump
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
        },
      }
    ),
    "a z https://codsen.com b",
    "255.02 - heads only"
  );

  // wrap heads only
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
        },
      }
    ),
    "a z [https://codsen.com b",
    "255.03 - heads only"
  );

  // wrap heads only
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapTails: "]",
        },
      }
    ),
    "a z https://codsen.com] b",
    "255.04 - tails only"
  );

  // wrap heads only
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      }
    ),
    "a z [https://codsen.com] b",
    "255.05 - tails only"
  );

  // + ignoreTags
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        ignoreTags: "div",
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      }
    ),
    "a <div>z</div> [https://codsen.com] b",
    "255.06 - ignore on a div only"
  );

  // + ignoreTags
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        ignoreTags: "", // <--------- it's an empty string! Will be ignored.
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      }
    ),
    "a z [https://codsen.com] b",
    "255.07 - ignore on a div only"
  );

  // + stripTogetherWithTheirContents
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        stripTogetherWithTheirContents: "div",
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      }
    ),
    "a [https://codsen.com] b",
    "255.08 - whole div pair is removed"
  );
  t.end();
});

// 18. opts.onlyStripTags
// -----------------------------------------------------------------------------

tap.test("256 - opts.onlyStripTags - base cases", (t) => {
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "256.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "z" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
    "256.02 - non-existent tag option - leaves all tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: null }
    ),
    "Let's watch RT news this evening",
    "256.03 - falsey option"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [] }
    ),
    "Let's watch RT news this evening",
    "256.04 - no tags mentioned, will strip all"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [""] }
    ),
    "Let's watch RT news this evening",
    "256.05 - empty strings will be removed and will become default, blank setting"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["\t", "\n"] }
    ),
    "Let's watch RT news this evening",
    "256.06 - same, whitespace entries will be removed, setting will become default - strip all"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "256.07 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "a" }
    ),
    "Let's watch <b>RT news</b> this evening",
    "256.08 - only strip anchor tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["a"] }
    ),
    "Let's watch <b>RT news</b> this evening",
    "256.09 - only strip anchor tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "b" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "256.10 - only strip anchor tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["b"] }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "256.11 - only strip anchor tags"
  );
  t.end();
});

tap.test("257 - opts.onlyStripTags + opts.ignoreTags combo", (t) => {
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>'
    ),
    "Let's watch RT news this evening",
    "257.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a" }
    ),
    "<div>Let's watch <b>RT news</b> this evening</div>",
    "257.02"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { ignoreTags: "a" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "257.03"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a", ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "257.04 - both entries cancel each one out"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a", "b"], ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening</div>', // TODO - detect and skip adding the space here
    "257.05 - both entries cancel each one out"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a"], ignoreTags: ["a", "b"] }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "257.06 - both entries cancel each one out"
  );
  t.end();
});

tap.test("258 - opts.onlyStripTags - multiline text - defaults", (t) => {
  t.same(
    stripHtml(
      `Abc

<b>mn</b>

def`
    ),
    `Abc

mn

def`,
    "258"
  );
  t.end();
});

tap.test("259 - opts.onlyStripTags - multiline text - option on", (t) => {
  t.same(
    stripHtml(
      `Abc

<b>mn</b>
<i>op</i>
<u>qr</u>
<strong>st</strong>
<em>uv</em>

def`,
      {
        onlyStripTags: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "strong",
          "em",
          "u",
          "strike",
          "ul",
          "ol",
          "hr",
          "p",
          "li",
          "sub",
          "sup",
          "i",
          "b",
        ],
      }
    ),
    `Abc

mn
op
qr
st
uv

def`,
    "259"
  );
  t.end();
});

// 19. opts.cb
// -----------------------------------------------------------------------------

tap.test("260 - opts.cb - baseline, no ranges requested", (t) => {
  // baseline, notice dirty whitespace:
  t.same(
    stripHtml(`<div style="display: inline !important;" >abc</ div>`, {
      returnRangesOnly: false,
    }),
    "abc",
    "260"
  );
  t.end();
});

tap.test("261 - opts.cb - baseline, ranges requested", (t) => {
  t.same(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true,
    }),
    [
      [0, 6],
      [9, 16],
    ],
    "261"
  );
  t.end();
});

tap.test("262 - opts.cb - replace hr with tralala", (t) => {
  const cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, "<tralala>");
  };
  t.same(stripHtml("abc<hr>def", { cb }), "abc<tralala>def", "262.01");
  t.same(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "262.02"
  );
  t.end();
});

tap.test("263 - opts.cb - replace div with tralala", (t) => {
  const cb = ({
    tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(
      deleteFrom,
      deleteTo,
      `<${tag.slashPresent ? "/" : ""}tralala>`
    );
  };
  t.same(
    stripHtml("<div >abc</ div>", { cb }),
    "<tralala>abc</tralala>",
    "263.01"
  );
  t.same(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true,
      cb,
    }),
    [
      [0, 6, "<tralala>"],
      [9, 16, "</tralala>"],
    ],
    "263.02"
  );
  t.end();
});

tap.test("264 - opts.cb - replace only hr", (t) => {
  const cb = ({
    tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr,
    // proposedReturn
  }) => {
    if (tag.name === "hr") {
      rangesArr.push(
        deleteFrom,
        deleteTo,
        `<${tag.slashPresent ? "/" : ""}tralala>`
      );
    }
  };
  t.same(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { cb }),
    "abc<tralala>def<span>ghi</span>jkl",
    "264.01"
  );
  t.same(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "264.02"
  );
  t.end();
});

tap.test("265 - opts.cb - readme example one", (t) => {
  const cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, insert);
  };
  t.same(stripHtml("abc<hr>def", { cb }), "abc def", "265.01");
  t.same(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, " "]],
    "265.02"
  );
  t.end();
});

tap.test(
  "266 - opts.cb - ignored tags are also being pinged, with null values",
  (t) => {
    const capturedTags = [];
    const cb = ({
      tag,
      deleteFrom,
      deleteTo,
      insert,
      rangesArr,
      // proposedReturn
    }) => {
      rangesArr.push(deleteFrom, deleteTo, insert);
      capturedTags.push(tag.name);
    };
    const res = stripHtml("abc<hr>def<br>ghi", { cb, ignoreTags: ["hr"] });
    t.same(res, "abc<hr>def ghi", "266.01");
    t.same(capturedTags, ["hr", "br"], "266.02");
    t.end();
  }
);

tap.test(
  "267 - opts.cb - ignored tags are also being pinged, with null values",
  (t) => {
    const capturedTags = [];
    const cb = ({
      tag,
      deleteFrom,
      deleteTo,
      insert,
      rangesArr,
      // proposedReturn
    }) => {
      rangesArr.push(deleteFrom, deleteTo, insert);
      capturedTags.push(tag.name);
    };
    const res = stripHtml("abc<hr>def<br>ghi", {
      returnRangesOnly: true,
      cb,
      ignoreTags: ["hr"],
    });
    t.same(res, [[10, 14, " "]], "267.01");
    t.same(capturedTags, ["hr", "br"], "267.02");
    t.end();
  }
);

tap.test("268 - opts.cb - cb.tag contents are right on ignored tags", (t) => {
  const capturedTags = [];
  // const rangesArr = [];
  const cb = ({
    tag,
    // deleteFrom,
    // deleteTo,
    // insert
    // rangesArr
    // proposedReturn
  }) => {
    capturedTags.push(tag);
  };

  // notice there's no assigning to a variable, we just rely on a callback:
  stripHtml("a<br/>b", {
    cb,
    ignoreTags: ["b", "strong", "i", "em", "br", "sup"],
    onlyStripTags: [],
    stripTogetherWithTheirContents: ["script", "style", "xml"],
    skipHtmlDecoding: true,
    returnRangesOnly: true,
    trimOnlySpaces: true,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: "",
    },
  });

  t.same(
    capturedTags,
    [
      {
        attributes: [],
        lastClosingBracketAt: 5,
        lastOpeningBracketAt: 1,
        slashPresent: 4,
        leftOuterWhitespace: 1,
        onlyPlausible: false,
        nameStarts: 2,
        nameContainsLetters: true,
        nameEnds: 4,
        name: "br",
      },
    ],
    "268.01"
  );
  t.end();
});

tap.test(
  "269 - opts.cb - cb.tag contents are right on non-ignored tags",
  (t) => {
    const capturedTags = [];
    // const rangesArr = [];
    const cb = ({
      tag,
      // deleteFrom,
      // deleteTo,
      // insert
      // rangesArr
      // proposedReturn
    }) => {
      capturedTags.push(tag);
    };

    // notice there's no assigning to a variable, we just rely on a callback:
    stripHtml("abc<br >def<br>ghi<br/>jkl<br />mno", {
      cb,
      ignoreTags: ["b", "strong", "i", "em", "br", "sup"],
      onlyStripTags: [],
      stripTogetherWithTheirContents: ["script", "style", "xml"],
      skipHtmlDecoding: true,
      returnRangesOnly: true,
      trimOnlySpaces: true,
      dumpLinkHrefsNearby: {
        enabled: false,
        putOnNewLine: false,
        wrapHeads: "",
        wrapTails: "",
      },
    });

    t.same(
      capturedTags,
      [
        {
          attributes: [],
          lastClosingBracketAt: 7,
          lastOpeningBracketAt: 3,
          leftOuterWhitespace: 3,
          name: "br",
          nameContainsLetters: true,
          nameEnds: 6,
          nameStarts: 4,
          onlyPlausible: false,
          slashPresent: false,
        },
        {
          attributes: [],
          lastClosingBracketAt: 14,
          lastOpeningBracketAt: 11,
          leftOuterWhitespace: 11,
          name: "br",
          nameContainsLetters: true,
          nameEnds: 14,
          nameStarts: 12,
          onlyPlausible: false,
          slashPresent: false,
        },
        {
          attributes: [],
          lastClosingBracketAt: 22,
          lastOpeningBracketAt: 18,
          leftOuterWhitespace: 18,
          name: "br",
          nameContainsLetters: true,
          nameEnds: 21,
          nameStarts: 19,
          onlyPlausible: false,
          slashPresent: 21,
        },
        {
          attributes: [],
          lastClosingBracketAt: 31,
          lastOpeningBracketAt: 26,
          leftOuterWhitespace: 26,
          name: "br",
          nameContainsLetters: true,
          nameEnds: 29,
          nameStarts: 27,
          onlyPlausible: false,
          slashPresent: 30,
        },
      ],
      "269.01"
    );
    t.end();
  }
);
