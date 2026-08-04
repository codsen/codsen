// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.stripTogetherWithTheirContents - edge cases

test("001 - wrong opts.stripTogetherWithTheirContents value", () => {
  // block-level tag
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: true,
    }).result,
    "a c d",
    "001.01",
  );
  // inline tag
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: true,
    }).result,
    "acd",
    "001.02",
  );
});

test("002 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "a c d",
    "002.01",
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "acd",
    "002.02",
  );
});

test("003 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "a c d",
    "003.01",
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "acd",
    "003.02",
  );
});

test("004 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: undefined,
    }).result,
    "a c d",
    "004.01",
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: undefined,
    }).result,
    "acd",
    "004.02",
  );
});

test("005 - wrong opts.stripTogetherWithTheirContents value", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: "",
    }).result,
    "a c d",
    "005.01",
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: "",
    }).result,
    "acd",
    "005.02",
  );
});

test("006 - no mutations! - inline tag", () => {
  let originalOpts = {
    stripTogetherWithTheirContents: "b",
  };
  // opts object's mutation would happen here:
  equal(stripHtml("a<b>c</b>d", originalOpts).result, "ad", "006.01");

  // now the actual check:
  equal(
    originalOpts,
    {
      stripTogetherWithTheirContents: "b",
    },
    "006.02",
  );
});

test("007 - no mutations! - block-level tag", () => {
  let originalOpts = {
    stripTogetherWithTheirContents: "div",
  };
  // opts object's mutation would happen here:
  equal(stripHtml("a<div>c</div>d", originalOpts).result, "a d", "007.01");

  // now the actual check:
  equal(
    originalOpts,
    {
      stripTogetherWithTheirContents: "div",
    },
    "007.02",
  );
});

// strips tag pairs including content in-between
// -----------------------------------------------------------------------------

test("008 - tag pairs including content - healthy, typical style tag pair", () => {
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
    "008.01",
  );
});

test("009 - tag pairs including content - mismatching quotes \"text/css'", () => {
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
    "009.01",
  );
});

test("010 - tag pairs including content - mismatching quotes 'text/css\"", () => {
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
    "010.01",
  );
});

test("011 - tag pairs including content - via opts.stripTogetherWithTheirContents - tight inside", () => {
  equal(
    stripHtml("a<div>c</div>d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "011.01",
  );
  equal(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "011.02",
  );
});

test("012 - tag pairs including content - via opts.stripTogetherWithTheirContents - copious inner whitespace", () => {
  equal(
    stripHtml("a<    div    >c<   /   div   >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "012.01",
  );
  equal(
    stripHtml("a<    b    >c<   /   b   >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "012.02",
  );
});

test("013 - tag pairs including content - via opts.stripTogetherWithTheirContents - closing slash wrong side", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "013.01",
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "013.02",
  );
});

test("014 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   /    div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "014.01",
  );
  equal(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "014.02",
  );
  equal(
    stripHtml("a <    b    >c<   /    b   /    > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "014.03",
  );
});

test("015 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   //    div   //    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "015.01",
  );
  equal(
    stripHtml("a<    b    >c<   //    b   //    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "015.02",
  );
  equal(
    stripHtml("a <    b    >c<   //    b   //    > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "015.03",
  );
});

test("016 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   //  <  div   // >   >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "016.01",
  );
  equal(
    stripHtml("a <    div    >c<   //  <  div   // >   > d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "016.02",
  );
  equal(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "016.03",
  );
  equal(
    stripHtml("a <    b    >c<   //  <  b   // >   > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a d",
    "016.04",
  );
});

test("017 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >c<   /    div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a d",
    "017.01",
  );
  equal(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ad",
    "017.02",
  );
});

test("018 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<    div    >     c \n\n\n        <   /    div   /    >d", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a\n\nd",
    "018.01",
  );
  equal(
    stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a\n\nd",
    "018.02",
  );
  equal(
    stripHtml("a <    b    >     c \n\n\n        <   /    b   /    > d", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "a\n\nd",
    "018.03",
  );
});

test("019 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<div>c</div>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["div", "e"],
    }).result,
    "a d g",
    "019.01",
  );
  equal(
    stripHtml("a<b>c</b>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "ad g",
    "019.02",
  );
  equal(
    stripHtml("a <b>c</b> d <e>f</e> g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "a d g",
    "019.03",
  );
});

test("020 - tag pairs including content - via opts.stripTogetherWithTheirContents", () => {
  equal(
    stripHtml("a<bro>c</bro>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"],
    }).result,
    "a c d g",
    "020.01",
  );
});

test("021 - tag pairs including content", () => {
  equal(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      },
    ).result,
    "Text and some more.",
    "021.01",
  );
});

test("022 - tag pairs including content", () => {
  equal(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"],
      },
    ).result,
    "Text and some more.",
    "022.01",
  );
});

test("023 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: [],
    }).result,
    "a c d",
    "023.01",
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: [],
    }).result,
    "acd",
    "023.02",
  );
});

test("024 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "a c d",
    "024.01",
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null,
    }).result,
    "acd",
    "024.02",
  );
});

test("025 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<     div   /    >d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "a c d",
    "025.01",
  );
  equal(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false,
    }).result,
    "acd",
    "025.02",
  );
});

test("026 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c<   //  <  div   // >   >d", {
      stripTogetherWithTheirContents: "div",
    }).result,
    "a d",
    "026.01",
  );
  equal(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b",
    }).result,
    "a d", // ! still a space as a precaution
    "026.02",
  );
});

test("027 - tag pairs including content", () => {
  equal(
    stripHtml(
      'a<    div style="display:block; color: #333">>c<   //  <  div   // >   >d',
      {
        stripTogetherWithTheirContents: "div",
      },
    ).result,
    "a d",
    "027.01",
  );
  equal(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b",
      },
    ).result,
    "a d", // ! still a space as a precaution
    "027.02",
  );
});

test("028 - tag pairs including content", () => {
  equal(
    stripHtml("a<    div    >c", {
      stripTogetherWithTheirContents: ["e", "div"],
    }).result,
    "a c",
    "028.01",
  );
  equal(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"],
    }).result,
    "ac",
    "028.02",
  );
});

test("029 - tag pairs including content", () => {
  throws(
    () => {
      stripHtml(
        'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
        {
          stripTogetherWithTheirContents: ["zzz", true, "b"],
        },
      );
    },
    /THROW_ID_09/,
    "29.01",
  );
});

test("030 - third, rogue <style> causes chopping off the remainder", () => {
  equal(stripHtml("a<style>b</style>c").result, "a c", "030.01");
  equal(stripHtml("a<style>b<style>c").result, "a b c", "030.02");
  equal(stripHtml("a</style>b</style>c").result, "a b c", "030.03");

  equal(stripHtml("a<style>b</style>c<div>z</div>").result, "a c z", "030.04");
  equal(stripHtml("a<style>b<style>c<div>z</div>").result, "a b c z", "030.05");
  equal(
    stripHtml("a</style>b</style>c<div>z</div>").result,
    "a b c z",
    "030.06",
  );

  equal(stripHtml("a<style>b</style>c<style>d").result, "a c d", "030.07");
  equal(stripHtml("a<style>b</style>c</style>d").result, "a c d", "030.08");
  equal(
    stripHtml("a<style>b</style>c<style>d<div>z</div>").result,
    "a c d z",
    "030.09",
  );
  equal(
    stripHtml("a<style>b</style>c</style>d<div>z</div>").result,
    "a c d z",
    "030.10",
  );

  equal(stripHtml("a<style>b<style>c<style>d").result, "a b c d", "030.11");
  equal(stripHtml("a<style>b<style>c</style>d").result, "a b d", "030.12");
  equal(
    stripHtml("a<style>b<style>c<style>d<div>z</div>").result,
    "a b c d z",
    "030.13",
  );
  equal(
    stripHtml("a<style>b<style>c</style>d<div>z</div>").result,
    "a b d z",
    "030.14",
  );

  equal(stripHtml("a</style>b</style>c<style>d").result, "a b c d", "030.15");
  equal(stripHtml("a</style>b</style>c</style>d").result, "a b c d", "030.16");
  equal(
    stripHtml("a</style>b</style>c<style>d<div>z</div>").result,
    "a b c d z",
    "030.17",
  );
  equal(
    stripHtml("a</style>b</style>c</style>d<div>z</div>").result,
    "a b c d z",
    "030.18",
  );
});

test.run();
