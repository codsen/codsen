import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// tag pairs vs content
// -----------------------------------------------------------------------------

test("01 - single tag pair - tight", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml("<a>zzz</a>");
  equal(result, "zzz", "01.01");
  equal(
    ranges,
    [
      [0, 3],
      [6, 10],
    ],
    "01.02"
  );
  equal(
    allTagLocations,
    [
      [0, 3],
      [6, 10],
    ],
    "01.03"
  );
  equal(
    filteredTagLocations,
    [
      [0, 3],
      [6, 10],
    ],
    "01.04"
  );
});

test("02 - single tag pair - outer whitespace", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(" <a>zzz</a> ");
  equal(result, "zzz", "02.01");
  equal(
    ranges,
    [
      [0, 4],
      [7, 12],
    ],
    "02.02"
  );
  equal(
    allTagLocations,
    [
      [1, 4],
      [7, 11],
    ],
    "02.03"
  );
  equal(
    filteredTagLocations,
    [
      [1, 4],
      [7, 11],
    ],
    "02.04"
  );
});

test("03 - single tag pair - inner and outer whitespace", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } =
    stripHtml(" <a> zzz </a> ");
  equal(result, "zzz", "03.01");
  equal(
    ranges,
    [
      [0, 5],
      [8, 14],
    ],
    "03.02"
  );
  equal(
    allTagLocations,
    [
      [1, 4],
      [9, 13],
    ],
    "03.03"
  );
  equal(
    filteredTagLocations,
    [
      [1, 4],
      [9, 13],
    ],
    "03.04"
  );
});

test("04 - single tag pair - text", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    `This is a title with some <code>code</code> in it`
  );
  equal(result, `This is a title with some code in it`, "04.01");
  equal(
    ranges,
    [
      [25, 32, " "],
      [36, 44, " "],
    ],
    "04.02"
  );
  equal(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "04.03"
  );
  equal(
    filteredTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "04.04"
  );
});

test("05 - single tag pair - text, pair tag", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    `This is a title with some <code>code</code> in it`,
    {
      stripTogetherWithTheirContents: ["code"],
    }
  );
  equal(result, `This is a title with some in it`, "05.01");
  equal(ranges, [[25, 44, " "]], "05.02");
  equal(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "05.03"
  );
  equal(filteredTagLocations, [[26, 43]], "05.04");
});

test("06 - single tag pair - astrisk", () => {
  let { result, ranges, allTagLocations, filteredTagLocations } = stripHtml(
    `This is a title with some <code>code</code> in it`,
    {
      stripTogetherWithTheirContents: ["*"],
    }
  );
  equal(result, `This is a title with some in it`, "06.01");
  equal(ranges, [[25, 44, " "]], "06.02");
  equal(
    allTagLocations,
    [
      [26, 32],
      [36, 43],
    ],
    "06.03"
  );
  equal(filteredTagLocations, [[26, 43]], "06.04");
});

test("07 - single tag pair - inner line break retained", () => {
  equal(stripHtml(" <a> zz\nz </a> ").result, "zz\nz", "07.01");
});

test("08 - multiple tag pairs - adds spaces - #1", () => {
  equal(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu")
      .result,
    "rrr zzz something\nelse zzz yyy uuu",
    "08.01"
  );
});

test("09 - multiple tag pairs - adds spaces - #2", () => {
  equal(stripHtml("aaaaaaa<div>bbbbbbbb").result, "aaaaaaa bbbbbbbb", "09.01");
  equal(stripHtml("aaaaaaa<a>bbbbbbbb").result, "aaaaaaabbbbbbbb", "09.02");
});

test("10 - multiple tag pairs - adds spaces - #2", () => {
  equal(stripHtml("<a>bbbbbbbb").result, "bbbbbbbb", "10.01");
});

test("11 - multiple tag pairs - adds spaces - #2", () => {
  equal(stripHtml("aaaaaaa<a>").result, "aaaaaaa", "11.01");
});

test("12 - deletion while being on sensitive mode - recognised tag name, pair", () => {
  equal(stripHtml("< div >x</div>").result, "x", "12.01");
});

test("13 - deletion while being on sensitive mode - recognised tag name, singleton", () => {
  equal(stripHtml("aaaaaaa< br >bbbbbbbb").result, "aaaaaaa bbbbbbbb", "13.01");
});

test("14 - deletion while being on sensitive mode - recognised tag name, pair, tight outer content", () => {
  equal(stripHtml("aaaaaaa< div >x</div>").result, "aaaaaaa x", "14.01");
});

test("15 - deletion while being on sensitive mode - recognised tag name, pair, spaced outer content", () => {
  equal(stripHtml("aaaaaaa < div >x</div>").result, "aaaaaaa x", "15.01");
});

test("16 - deletion while being on sensitive mode - recognised tag name, pair, trailing whitespace", () => {
  equal(stripHtml("aaaaaaa< div >x</div> ").result, "aaaaaaa x", "16.01");
});

test("17 - tags with attributes - tight inside tag", () => {
  equal(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb').result,
    "aaaaaaa x bbbbbbbb",
    "17.01"
  );
});

test("18 - tags with attributes - rogue spaces inside tag", () => {
  equal(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb').result,
    "aaaaaaa bbbbbbbb",
    "18.01"
  );
});

test("19 - tags with attributes - rogue spaces inside tag, pair", () => {
  equal(
    stripHtml('aaaaaaa< div class="zzzz">x</div>').result,
    "aaaaaaa x",
    "19.01"
  );
});

test("20 - tags with attributes", () => {
  equal(
    stripHtml('aaaaaaa < div class="zzzz">x</div>').result,
    "aaaaaaa x",
    "20.01"
  );
});

test("21 - tags with attributes", () => {
  equal(
    stripHtml('aaaaaaa< div class="zzzz">x</div>').result,
    "aaaaaaa x",
    "21.01"
  );
});

test("22 - tags with attributes", () => {
  equal(stripHtml('< div class="zzzz">x</div>').result, "x", "22.01");
});

test("23 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb").result,
    "aaaa something bbbbb",
    "23.01"
  );
});

test("24 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb").result,
    "aaaa something bbbbb",
    "24.01"
  );
});

test("25 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb").result,
    "aaaa something bbbbb",
    "25.01"
  );
});

test("26 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "26.01"
  );
});

test("27 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "27.01"
  );
});

test("28 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "28.01"
  );
});

test("29 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb").result,
    "aaaa something bbbbb",
    "29.01"
  );
});

test("30 - multiple brackets repeated", () => {
  equal(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb")
      .result,
    "aaaa something bbbbb",
    "30.01"
  );
});

test("31 - checking can script slip through in any way", () => {
  equal(
    stripHtml("x<div>y</div>z", {
      stripTogetherWithTheirContents: ["div"],
    }).result,
    "x z",
    "31.01"
  );
  equal(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"],
    }).result,
    "xz",
    "31.02"
  );
});

test("32 - checking can script slip through in any way", () => {
  equal(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ).result,
    "some text more text",
    "32.01"
  );
});

test("33 - checking can script slip through in any way", () => {
  equal(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ).result,
    "some text more text",
    "33.01"
  );
});

test("34 - checking can script slip through in any way", () => {
  equal(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text'
    ).result,
    "some text more text",
    "34.01"
  );
});

test.run();
