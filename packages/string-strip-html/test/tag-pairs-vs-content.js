import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// tag pairs vs content
// -----------------------------------------------------------------------------

tap.test("01 - single tag pair - tight", (t) => {
  t.same(stripHtml("<a>zzz</a>"), "zzz", "01");
  t.end();
});

tap.test("02 - single tag pair - outer whitespace", (t) => {
  t.same(stripHtml(" <a>zzz</a> "), "zzz", "02");
  t.end();
});

tap.test("03 - single tag pair - inner and outer whitespace", (t) => {
  t.same(stripHtml(" <a> zzz </a> "), "zzz", "03");
  t.end();
});

tap.test("04 - single tag pair - inner line break retained", (t) => {
  t.same(stripHtml(" <a> zz\nz </a> "), "zz\nz", "04");
  t.end();
});

tap.test("05 - multiple tag pairs - adds spaces - #1", (t) => {
  t.same(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu"),
    "rrr zzz something\nelse zzz yyy uuu",
    "05"
  );
  t.end();
});

tap.test("06 - multiple tag pairs - adds spaces - #2", (t) => {
  t.same(stripHtml("aaaaaaa<a>bbbbbbbb"), "aaaaaaa bbbbbbbb", "06");
  t.end();
});

tap.test("07 - multiple tag pairs - adds spaces - #2", (t) => {
  t.same(stripHtml("<a>bbbbbbbb"), "bbbbbbbb", "07");
  t.end();
});

tap.test("08 - multiple tag pairs - adds spaces - #2", (t) => {
  t.same(stripHtml("aaaaaaa<a>"), "aaaaaaa", "08");
  t.end();
});

tap.test(
  "09 - deletion while being on sensitive mode - recognised tag name, pair",
  (t) => {
    t.same(stripHtml("< div >x</div>"), "x", "09");
    t.end();
  }
);

tap.test(
  "10 - deletion while being on sensitive mode - recognised tag name, singleton",
  (t) => {
    t.same(stripHtml("aaaaaaa< br >bbbbbbbb"), "aaaaaaa bbbbbbbb", "10");
    t.end();
  }
);

tap.test(
  "11 - deletion while being on sensitive mode - recognised tag name, pair, tight outer content",
  (t) => {
    t.same(stripHtml("aaaaaaa< div >x</div>"), "aaaaaaa x", "11");
    t.end();
  }
);

tap.test(
  "12 - deletion while being on sensitive mode - recognised tag name, pair, spaced outer content",
  (t) => {
    t.same(stripHtml("aaaaaaa < div >x</div>"), "aaaaaaa x", "12");
    t.end();
  }
);

tap.test(
  "13 - deletion while being on sensitive mode - recognised tag name, pair, trailing whitespace",
  (t) => {
    t.same(stripHtml("aaaaaaa< div >x</div> "), "aaaaaaa x", "13");
    t.end();
  }
);

tap.test("14 - tags with attributes - tight inside tag", (t) => {
  t.same(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "14"
  );
  t.end();
});

tap.test("15 - tags with attributes - rogue spaces inside tag", (t) => {
  t.same(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "15"
  );
  t.end();
});

tap.test("16 - tags with attributes - rogue spaces inside tag, pair", (t) => {
  t.same(stripHtml('aaaaaaa< div class="zzzz">x</div>'), "aaaaaaa x", "16");
  t.end();
});

tap.test("17 - tags with attributes", (t) => {
  t.same(stripHtml('aaaaaaa < div class="zzzz">x</div>'), "aaaaaaa x", "17");
  t.end();
});

tap.test("18 - tags with attributes", (t) => {
  t.same(stripHtml('aaaaaaa< div class="zzzz">x</div>'), "aaaaaaa x", "18");
  t.end();
});

tap.test("19 - tags with attributes", (t) => {
  t.same(stripHtml('< div class="zzzz">x</div>'), "x", "19");
  t.end();
});

tap.test("20 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb"),
    "aaaa something bbbbb",
    "20"
  );
  t.end();
});

tap.test("21 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb"),
    "aaaa something bbbbb",
    "21"
  );
  t.end();
});

tap.test("22 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "22"
  );
  t.end();
});

tap.test("23 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "23"
  );
  t.end();
});

tap.test("24 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "24"
  );
  t.end();
});

tap.test("25 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "25"
  );
  t.end();
});

tap.test("26 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "26"
  );
  t.end();
});

tap.test("27 - multiple brackets repeated", (t) => {
  t.same(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "27"
  );
  t.end();
});

tap.test("28 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"],
    }),
    "x z",
    "28"
  );
  t.end();
});

tap.test("29 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "29"
  );
  t.end();
});

tap.test("30 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "30"
  );
  t.end();
});

tap.test("31 - checking can script slip through in any way", (t) => {
  t.same(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text'
    ),
    "some text more text",
    "31 - sneaky HTML character-encoded brackets"
  );
  t.end();
});
