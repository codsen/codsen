import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("01 - missing closing bracket - opening bracket acts as tag delimeter", () => {
  equal(
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
      ranges: [
        [0, 6],
        [10, 36],
      ],
    },
    "01.01",
  );
});

test("02 - missing closing brackets", () => {
  equal(
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
      ranges: [
        [0, 10],
        [14, 57],
      ],
    },
    "02.01",
  );
});

test("03 - missing closing brackets", () => {
  equal(
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
      ranges: [
        [0, 6],
        [10, 17],
      ],
    },
    "03.01",
  );
});

test("04 - missing closing brackets, leading to EOL", () => {
  equal(
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
      ranges: [
        [0, 3],
        [7, 9],
      ],
    },
    "04.01",
  );
});

test("05 - missing closing brackets, multiple tags", () => {
  equal(
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
      ranges: [
        [0, 3],
        [7, 11],
      ],
    },
    "05.01",
  );
});

test("06 - missing opening bracket, but recognised tag name", () => {
  equal(
    stripHtml('body class="x">zzz</body>'),
    {
      result: "zzz",
      allTagLocations: [
        [0, 15],
        [18, 25],
      ],
      filteredTagLocations: [
        [0, 15],
        [18, 25],
      ],
      ranges: [
        [0, 15],
        [18, 25],
      ],
    },
    "06.01",
  );
});

test("07 - missing opening bracket, but recognised tag name, inner whitespace", () => {
  equal(
    stripHtml('BODY class="x" >zzz</body>'),
    {
      result: "zzz",
      allTagLocations: [
        [0, 16],
        [19, 26],
      ],
      filteredTagLocations: [
        [0, 16],
        [19, 26],
      ],
      ranges: [
        [0, 16],
        [19, 26],
      ],
    },
    "07.01",
  );
});

test("08 - missing opening bracket, but recognised tag name, closing slash", () => {
  equal(
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
      ranges: [
        [0, 6],
        [9, 16],
      ],
    },
    "08.01",
  );
});

test("09 - missing opening bracket, but recognised tag name, whitespace in front of slash", () => {
  equal(
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
      ranges: [
        [0, 7],
        [10, 17],
      ],
    },
    "09.01",
  );
});

test("10 - missing opening bracket, but recognised tag name, rogue whitespace around slash", () => {
  equal(
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
      ranges: [
        [0, 8],
        [11, 18],
      ],
    },
    "10.01",
  );
});

test("11 - missing opening bracket, but recognised tag name, recognised article tag", () => {
  equal(
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
      ranges: [
        [0, 31],
        [34, 52],
      ],
    },
    "11.01",
  );
});

test("12 - missing opening bracket, but recognised tag name - at index position zero", () => {
  equal(
    stripHtml("tralala>zzz</body>"),
    {
      result: "tralala>zzz",
      allTagLocations: [[11, 18]],
      filteredTagLocations: [[11, 18]],
      ranges: [[11, 18]],
    },
    "12.01",
  );
});

test("13 - missing opening bracket, but recognised tag name - all caps, recognised", () => {
  equal(
    stripHtml("BODY/>zzz</BODY>"),
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
      ranges: [
        [0, 6],
        [9, 16],
      ],
    },
    "13.01",
  );
});

test("14 - missing opening bracket, but recognised tag name - low caps, unrecognised", () => {
  equal(
    stripHtml("tralala>zzz</BODY>"),
    {
      result: "tralala>zzz",
      allTagLocations: [[11, 18]],
      filteredTagLocations: [[11, 18]],
      ranges: [[11, 18]],
    },
    "14.01",
  );
});

test("15 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 20]],
      filteredTagLocations: [[1, 20]],
      ranges: [[1, 20, " "]],
    },
    "15.01",
  );
});

test("16 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
      ranges: [[1, 21, " "]],
    },
    "16.01",
  );
});

test("17 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
      ranges: [[1, 21, " "]],
    },
    "17.01",
  );
});

test("18 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
      ranges: [[1, 22, " "]],
    },
    "18.01",
  );
});

test("19 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=/ >b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
      ranges: [[1, 22, " "]],
    },
    "19.01",
  );
});

test("20 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
      ranges: [[1, 23, " "]],
    },
    "20.01",
  );
});

test("21 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
      ranges: [[1, 23, " "]],
    },
    "21.01",
  );
});

test("22 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=  / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 24]],
      filteredTagLocations: [[1, 24]],
      ranges: [[1, 24, " "]],
    },
    "22.01",
  );
});

test("23 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever=>b"),
    {
      result: "a b",
      ranges: [[1, 30, " "]],
      allTagLocations: [[1, 30]],
      filteredTagLocations: [[1, 30]],
    },
    "23.01",
  );
});

test("24 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever=>b", {
      onlyStripTags: ["article"],
    }),
    {
      result: "a b",
      ranges: [[1, 30, " "]],
      allTagLocations: [[1, 30]],
      filteredTagLocations: [[1, 30]],
    },
    "24.01",
  );
});

test("25 - multiple incomplete attributes", () => {
  let input = "a<article anything= whatever=>b";
  equal(
    stripHtml(input, {
      ignoreTags: ["article"],
    }),
    {
      result: input,
      ranges: null,
      allTagLocations: [[1, 30]],
      filteredTagLocations: [],
    },
    "25.01",
  );
});

test("26 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
      ranges: [[1, 31, " "]],
    },
    "26.01",
  );
});

test("27 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
      ranges: [[1, 31, " "]],
    },
    "27.01",
  );
});

test("28 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 32]],
      filteredTagLocations: [[1, 32]],
      ranges: [[1, 32, " "]],
    },
    "28.01",
  );
});

test("29 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala">b'),
    {
      result: "a b",
      allTagLocations: [[1, 53]],
      filteredTagLocations: [[1, 53]],
      ranges: [[1, 53, " "]],
    },
    "29.01",
  );
});

test("30 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"/>b'),
    {
      result: "a b",
      allTagLocations: [[1, 54]],
      filteredTagLocations: [[1, 54]],
      ranges: [[1, 54, " "]],
    },
    "30.01",
  );
});

test("31 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" />b'),
    {
      result: "a b",
      allTagLocations: [[1, 55]],
      filteredTagLocations: [[1, 55]],
      ranges: [[1, 55, " "]],
    },
    "31.01",
  );
});

test("32 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" / >b'),
    {
      result: "a b",
      allTagLocations: [[1, 56]],
      filteredTagLocations: [[1, 56]],
      ranges: [[1, 56, " "]],
    },
    "32.01",
  );
});

test("33 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"  /  >b'),
    {
      result: "a b",
      allTagLocations: [[1, 58]],
      filteredTagLocations: [[1, 58]],
      ranges: [[1, 58, " "]],
    },
    "33.01",
  );
});

test("34 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a <article anything= class="zz" whatever= id="lalala"  /  > b'),
    {
      result: "a b",
      allTagLocations: [[2, 59]],
      filteredTagLocations: [[2, 59]],
      ranges: [[1, 60, " "]],
    },
    "34.01",
  );
});

test("35 - multiple incomplete attributes", () => {
  equal(
    stripHtml(
      'a <article anything = class="zz" whatever = id="lalala"  /  > b',
    ),
    {
      result: "a b",
      allTagLocations: [[2, 61]],
      filteredTagLocations: [[2, 61]],
      ranges: [[1, 62, " "]],
    },
    "35.01",
  );
});

test("36 - tag name, equals and end of a tag", () => {
  // html
  equal(
    stripHtml("a<article=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 11]],
      filteredTagLocations: [[1, 11]],
      ranges: [[1, 11, " "]],
    },
    "36.01",
  );
});

test("37 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article =>b").result, "a b", "37.01");
});

test("38 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article= >b").result, "a b", "38.01");
});

test("39 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article = >b").result, "a b", "39.01");
});

test("40 - tag name, equals and end of a tag", () => {
  // xhtml without space between the slash and closing tag
  equal(stripHtml("a<article=/>b").result, "a b", "40.01");
});

test("41 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article =/>b").result, "a b", "41.01");
});

test("42 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article= />b").result, "a b", "42.01");
});

test("43 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article = />b").result, "a b", "43.01");
});

test("44 - tag name, equals and end of a tag", () => {
  // xhtml with space after the closing slash
  equal(stripHtml("a<article=/ >b").result, "a b", "44.01");
});

test("45 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article =/ >b").result, "a b", "45.01");
});

test("46 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article= / >b").result, "a b", "46.01");
});

test("47 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article = / >b").result, "a b", "47.01");
});

test("48 - multiple equals after attribute's name", () => {
  // 1. consecutive equals
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class =="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "48.01",
  );
});

test("49 - multiple equals after attribute's name", () => {
  // TIGHT

  // ranged tag:
  equal(
    stripHtml('abc<script class =="zzzz">x</script>def').result,
    "abc def",
    "49.01",
  );
  // block-level tag:
  equal(
    stripHtml('abc<div class =="zzzz">x</div>def').result,
    "abc x def",
    "49.02",
  );
  // inline tag
  equal(stripHtml('abc<b class =="zzzz">x</b>def').result, "abcxdef", "49.03");

  // ONE SPACE

  // ranged tag:
  equal(
    stripHtml('abc <script class =="zzzz">x</script> def').result,
    "abc def",
    "49.04",
  );
  // block-level tag:
  equal(
    stripHtml('abc <div class =="zzzz">x</div> def').result,
    "abc x def",
    "49.05",
  );
  // inline tag
  equal(
    stripHtml('abc <b class =="zzzz">x</b> def').result,
    "abc x def",
    "49.06",
  );

  // TWO SPACES

  // ranged tag:
  equal(
    stripHtml('abc  <script class =="zzzz">x</script>  def').result,
    "abc def",
    "49.07",
  );
  // block-level tag:
  equal(
    stripHtml('abc  <div class =="zzzz">x</div>  def').result,
    "abc x def",
    "49.08",
  );
  // inline tag
  equal(
    stripHtml('abc  <b class =="zzzz">x</b>  def').result,
    "abc x def",
    "49.09",
  );
});

test("50 - multiple equals after attribute's name", () => {
  // 2. consecutive equals with space
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class = ="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "50.01",
  );
});

test("51 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class = ="zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "51.01",
  );
});

test("52 - multiple equals after attribute's name", () => {
  // 3. consecutive equals with more spaces in between
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class = = "zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "52.01",
  );
});

test("53 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class = = "zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "53.01",
  );
});

test("54 - multiple equals after attribute's name", () => {
  // 4. consecutive equals, following attribute's name tightly
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class= = "zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "54.01",
  );
});

test("55 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class= = "zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "55.01",
  );
});

test("56 - multiple equals after attribute's name", () => {
  // 5. consecutive equals, tight
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class=="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "56.01",
  );
});

test("57 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class=="zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "57.01",
  );
});

test("58 - multiple quotes in the attributes - double, opening only - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "58.01",
  );
});

test("59 - multiple quotes in the attributes - double, opening only - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "59.01",
  );
});

test("60 - multiple quotes in the attributes - double, closing - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "60.01",
  );
});

test("61 - multiple quotes in the attributes - double, closing - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "61.01",
  );
});

test("62 - multiple quotes in the attributes - double, both closing and opening - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class=""zzzz"">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "62.01",
  );
});

test("63 - multiple quotes in the attributes - double, both closing and opening - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class=""zzzz"">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "63.01",
  );
});

test("64 - multiple quotes in the attributes - single, opening only - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "64.01",
  );
});

test("65 - multiple quotes in the attributes - single, opening only - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "65.01",
  );
});

test("66 - multiple quotes in the attributes - single, closing - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "66.01",
  );
});

test("67 - multiple quotes in the attributes - single, closing - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "67.01",
  );
});

test("68 - multiple quotes in the attributes - single, both closing and opening - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz''>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "68.01",
  );
});

test("69 - multiple quotes in the attributes - single, both closing and opening - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz''>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "69.01",
  );
});

test("70 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class= ==''zzzz''>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "70.01",
  );
});

test("71 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class = ==''zzzz''>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "71.01",
  );
});

test("72 - multiple quotes in the attributes - mismatching quotes only - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz\"\">x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "72.01",
  );
});

test("73 - multiple quotes in the attributes - mismatching quotes only - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz\"\">x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "73.01",
  );
});

test("74 - multiple quotes in the attributes - crazy messed up - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " ">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "74.01",
  );
});

test("75 - multiple quotes in the attributes - crazy messed up - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " ">x</script>bbbbbbbb')
      .result,
    "aaaaaaa bbbbbbbb",
    "75.01",
  );
});

test("76 - multiple quotes in the attributes - even more crazy messed up - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " " /// >x</div>bbbbbbbb')
      .result,
    "aaaaaaa x bbbbbbbb",
    "76.01",
  );
});

test("77 - multiple quotes in the attributes - even more crazy messed up - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " " /// >x</script>bbbbbbbb')
      .result,
    "aaaaaaa bbbbbbbb",
    "77.01",
  );
});

test("78 - unclosed attributes - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class="zzzz>x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "78.01",
  );
});

test("79 - unclosed attributes - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class="zzzz>x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "79.01",
  );
});

test("80 - unclosed attributes - single tag", () => {
  equal(
    stripHtml('aaaaaaa<br class="zzzz>x<br>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "80.01",
  );
});

test("81 - unclosed attributes - new tag starts, closing quote missing", () => {
  equal(
    stripHtml('aaaaaaa<br class="zzzz <br>bbbbbbbb').result,
    "aaaaaaa",
    "81.01",
  );
  equal(
    stripHtml('aaa<br class="zzzz <br>\n<div>bbb</div>').result,
    "aaa",
    "81.02",
  );
  equal(
    stripHtml('aaa<br class="zzzz <br>\n<div class="x">bbb</div>').result,
    "aaa\nbbb",
    "81.03",
  );
});

test("82 - unclosed attributes - new tag starts, both quotes present", () => {
  equal(
    stripHtml('aaaaaaa<br class="zzzz" <br>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "82.01",
  );
});

test("83 - unclosed attributes - cut off at the end of attribute's name", () => {
  equal(
    stripHtml("aaaaaaa<br class<br>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "83.01",
  );
});

test("84 - unclosed attributes - cut off with a rogue exclamation mark", () => {
  equal(
    stripHtml("aaaaaaa<br class!<br>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "84.01",
  );
});

test("85 - duplicated consecutive attribute values - inner whitespace", () => {
  equal(
    stripHtml('aa< br class1="b1" yo1   =   class2 = "b2" yo2 yo3>cc').result,
    "aa cc",
    "85.01",
  );
});

test("86 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa< br a b >cc").result, "aa< br a b >cc", "86.01");
});

test("87 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa < br a b >cc").result, "aa < br a b >cc", "87.01");
});

test("88 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa< br a b > cc").result, "aa< br a b > cc", "88.01");
});

test("89 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa < br a b > cc").result, "aa < br a b > cc", "89.01");
});

test("90 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa  < br a b >  cc").result, "aa  < br a b >  cc", "90.01");
});

test("91 - various, #1", () => {
  equal(stripHtml('aa< br a b=" >cc').result, "aa cc", "91.01");
});

test("92 - various, #2", () => {
  equal(stripHtml('aa< br a b= " >cc').result, "aa cc", "92.01");
});

test("93 - various, #3", () => {
  equal(stripHtml('aa< br a b =" >cc').result, "aa cc", "93.01");
});

test("94 - various, #4", () => {
  equal(stripHtml('aa< br a b = " >cc').result, "aa cc", "94.01");
});

test("95 - various, #5", () => {
  // xhtml
  equal(stripHtml('aa< br a b=" />cc').result, "aa cc", "95.01");
});

test("96 - various, #6", () => {
  equal(stripHtml('aa< br a b= " />cc').result, "aa cc", "96.01");
});

test("97 - various, #7", () => {
  equal(stripHtml('aa< br a b =" />cc').result, "aa cc", "97.01");
});

test("98 - various, #8", () => {
  equal(stripHtml('aa< br a b = " />cc').result, "aa cc", "98.01");
});

test("99 - various, #9", () => {
  equal(stripHtml('aa< br a b=" / >cc').result, "aa cc", "99.01");
});

test("100 - various, #10", () => {
  equal(stripHtml('aa< br a b= " / >cc').result, "aa cc", "100.01");
});

test("101 - various, #11", () => {
  equal(stripHtml('aa< br a b =" / >cc').result, "aa cc", "101.01");
});

test("102 - various, #12", () => {
  equal(stripHtml('aa< br a b = " / >cc').result, "aa cc", "102.01");
});

test("103 - various, #13", () => {
  equal(stripHtml('aa< br a b=" // >cc').result, "aa cc", "103.01");
});

test("104 - various, #14", () => {
  equal(stripHtml('aa< br a b= " // >cc').result, "aa cc", "104.01");
});

test("105 - various, #15", () => {
  equal(stripHtml('aa< br a b =" // >cc').result, "aa cc", "105.01");
});

test("106 - various, #16", () => {
  equal(stripHtml('aa< br a b = " // >cc').result, "aa cc", "106.01");
});

test("107 - various, #17", () => {
  equal(
    stripHtml('<div><article class="main" id=="something">text</article></div>')
      .result,
    "text",
    "107.01",
  );
});

test("108 - various, #18 - suddenly cut off healthy HTML", () => {
  equal(
    stripHtml(
      `la <b>la</b> la<table><tr>
<td><a href="http://codsen.com" target="_blank"><img src="http://cdn.codsen.com/nonexistent.gif" width="11" height="22" border="0" style="display:block; -ms-interpolation-mode:bicubic; color: #ffffff; font-style: it`,
    ).result,
    "la la la",
    "108.01",
  );
});

test("109 - unclosed tag followed by a tag - HTML", () => {
  // tight
  equal(stripHtml('111 <br class="zz"<img> 222').result, "111 222", "109.01");
});

test("110 - unclosed tag followed by a tag - XHTML", () => {
  equal(stripHtml('111 <br class="zz"/<img> 222').result, "111 222", "110.01");
});

test("111 - unclosed tag followed by a tag - HTML", () => {
  // space
  equal(stripHtml('111 <br class="zz" <img> 222').result, "111 222", "111.01");
});

test("112 - unclosed tag followed by a tag - XHTML", () => {
  equal(stripHtml('111 <br class="zz"/ <img> 222').result, "111 222", "112.01");
});

test("113 - unclosed tag followed by a tag - HTML - line break", () => {
  //
  equal(
    stripHtml('111 <br class="zz"\n<img> 222').result,
    "111\n222",
    "113.01",
  );
});

test("114 - unclosed tag followed by a tag - XHTML - line break", () => {
  equal(
    stripHtml('111 <br class="zz"/\n<img> 222').result,
    "111\n222",
    "114.01",
  );
});

test("115 - unclosed tag followed by a tag - space and line break, HTML", () => {
  //
  equal(
    stripHtml('111 <br class="zz" \n<img> 222').result,
    "111\n222",
    "115.01",
  );
});

test("116 - unclosed tag followed by a tag - space and line break, XHTML", () => {
  equal(
    stripHtml('111 <br class="zz"/ \n<img> 222').result,
    "111\n222",
    "116.01",
  );
});

test("117 - unclosed tag followed by a tag - messy", () => {
  equal(
    stripHtml('111 <br class="zz"\t/ \n<img> 222').result,
    "111\n222",
    "117.01",
  );
});

test("118 - unclosed tag followed by a tag", () => {
  equal(
    stripHtml('111 <br class="zz"\t/\r\n\t \n<img> 222').result,
    "111\n\n222",
    "118.01",
  );
});

test("119 - unclosed tag followed by a tag", () => {
  equal(
    stripHtml("111 <a\t/\r\n\t \n<img> 222").result,
    "111\n\n222",
    "119.01",
  );
});

test("120 - dirty code - unclosed tag followed by a tag", () => {
  equal(
    stripHtml("111 <a\t/\r\n\t \n<img> 222").result,
    "111\n\n222",
    "120.01",
  );
});

test("121 - two equals", () => {
  equal(stripHtml('aaa <div class=="yo"> zzz').result, "aaa zzz", "121.01");
});

test("122 - space + two equals", () => {
  equal(stripHtml('aaa <div class =="yo"> zzz').result, "aaa zzz", "122.01");
});

// harvested from sources mentioned in https://github.com/codsen/codsen/issues/48
test("123 - Alvaro's #1 - DOCTYPE attr's", () => {
  let gathered = [];
  let cb = (o) => {
    gathered.push(o.tag);
    o.rangesArr.push(o.proposedReturn);
  };
  equal(
    stripHtml(
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
      {
        cb,
      },
    ).result,
    "",
    "123.01",
  );
  equal(
    gathered[0].attributes,
    [
      {
        nameStarts: 10,
        nameEnds: 14,
        name: "html",
      },
      {
        nameStarts: 15,
        nameEnds: 21,
        name: "PUBLIC",
      },
      {
        nameStarts: 22,
        nameEnds: 62,
        name: '"-//W3C//DTD XHTML 1.0 Transitional//EN"',
      },
      {
        nameStarts: 63,
        nameEnds: 120,
        name: '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"',
      },
    ],
    "123.02",
  );
});

test("124 - Alvaro's #2", () => {
  let gathered = [];
  let cb = (o) => {
    gathered.push(o.tag);
    o.rangesArr.push(o.proposedReturn);
  };
  let { result } = stripHtml(
    "<script>a.a || a.a('<script a=\"/a/a\"><\\/script>')</script>",
    { cb },
  );
  equal(result, "", "124.01");
  equal(
    gathered,
    [
      {
        attributes: [],
        lastOpeningBracketAt: 0,
        slashPresent: false,
        leftOuterWhitespace: 0,
        onlyPlausible: false,
        nameStarts: 1,
        nameContainsLetters: true,
        nameEnds: 7,
        name: "script",
        lastClosingBracketAt: 7,
      },
      {
        lastOpeningBracketAt: 49,
        slashPresent: 50,
        attributes: [],
        leftOuterWhitespace: 49,
        onlyPlausible: false,
        nameStarts: 51,
        nameContainsLetters: true,
        nameEnds: 57,
        name: "script",
        lastClosingBracketAt: 57,
      },
      {
        lastOpeningBracketAt: 49,
        slashPresent: 50,
        attributes: [],
        leftOuterWhitespace: 49,
        onlyPlausible: false,
        nameStarts: 51,
        nameContainsLetters: true,
        nameEnds: 57,
        name: "script",
        lastClosingBracketAt: 57,
      },
    ],
    "124.02",
  );
});

test("125 - Alvaro's #3", () => {
  let gathered = [];
  let cb = (o) => {
    gathered.push(o.tag);
    o.rangesArr.push(o.proposedReturn);
  };
  let { result } = stripHtml('<script><div class="{%}f{%}%}"></script>', {
    cb,
  });
  equal(result, "", "125.01");
  equal(
    gathered,
    [
      {
        attributes: [],
        lastOpeningBracketAt: 0,
        slashPresent: false,
        leftOuterWhitespace: 0,
        onlyPlausible: false,
        nameStarts: 1,
        nameContainsLetters: true,
        nameEnds: 7,
        name: "script",
        lastClosingBracketAt: 7,
      },
      {
        lastOpeningBracketAt: 31,
        slashPresent: 32,
        attributes: [],
        leftOuterWhitespace: 31,
        onlyPlausible: false,
        nameStarts: 33,
        nameContainsLetters: true,
        nameEnds: 39,
        name: "script",
        lastClosingBracketAt: 39,
      },
      {
        lastOpeningBracketAt: 31,
        slashPresent: 32,
        attributes: [],
        leftOuterWhitespace: 31,
        onlyPlausible: false,
        nameStarts: 33,
        nameContainsLetters: true,
        nameEnds: 39,
        name: "script",
        lastClosingBracketAt: 39,
      },
    ],
    "125.02",
  );
});

test("126 - Alvaro's #4", () => {
  let gathered = [];
  let cb = (o) => {
    gathered.push(o.tag);
    o.rangesArr.push(o.proposedReturn);
  };
  let { result } = stripHtml(
    '<script><div class="a {% if(b.c == 1 || (b.c >= 2 && d[1].e > 25)){%}f{%}%}"></script>',
    { cb },
  );
  equal(result, "", "126.01");
  equal(
    gathered,
    [
      {
        attributes: [],
        lastOpeningBracketAt: 0,
        slashPresent: false,
        leftOuterWhitespace: 0,
        onlyPlausible: false,
        nameStarts: 1,
        nameContainsLetters: true,
        nameEnds: 7,
        name: "script",
        lastClosingBracketAt: 7,
      },
      {
        lastOpeningBracketAt: 77,
        slashPresent: 78,
        attributes: [],
        leftOuterWhitespace: 77,
        onlyPlausible: false,
        nameStarts: 79,
        nameContainsLetters: true,
        nameEnds: 85,
        name: "script",
        lastClosingBracketAt: 85,
      },
      {
        lastOpeningBracketAt: 77,
        slashPresent: 78,
        attributes: [],
        leftOuterWhitespace: 77,
        onlyPlausible: false,
        nameStarts: 79,
        nameContainsLetters: true,
        nameEnds: 85,
        name: "script",
        lastClosingBracketAt: 85,
      },
    ],
    "126.02",
  );
});

test("127 - #65, nested, minimal", () => {
  let gathered = [];
  let cb = (o) => {
    gathered.push(o.tag);
    o.rangesArr.push(o.proposedReturn);
  };
  let { result } = stripHtml('<a href="<b>c</b>">d</a>', { cb });
  equal(result, "d", "127.01");
  equal(
    gathered,
    [
      {
        attributes: [
          {
            nameStarts: 3,
            nameEnds: 7,
            equalsAt: 7,
            name: "href",
            valueStarts: 9,
            valueEnds: 17,
            value: "<b>c</b>",
          },
        ],
        lastOpeningBracketAt: 0,
        slashPresent: false,
        leftOuterWhitespace: 0,
        onlyPlausible: false,
        nameStarts: 1,
        nameContainsLetters: true,
        nameEnds: 2,
        name: "a",
        lastClosingBracketAt: 18,
      },
      {
        lastOpeningBracketAt: 20,
        slashPresent: 21,
        attributes: [],
        leftOuterWhitespace: 20,
        onlyPlausible: false,
        nameStarts: 22,
        nameContainsLetters: true,
        nameEnds: 23,
        name: "a",
        lastClosingBracketAt: 23,
      },
    ],
    "127.02",
  );
});

test.run();
