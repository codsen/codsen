import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

tap.test(
  "01 - missing closing bracket - opening bracket acts as tag delimeter",
  (t) => {
    t.hasStrict(
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
          [10, 29],
          [29, 36],
        ],
      },
      "01"
    );
    t.end();
  }
);

tap.test("02 - missing closing brackets", (t) => {
  t.hasStrict(
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
        [15, 47],
        [47, 57],
      ],
    },
    "02 - with more whitespace"
  );
  t.end();
});

tap.test("03 - missing closing brackets", (t) => {
  t.hasStrict(
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

tap.test("04 - missing closing brackets, leading to EOL", (t) => {
  t.hasStrict(
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
    "04"
  );
  t.end();
});

tap.test("05 - missing closing brackets, multiple tags", (t) => {
  t.hasStrict(
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
    "05"
  );
  t.end();
});

tap.test("06 - missing opening bracket, but recognised tag name", (t) => {
  t.hasStrict(
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
    "06"
  );
  t.end();
});

tap.test(
  "07 - missing opening bracket, but recognised tag name, inner whitespace",
  (t) => {
    t.hasStrict(
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
      "07"
    );
    t.end();
  }
);

tap.test(
  "08 - missing opening bracket, but recognised tag name, closing slash",
  (t) => {
    t.hasStrict(
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
      "08"
    );
    t.end();
  }
);

tap.test(
  "09 - missing opening bracket, but recognised tag name, whitespace in front of slash",
  (t) => {
    t.hasStrict(
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
      "09"
    );
    t.end();
  }
);

tap.test(
  "10 - missing opening bracket, but recognised tag name, rogue whitespace around slash",
  (t) => {
    t.hasStrict(
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
      "10"
    );
    t.end();
  }
);

tap.test(
  "11 - missing opening bracket, but recognised tag name, recognised article tag",
  (t) => {
    t.hasStrict(
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
      "11"
    );
    t.end();
  }
);

tap.test(
  "12 - missing opening bracket, but recognised tag name - at index position zero",
  (t) => {
    t.hasStrict(
      stripHtml("tralala>zzz</body>"),
      {
        result: "tralala>zzz",
        allTagLocations: [[11, 18]],
        filteredTagLocations: [[11, 18]],
      },
      "12"
    );
    t.end();
  }
);

tap.test(
  "13 - missing opening bracket, but recognised tag name - all caps, recognised",
  (t) => {
    t.hasStrict(
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
      "13"
    );
    t.end();
  }
);

tap.test(
  "14 - missing opening bracket, but recognised tag name - low caps, unrecognised",
  (t) => {
    t.hasStrict(
      stripHtml("tralala>zzz</BODY>"),
      {
        result: "tralala>zzz",
        allTagLocations: [[11, 18]],
        filteredTagLocations: [[11, 18]],
      },
      "14"
    );
    t.end();
  }
);

tap.test("15 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 20]],
      filteredTagLocations: [[1, 20]],
    },
    "15"
  );
  t.end();
});

tap.test("16 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
    },
    "16"
  );
  t.end();
});

tap.test("17 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
    },
    "17"
  );
  t.end();
});

tap.test("18 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
    },
    "18"
  );
  t.end();
});

tap.test("19 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything=/ >b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
    },
    "19"
  );
  t.end();
});

tap.test("20 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
    },
    "20"
  );
  t.end();
});

tap.test("21 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
    },
    "21"
  );
  t.end();
});

tap.test("22 - incomplete attribute", (t) => {
  t.hasStrict(
    stripHtml("a<article anything=  / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 24]],
      filteredTagLocations: [[1, 24]],
    },
    "22"
  );
  t.end();
});

tap.test("23 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= whatever=>b"),
    {
      result: "a b",
      ranges: [[1, 30, " "]],
      allTagLocations: [[1, 30]],
      filteredTagLocations: [[1, 30]],
    },
    "23"
  );
  t.end();
});

tap.test("24 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= whatever=>b", {
      onlyStripTags: ["article"],
    }),
    {
      result: "a b",
      ranges: [[1, 30, " "]],
      allTagLocations: [[1, 30]],
      filteredTagLocations: [[1, 30]],
    },
    "24"
  );
  t.end();
});

tap.test("25 - multiple incomplete attributes", (t) => {
  const input = `a<article anything= whatever=>b`;
  t.hasStrict(
    stripHtml(input, {
      ignoreTags: ["article"],
    }),
    {
      result: input,
      ranges: null,
      allTagLocations: [[1, 30]],
      filteredTagLocations: [],
    },
    "25"
  );
  t.end();
});

tap.test("26 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= whatever=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
    },
    "26"
  );
  t.end();
});

tap.test("27 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= whatever= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
    },
    "27"
  );
  t.end();
});

tap.test("28 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml("a<article anything= whatever= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 32]],
      filteredTagLocations: [[1, 32]],
    },
    "28"
  );
  t.end();
});

tap.test("29 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml('a<article anything= class="zz" whatever= id="lalala">b'),
    {
      result: "a b",
      allTagLocations: [[1, 53]],
      filteredTagLocations: [[1, 53]],
    },
    "29 - a mix thereof"
  );
  t.end();
});

tap.test("30 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"/>b'),
    {
      result: "a b",
      allTagLocations: [[1, 54]],
      filteredTagLocations: [[1, 54]],
    },
    "30 - a mix thereof"
  );
  t.end();
});

tap.test("31 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" />b'),
    {
      result: "a b",
      allTagLocations: [[1, 55]],
      filteredTagLocations: [[1, 55]],
    },
    "31 - a mix thereof"
  );
  t.end();
});

tap.test("32 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" / >b'),
    {
      result: "a b",
      allTagLocations: [[1, 56]],
      filteredTagLocations: [[1, 56]],
    },
    "32 - a mix thereof"
  );
  t.end();
});

tap.test("33 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"  /  >b'),
    {
      result: "a b",
      allTagLocations: [[1, 58]],
      filteredTagLocations: [[1, 58]],
    },
    "33 - a mix thereof"
  );
  t.end();
});

tap.test("34 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml('a <article anything= class="zz" whatever= id="lalala"  /  > b'),
    {
      result: "a b",
      allTagLocations: [[2, 59]],
      filteredTagLocations: [[2, 59]],
    },
    "34 - a mix thereof"
  );
  t.end();
});

tap.test("35 - multiple incomplete attributes", (t) => {
  t.hasStrict(
    stripHtml(
      'a <article anything = class="zz" whatever = id="lalala"  /  > b'
    ),
    {
      result: "a b",
      allTagLocations: [[2, 61]],
      filteredTagLocations: [[2, 61]],
    },
    "35 - a mix thereof"
  );
  t.end();
});

tap.test("36 - tag name, equals and end of a tag", (t) => {
  // html
  t.hasStrict(
    stripHtml("a<article=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 11]],
      filteredTagLocations: [[1, 11]],
    },
    "36"
  );
  t.end();
});

tap.test("37 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article =>b"), { result: "a b" }, "37");
  t.end();
});

tap.test("38 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article= >b"), { result: "a b" }, "38");
  t.end();
});

tap.test("39 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article = >b"), { result: "a b" }, "39");
  t.end();
});

tap.test("40 - tag name, equals and end of a tag", (t) => {
  // xhtml without space between the slash and closing tag
  t.hasStrict(stripHtml("a<article=/>b"), { result: "a b" }, "40");
  t.end();
});

tap.test("41 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article =/>b"), { result: "a b" }, "41");
  t.end();
});

tap.test("42 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article= />b"), { result: "a b" }, "42");
  t.end();
});

tap.test("43 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article = />b"), { result: "a b" }, "43");
  t.end();
});

tap.test("44 - tag name, equals and end of a tag", (t) => {
  // xhtml with space after the closing slash
  t.hasStrict(stripHtml("a<article=/ >b"), { result: "a b" }, "44");
  t.end();
});

tap.test("45 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article =/ >b"), { result: "a b" }, "45");
  t.end();
});

tap.test("46 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article= / >b"), { result: "a b" }, "46");
  t.end();
});

tap.test("47 - tag name, equals and end of a tag", (t) => {
  t.hasStrict(stripHtml("a<article = / >b"), { result: "a b" }, "47");
  t.end();
});

tap.test("48 - multiple equals after attribute's name", (t) => {
  // 1. consecutive equals
  // normal tag:
  t.hasStrict(
    stripHtml('aaaaaaa<div class =="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "48"
  );
  t.end();
});

tap.test("49 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.hasStrict(
    stripHtml('aaaaaaa<script class =="zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "49"
  );
  t.end();
});

tap.test("50 - multiple equals after attribute's name", (t) => {
  // 2. consecutive equals with space
  // normal tag:
  t.hasStrict(
    stripHtml('aaaaaaa<div class = ="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "50"
  );
  t.end();
});

tap.test("51 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.hasStrict(
    stripHtml('aaaaaaa<script class = ="zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "51"
  );
  t.end();
});

tap.test("52 - multiple equals after attribute's name", (t) => {
  // 3. consecutive equals with more spaces in between
  // normal tag:
  t.hasStrict(
    stripHtml('aaaaaaa<div class = = "zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "52"
  );
  t.end();
});

tap.test("53 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.hasStrict(
    stripHtml('aaaaaaa<script class = = "zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "53"
  );
  t.end();
});

tap.test("54 - multiple equals after attribute's name", (t) => {
  // 4. consecutive equals, following attribute's name tightly
  // normal tag:
  t.hasStrict(
    stripHtml('aaaaaaa<div class= = "zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "54"
  );
  t.end();
});

tap.test("55 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.hasStrict(
    stripHtml('aaaaaaa<script class= = "zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "55"
  );
  t.end();
});

tap.test("56 - multiple equals after attribute's name", (t) => {
  // 5. consecutive equals, tight
  // normal tag:
  t.hasStrict(
    stripHtml('aaaaaaa<div class=="zzzz">x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "56"
  );
  t.end();
});

tap.test("57 - multiple equals after attribute's name", (t) => {
  // ranged tag:
  t.hasStrict(
    stripHtml('aaaaaaa<script class=="zzzz">x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "57"
  );
  t.end();
});

tap.test(
  "58 - multiple quotes in the attributes - double, opening only - normal",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "58"
    );
    t.end();
  }
);

tap.test(
  "59 - multiple quotes in the attributes - double, opening only - ranged",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "59"
    );
    t.end();
  }
);

tap.test(
  "60 - multiple quotes in the attributes - double, closing - normal",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "60"
    );
    t.end();
  }
);

tap.test(
  "61 - multiple quotes in the attributes - double, closing - ranged",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "61"
    );
    t.end();
  }
);

tap.test(
  "62 - multiple quotes in the attributes - double, both closing and opening - normal",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<div class=""zzzz"">x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "62"
    );
    t.end();
  }
);

tap.test(
  "63 - multiple quotes in the attributes - double, both closing and opening - ranged",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<script class=""zzzz"">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "63"
    );
    t.end();
  }
);

tap.test(
  "64 - multiple quotes in the attributes - single, opening only - normal",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "64"
    );
    t.end();
  }
);

tap.test(
  "65 - multiple quotes in the attributes - single, opening only - ranged",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "65"
    );
    t.end();
  }
);

tap.test(
  "66 - multiple quotes in the attributes - single, closing - normal",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "66"
    );
    t.end();
  }
);

tap.test(
  "67 - multiple quotes in the attributes - single, closing - ranged",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "67"
    );
    t.end();
  }
);

tap.test(
  "68 - multiple quotes in the attributes - single, both closing and opening - normal",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<div class=''zzzz''>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "68"
    );
    t.end();
  }
);

tap.test(
  "69 - multiple quotes in the attributes - single, both closing and opening - ranged",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<script class=''zzzz''>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "69"
    );
    t.end();
  }
);

tap.test(
  "70 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - normal",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<div class= ==''zzzz''>x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "70"
    );
    t.end();
  }
);

tap.test(
  "71 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - ranged",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<script class = ==''zzzz''>x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "71"
    );
    t.end();
  }
);

tap.test(
  "72 - multiple quotes in the attributes - mismatching quotes only - normal",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<div class=''zzzz\"\">x</div>bbbbbbbb"),
      { result: "aaaaaaa x bbbbbbbb" },
      "72"
    );
    t.end();
  }
);

tap.test(
  "73 - multiple quotes in the attributes - mismatching quotes only - ranged",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<script class=''zzzz\"\">x</script>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "73"
    );
    t.end();
  }
);

tap.test(
  "74 - multiple quotes in the attributes - crazy messed up - normal",
  (t) => {
    t.hasStrict(
      stripHtml(`aaaaaaa<div class= =='  'zzzz" " ">x</div>bbbbbbbb`),
      { result: "aaaaaaa x bbbbbbbb" },
      "74"
    );
    t.end();
  }
);

tap.test(
  "75 - multiple quotes in the attributes - crazy messed up - ranged",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " ">x</script>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "75"
    );
    t.end();
  }
);

tap.test(
  "76 - multiple quotes in the attributes - even more crazy messed up - normal",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " " /// >x</div>bbbbbbbb'),
      { result: "aaaaaaa x bbbbbbbb" },
      "76"
    );
    t.end();
  }
);

tap.test(
  "77 - multiple quotes in the attributes - even more crazy messed up - ranged",
  (t) => {
    t.hasStrict(
      stripHtml(
        'aaaaaaa<script class= ==\'  \'zzzz" " " /// >x</script>bbbbbbbb'
      ),
      { result: "aaaaaaa bbbbbbbb" },
      "77"
    );
    t.end();
  }
);

tap.test("78 - unclosed attributes - normal", (t) => {
  t.hasStrict(
    stripHtml('aaaaaaa<div class="zzzz>x</div>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "78"
  );
  t.end();
});

tap.test("79 - unclosed attributes - ranged", (t) => {
  t.hasStrict(
    stripHtml('aaaaaaa<script class="zzzz>x</script>bbbbbbbb'),
    { result: "aaaaaaa bbbbbbbb" },
    "79"
  );
  t.end();
});

tap.test("80 - unclosed attributes - single tag", (t) => {
  t.hasStrict(
    stripHtml('aaaaaaa<br class="zzzz>x<br>bbbbbbbb'),
    { result: "aaaaaaa x bbbbbbbb" },
    "80"
  );
  t.end();
});

tap.test(
  "81 - unclosed attributes - new tag starts, closing quote missing",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<br class="zzzz <br>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "81"
    );
    t.end();
  }
);

tap.test(
  "82 - unclosed attributes - new tag starts, both quotes present",
  (t) => {
    t.hasStrict(
      stripHtml('aaaaaaa<br class="zzzz" <br>bbbbbbbb'),
      { result: "aaaaaaa bbbbbbbb" },
      "82"
    );
    t.end();
  }
);

tap.test(
  "83 - unclosed attributes - cut off at the end of attribute's name",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<br class<br>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "83"
    );
    t.end();
  }
);

tap.test(
  "84 - unclosed attributes - cut off with a rogue exclamation mark",
  (t) => {
    t.hasStrict(
      stripHtml("aaaaaaa<br class!<br>bbbbbbbb"),
      { result: "aaaaaaa bbbbbbbb" },
      "84"
    );
    t.end();
  }
);

tap.test(
  "85 - duplicated consecutive attribute values - inner whitespace",
  (t) => {
    t.hasStrict(
      stripHtml('aa< br class1="b1" yo1   =   class2 = "b2" yo2 yo3>cc'),
      { result: "aa cc" },
      "85"
    );
    t.end();
  }
);

tap.test("86 - space after bracket, multiple attrs, no equals", (t) => {
  t.hasStrict(stripHtml("aa< br a b >cc"), { result: "aa< br a b >cc" }, "86");
  t.end();
});

tap.test("87 - space after bracket, multiple attrs, no equals", (t) => {
  t.hasStrict(
    stripHtml("aa < br a b >cc"),
    { result: "aa < br a b >cc" },
    "87"
  );
  t.end();
});

tap.test("88 - space after bracket, multiple attrs, no equals", (t) => {
  t.hasStrict(
    stripHtml("aa< br a b > cc"),
    { result: "aa< br a b > cc" },
    "88"
  );
  t.end();
});

tap.test("89 - space after bracket, multiple attrs, no equals", (t) => {
  t.hasStrict(
    stripHtml("aa < br a b > cc"),
    { result: "aa < br a b > cc" },
    "89"
  );
  t.end();
});

tap.test("90 - space after bracket, multiple attrs, no equals", (t) => {
  t.hasStrict(
    stripHtml("aa  < br a b >  cc"),
    { result: "aa  < br a b >  cc" },
    "90"
  );
  t.end();
});

tap.test("91 - various, #1", (t) => {
  t.hasStrict(stripHtml('aa< br a b=" >cc'), { result: "aa cc" }, "91");
  t.end();
});

tap.test("92 - various, #2", (t) => {
  t.hasStrict(stripHtml('aa< br a b= " >cc'), { result: "aa cc" }, "92");
  t.end();
});

tap.test("93 - various, #3", (t) => {
  t.hasStrict(stripHtml('aa< br a b =" >cc'), { result: "aa cc" }, "93");
  t.end();
});

tap.test("94 - various, #4", (t) => {
  t.hasStrict(stripHtml('aa< br a b = " >cc'), { result: "aa cc" }, "94");
  t.end();
});

tap.test("95 - various, #5", (t) => {
  // xhtml
  t.hasStrict(stripHtml('aa< br a b=" />cc'), { result: "aa cc" }, "95");
  t.end();
});

tap.test("96 - various, #6", (t) => {
  t.hasStrict(stripHtml('aa< br a b= " />cc'), { result: "aa cc" }, "96");
  t.end();
});

tap.test("97 - various, #7", (t) => {
  t.hasStrict(stripHtml('aa< br a b =" />cc'), { result: "aa cc" }, "97");
  t.end();
});

tap.test("98 - various, #8", (t) => {
  t.hasStrict(stripHtml('aa< br a b = " />cc'), { result: "aa cc" }, "98");
  t.end();
});

tap.test("99 - various, #9", (t) => {
  t.hasStrict(stripHtml('aa< br a b=" / >cc'), { result: "aa cc" }, "99");
  t.end();
});

tap.test("100 - various, #10", (t) => {
  t.hasStrict(stripHtml('aa< br a b= " / >cc'), { result: "aa cc" }, "100");
  t.end();
});

tap.test("101 - various, #11", (t) => {
  t.hasStrict(stripHtml('aa< br a b =" / >cc'), { result: "aa cc" }, "101");
  t.end();
});

tap.test("102 - various, #12", (t) => {
  t.hasStrict(stripHtml('aa< br a b = " / >cc'), { result: "aa cc" }, "102");
  t.end();
});

tap.test("103 - various, #13", (t) => {
  t.hasStrict(stripHtml('aa< br a b=" // >cc'), { result: "aa cc" }, "103");
  t.end();
});

tap.test("104 - various, #14", (t) => {
  t.hasStrict(stripHtml('aa< br a b= " // >cc'), { result: "aa cc" }, "104");
  t.end();
});

tap.test("105 - various, #15", (t) => {
  t.hasStrict(stripHtml('aa< br a b =" // >cc'), { result: "aa cc" }, "105");
  t.end();
});

tap.test("106 - various, #16", (t) => {
  t.hasStrict(stripHtml('aa< br a b = " // >cc'), { result: "aa cc" }, "106");
  t.end();
});

tap.test("107 - various, #17", (t) => {
  t.hasStrict(
    stripHtml(
      '<div><article class="main" id=="something">text</article></div>'
    ),
    { result: "text" },
    "107"
  );
  t.end();
});

tap.test("108 - various, #18 - suddenly cut off healthy HTML", (t) => {
  t.hasStrict(
    stripHtml(
      `la <b>la</b> la<table><tr>
<td><a href="http://codsen.com" target="_blank"><img src="http://cdn.codsen.com/nonexistent.gif" width="11" height="22" border="0" style="display:block; -ms-interpolation-mode:bicubic; color: #ffffff; font-style: it`
    ),
    { result: "la la la" },
    "108 - HTML cut off in the middle of an inline CSS style"
  );
  t.end();
});

tap.test("109 - unclosed tag followed by a tag - HTML", (t) => {
  // tight
  t.hasStrict(
    stripHtml('111 <br class="zz"<img> 222'),
    { result: "111 222" },
    "109"
  );
  t.end();
});

tap.test("110 - unclosed tag followed by a tag - XHTML", (t) => {
  t.hasStrict(
    stripHtml('111 <br class="zz"/<img> 222'),
    { result: "111 222" },
    "110"
  );
  t.end();
});

tap.test("111 - unclosed tag followed by a tag - HTML", (t) => {
  // space
  t.hasStrict(
    stripHtml('111 <br class="zz" <img> 222'),
    { result: "111 222" },
    "111"
  );
  t.end();
});

tap.test("112 - unclosed tag followed by a tag - XHTML", (t) => {
  t.hasStrict(
    stripHtml('111 <br class="zz"/ <img> 222'),
    { result: "111 222" },
    "112"
  );
  t.end();
});

tap.test("113 - unclosed tag followed by a tag - HTML - line break", (t) => {
  //
  t.hasStrict(
    stripHtml('111 <br class="zz"\n<img> 222'),
    { result: "111\n222" },
    "113"
  );
  t.end();
});

tap.test("114 - unclosed tag followed by a tag - XHTML - line break", (t) => {
  t.hasStrict(
    stripHtml('111 <br class="zz"/\n<img> 222'),
    { result: "111\n222" },
    "114"
  );
  t.end();
});

tap.test(
  "115 - unclosed tag followed by a tag - space and line break, HTML",
  (t) => {
    //
    t.hasStrict(
      stripHtml('111 <br class="zz" \n<img> 222'),
      { result: "111\n222" },
      "115"
    );
    t.end();
  }
);

tap.test(
  "116 - unclosed tag followed by a tag - space and line break, XHTML",
  (t) => {
    t.hasStrict(
      stripHtml('111 <br class="zz"/ \n<img> 222'),
      { result: "111\n222" },
      "116"
    );
    t.end();
  }
);

tap.test("117 - unclosed tag followed by a tag - messy", (t) => {
  t.hasStrict(
    stripHtml('111 <br class="zz"\t/ \n<img> 222'),
    { result: "111\n222" },
    "117"
  );
  t.end();
});

tap.test("118 - unclosed tag followed by a tag", (t) => {
  t.hasStrict(
    stripHtml('111 <br class="zz"\t/\r\n\t \n<img> 222'),
    { result: "111\n\n222" },
    "118"
  );
  t.end();
});

tap.test("119 - unclosed tag followed by a tag", (t) => {
  t.hasStrict(
    stripHtml("111 <a\t/\r\n\t \n<img> 222"),
    { result: "111\n\n222" },
    "119"
  );
  t.end();
});

tap.test("120 - dirty code - unclosed tag followed by a tag", (t) => {
  t.hasStrict(
    stripHtml("111 <a\t/\r\n\t \n<img> 222"),
    { result: "111\n\n222" },
    "120"
  );
  t.end();
});

tap.test("121 - two equals", (t) => {
  t.hasStrict(
    stripHtml('aaa <div class=="yo"> zzz'),
    { result: "aaa zzz" },
    "121"
  );
  t.end();
});

tap.test("122 - space + two equals", (t) => {
  t.hasStrict(
    stripHtml('aaa <div class =="yo"> zzz'),
    { result: "aaa zzz" },
    "122"
  );
  t.end();
});
