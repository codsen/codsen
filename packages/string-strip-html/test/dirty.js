// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("001 - missing closing bracket - opening bracket acts as tag delimeter", () => {
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
    "001.01",
  );
});

test("002 - missing closing brackets", () => {
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
    "002.01",
  );
});

test("003 - missing closing brackets", () => {
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
    "003.01",
  );
});

test("004 - missing closing brackets, leading to EOL", () => {
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
    "004.01",
  );
});

test("005 - missing closing brackets, multiple tags", () => {
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
    "005.01",
  );
});

test("006 - missing opening bracket, but recognised tag name", () => {
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
    "006.01",
  );
});

test("007 - missing opening bracket, but recognised tag name, inner whitespace", () => {
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
    "007.01",
  );
});

test("008 - missing opening bracket, but recognised tag name, closing slash", () => {
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
    "008.01",
  );
});

test("009 - missing opening bracket, but recognised tag name, whitespace in front of slash", () => {
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
    "009.01",
  );
});

test("010 - missing opening bracket, but recognised tag name, rogue whitespace around slash", () => {
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
    "010.01",
  );
});

test("011 - missing opening bracket, but recognised tag name, recognised article tag", () => {
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
    "011.01",
  );
});

test("012 - missing opening bracket, but recognised tag name - at index position zero", () => {
  equal(
    stripHtml("tralala>zzz</body>"),
    {
      result: "tralala>zzz",
      allTagLocations: [[11, 18]],
      filteredTagLocations: [[11, 18]],
      ranges: [[11, 18]],
    },
    "012.01",
  );
});

test("013 - missing opening bracket, but recognised tag name - all caps, recognised", () => {
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
    "013.01",
  );
});

test("014 - missing opening bracket, but recognised tag name - low caps, unrecognised", () => {
  equal(
    stripHtml("tralala>zzz</BODY>"),
    {
      result: "tralala>zzz",
      allTagLocations: [[11, 18]],
      filteredTagLocations: [[11, 18]],
      ranges: [[11, 18]],
    },
    "014.01",
  );
});

test("015 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 20]],
      filteredTagLocations: [[1, 20]],
      ranges: [[1, 20, " "]],
    },
    "015.01",
  );
});

test("016 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
      ranges: [[1, 21, " "]],
    },
    "016.01",
  );
});

test("017 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 21]],
      filteredTagLocations: [[1, 21]],
      ranges: [[1, 21, " "]],
    },
    "017.01",
  );
});

test("018 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
      ranges: [[1, 22, " "]],
    },
    "018.01",
  );
});

test("019 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=/ >b"),
    {
      result: "a b",
      allTagLocations: [[1, 22]],
      filteredTagLocations: [[1, 22]],
      ranges: [[1, 22, " "]],
    },
    "019.01",
  );
});

test("020 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
      ranges: [[1, 23, " "]],
    },
    "020.01",
  );
});

test("021 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything= / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 23]],
      filteredTagLocations: [[1, 23]],
      ranges: [[1, 23, " "]],
    },
    "021.01",
  );
});

test("022 - incomplete attribute", () => {
  equal(
    stripHtml("a<article anything=  / >b"),
    {
      result: "a b",
      allTagLocations: [[1, 24]],
      filteredTagLocations: [[1, 24]],
      ranges: [[1, 24, " "]],
    },
    "022.01",
  );
});

test("023 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever=>b"),
    {
      result: "a b",
      ranges: [[1, 30, " "]],
      allTagLocations: [[1, 30]],
      filteredTagLocations: [[1, 30]],
    },
    "023.01",
  );
});

test("024 - multiple incomplete attributes", () => {
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
    "024.01",
  );
});

test("025 - multiple incomplete attributes", () => {
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
    "025.01",
  );
});

test("026 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever=/>b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
      ranges: [[1, 31, " "]],
    },
    "026.01",
  );
});

test("027 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever= >b"),
    {
      result: "a b",
      allTagLocations: [[1, 31]],
      filteredTagLocations: [[1, 31]],
      ranges: [[1, 31, " "]],
    },
    "027.01",
  );
});

test("028 - multiple incomplete attributes", () => {
  equal(
    stripHtml("a<article anything= whatever= />b"),
    {
      result: "a b",
      allTagLocations: [[1, 32]],
      filteredTagLocations: [[1, 32]],
      ranges: [[1, 32, " "]],
    },
    "028.01",
  );
});

test("029 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala">b'),
    {
      result: "a b",
      allTagLocations: [[1, 53]],
      filteredTagLocations: [[1, 53]],
      ranges: [[1, 53, " "]],
    },
    "029.01",
  );
});

test("030 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"/>b'),
    {
      result: "a b",
      allTagLocations: [[1, 54]],
      filteredTagLocations: [[1, 54]],
      ranges: [[1, 54, " "]],
    },
    "030.01",
  );
});

test("031 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" />b'),
    {
      result: "a b",
      allTagLocations: [[1, 55]],
      filteredTagLocations: [[1, 55]],
      ranges: [[1, 55, " "]],
    },
    "031.01",
  );
});

test("032 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" / >b'),
    {
      result: "a b",
      allTagLocations: [[1, 56]],
      filteredTagLocations: [[1, 56]],
      ranges: [[1, 56, " "]],
    },
    "032.01",
  );
});

test("033 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"  /  >b'),
    {
      result: "a b",
      allTagLocations: [[1, 58]],
      filteredTagLocations: [[1, 58]],
      ranges: [[1, 58, " "]],
    },
    "033.01",
  );
});

test("034 - multiple incomplete attributes", () => {
  equal(
    stripHtml('a <article anything= class="zz" whatever= id="lalala"  /  > b'),
    {
      result: "a b",
      allTagLocations: [[2, 59]],
      filteredTagLocations: [[2, 59]],
      ranges: [[1, 60, " "]],
    },
    "034.01",
  );
});

test("035 - multiple incomplete attributes", () => {
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
    "035.01",
  );
});

test("036 - tag name, equals and end of a tag", () => {
  // html
  equal(
    stripHtml("a<article=>b"),
    {
      result: "a b",
      allTagLocations: [[1, 11]],
      filteredTagLocations: [[1, 11]],
      ranges: [[1, 11, " "]],
    },
    "036.01",
  );
});

test("037 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article =>b").result, "a b", "037.01");
});

test("038 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article= >b").result, "a b", "038.01");
});

test("039 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article = >b").result, "a b", "039.01");
});

test("040 - tag name, equals and end of a tag", () => {
  // xhtml without space between the slash and closing tag
  equal(stripHtml("a<article=/>b").result, "a b", "040.01");
});

test("041 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article =/>b").result, "a b", "041.01");
});

test("042 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article= />b").result, "a b", "042.01");
});

test("043 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article = />b").result, "a b", "043.01");
});

test("044 - tag name, equals and end of a tag", () => {
  // xhtml with space after the closing slash
  equal(stripHtml("a<article=/ >b").result, "a b", "044.01");
});

test("045 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article =/ >b").result, "a b", "045.01");
});

test("046 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article= / >b").result, "a b", "046.01");
});

test("047 - tag name, equals and end of a tag", () => {
  equal(stripHtml("a<article = / >b").result, "a b", "047.01");
});

test("048 - multiple equals after attribute's name", () => {
  // 1. consecutive equals
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class =="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "048.01",
  );
});

test("049 - multiple equals after attribute's name", () => {
  // TIGHT

  // ranged tag:
  equal(
    stripHtml('abc<script class =="zzzz">x</script>def').result,
    "abc def",
    "049.01",
  );
  // block-level tag:
  equal(
    stripHtml('abc<div class =="zzzz">x</div>def').result,
    "abc x def",
    "049.02",
  );
  // inline tag
  equal(stripHtml('abc<b class =="zzzz">x</b>def').result, "abcxdef", "049.03");

  // ONE SPACE

  // ranged tag:
  equal(
    stripHtml('abc <script class =="zzzz">x</script> def').result,
    "abc def",
    "049.04",
  );
  // block-level tag:
  equal(
    stripHtml('abc <div class =="zzzz">x</div> def').result,
    "abc x def",
    "049.05",
  );
  // inline tag
  equal(
    stripHtml('abc <b class =="zzzz">x</b> def').result,
    "abc x def",
    "049.06",
  );

  // TWO SPACES

  // ranged tag:
  equal(
    stripHtml('abc  <script class =="zzzz">x</script>  def').result,
    "abc def",
    "049.07",
  );
  // block-level tag:
  equal(
    stripHtml('abc  <div class =="zzzz">x</div>  def').result,
    "abc x def",
    "049.08",
  );
  // inline tag
  equal(
    stripHtml('abc  <b class =="zzzz">x</b>  def').result,
    "abc x def",
    "049.09",
  );
});

test("050 - multiple equals after attribute's name", () => {
  // 2. consecutive equals with space
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class = ="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "050.01",
  );
});

test("051 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class = ="zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "051.01",
  );
});

test("052 - multiple equals after attribute's name", () => {
  // 3. consecutive equals with more spaces in between
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class = = "zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "052.01",
  );
});

test("053 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class = = "zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "053.01",
  );
});

test("054 - multiple equals after attribute's name", () => {
  // 4. consecutive equals, following attribute's name tightly
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class= = "zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "054.01",
  );
});

test("055 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class= = "zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "055.01",
  );
});

test("056 - multiple equals after attribute's name", () => {
  // 5. consecutive equals, tight
  // normal tag:
  equal(
    stripHtml('aaaaaaa<div class=="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "056.01",
  );
});

test("057 - multiple equals after attribute's name", () => {
  // ranged tag:
  equal(
    stripHtml('aaaaaaa<script class=="zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "057.01",
  );
});

test("058 - multiple quotes in the attributes - double, opening only - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "058.01",
  );
});

test("059 - multiple quotes in the attributes - double, opening only - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "059.01",
  );
});

test("060 - multiple quotes in the attributes - double, closing - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "060.01",
  );
});

test("061 - multiple quotes in the attributes - double, closing - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "061.01",
  );
});

test("062 - multiple quotes in the attributes - double, both closing and opening - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class=""zzzz"">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "062.01",
  );
});

test("063 - multiple quotes in the attributes - double, both closing and opening - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class=""zzzz"">x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "063.01",
  );
});

test("064 - multiple quotes in the attributes - single, opening only - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "064.01",
  );
});

test("065 - multiple quotes in the attributes - single, opening only - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "065.01",
  );
});

test("066 - multiple quotes in the attributes - single, closing - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "066.01",
  );
});

test("067 - multiple quotes in the attributes - single, closing - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "067.01",
  );
});

test("068 - multiple quotes in the attributes - single, both closing and opening - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz''>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "068.01",
  );
});

test("069 - multiple quotes in the attributes - single, both closing and opening - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz''>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "069.01",
  );
});

test("070 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class= ==''zzzz''>x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "070.01",
  );
});

test("071 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class = ==''zzzz''>x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "071.01",
  );
});

test("072 - multiple quotes in the attributes - mismatching quotes only - normal", () => {
  equal(
    stripHtml("aaaaaaa<div class=''zzzz\"\">x</div>bbbbbbbb").result,
    "aaaaaaa x bbbbbbbb",
    "072.01",
  );
});

test("073 - multiple quotes in the attributes - mismatching quotes only - ranged", () => {
  equal(
    stripHtml("aaaaaaa<script class=''zzzz\"\">x</script>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "073.01",
  );
});

test("074 - multiple quotes in the attributes - crazy messed up - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " ">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "074.01",
  );
});

test("075 - multiple quotes in the attributes - crazy messed up - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " ">x</script>bbbbbbbb')
      .result,
    "aaaaaaa bbbbbbbb",
    "075.01",
  );
});

test("076 - multiple quotes in the attributes - even more crazy messed up - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " " /// >x</div>bbbbbbbb')
      .result,
    "aaaaaaa x bbbbbbbb",
    "076.01",
  );
});

test("077 - multiple quotes in the attributes - even more crazy messed up - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " " /// >x</script>bbbbbbbb')
      .result,
    "aaaaaaa bbbbbbbb",
    "077.01",
  );
});

test("078 - unclosed attributes - normal", () => {
  equal(
    stripHtml('aaaaaaa<div class="zzzz>x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "078.01",
  );
});

test("079 - unclosed attributes - ranged", () => {
  equal(
    stripHtml('aaaaaaa<script class="zzzz>x</script>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "079.01",
  );
});

test("080 - unclosed attributes - single tag", () => {
  equal(
    stripHtml('aaaaaaa<br class="zzzz>x<br>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "080.01",
  );
});

test("081 - unclosed attributes - new tag starts, closing quote missing", () => {
  equal(
    stripHtml('aaaaaaa<br class="zzzz <br>bbbbbbbb').result,
    "aaaaaaa",
    "081.01",
  );
  equal(
    stripHtml('aaa<br class="zzzz <br>\n<div>bbb</div>').result,
    "aaa",
    "081.02",
  );
  equal(
    stripHtml('aaa<br class="zzzz <br>\n<div class="x">bbb</div>').result,
    "aaa\nbbb",
    "081.03",
  );
});

test("082 - unclosed attributes - new tag starts, both quotes present", () => {
  equal(
    stripHtml('aaaaaaa<br class="zzzz" <br>bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "082.01",
  );
});

test("083 - unclosed attributes - cut off at the end of attribute's name", () => {
  equal(
    stripHtml("aaaaaaa<br class<br>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "083.01",
  );
});

test("084 - unclosed attributes - cut off with a rogue exclamation mark", () => {
  equal(
    stripHtml("aaaaaaa<br class!<br>bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "084.01",
  );
});

test("085 - duplicated consecutive attribute values - inner whitespace", () => {
  equal(
    stripHtml('aa< br class1="b1" yo1   =   class2 = "b2" yo2 yo3>cc').result,
    "aa cc",
    "085.01",
  );
});

test("086 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa< br a b >cc").result, "aa< br a b >cc", "086.01");
});

test("087 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa < br a b >cc").result, "aa < br a b >cc", "087.01");
});

test("088 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa< br a b > cc").result, "aa< br a b > cc", "088.01");
});

test("089 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa < br a b > cc").result, "aa < br a b > cc", "089.01");
});

test("090 - space after bracket, multiple attrs, no equals", () => {
  equal(stripHtml("aa  < br a b >  cc").result, "aa  < br a b >  cc", "090.01");
});

test("091 - various, #1", () => {
  equal(stripHtml('aa< br a b=" >cc').result, "aa cc", "091.01");
});

test("092 - various, #2", () => {
  equal(stripHtml('aa< br a b= " >cc').result, "aa cc", "092.01");
});

test("093 - various, #3", () => {
  equal(stripHtml('aa< br a b =" >cc').result, "aa cc", "093.01");
});

test("094 - various, #4", () => {
  equal(stripHtml('aa< br a b = " >cc').result, "aa cc", "094.01");
});

test("095 - various, #5", () => {
  // xhtml
  equal(stripHtml('aa< br a b=" />cc').result, "aa cc", "095.01");
});

test("096 - various, #6", () => {
  equal(stripHtml('aa< br a b= " />cc').result, "aa cc", "096.01");
});

test("097 - various, #7", () => {
  equal(stripHtml('aa< br a b =" />cc').result, "aa cc", "097.01");
});

test("098 - various, #8", () => {
  equal(stripHtml('aa< br a b = " />cc').result, "aa cc", "098.01");
});

test("099 - various, #9", () => {
  equal(stripHtml('aa< br a b=" / >cc').result, "aa cc", "099.01");
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
