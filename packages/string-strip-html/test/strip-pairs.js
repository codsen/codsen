import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.stripTogetherWithTheirContents - edge cases

test("01 - wrong opts.stripTogetherWithTheirContents value", () => {
  // block-level tag
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: true,
    }).result,
    "a c d",
    "01.01"
  );
  // inline tag
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: true,
    }).result,
    "acd",
    "01.02"
  );
});

test("02 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "a c d",
    "02.01"
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "acd",
    "02.02"
  );
});

test("03 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "a c d",
    "03.01"
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "acd",
    "03.02"
  );
});

test("04 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: undefined,
    }).result,
    "a c d",
    "04.01"
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: undefined,
    }).result,
    "acd",
    "04.02"
  );
});

test("05 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: "",
    }).result,
    "a c d",
    "05.01"
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: "",
    }).result,
    "acd",
    "05.02"
  );
});

test("06 - no mutations! - inline tag", () => {
  let originalOpts = {
    stripTogetherWithTheirContents: "b",
  };
  // opts object's mutation would happen here:
  equal(stripHtml("a<b>c</b>d", originalOpts).result, "ad", "06.01");

  // now the actual check:
  equal(
    originalOpts,
    {
      stripTogetherWithTheirContents: "b",
    },
    "06.02"
  );
});

test("07 - no mutations! - block-level tag", () => {
  let originalOpts = {
    stripTogetherWithTheirContents: "div",
  };
  // opts object's mutation would happen here:
  equal(stripHtml("a<div>c</div>d", originalOpts).result, "a d", "07.01");

  // now the actual check:
  equal(
    originalOpts,
    {
      stripTogetherWithTheirContents: "div",
    },
    "07.02"
  );
});

// strips tag pairs including content in-between
// -----------------------------------------------------------------------------

test("08 - tag pairs including content - healthy, typical style tag pair", () => {
  equal(
    stripHtml(`<html><head>
<style type="text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`).result,
    "aaa",
    "08.01"
  );
});

test("09 - tag pairs including content - mismatching quotes \"text/css'", () => {
  // Ranged tags are sensitive to slash detection.
  // Slash detection works checking is slash not within quoted attribute values.
  // Messed up, unmatching attribute quotes can happen too.
  // Let's see what happens!
  equal(
    stripHtml(`<html><head>
<style type="text/css'>#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`).result,
    "aaa",
    "09.01"
  );
});

test("10 - tag pairs including content - mismatching quotes 'text/css\"", () => {
  equal(
    stripHtml(`<html><head>
<style type='text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`).result,
    "aaa",
    "10.01"
  );
});

test("11 - tag pairs including content - via opts.stripTogetherWithTheirContents - tight inside", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "11.01"
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "11.02"
  );
});

test("12 - tag pairs including content - via opts.stripTogetherWithTheirContents - copious inner whitespace", () => {
  equal(
    stripHtml("a<    div    >c<   /   div   >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "12.01"
  );
  equal(
    stripHtml("a<    b    >c<   /   b   >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "12.02"
  );
});

test("13 - tag pairs including content - via opts.stripTogetherWithTheirContents - closing slash wrong side", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "13.01"
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "13.02"
  );
});

test("14 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   /    div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "14.01"
  );
  equal(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "14.02"
  );
  equal(
    stripHtml("a <    b    >c<   /    b   /    > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "14.03"
  );
});

test("15 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   //    div   //    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "15.01"
  );
  equal(
    stripHtml("a<    b    >c<   //    b   //    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "15.02"
  );
  equal(
    stripHtml("a <    b    >c<   //    b   //    > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "15.03"
  );
});

test("16 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   //  <  div   // >   >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "16.01"
  );
  equal(
    stripHtml("a <    div    >c<   //  <  div   // >   > d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "16.02"
  );
  equal(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "16.03"
  );
  equal(
    stripHtml("a <    b    >c<   //  <  b   // >   > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "16.04"
  );
});

test("17 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   /    div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "17.01"
  );
  equal(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "17.02"
  );
});

test("18 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >     c \n\n\n        <   /    div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a\n\nd",
    "18.01"
  );
  equal(
    stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a\n\nd",
    "18.02"
  );
  equal(
    stripHtml("a <    b    >     c \n\n\n        <   /    b   /    > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a\n\nd",
    "18.03"
  );
});

test("19 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<div>c</div>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["div", "e"],
    }).result,
    "a d g",
    "19.01"
  );
  equal(
    stripHtml("a<b>c</b>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "ad g",
    "19.02"
  );
  equal(
    stripHtml("a <b>c</b> d <e>f</e> g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "a d g",
    "19.03"
  );
});

test("20 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<bro>c</bro>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "a c d g",
    "20.01"
  );
});

test("21 - tag pairs including content", () => {
  equal(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ).result,
    "Text and some more.",
    "21.01"
  );
});

test("22 - tag pairs including content", () => {
  equal(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ).result,
    "Text and some more.",
    "22.01"
  );
});

test("23 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: [],
    }).result,
    "a c d",
    "23.01"
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: [],
    }).result,
    "acd",
    "23.02"
  );
});

test("24 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "a c d",
    "24.01"
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "acd",
    "24.02"
  );
});

test("25 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "a c d",
    "25.01"
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "acd",
    "25.02"
  );
});

test("26 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<   //  <  div   // >   >d", {
      stripTogetherWithTheirContents: "div",
    }).result,
    "a d",
    "26.01"
  );
  equal(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b",
    }).result,
    "a d", // ! still a space as a precaution
    "26.02"
  );
});

test("27 - tag pairs including content", () => {
  equal(
    stripHtml(
      'a<    div style="display:block; color: #333">>c<   //  <  div   // >   >d',
      {
        stripTogetherWithTheirContents: "div",
      }
    ).result,
    "a d",
    "27.01"
  );
  equal(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b",
      }
    ).result,
    "a d", // ! still a space as a precaution
    "27.02"
  );
});

test("28 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a c",
    "28.01"
  );
  equal(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ac",
    "28.02"
  );
});

test("29 - tag pairs including content", () => {
  throws(
    () => {
      stripHtml(
        'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
        {
          stripTogetherWithTheirContents: ["zzz", true, "b"],
        }
      );
    },
    /THROW_ID_08/,
    "29.01"
  );
});

test("30 - third, rogue <style> causes chopping off the remainder", () => {
  equal(stripHtml("a<style>b</style>c").result, "a c", "30.01");
  equal(stripHtml("a<style>b<style>c").result, "a b c", "30.02");
  equal(stripHtml("a</style>b</style>c").result, "a b c", "30.03");

  equal(stripHtml("a<style>b</style>c<div>z</div>").result, "a c z", "30.04");
  equal(stripHtml("a<style>b<style>c<div>z</div>").result, "a b c z", "30.05");
  equal(
    stripHtml("a</style>b</style>c<div>z</div>").result,
    "a b c z",
    "30.06"
  );

  equal(stripHtml("a<style>b</style>c<style>d").result, "a c d", "30.07");
  equal(stripHtml("a<style>b</style>c</style>d").result, "a c d", "30.08");
  equal(
    stripHtml("a<style>b</style>c<style>d<div>z</div>").result,
    "a c d z",
    "30.09"
  );
  equal(
    stripHtml("a<style>b</style>c</style>d<div>z</div>").result,
    "a c d z",
    "30.10"
  );

  equal(stripHtml("a<style>b<style>c<style>d").result, "a b c d", "30.11");
  equal(stripHtml("a<style>b<style>c</style>d").result, "a b d", "30.12");
  equal(
    stripHtml("a<style>b<style>c<style>d<div>z</div>").result,
    "a b c d z",
    "30.13"
  );
  equal(
    stripHtml("a<style>b<style>c</style>d<div>z</div>").result,
    "a b d z",
    "30.14"
  );

  equal(stripHtml("a</style>b</style>c<style>d").result, "a b c d", "30.15");
  equal(stripHtml("a</style>b</style>c</style>d").result, "a b c d", "30.16");
  equal(
    stripHtml("a</style>b</style>c<style>d<div>z</div>").result,
    "a b c d z",
    "30.17"
  );
  equal(
    stripHtml("a</style>b</style>c</style>d<div>z</div>").result,
    "a b c d z",
    "30.18"
  );
});

test.run();
