import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.stripTogetherWithTheirContents - edge cases

test("01 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: true,
    }).result,
    "a c d",
    "01"
  );
});

test("02 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "a c d",
    "02"
  );
});

test("03 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "a c d",
    "03"
  );
});

test("04 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: undefined,
    }).result,
    "a c d",
    "04"
  );
});

test("05 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: "",
    }).result,
    "a c d",
    "05"
  );
});

test("06 - no mutations!", () => {
  let originalOpts = {
    stripTogetherWithTheirContents: "b",
  };
  // opts object's mutation would happen here:
  equal(stripHtml("a<b>c</b>d", originalOpts).result, "a d", "06.01");

  // now the actual check:
  equal(
    originalOpts,
    {
      stripTogetherWithTheirContents: "b",
    },
    "06.02"
  );
});

// strips tag pairs including content in-between
// -----------------------------------------------------------------------------

test("07 - tag pairs including content - healthy, typical style tag pair", () => {
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
    "07"
  );
});

test(`08 - tag pairs including content - mismatching quotes "text/css'`, () => {
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
    `08`
  );
});

test(`09 - tag pairs including content - mismatching quotes 'text/css"`, () => {
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
    "09"
  );
});

test("10 - tag pairs including content - via opts.stripTogetherWithTheirContents - tight inside", () => {
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "10"
  );
});

test("11 - tag pairs including content - via opts.stripTogetherWithTheirContents - copious inner whitespace", () => {
  equal(
    stripHtml("a<    b    >c<   /   b   >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "11 - whitespace within the tag"
  );
});

test("12 - tag pairs including content - via opts.stripTogetherWithTheirContents - closing slash wrong side", () => {
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "12"
  );
});

test("13 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "13 - two closing slashes"
  );
});

test("14 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    b    >c<   //    b   //    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "14 - multiple duplicated closing slashes"
  );
});

test("15 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "15 - multiple duplicated closing slashes"
  );
});

test("16 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "16 - no closing slashes"
  );
});

test("17 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a\n\nd",
    "17 - no closing slashes"
  );
});

test("18 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<b>c</b>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "a d g",
    "18"
  );
});

test("19 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<bro>c</bro>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "a c d g",
    "19 - sneaky similarity, bro starts with b"
  );
});

test("20 - tag pairs including content", () => {
  equal(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ).result,
    "Text and some more.",
    "20 - strips with attributes. Now resembling real life."
  );
});

test("21 - tag pairs including content", () => {
  equal(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      }
    ).result,
    "Text and some more.",
    "21 - lots of spaces within tags"
  );
});

test("22 - tag pairs including content", () => {
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: [],
    }).result,
    "a c d",
    "22 - override stripTogetherWithTheirContents to an empty array"
  );
});

test("23 - tag pairs including content", () => {
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "a c d",
    "23 - override stripTogetherWithTheirContents to an empty array"
  );
});

test("24 - tag pairs including content", () => {
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "a c d",
    "24 - override stripTogetherWithTheirContents to an empty array"
  );
});

test("25 - tag pairs including content", () => {
  equal(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b",
    }).result,
    "a d",
    "25 - opts.stripTogetherWithTheirContents is not array but string"
  );
});

test("26 - tag pairs including content", () => {
  equal(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b",
      }
    ).result,
    "a d",
    "26"
  );
});

test("27 - tag pairs including content", () => {
  equal(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a c",
    "27 - single custom range tag"
  );
});

test("28 - tag pairs including content", () => {
  throws(
    () => {
      stripHtml(
        'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
        {
          stripTogetherWithTheirContents: ["zzz", true, "b"],
        }
      );
    },
    /THROW_ID_05/,
    "28"
  );
});

test("29 - third, rogue <style> causes chopping off the remainder", () => {
  equal(stripHtml("a<style>b</style>c").result, "a c", "29.01");
  equal(stripHtml("a<style>b<style>c").result, "a b c", "29.02");
  equal(stripHtml("a</style>b</style>c").result, "a b c", "29.03");

  equal(stripHtml("a<style>b</style>c<div>z</div>").result, "a c z", "29.04");
  equal(stripHtml("a<style>b<style>c<div>z</div>").result, "a b c z", "29.05");
  equal(
    stripHtml("a</style>b</style>c<div>z</div>").result,
    "a b c z",
    "29.06"
  );

  equal(stripHtml("a<style>b</style>c<style>d").result, "a c d", "29.07");
  equal(stripHtml("a<style>b</style>c</style>d").result, "a c d", "29.08");
  equal(
    stripHtml("a<style>b</style>c<style>d<div>z</div>").result,
    "a c d z",
    "29.09"
  );
  equal(
    stripHtml("a<style>b</style>c</style>d<div>z</div>").result,
    "a c d z",
    "29.10"
  );

  equal(stripHtml("a<style>b<style>c<style>d").result, "a b c d", "29.11");
  equal(stripHtml("a<style>b<style>c</style>d").result, "a b d", "29.12");
  equal(
    stripHtml("a<style>b<style>c<style>d<div>z</div>").result,
    "a b c d z",
    "29.13"
  );
  equal(
    stripHtml("a<style>b<style>c</style>d<div>z</div>").result,
    "a b d z",
    "29.14"
  );

  equal(stripHtml("a</style>b</style>c<style>d").result, "a b c d", "29.15");
  equal(stripHtml("a</style>b</style>c</style>d").result, "a b c d", "29.16");
  equal(
    stripHtml("a</style>b</style>c<style>d<div>z</div>").result,
    "a b c d z",
    "29.17"
  );
  equal(
    stripHtml("a</style>b</style>c</style>d<div>z</div>").result,
    "a b c d z",
    "29.18"
  );
});

test.run();
