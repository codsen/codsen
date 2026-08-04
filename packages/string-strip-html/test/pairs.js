// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// tag pairs vs content
// -----------------------------------------------------------------------------

test("001 - single tag pair - tight", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml("<a>zzz</a>");
  equal(result, "zzz", "001.01");
  equal(
    ranges,
    [
      [0, 3],
      [6, 10],
    ],
    "001.02",
  );
  equal(
    allTagLocations,
    [
      [0, 3],
      [6, 10],
    ],
    "001.03",
  );
  equal(
    filteredTagLocations,
    [
      [0, 3],
      [6, 10],
    ],
    "001.04",
  );
});

test("002 - single tag pair - outer whitespace", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(" <a>zzz</a> ");
  equal(result, "zzz", "002.01");
  equal(
    ranges,
    [
      [0, 4],
      [7, 12],
    ],
    "002.02",
  );
  equal(
    allTagLocations,
    [
      [1, 4],
      [7, 11],
    ],
    "002.03",
  );
  equal(
    filteredTagLocations,
    [
      [1, 4],
      [7, 11],
    ],
    "002.04",
  );
});

test("003 - single tag pair - inner and outer whitespace", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(" <a> zzz </a> ");
  equal(result, "zzz", "003.01");
  equal(
    ranges,
    [
      [0, 5],
      [8, 14],
    ],
    "003.02",
  );
  equal(
    allTagLocations,
    [
      [1, 4],
      [9, 13],
    ],
    "003.03",
  );
  equal(
    filteredTagLocations,
    [
      [1, 4],
      [9, 13],
    ],
    "003.04",
  );
});

test("004 - single tag pair - text", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    "This is a title with some <code>code</code> in it",
  );
  equal(result, "This is a title with some code in it", "004.01");
  equal(
    ranges,
    [
      [25, 32, " "],
      [36, 44, " "],
    ],
    "004.02",
  );
  equal(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "004.03",
  );
  equal(
    filteredTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "004.04",
  );
});

test("005 - single tag pair - text, pair tag", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    "This is a title with some <code>code</code> in it",
    {
      stripTogetherWithTheirContents: ["code"],
    },
  );
  equal(result, "This is a title with some in it", "005.01");
  equal(ranges, [[25, 44, " "]], "005.02");
  equal(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "005.03",
  );
  equal(filteredTagLocations, [[26, 43]], "005.04");
});

test("006 - single tag pair - astrisk", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    "This is a title with some <code>code</code> in it",
    {
      stripTogetherWithTheirContents: ["*"],
    },
  );
  equal(result, "This is a title with some in it", "006.01");
  equal(ranges, [[25, 44, " "]], "006.02");
  equal(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "006.03",
  );
  equal(filteredTagLocations, [[26, 43]], "006.04");
});

test("007 - single tag pair - inner line break retained", () => {
  equal(stripHtml(" <a> zz\nz </a> ").result, "zz\nz", "007.01");
});

test("008 - multiple tag pairs - adds spaces - #1", () => {
  equal(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu")
      .result,
    "rrr zzz something\nelse zzz yyy uuu",
    "008.01",
  );
});

test("009 - multiple tag pairs - adds spaces - #2", () => {
  equal(stripHtml("aaaaaaa<div>bbbbbbbb").result, "aaaaaaa bbbbbbbb", "009.01");
  equal(stripHtml("aaaaaaa<a>bbbbbbbb").result, "aaaaaaabbbbbbbb", "009.02");
});

test("010 - multiple tag pairs - adds spaces - #2", () => {
  equal(stripHtml("<a>bbbbbbbb").result, "bbbbbbbb", "010.01");
});

test("011 - multiple tag pairs - adds spaces - #2", () => {
  equal(stripHtml("aaaaaaa<a>").result, "aaaaaaa", "011.01");
});

test("012 - deletion while being on sensitive mode - recognised tag name, pair", () => {
  equal(stripHtml("< div >x</div>").result, "x", "012.01");
});

test("013 - deletion while being on sensitive mode - recognised tag name, singleton", () => {
  equal(
    stripHtml("aaaaaaa< br >bbbbbbbb").result,
    "aaaaaaa bbbbbbbb",
    "013.01",
  );
});

test("014 - deletion while being on sensitive mode - recognised tag name, pair, tight outer content", () => {
  equal(stripHtml("aaaaaaa< div >x</div>").result, "aaaaaaa x", "014.01");
});

test("015 - deletion while being on sensitive mode - recognised tag name, pair, spaced outer content", () => {
  equal(stripHtml("aaaaaaa < div >x</div>").result, "aaaaaaa x", "015.01");
});

test("016 - deletion while being on sensitive mode - recognised tag name, pair, trailing whitespace", () => {
  equal(stripHtml("aaaaaaa< div >x</div> ").result, "aaaaaaa x", "016.01");
});

test("017 - tags with attributes - tight inside tag", () => {
  equal(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "017.01",
  );
});

test("018 - tags with attributes - rogue spaces inside tag", () => {
  equal(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "018.01",
  );
});

test("019 - tags with attributes - rogue spaces inside tag, pair", () => {
  equal(
    stripHtml('aaaaaaa< div class="zzzz">x</div>').result,
    "aaaaaaa x",
    "019.01",
  );
});

test("020 - tags with attributes", () => {
  equal(
    stripHtml('aaaaaaa < div class="zzzz">x</div>').result,
    "aaaaaaa x",
    "020.01",
  );
});

test("021 - tags with attributes", () => {
  equal(
    stripHtml('aaaaaaa< div class="zzzz">x</div>').result,
    "aaaaaaa x",
    "021.01",
  );
});

test("022 - tags with attributes", () => {
  equal(stripHtml('< div class="zzzz">x</div>').result, "x", "022.01");
});

test("023 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb").result,
    "aaaa something bbbbb",
    "023.01",
  );
});

test("024 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb").result,
    "aaaa something bbbbb",
    "024.01",
  );
});

test("025 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb").result,
    "aaaa something bbbbb",
    "025.01",
  );
});

test("026 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "026.01",
  );
});

test("027 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "027.01",
  );
});

test("028 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "028.01",
  );
});

test("029 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "029.01",
  );
});

test("030 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb")
      .result,
    "aaaa something bbbbb",
    "030.01",
  );
});

test("031 - checking can script slip through in any way", () => {
  equal(
    stripHtml("x<div>y</div>z", {
      stripTogetherWithTheirContents: ["div"],
    }).result,
    "x z",
    "031.01",
  );
  equal(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"],
    }).result,
    "xz",
    "031.02",
  );
});

test("032 - checking can script slip through in any way", () => {
  equal(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text',
    ).result,
    "some text more text",
    "032.01",
  );
});

test("033 - checking can script slip through in any way", () => {
  equal(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text',
    ).result,
    "some text more text",
    "033.01",
  );
});

test("034 - checking can script slip through in any way", () => {
  equal(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text',
    ).result,
    "some text more text",
    "034.01",
  );
});

test.run();
