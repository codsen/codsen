import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// tag pairs vs content
// -----------------------------------------------------------------------------

tap.test("01 - single tag pair - tight", (t) => {
  const { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    "<a>zzz</a>"
  );
  t.strictSame(result, "zzz", "01.01");
  t.strictSame(
    ranges,
    [
      [0, 3],
      [6, 10],
    ],
    "01.02"
  );
  t.strictSame(
    allTagLocations,
    [
      [0, 3],
      [6, 10],
    ],
    "01.03"
  );
  t.strictSame(
    filteredTagLocations,
    [
      [0, 3],
      [6, 10],
    ],
    "01.04"
  );
  t.end();
});

tap.test("02 - single tag pair - outer whitespace", (t) => {
  const { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    " <a>zzz</a> "
  );
  t.strictSame(result, "zzz", "02.01");
  t.strictSame(
    ranges,
    [
      [0, 4],
      [7, 12],
    ],
    "02.02"
  );
  t.strictSame(
    allTagLocations,
    [
      [1, 4],
      [7, 11],
    ],
    "02.03"
  );
  t.strictSame(
    filteredTagLocations,
    [
      [1, 4],
      [7, 11],
    ],
    "02.04"
  );
  t.end();
});

tap.test("03 - single tag pair - inner and outer whitespace", (t) => {
  const { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    " <a> zzz </a> "
  );
  t.strictSame(result, "zzz", "03.01");
  t.strictSame(
    ranges,
    [
      [0, 5],
      [8, 14],
    ],
    "03.02"
  );
  t.strictSame(
    allTagLocations,
    [
      [1, 4],
      [9, 13],
    ],
    "03.03"
  );
  t.strictSame(
    filteredTagLocations,
    [
      [1, 4],
      [9, 13],
    ],
    "03.04"
  );
  t.end();
});

tap.test("04 - single tag pair - text", (t) => {
  const { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    `This is a title with some <code>code</code> in it`
  );
  t.strictSame(result, `This is a title with some code in it`, "04.01");
  t.strictSame(
    ranges,
    [
      [25, 32, " "],
      [36, 44, " "],
    ],
    "04.02"
  );
  t.strictSame(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "04.03"
  );
  t.strictSame(
    filteredTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "04.04"
  );
  t.end();
});

tap.test("05 - single tag pair - text, pair tag", (t) => {
  const { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    `This is a title with some <code>code</code> in it`,
    {
      stripTogetherWithTheirContents: ["code"],
    }
  );
  t.strictSame(result, `This is a title with some in it`, "05.01");
  t.strictSame(ranges, [[25, 44, " "]], "05.02");
  t.strictSame(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "05.03"
  );
  t.strictSame(filteredTagLocations, [[26, 43]], "05.04");
  t.end();
});

tap.test("06 - single tag pair - inner line break retained", (t) => {
  t.match(stripHtml(" <a> zz\nz </a> "), { result: "zz\nz" }, "06");
  t.end();
});

tap.test("07 - multiple tag pairs - adds spaces - #1", (t) => {
  t.match(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu"),
    { result: "rrr zzz something\nelse zzz yyy uuu" },
    "07"
  );
  t.end();
});

tap.test("08 - multiple tag pairs - adds spaces - #2", (t) => {
  t.match(
    stripHtml("aaaaaaa<a>bbbbbbbb"),
    { result: "aaaaaaa bbbbbbbb" },
    "08"
  );
  t.end();
});

tap.test("09 - multiple tag pairs - adds spaces - #2", (t) => {
  t.match(stripHtml("<a>bbbbbbbb"), { result: "bbbbbbbb" }, "09");
  t.end();
});

tap.test("10 - multiple tag pairs - adds spaces - #2", (t) => {
  t.match(stripHtml("aaaaaaa<a>"), { result: "aaaaaaa" }, "10");
  t.end();
});

tap.test(
  "11 - deletion while being on sensitive mode - recognised tag name, pair",
  (t) => {
    t.match(stripHtml("< div >x</div>"), { result: "x" }, "11");
    t.end();
  }
);

tap.test(
  "12 - deletion while being on sensitive mode - recognised tag name, singleton",
  (t) => {
    t.match(
      stripHtml("aaaaaaa< br >bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - deletion while being on sensitive mode - recognised tag name, pair, tight outer content",
  (t) => {
    t.match(stripHtml("aaaaaaa< div >x</div>"), { result: "aaaaaaa x" }, "13");
    t.end();
  }
);

tap.test(
  "14 - deletion while being on sensitive mode - recognised tag name, pair, spaced outer content",
  (t) => {
    t.match(stripHtml("aaaaaaa < div >x</div>"), { result: "aaaaaaa x" }, "14");
    t.end();
  }
);

tap.test(
  "15 - deletion while being on sensitive mode - recognised tag name, pair, trailing whitespace",
  (t) => {
    t.match(stripHtml("aaaaaaa< div >x</div> "), { result: "aaaaaaa x" }, "15");
    t.end();
  }
);

tap.test("16 - tags with attributes - tight inside tag", (t) => {
  t.match(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "16"
  );
  t.end();
});

tap.test("17 - tags with attributes - rogue spaces inside tag", (t) => {
  t.match(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "17"
  );
  t.end();
});

tap.test("18 - tags with attributes - rogue spaces inside tag, pair", (t) => {
  t.match(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    { result: "aaaaaaa x" },
    "18"
  );
  t.end();
});

tap.test("19 - tags with attributes", (t) => {
  t.match(
    stripHtml('aaaaaaa < div class="zzzz">x</div>'),
    { result: "aaaaaaa x" },
    "19"
  );
  t.end();
});

tap.test("20 - tags with attributes", (t) => {
  t.match(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    { result: "aaaaaaa x" },
    "20"
  );
  t.end();
});

tap.test("21 - tags with attributes", (t) => {
  t.match(stripHtml('< div class="zzzz">x</div>'), { result: "x" }, "21");
  t.end();
});

tap.test("22 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "22"
  );
  t.end();
});

tap.test("23 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "23"
  );
  t.end();
});

tap.test("24 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "24"
  );
  t.end();
});

tap.test("25 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "25"
  );
  t.end();
});

tap.test("26 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "26"
  );
  t.end();
});

tap.test("27 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "27"
  );
  t.end();
});

tap.test("28 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb"),
    { result: "aaaa something bbbbb" },
    "28"
  );
  t.end();
});

tap.test("29 - multiple brackets repeated", (t) => {
  t.match(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb"),
    { result: "aaaa something bbbbb" },
    "29"
  );
  t.end();
});

tap.test("30 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"],
    }),
    { result: "x z" },
    "30"
  );
  t.end();
});

tap.test("31 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    { result: "some text more text" },
    "31"
  );
  t.end();
});

tap.test("32 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    { result: "some text more text" },
    "32"
  );
  t.end();
});

tap.test("33 - checking can script slip through in any way", (t) => {
  t.match(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text'
    ),
    { result: "some text more text" },
    "33 - sneaky HTML character-encoded brackets"
  );
  t.end();
});
