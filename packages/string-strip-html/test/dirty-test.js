import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

tap.test(
  "01 - missing closing bracket - opening bracket acts as tag delimeter",
  (t) => {
    t.match(
      stripHtml("<body>text<script>zzz</script</body>"),
      {
        result: "text",
        allTagLocations: [
          [0, 6],
          [10, 18],
          [21, 29],
          [29, 36],
        ],
        filteredTagLocations: [
          [0, 6],
          [10, 18],
          [21, 29],
          [29, 36],
        ],
      },
      "01"
    );
    t.end();
  }
);

tap.test("02 - missing closing brackets", (t) => {
  t.match(
    stripHtml(" < body > text < script > zzz <    /    script < / body >"),
    {
      result: "text",
      allTagLocations: [
        [1, 9],
        [15, 25],
        [30, 47],
        [47, 57],
      ],
      filteredTagLocations: [
        [1, 9],
        [15, 25],
        [30, 47],
        [47, 57],
      ],
    },
    "02 - with more whitespace"
  );
  t.end();
});

tap.test("03 - missing closing brackets", (t) => {
  t.match(
    stripHtml("<body>text<script"),
    {
      result: "text",
      allTagLocations: [
        [0, 6],
        [10, 17],
      ],
      filteredTagLocations: [
        [0, 6],
        [10, 17],
      ],
    },
    "03 - missing closing bracket"
  );
  t.end();
});

tap.test("04 - missing closing brackets", (t) => {
  t.match(
    stripHtml("<script>text<script"),
    {
      result: "",
      allTagLocations: [
        [0, 8],
        [12, 19],
      ],
      filteredTagLocations: [
        [0, 8],
        [12, 19],
      ],
    },
    "04"
  );
  t.end();
});

tap.test("05 - missing closing brackets, leading to EOL", (t) => {
  t.match(
    stripHtml("<a>text<a"),
    {
      result: "text",
      allTagLocations: [
        [0, 3],
        [7, 9],
      ],
      filteredTagLocations: [
        [0, 3],
        [7, 9],
      ],
    },
    "05"
  );
  t.end();
});

tap.test("06 - missing closing brackets, multiple tags", (t) => {
  t.match(
    stripHtml("<a>text<a<a"),
    {
      result: "text",
      allTagLocations: [
        [0, 3],
        [7, 9],
        [9, 11],
      ],
      filteredTagLocations: [
        [0, 3],
        [7, 9],
        [9, 11],
      ],
    },
    "06"
  );
  t.end();
});

tap.test("07 - missing closing brackets + line breaks", (t) => {
  t.match(
    stripHtml("<body>text<script>\nzzz\n<script</body>"),
    {
      result: "text",
      allTagLocations: [
        [0, 6],
        [10, 18],
        [23, 30],
        [30, 37],
      ],
      filteredTagLocations: [
        [0, 6],
        [10, 18],
        [23, 30],
        [30, 37],
      ],
    },
    "07"
  );
  t.end();
});

tap.test(
  "08 - missing closing brackets + line breaks, with lots whitespace",
  (t) => {
    t.match(
      stripHtml("< body > text < script >\nzzz\n< script < / body >"),
      {
        result: "text",
        allTagLocations: [
          [0, 8],
          [14, 24],
          [29, 38],
          [38, 48],
        ],
        filteredTagLocations: [
          [0, 8],
          [14, 24],
          [29, 38],
          [38, 48],
        ],
      },
      "08"
    );
    t.end();
  }
);

tap.test("09 - missing opening bracket, but recognised tag name", (t) => {
  t.match(
    stripHtml("body>zzz</body>"),
    {
      result: "zzz",
      allTagLocations: [
        [0, 5],
        [8, 15],
      ],
      filteredTagLocations: [
        [0, 5],
        [8, 15],
      ],
    },
    "09"
  );
  t.end();
});

tap.test(
  "10 - missing opening bracket, but recognised tag name, inner whitespace",
  (t) => {
    t.match(
      stripHtml("body >zzz</body>"),
      {
        result: "zzz",
        allTagLocations: [
          [0, 6],
          [9, 16],
        ],
        filteredTagLocations: [
          [0, 6],
          [9, 16],
        ],
      },
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - missing opening bracket, but recognised tag name, closing slash",
  (t) => {
    t.match(
      stripHtml("body/>zzz</body>"),
      {
        result: "zzz",
        allTagLocations: [
          [0, 6],
          [9, 16],
        ],
        filteredTagLocations: [
          [0, 6],
          [9, 16],
        ],
      },
      "11"
    );
    t.end();
  }
);

tap.test(
  "12 - missing opening bracket, but recognised tag name, whitespace in front of slash",
  (t) => {
    t.match(
      stripHtml("body />zzz</body>"),
      {
        result: "zzz",
        allTagLocations: [
          [0, 7],
          [10, 17],
        ],
        filteredTagLocations: [
          [0, 7],
          [10, 17],
        ],
      },
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - missing opening bracket, but recognised tag name, rogue whitespace around slash",
  (t) => {
    t.match(
      stripHtml("body / >zzz</body>"),
      {
        result: "zzz",
        allTagLocations: [
          [0, 8],
          [11, 18],
        ],
        filteredTagLocations: [
          [0, 8],
          [11, 18],
        ],
      },
      "13"
    );
    t.end();
  }
);

tap.test(
  "14 - missing opening bracket, but recognised tag name, recognised article tag",
  (t) => {
    t.match(
      stripHtml('<body>\narticle class="main" / >zzz</article>\n</body>'),
      {
        result: "zzz",
        allTagLocations: [
          [0, 6],
          [6, 31],
          [34, 44],
          [45, 52],
        ],
        filteredTagLocations: [
          [0, 6],
          [6, 31],
          [34, 44],
          [45, 52],
        ],
      },
      "14"
    );
    t.end();
  }
);

tap.test(
  "15 - missing opening bracket, but recognised tag name - at index position zero",
  (t) => {
    t.match(
      stripHtml("tralala>zzz</body>"),
      {
        result: "tralala>zzz",
        allTagLocations: [[11, 18]],
        filteredTagLocations: [[11, 18]],
      },
      "15"
    );
    t.end();
  }
);

tap.test(
  "16 - missing opening bracket, but recognised tag name - all caps, recognised",
  (t) => {
    t.match(
      stripHtml("BODY>zzz</BODY>"),
      {
        result: "zzz",
        allTagLocations: [
          [0, 5],
          [8, 15],
        ],
        filteredTagLocations: [
          [0, 5],
          [8, 15],
        ],
      },
      "16"
    );
    t.end();
  }
);

tap.test(
  "17 - missing opening bracket, but recognised tag name - low caps, unrecognised",
  (t) => {
    t.match(
      stripHtml("tralala>zzz</BODY>"),
      {
        result: "tralala>zzz",
        allTagLocations: [[11, 18]],
        filteredTagLocations: [[11, 18]],
      },
      "17"
    );
    t.end();
  }
);

tap.test("18 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 20]],
      filteredTagLocations: [[1, 20]],
    },
    "18"
  );
  t.end();
});

tap.test("19 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
    },
    "19"
  );
  t.end();
});

tap.test("20 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
    },
    "20"
  );
  t.end();
});

tap.test("21 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
    },
    "21"
  );
  t.end();
});

tap.test("22 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything=/ >b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
    },
    "22"
  );
  t.end();
});

tap.test("23 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
    },
    "23"
  );
  t.end();
});

tap.test("24 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
    },
    "24"
  );
  t.end();
});

tap.test("25 - incomplete attribute", (t) => {
  t.match(
    stripHtml("a<article anything=  / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 24]],
      filteredTagLocations: [[1, 24]],
    },
    "25"
  );
  t.end();
});

tap.test("26 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml("a<article anything= whatever=>b"),
    {
      result: "a b",
      ranges: [[1, 30, " "]],
      allTagLocations: [[1, 30]],
      filteredTagLocations: [[1, 30]],
    },
    "26"
  );
  t.end();
});

tap.test("27 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml("a<article anything= whatever=>b", {
      onlyStripTags: ["article"],
    }),
    {
      result: "a b",
      ranges: [[1, 30, " "]],
      allTagLocations: [[1, 30]],
      filteredTagLocations: [[1, 30]],
    },
    "27"
  );
  t.end();
});

tap.test("28 - multiple incomplete attributes", (t) => {
  const input = `a<article anything= whatever=>b`;
  t.match(
    stripHtml(input, {
      ignoreTags: ["article"],
    }),
    {
      result: input,
      ranges: null,
      allTagLocations: [[1, 30]],
      filteredTagLocations: [],
    },
    "28"
  );
  t.end();
});

tap.test("29 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml("a<article anything= whatever=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
    },
    "29"
  );
  t.end();
});

tap.test("30 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml("a<article anything= whatever= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
    },
    "30"
  );
  t.end();
});

tap.test("31 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml("a<article anything= whatever= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 32]],
      filteredTagLocations: [[1, 32]],
    },
    "31"
  );
  t.end();
});

tap.test("32 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml('a<article anything= class="zz" whatever= id="lalala">b'),
    {
      result: "a b",
      allTagLocations: [[1, 53]],
      filteredTagLocations: [[1, 53]],
    },
    "32 - a mix thereof"
  );
  t.end();
});

tap.test("33 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"/>b'),
    {
      result: "a b",
      allTagLocations: [[1, 54]],
      filteredTagLocations: [[1, 54]],
    },
    "33 - a mix thereof"
  );
  t.end();
});

tap.test("34 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" />b'),
    {
      result: "a b",
      allTagLocations: [[1, 55]],
      filteredTagLocations: [[1, 55]],
    },
    "34 - a mix thereof"
  );
  t.end();
});

tap.test("35 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" / >b'),
    {
      result: "a b",
      allTagLocations: [[1, 56]],
      filteredTagLocations: [[1, 56]],
    },
    "35 - a mix thereof"
  );
  t.end();
});

tap.test("36 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"  /  >b'),
    {
      result: "a b",
      allTagLocations: [[1, 58]],
      filteredTagLocations: [[1, 58]],
    },
    "36 - a mix thereof"
  );
  t.end();
});

tap.test("37 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml('a <article anything= class="zz" whatever= id="lalala"  /  > b'),
    {
      result: "a b",
      allTagLocations: [[2, 59]],
      filteredTagLocations: [[2, 59]],
    },
    "37 - a mix thereof"
  );
  t.end();
});

tap.test("38 - multiple incomplete attributes", (t) => {
  t.match(
    stripHtml(
      'a <article anything = class="zz" whatever = id="lalala"  /  > b'
    ),
    {
      result: "a b",
      allTagLocations: [[2, 61]],
      filteredTagLocations: [[2, 61]],
    },
    "38 - a mix thereof"
  );
  t.end();
});

tap.test("39 - tag name, equals and end of a tag", (t) => {
  // html
  t.match(
    stripHtml("a<article=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 11]],
      filteredTagLocations: [[1, 11]],
    },
    "39"
  );
  t.end();
});

tap.test("40 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article =>b"), { result: "a b" }, "40");
  t.end();
});

tap.test("41 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article= >b"), { result: "a b" }, "41");
  t.end();
});

tap.test("42 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article = >b"), { result: "a b" }, "42");
  t.end();
});

tap.test("43 - tag name, equals and end of a tag", (t) => {
  // xhtml without space between the slash and closing tag
  t.match(stripHtml("a<article=/>b"), { result: "a b" }, "43");
  t.end();
});

tap.test("44 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article =/>b"), { result: "a b" }, "44");
  t.end();
});

tap.test("45 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article= />b"), { result: "a b" }, "45");
  t.end();
});

tap.test("46 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article = />b"), { result: "a b" }, "46");
  t.end();
});

tap.test("47 - tag name, equals and end of a tag", (t) => {
  // xhtml with space after the closing slash
  t.match(stripHtml("a<article=/ >b"), { result: "a b" }, "47");
  t.end();
});

tap.test("48 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article =/ >b"), { result: "a b" }, "48");
  t.end();
});

tap.test("49 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article= / >b"), { result: "a b" }, "49");
  t.end();
});

tap.test("50 - tag name, equals and end of a tag", (t) => {
  t.match(stripHtml("a<article = / >b"), { result: "a b" }, "50");
  t.end();
});

tap.test("51 - multiple equals after attribute's name", (t) => {
  // 1. consecutive equals
  // normal tag:
  t.match(
    stripHtml('aaaaaaa<div class =="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "51"
  );
  t.end();
});

tap.test("52 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.match(
    stripHtml('aaaaaaa<script class =="zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "52"
  );
  t.end();
});

tap.test("53 - multiple equals after attribute's name", (t) => {
  // 2. consecutive equals with space
  // normal tag:
  t.match(
    stripHtml('aaaaaaa<div class = ="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "53"
  );
  t.end();
});

tap.test("54 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.match(
    stripHtml('aaaaaaa<script class = ="zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "54"
  );
  t.end();
});

tap.test("55 - multiple equals after attribute's name", (t) => {
  // 3. consecutive equals with more spaces in between
  // normal tag:
  t.match(
    stripHtml('aaaaaaa<div class = = "zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "55"
  );
  t.end();
});

tap.test("56 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.match(
    stripHtml('aaaaaaa<script class = = "zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "56"
  );
  t.end();
});

tap.test("57 - multiple equals after attribute's name", (t) => {
  // 4. consecutive equals, following attribute's name tightly
  // normal tag:
  t.match(
    stripHtml('aaaaaaa<div class= = "zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "57"
  );
  t.end();
});

tap.test("58 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.match(
    stripHtml('aaaaaaa<script class= = "zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "58"
  );
  t.end();
});

tap.test("59 - multiple equals after attribute's name", (t) => {
  // 5. consecutive equals, tight
  // normal tag:
  t.match(
    stripHtml('aaaaaaa<div class=="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "59"
  );
  t.end();
});

tap.test("60 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.match(
    stripHtml('aaaaaaa<script class=="zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "60"
  );
  t.end();
});

tap.test(
  "61 - multiple quotes in the attributes - double, opening only - normal",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "61"
    );
    t.end();
  }
);

tap.test(
  "62 - multiple quotes in the attributes - double, opening only - ranged",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "62"
    );
    t.end();
  }
);

tap.test(
  "63 - multiple quotes in the attributes - double, closing - normal",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "63"
    );
    t.end();
  }
);

tap.test(
  "64 - multiple quotes in the attributes - double, closing - ranged",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "64"
    );
    t.end();
  }
);

tap.test(
  "65 - multiple quotes in the attributes - double, both closing and opening - normal",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<div class=""zzzz"">x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "65"
    );
    t.end();
  }
);

tap.test(
  "66 - multiple quotes in the attributes - double, both closing and opening - ranged",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<script class=""zzzz"">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "66"
    );
    t.end();
  }
);

tap.test(
  "67 - multiple quotes in the attributes - single, opening only - normal",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "67"
    );
    t.end();
  }
);

tap.test(
  "68 - multiple quotes in the attributes - single, opening only - ranged",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "68"
    );
    t.end();
  }
);

tap.test(
  "69 - multiple quotes in the attributes - single, closing - normal",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "69"
    );
    t.end();
  }
);

tap.test(
  "70 - multiple quotes in the attributes - single, closing - ranged",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "70"
    );
    t.end();
  }
);

tap.test(
  "71 - multiple quotes in the attributes - single, both closing and opening - normal",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<div class=''zzzz''>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "71"
    );
    t.end();
  }
);

tap.test(
  "72 - multiple quotes in the attributes - single, both closing and opening - ranged",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<script class=''zzzz''>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "72"
    );
    t.end();
  }
);

tap.test(
  "73 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - normal",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<div class= ==''zzzz''>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "73"
    );
    t.end();
  }
);

tap.test(
  "74 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - ranged",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<script class = ==''zzzz''>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "74"
    );
    t.end();
  }
);

tap.test(
  "75 - multiple quotes in the attributes - mismatching quotes only - normal",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<div class=''zzzz\"\">x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "75"
    );
    t.end();
  }
);

tap.test(
  "76 - multiple quotes in the attributes - mismatching quotes only - ranged",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<script class=''zzzz\"\">x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "76"
    );
    t.end();
  }
);

tap.test(
  "77 - multiple quotes in the attributes - crazy messed up - normal",
  (t) => {
    t.match(
      stripHtml(`aaaaaaa<div class= =='  'zzzz" " ">x</div>bbbbbbbb`),
      { result: "aaaaaaa x bbbbbbbb" },
      "77"
    );
    t.end();
  }
);

tap.test(
  "78 - multiple quotes in the attributes - crazy messed up - ranged",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " ">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "78"
    );
    t.end();
  }
);

tap.test(
  "79 - multiple quotes in the attributes - even more crazy messed up - normal",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " " /// >x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "79"
    );
    t.end();
  }
);

tap.test(
  "80 - multiple quotes in the attributes - even more crazy messed up - ranged",
  (t) => {
    t.match(
      stripHtml(
        'aaaaaaa<script class= ==\'  \'zzzz" " " /// >x</script>bbbbbbbb'
      ),
      { result: "aaaaaaa bbbbbbbb" },
      "80"
    );
    t.end();
  }
);

tap.test("81 - unclosed attributes - normal", (t) => {
  t.match(
    stripHtml('aaaaaaa<div class="zzzz>x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "81"
  );
  t.end();
});

tap.test("82 - unclosed attributes - ranged", (t) => {
  t.match(
    stripHtml('aaaaaaa<script class="zzzz>x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "82"
  );
  t.end();
});

tap.test("83 - unclosed attributes - single tag", (t) => {
  t.match(
    stripHtml('aaaaaaa<br class="zzzz>x<br>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "83"
  );
  t.end();
});

tap.test(
  "84 - unclosed attributes - new tag starts, closing quote missing",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<br class="zzzz <br>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "84"
    );
    t.end();
  }
);

tap.test(
  "85 - unclosed attributes - new tag starts, both quotes present",
  (t) => {
    t.match(
      stripHtml('aaaaaaa<br class="zzzz" <br>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "85"
    );
    t.end();
  }
);

tap.test(
  "86 - unclosed attributes - cut off at the end of attribute's name",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<br class<br>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "86"
    );
    t.end();
  }
);

tap.test(
  "87 - unclosed attributes - cut off with a rogue exclamation mark",
  (t) => {
    t.match(
      stripHtml("aaaaaaa<br class!<br>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "87"
    );
    t.end();
  }
);

tap.test(
  "88 - duplicated consecutive attribute values - inner whitespace",
  (t) => {
    t.match(
      stripHtml('aa< br class1="b1" yo1   =   class2 = "b2" yo2 yo3>cc'),
      { result: "aa cc" },
      "88"
    );
    t.end();
  }
);

tap.test("89 - space after bracket, multiple attrs, no equals", (t) => {
  t.match(stripHtml("aa< br a b >cc"), { result: "aa< br a b >cc" }, "89");
  t.end();
});

tap.test("90 - space after bracket, multiple attrs, no equals", (t) => {
  t.match(stripHtml("aa < br a b >cc"), { result: "aa < br a b >cc" }, "90");
  t.end();
});

tap.test("91 - space after bracket, multiple attrs, no equals", (t) => {
  t.match(stripHtml("aa< br a b > cc"), { result: "aa< br a b > cc" }, "91");
  t.end();
});

tap.test("92 - space after bracket, multiple attrs, no equals", (t) => {
  t.match(stripHtml("aa < br a b > cc"), { result: "aa < br a b > cc" }, "92");
  t.end();
});

tap.test("93 - space after bracket, multiple attrs, no equals", (t) => {
  t.match(
    stripHtml("aa  < br a b >  cc"),
    { result: "aa  < br a b >  cc" },
    "93"
  );
  t.end();
});

tap.test("94 - various, #1", (t) => {
  t.match(stripHtml('aa< br a b=" >cc'), { result: "aa cc" }, "94");
  t.end();
});

tap.test("95 - various, #2", (t) => {
  t.match(stripHtml('aa< br a b= " >cc'), { result: "aa cc" }, "95");
  t.end();
});

tap.test("96 - various, #3", (t) => {
  t.match(stripHtml('aa< br a b =" >cc'), { result: "aa cc" }, "96");
  t.end();
});

tap.test("97 - various, #4", (t) => {
  t.match(stripHtml('aa< br a b = " >cc'), { result: "aa cc" }, "97");
  t.end();
});

tap.test("98 - various, #5", (t) => {
  // xhtml
  t.match(stripHtml('aa< br a b=" />cc'), { result: "aa cc" }, "98");
  t.end();
});

tap.test("99 - various, #6", (t) => {
  t.match(stripHtml('aa< br a b= " />cc'), { result: "aa cc" }, "99");
  t.end();
});

tap.test("100 - various, #7", (t) => {
  t.match(stripHtml('aa< br a b =" />cc'), { result: "aa cc" }, "100");
  t.end();
});

tap.test("101 - various, #8", (t) => {
  t.match(stripHtml('aa< br a b = " />cc'), { result: "aa cc" }, "101");
  t.end();
});

tap.test("102 - various, #9", (t) => {
  t.match(stripHtml('aa< br a b=" / >cc'), { result: "aa cc" }, "102");
  t.end();
});

tap.test("103 - various, #10", (t) => {
  t.match(stripHtml('aa< br a b= " / >cc'), { result: "aa cc" }, "103");
  t.end();
});

tap.test("104 - various, #11", (t) => {
  t.match(stripHtml('aa< br a b =" / >cc'), { result: "aa cc" }, "104");
  t.end();
});

tap.test("105 - various, #12", (t) => {
  t.match(stripHtml('aa< br a b = " / >cc'), { result: "aa cc" }, "105");
  t.end();
});

tap.test("106 - various, #13", (t) => {
  t.match(stripHtml('aa< br a b=" // >cc'), { result: "aa cc" }, "106");
  t.end();
});

tap.test("107 - various, #14", (t) => {
  t.match(stripHtml('aa< br a b= " // >cc'), { result: "aa cc" }, "107");
  t.end();
});

tap.test("108 - various, #15", (t) => {
  t.match(stripHtml('aa< br a b =" // >cc'), { result: "aa cc" }, "108");
  t.end();
});

tap.test("109 - various, #16", (t) => {
  t.match(stripHtml('aa< br a b = " // >cc'), { result: "aa cc" }, "109");
  t.end();
});

tap.test("110 - various, #17", (t) => {
  t.match(
    stripHtml(
      '<div><article class="main" id=="something">text</article></div>'
    ),
    { result: "text" },
    "110"
  );
  t.end();
});

tap.test("111 - various, #18 - suddenly cut off healthy HTML", (t) => {
  t.match(
    stripHtml(
      `la <b>la</b> la<table><tr>
<td><a href="http://codsen.com" target="_blank"><img src="http://cdn.codsen.com/nonexistent.gif" width="11" height="22" border="0" style="display:block; -ms-interpolation-mode:bicubic; color: #ffffff; font-style: it`
    ),
    { result: "la la la" },
    "111 - HTML cut off in the middle of an inline CSS style"
  );
  t.end();
});

tap.test("112 - unclosed tag followed by a tag - HTML", (t) => {
  // tight
  t.match(
    stripHtml('111 <br class="zz"<img> 222'),
    { result: "111 222" },
    "112"
  );
  t.end();
});

tap.test("113 - unclosed tag followed by a tag - XHTML", (t) => {
  t.match(
    stripHtml('111 <br class="zz"/<img> 222'),
    { result: "111 222" },
    "113"
  );
  t.end();
});

tap.test("114 - unclosed tag followed by a tag - HTML", (t) => {
  // space
  t.match(
    stripHtml('111 <br class="zz" <img> 222'),
    { result: "111 222" },
    "114"
  );
  t.end();
});

tap.test("115 - unclosed tag followed by a tag - XHTML", (t) => {
  t.match(
    stripHtml('111 <br class="zz"/ <img> 222'),
    { result: "111 222" },
    "115"
  );
  t.end();
});

tap.test("116 - unclosed tag followed by a tag - HTML - line break", (t) => {
  //
  t.match(
    stripHtml('111 <br class="zz"\n<img> 222'),
    { result: "111\n222" },
    "116"
  );
  t.end();
});

tap.test("117 - unclosed tag followed by a tag - XHTML - line break", (t) => {
  t.match(
    stripHtml('111 <br class="zz"/\n<img> 222'),
    { result: "111\n222" },
    "117"
  );
  t.end();
});

tap.test(
  "118 - unclosed tag followed by a tag - space and line break, HTML",
  (t) => {
    //
    t.match(
      stripHtml('111 <br class="zz" \n<img> 222'),
      { result: "111\n222" },
      "118"
    );
    t.end();
  }
);

tap.test(
  "119 - unclosed tag followed by a tag - space and line break, XHTML",
  (t) => {
    t.match(
      stripHtml('111 <br class="zz"/ \n<img> 222'),
      { result: "111\n222" },
      "119"
    );
    t.end();
  }
);

tap.test("120 - unclosed tag followed by a tag - messy", (t) => {
  t.match(
    stripHtml('111 <br class="zz"\t/ \n<img> 222'),
    { result: "111\n222" },
    "120"
  );
  t.end();
});

tap.test("121 - unclosed tag followed by a tag", (t) => {
  t.match(
    stripHtml('111 <br class="zz"\t/\r\n\t \n<img> 222'),
    { result: "111\n\n222" },
    "121"
  );
  t.end();
});

tap.test("122 - unclosed tag followed by a tag", (t) => {
  t.match(
    stripHtml("111 <a\t/\r\n\t \n<img> 222"),
    { result: "111\n\n222" },
    "122"
  );
  t.end();
});

tap.test("123 - dirty code - unclosed tag followed by a tag", (t) => {
  t.match(
    stripHtml("111 <a\t/\r\n\t \n<img> 222"),
    { result: "111\n\n222" },
    "123"
  );
  t.end();
});

tap.test("124 - two equals", (t) => {
  t.match(stripHtml('aaa <div class=="yo"> zzz'), { result: "aaa zzz" }, "124");
  t.end();
});

tap.test("125 - space + two equals", (t) => {
  t.match(
    stripHtml('aaa <div class =="yo"> zzz'),
    { result: "aaa zzz" },
    "125"
  );
  t.end();
});
