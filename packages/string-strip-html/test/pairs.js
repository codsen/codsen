import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// tag pairs vs content
// -----------------------------------------------------------------------------

tap.test("01 - single tag pair - tight", (t) => {
  t.match(stripHtml("<a>zzz</a>"), { result: "zzz" }, "01");
  t.end();
});

tap.test("02 - single tag pair - outer whitespace", (t) => {
  t.match(stripHtml(" <a>zzz</a> "), { result: "zzz" }, "02");
  t.end();
});

tap.test("03 - single tag pair - inner and outer whitespace", (t) => {
  t.match(stripHtml(" <a> zzz </a> "), { result: "zzz" }, "03");
  t.end();
});

tap.test("04 - single tag pair - inner line break retained", (t) => {
  t.match(stripHtml(" <a> zz\nz </a> "), { result: "zz\nz" }, "04");
  t.end();
});

tap.test("05 - multiple tag pairs - adds spaces - #1", (t) => {
  t.match(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu"),
    { result: "rrr zzz something\nelse zzz yyy uuu" },
    "05"
  );
  t.end();
});

tap.test("06 - multiple tag pairs - adds spaces - #2", (t) => {
  t.match(
    stripHtml("aaaaaaa<a>bbbbbbbb"),
    { result: "aaaaaaa bbbbbbbb" },
    "06"
  );
  t.end();
});

tap.test("07 - multiple tag pairs - adds spaces - #2", (t) => {
  t.match(stripHtml("<a>bbbbbbbb"), { result: "bbbbbbbb" }, "07");
  t.end();
});

tap.test("08 - multiple tag pairs - adds spaces - #2", (t) => {
  t.match(stripHtml("aaaaaaa<a>"), { result: "aaaaaaa" }, "08");
  t.end();
});

tap.test(
  "09 - deletion while being on sensitive mode - recognised tag name, pair",
  (t) => {
    t.match(stripHtml("< div >x</div>"), { result: "x" }, "09");
    t.end();
  }
);

tap.test(
  "10 - deletion while being on sensitive mode - recognised tag name, singleton",
  (t) => {
    t.match(
      stripHtml("aaaaaaa< br >bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - deletion while being on sensitive mode - recognised tag name, pair, tight outer content",
  (t) => {
    t.match(stripHtml("aaaaaaa< div >x</div>"), { result: "aaaaaaa x" }, "11");
    t.end();
  }
);

tap.test(
  "12 - deletion while being on sensitive mode - recognised tag name, pair, spaced outer content",
  (t) => {
    t.match(stripHtml("aaaaaaa < div >x</div>"), { result: "aaaaaaa x" }, "12");
    t.end();
  }
);

tap.test(
  "13 - deletion while being on sensitive mode - recognised tag name, pair, trailing whitespace",
  (t) => {
    t.match(stripHtml("aaaaaaa< div >x</div> "), { result: "aaaaaaa x" }, "13");
    t.end();
  }
);

tap.test("14 - tags with attributes - tight inside tag", (t) => {
  t.match(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "14"
  );
  t.end();
});

tap.test("15 - tags with attributes - rogue spaces inside tag", (t) => {
  t.match(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "15"
  );
  t.end();
});

tap.test("16 - tags with attributes - rogue spaces inside tag, pair", (t) => {
  t.match(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    { result: "aaaaaaa x" },
    "16"
  );
  t.end();
});

tap.test("17 - tags with attributes", (t) => {
  t.match(
    stripHtml('aaaaaaa < div class="zzzz">x</div>'),
    { result: "aaaaaaa x" },
    "17"
  );
  t.end();
});

tap.test("18 - tags with attributes", (t) => {
  t.match(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    { result: "aaaaaaa x" },
    "18"
  );
  t.end();
});

tap.test("19 - tags with attributes", (t) => {
  t.match(stripHtml('< div class="zzzz">x</div>'), { result: "x" }, "19");
  t.end();
});

tap.test("20 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "20"
  );
  t.end();
});

tap.test("21 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "21"
  );
  t.end();
});

tap.test("22 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "22"
  );
  t.end();
});

tap.test("23 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "23"
  );
  t.end();
});

tap.test("24 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "24"
  );
  t.end();
});

tap.test("25 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "25"
  );
  t.end();
});

tap.test("26 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "26"
  );
  t.end();
});

tap.test("27 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "27"
  );
  t.end();
});

tap.test("28 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"],
    }),
    { result: "x z" },
    "28"
  );
  t.end();
});

tap.test("29 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    { result: "some text more text" },
    "29"
  );
  t.end();
});

tap.test("30 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    { result: "some text more text" },
    "30"
  );
  t.end();
});

tap.test("31 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text'
    ),
    { result: "some text more text" },
    "31 - sneaky HTML character-encoded brackets"
  );
  t.end();
});
