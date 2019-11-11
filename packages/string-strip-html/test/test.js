// avanotonly

import test from "ava";
import stripHtml from "../dist/string-strip-html.esm";

// ==============================
// normal use cases
// ==============================

test("01.01 - string is whole (opening) tag - no ignore", t => {
  t.deepEqual(stripHtml("<a>"), "", "01.01");
});

test("01.02 - string is whole (opening) tag - ignore but wrong", t => {
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: ["b"]
    }),
    "",
    "01.02"
  );
});

test("01.03 - string is whole (opening) tag - ignore", t => {
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: ["a"]
    }),
    "<a>",
    "01.03"
  );
});

test("01.04 - string is whole (opening) tag - whitespace after opening bracket", t => {
  t.deepEqual(stripHtml("< a>"), "", "01.04");
});

test("01.05 - string is whole (opening) tag - whitespace before closing bracket", t => {
  t.deepEqual(stripHtml("<a >"), "", "01.05");
});

test("01.06 - string is whole (opening) tag - whitespace inside on both sides", t => {
  t.deepEqual(stripHtml("< a >"), "", "01.06");
});

test("01.07 - string is whole (opening) tag - copious whitespace inside on both sides", t => {
  t.deepEqual(stripHtml("<     a     >"), "", "01.07");
});

test("01.08 - string is whole (opening) tag - leading space is not retained", t => {
  t.deepEqual(stripHtml(" <a>"), "", "01.08");
});

test("01.09 - string is whole (opening) tag - trailing space is not retained", t => {
  t.deepEqual(stripHtml("< a> "), "", "01.09");
});

test("01.10 - string is whole (opening) tag - surrounding whitespace outside", t => {
  t.deepEqual(stripHtml("  <a >  "), "", "01.10");
});

test("01.11 - string is whole (opening) tag - raw tab in front", t => {
  t.deepEqual(stripHtml("\t< a >"), "", "01.11");
});

test("01.12 - string is whole (opening) tag - lots of different whitespace chars", t => {
  t.deepEqual(stripHtml("    \t   <     a     >      \n\n   "), "", "01.12");
});

test("01.13 - string is whole (opening) tag - whitespace between tags is deleted too", t => {
  t.deepEqual(stripHtml("<a>         <a>"), "", "01.13");
});

test("01.14 - string is whole (opening) tag - whitespace between tag and text is removed", t => {
  t.deepEqual(stripHtml("<a>         z"), "z", "01.14");
});

test("01.15 - string is whole (opening) tag - leading/trailing spaces", t => {
  t.deepEqual(stripHtml("   <b>text</b>   "), "text", "01.15");
});

test("01.16 - string is whole (opening) tag - but leading/trailing line breaks are deleted", t => {
  t.deepEqual(stripHtml("\n\n\n<b>text</b>\r\r\r"), "text", "01.16");
});

test("01.17 - string is whole (opening) tag - HTML tag with attributes", t => {
  t.deepEqual(
    stripHtml(
      'z<a href="https://codsen.com" target="_blank">z<a href="xxx" target="_blank">z'
    ),
    "z z z",
    "01.17"
  );
});

test("01.18 - string is whole (opening) tag - custom tag names, healthy", t => {
  t.deepEqual(stripHtml("<custom>"), "", "01.18");
});

test("01.19 - string is whole (opening) tag - custom tag names, missing closing bracket", t => {
  t.deepEqual(stripHtml("<custom"), "", "01.19");
});

test("01.20 - string is whole (opening) tag - custom tag names, dash in the name", t => {
  t.deepEqual(stripHtml("<custom-tag>"), "", "01.20");
});

test("01.21 - string is whole (opening) tag - dash is name's first character", t => {
  t.deepEqual(stripHtml("<-tag>"), "", "01.21");
});

test("01.22 - string is whole (opening) tag - multiple custom", t => {
  t.deepEqual(stripHtml("<custom><custom><custom>"), "", "01.01.22");
});

test("01.23 - string is whole (opening) tag - multiple custom with dashes", t => {
  t.deepEqual(stripHtml("<custom-tag><custom-tag><custom-tag>"), "", "01.23");
});

test("01.24 - string is whole (opening) tag - multiple custom with names starting with dashes", t => {
  t.deepEqual(stripHtml("<-tag><-tag><-tag>"), "", "01.24");
});

test("01.25 - string is whole (opening) tag - multiple custom with surroundings", t => {
  t.deepEqual(stripHtml("a<custom><custom><custom>b"), "a b", "01.25");
});

test("01.26 - string is whole (opening) tag - multiple custom with surroundings with dashes", t => {
  t.deepEqual(
    stripHtml("a<custom-tag><custom-tag><custom-tag>b"),
    "a b",
    "01.26"
  );
});

test("01.27 - string is whole (opening) tag - multiple custom with surroundings starting with dashes", t => {
  t.deepEqual(stripHtml("a<-tag><-tag><-tag>b"), "a b", "01.27");
});

test("01.28 - string is whole (opening) tag - self-closing - multiple with surroundings, inner whitespace", t => {
  t.deepEqual(stripHtml("a</custom>< /custom><custom/>b"), "a b", "01.28");
});

test("01.29 - string is whole (opening) tag - self-closing - multiple", t => {
  t.deepEqual(
    stripHtml("a<custom-tag /></ custom-tag>< /custom-tag>b"),
    "a b",
    "01.29"
  );
});

test("01.30 - string is whole (opening) tag - self-closing - multiple names start with dash", t => {
  t.deepEqual(stripHtml("a</ -tag>< /-tag><-tag / >   b"), "a b", "01.30");
});

test("01.31 - string is whole (opening) tag - custom, outer whitespace", t => {
  t.deepEqual(stripHtml("a  </custom>< /custom><custom/>   b"), "a b", "01.31");
});

test("01.32 - string is whole (opening) tag - custom, line breaks", t => {
  t.deepEqual(
    stripHtml("a\n<custom-tag /></ custom-tag>\n< /custom-tag>\n\nb"),
    "a\n\nb",
    "01.32"
  );
});

test("01.33 - string is whole (opening) tag - custom, outer tabs", t => {
  t.deepEqual(
    stripHtml("a\t\t</ -tag>< /-tag><-tag / >   \t b"),
    "a b",
    "01.33"
  );
});

test("01.34 - string is whole (closing) tag - self-closing - single", t => {
  t.deepEqual(stripHtml("</a>"), "", "01.34");
});

test("01.35 - string is whole (closing) tag - self-closing - whitespace before slash", t => {
  t.deepEqual(stripHtml("< /a>"), "", "01.35");
});

test("01.36 - string is whole (closing) tag - self-closing - whitespace after slash", t => {
  t.deepEqual(stripHtml("</ a>"), "", "01.36");
});

test("01.37 - string is whole (closing) tag - self-closing - whitespace after name", t => {
  t.deepEqual(stripHtml("</a >"), "", "01.37");
});

test("01.38 - string is whole (closing) tag - self-closing - surrounding whitespace", t => {
  t.deepEqual(stripHtml("< /a >"), "", "01.38");
});

test("01.39 - string is whole (closing) tag - self-closing - surrounding whitespace #2", t => {
  t.deepEqual(stripHtml("</ a >"), "", "01.39");
});

test("01.40 - string is whole (closing) tag - self-closing - whitespace everywhere", t => {
  t.deepEqual(stripHtml("< / a >"), "", "01.40");
});

test("01.41 - string is whole (closing) tag - self-closing - copious whitespace everywhere", t => {
  t.deepEqual(stripHtml("<  /   a     >"), "", "01.41");
});

test("01.42 - string is whole (closing) tag - self-closing - leading outside whitespace", t => {
  t.deepEqual(stripHtml(" </a>"), "", "01.42");
});

test("01.43 - string is whole (closing) tag - self-closing - trailing outside whitespace", t => {
  t.deepEqual(stripHtml("< /a> "), "", "01.43");
});

test("01.44 - string is whole (closing) tag - self-closing - outside whitespace on both sides", t => {
  t.deepEqual(stripHtml("  </a >  "), "", "01.44");
});

test("01.45 - string is whole (closing) tag - self-closing - copious outside whitespace on both sides", t => {
  t.deepEqual(stripHtml("\t< /a >"), "", "01.45");
});

test("01.46 - string is whole (closing) tag - self-closing - even more copious outside whitespace on both sides", t => {
  t.deepEqual(stripHtml("    \t   <   /  a     >      \n\n   "), "", "01.46");
});

// 02. tag pairs vs content
// -----------------------------------------------------------------------------

test("02.01 - single tag pair - tight", t => {
  t.deepEqual(stripHtml("<a>zzz</a>"), "zzz", "02.01");
});

test("02.02 - single tag pair - outer whitespace", t => {
  t.deepEqual(stripHtml(" <a>zzz</a> "), "zzz", "02.02");
});

test("02.03 - single tag pair - inner and outer whitespace", t => {
  t.deepEqual(stripHtml(" <a> zzz </a> "), "zzz", "02.03");
});

test("02.04 - single tag pair - inner line break retained", t => {
  t.deepEqual(stripHtml(" <a> zz\nz </a> "), "zz\nz", "02.04");
});

test("02.05 - multiple tag pairs - adds spaces - #1", t => {
  t.deepEqual(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu"),
    "rrr zzz something\nelse zzz yyy uuu",
    "02.05"
  );
});

test("02.06 - multiple tag pairs - adds spaces - #2", t => {
  t.deepEqual(stripHtml("aaaaaaa<a>bbbbbbbb"), "aaaaaaa bbbbbbbb", "02.06");
});

test("02.07 - multiple tag pairs - adds spaces - #2", t => {
  t.deepEqual(stripHtml("<a>bbbbbbbb"), "bbbbbbbb", "02.07");
});

test("02.08 - multiple tag pairs - adds spaces - #2", t => {
  t.deepEqual(stripHtml("aaaaaaa<a>"), "aaaaaaa", "02.08");
});

test("02.09 - deletion while being on sensitive mode - recognised tag name, pair", t => {
  t.deepEqual(stripHtml("< div >x</div>"), "x", "02.09");
});

test("02.10 - deletion while being on sensitive mode - recognised tag name, singleton", t => {
  t.deepEqual(stripHtml("aaaaaaa< br >bbbbbbbb"), "aaaaaaa bbbbbbbb", "02.10");
});

test("02.11 - deletion while being on sensitive mode - recognised tag name, pair, tight outer content", t => {
  t.deepEqual(stripHtml("aaaaaaa< div >x</div>"), "aaaaaaa x", "02.11");
});

test("02.12 - deletion while being on sensitive mode - recognised tag name, pair, spaced outer content", t => {
  t.deepEqual(stripHtml("aaaaaaa < div >x</div>"), "aaaaaaa x", "02.12");
});

test("02.13 - deletion while being on sensitive mode - recognised tag name, pair, trailing whitespace", t => {
  t.deepEqual(stripHtml("aaaaaaa< div >x</div> "), "aaaaaaa x", "02.13");
});

test("02.14 - tags with attributes - tight inside tag", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "02.14"
  );
});

test("02.15 - tags with attributes - rogue spaces inside tag", t => {
  t.deepEqual(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "02.15"
  );
});

test("02.16 - tags with attributes - rogue spaces inside tag, pair", t => {
  t.deepEqual(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    "aaaaaaa x",
    "02.16"
  );
});

test("02.17 - tags with attributes", t => {
  t.deepEqual(
    stripHtml('aaaaaaa < div class="zzzz">x</div>'),
    "aaaaaaa x",
    "02.17"
  );
});

test("02.18 - tags with attributes", t => {
  t.deepEqual(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    "aaaaaaa x",
    "02.18"
  );
});

test("02.19 - tags with attributes", t => {
  t.deepEqual(stripHtml('< div class="zzzz">x</div>'), "x", "02.19");
});

test("02.20 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb"),
    "aaaa something bbbbb",
    "02.20"
  );
});

test("02.21 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb"),
    "aaaa something bbbbb",
    "02.21"
  );
});

test("02.22 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "02.22"
  );
});

test("02.23 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "02.23"
  );
});

test("02.24 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "02.24"
  );
});

test("02.25 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "02.25"
  );
});

test("02.26 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "02.26"
  );
});

test("02.27 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "02.27"
  );
});

test("02.28 - checking can script slip through in any way", t => {
  t.deepEqual(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"]
    }),
    "x z",
    "02.28"
  );
});

test("02.29 - checking can script slip through in any way", t => {
  t.deepEqual(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "02.29"
  );
});

test("02.30 - checking can script slip through in any way", t => {
  t.deepEqual(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "02.30"
  );
});

test("02.31 - checking can script slip through in any way", t => {
  t.deepEqual(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text'
    ),
    "some text more text",
    "02.31 - sneaky HTML character-encoded brackets"
  );
});

// 03. strips tag pairs including content in-between
// -----------------------------------------------------------------------------

test("03.01 - tag pairs including content - healthy, typical style tag pair", t => {
  t.deepEqual(
    stripHtml(`<html><head>
<style type="text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
    "aaa",
    "03.01"
  );
});

test(`03.02 - tag pairs including content - mismatching quotes "text/css'`, t => {
  // Ranged tags are sensitive to slash detection.
  // Slash detection works checking is slash not within quoted attribute values.
  // Messed up, unmatching attribute quotes can happen too.
  // Let's see what happens!
  t.deepEqual(
    stripHtml(`<html><head>
<style type="text/css'>#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
    "aaa",
    `03.02`
  );
});

test(`03.03 - tag pairs including content - mismatching quotes 'text/css"`, t => {
  t.deepEqual(
    stripHtml(`<html><head>
<style type='text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
    "aaa",
    "03.03"
  );
});

test("03.04 - tag pairs including content - via opts.stripTogetherWithTheirContents - tight inside", t => {
  t.deepEqual(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "03.04"
  );
});

test("03.05 - tag pairs including content - via opts.stripTogetherWithTheirContents - copious inner whitespace", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<   /   b   >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "03.05 - whitespace within the tag"
  );
});

test("03.06 - tag pairs including content - via opts.stripTogetherWithTheirContents - closing slash wrong side", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "03.06"
  );
});

test("03.07 - tag pairs including content - via opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "03.07 - two closing slashes"
  );
});

test("03.08 - tag pairs including content - via opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<   //    b   //    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "03.08 - multiple duplicated closing slashes"
  );
});

test("03.09 - tag pairs including content - via opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "03.09 - multiple duplicated closing slashes"
  );
});

test("03.10 - tag pairs including content - via opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "03.10 - no closing slashes"
  );
});

test("03.11 - tag pairs including content - via opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a\n\nd",
    "03.11 - no closing slashes"
  );
});

test("03.12 - tag pairs including content - via opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<b>c</b>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"]
    }),
    "a d g",
    "03.12"
  );
});

test("03.13 - tag pairs including content - via opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<bro>c</bro>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"]
    }),
    "a c d g",
    "03.13 - sneaky similarity, bro starts with b"
  );
});

test("03.14 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"]
      }
    ),
    "Text and some more.",
    "03.14 - strips with attributes. Now resembling real life."
  );
});

test("03.15 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"]
      }
    ),
    "Text and some more.",
    "03.15 - lots of spaces within tags"
  );
});

test("03.16 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: []
    }),
    "a c d",
    "03.16 - override stripTogetherWithTheirContents to an empty array"
  );
});

test("03.17 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null
    }),
    "a c d",
    "03.17 - override stripTogetherWithTheirContents to an empty array"
  );
});

test("03.18 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false
    }),
    "a c d",
    "03.18 - override stripTogetherWithTheirContents to an empty array"
  );
});

test("03.19 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b"
    }),
    "a d",
    "03.19 - opts.stripTogetherWithTheirContents is not array but string"
  );
});

test("03.20 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b"
      }
    ),
    "a d",
    "03.20"
  );
});

test("03.21 - tag pairs including content - ", t => {
  t.deepEqual(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a c",
    "03.21 - single custom range tag"
  );
});

test("03.22 - tag pairs including content - ", t => {
  t.throws(() => {
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: ["zzz", true, "b"]
      }
    );
  });
});

// 04. whacky inputs
// -----------------------------------------------------------------------------

test("04.01 - whacky - sequence of empty <> - single", t => {
  t.deepEqual(stripHtml("<>"), "<>", "04.01");
});

test("04.02 - whacky - sequence of empty <> - tight outside EOL", t => {
  t.deepEqual(stripHtml("<><>"), "<><>", "04.02");
});

test("04.03 - whacky - sequence of empty <> - tight outside, content", t => {
  t.deepEqual(stripHtml("a<><>b"), "a<><>b", "04.03");
});

test("04.04 - whacky - sequence of empty <> - just trimmed", t => {
  t.deepEqual(stripHtml("\na<><>b\n"), "a<><>b", "04.04");
});

test("04.05 - whacky - brackets used for expressive purposes (very very suspicious but possible)", t => {
  t.deepEqual(
    stripHtml("text <<<<<<<<<<< text"),
    "text <<<<<<<<<<< text",
    "04.05"
  );
});

test("04.06 - brackets used for expressive purposes (very very suspicious but possible)", t => {
  t.deepEqual(
    stripHtml("text <<<<<<<<<<< text <<<<<<<<<<< text"),
    "text <<<<<<<<<<< text <<<<<<<<<<< text",
    "04.06"
  );
});

test("04.07 - brackets used for expressive purposes (very very suspicious but possible)", t => {
  t.deepEqual(
    stripHtml("<article> text <<<<<<<<<<< text </article>"),
    "text <<<<<<<<<<< text",
    "04.07"
  );
});

test("04.08 - brackets used for expressive purposes (very very suspicious but possible)", t => {
  // will not remove
  t.deepEqual(
    stripHtml("text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3"),
    "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3",
    "04.08"
  );
});

test("04.09 - brackets used for expressive purposes (very very suspicious but possible)", t => {
  t.deepEqual(
    stripHtml("<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>"),
    "text1 <<<<<<<<<<< text2 >>>>>>>>> text3",
    "04.09"
  );
});

// 05. multiple ranged tags
// -----------------------------------------------------------------------------

test("05.01 - multiple ranged tags - with text in between", t => {
  t.deepEqual(
    stripHtml(
      "code here and here <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more"
    ),
    "code here and here and also some here and finally here some more and also some here and finally here some more and also some here and finally here some more",
    "05.01"
  );
});

test("05.02 - multiple ranged tags - tags touching each other", t => {
  t.deepEqual(
    stripHtml(
      "code here and here <style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script> and finally here some more"
    ),
    "code here and here and finally here some more",
    "05.02"
  );
});

test("05.03 - multiple ranged tags - lots of dodgy slashes around and within tags", t => {
  t.deepEqual(
    stripHtml(
      "///</a>///<a/>///</ a>///< /a></ a>///< /a>///</ a />///</a/>///< / a / >///"
    ),
    "/// /// /// /// /// /// /// /// ///",
    "05.03"
  );
});

test("05.04 - multiple ranged tags - this time repeated slashes inside", t => {
  t.deepEqual(
    stripHtml(
      "///<///a>///<a/////>///<//// a>///< ///a><// a>///< ///a>///<// a //>///<///a///>///< //// a //// >///"
    ),
    "/// /// /// /// /// /// /// /// ///",
    "05.04"
  );
});

test("05.05 - multiple ranged tags - and the same but with bunch of line breaks and tabs", t => {
  // line breaks within tag doesn't count - the new line breaks should not be introduced!
  t.deepEqual(
    stripHtml(
      "///</\n/\n/\ta>///<a\n///\n//\t>///<\n////\t a>///< /\n//\na><// \ta>///<\n\n\n\n ///a>///<\t\t\t\t// \n\n\na //>///<\n\n\n///a\n///\n>///<\n //// \na\n //// \n>///"
    ),
    "/// /// /// /// /// /// /// /// ///",
    "05.05"
  );
});

test("05.06 - multiple ranged tags - lots of dodgy exclamation marks around and within tags", t => {
  t.deepEqual(
    stripHtml(
      "zzz<!a>zzz<a!>zzz<! a>zzz< !a><! a>zzz< !a>zzz<! a !>zzz<!a!>zzz< ! a ! >zzz"
    ),
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "05.06"
  );
});

test("05.07 - multiple ranged tags - this time repeated exclamation marks inside", t => {
  t.deepEqual(
    stripHtml(
      "zzz<!!!a>zzz<a!!!!!>zzz<!!!! a>zzz< !!!a><!! a>zzz< !!!a>zzz<!! a !!>zzz<!!!a!!!>zzz< !!!! a !!!! >zzz"
    ),
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "05.07"
  );
});

test("05.08 - multiple ranged tags - and the same but with bunch of line breaks and tabs", t => {
  t.deepEqual(
    stripHtml(
      "zzz<!\n!\n!\ta>zzz<a\n!!!\n!!\t>zzz<\n!!!!\t a>zzz< !\n!!\na><!! \ta>zzz<\n\n\n\n !!!a>zzz<\t\t\t\t!! \n\n\na !!>zzz<\n\n\n!!!a\n!!!\n>zzz<\n !!!! \na\n !!!! \n>zzz"
    ),
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "05.08"
  );
});

// 06. whitespace control
// -----------------------------------------------------------------------------

test("06.01 - whitespace control - line breaks between tags", t => {
  t.deepEqual(
    stripHtml("something <a> \n\n to <a> put here to test"),
    "something\n\nto put here to test",
    "06.01"
  );
});

test("06.02 - whitespace control - line breaks within tag", t => {
  t.deepEqual(
    stripHtml("something <a\n\n>  to <a> put here to test"),
    "something to put here to test",
    "06.02"
  );
});

test("06.03 - whitespace control - leading inner tag linebreaks", t => {
  t.deepEqual(
    stripHtml("something <\n\na>  to <a> put here to test"),
    "something to put here to test",
    "06.03"
  );
});

test("06.04 - whitespace control - multiple tags, inner trailing linebreaks", t => {
  t.deepEqual(
    stripHtml("something <a>  to <a\n\n> put here to test"),
    "something to put here to test",
    "06.04"
  );
});

test("06.05 - whitespace control - multiple tags, inner leading linebreaks", t => {
  t.deepEqual(
    stripHtml("something <a>  to <\n\na> put here to test"),
    "something to put here to test",
    "06.05"
  );
});

test("06.06 - whitespace control - tabs and linebreaks inside, multiple tags", t => {
  t.deepEqual(
    stripHtml("something <\t\na\n>  to <a\n\n> put here to test"),
    "something to put here to test",
    "06.06"
  );
});

test("06.07 - whitespace control - even this", t => {
  t.deepEqual(
    stripHtml("something <\n\na\t>\t\t\t\t\t  to \t<\n\na\t> put here to test"),
    "something to put here to test",
    "06.07"
  );
});

// 07. CDATA
// -----------------------------------------------------------------------------

test("07.01 - CDATA - tight", t => {
  // surroundings are not a linebreaks
  t.deepEqual(
    stripHtml(`a<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>b`),
    "a b",
    "07.01"
  );
});

test("07.02 - CDATA - normal", t => {
  t.deepEqual(
    stripHtml(`a <![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]> b`),
    "a b",
    "07.02"
  );
});

test("07.03 - CDATA - loose", t => {
  t.deepEqual(
    stripHtml(`a \t\t<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>       b`),
    "a b",
    "07.03"
  );
});

test("07.04 - CDATA - single linebreaks", t => {
  // surroundings are linebreaks
  t.deepEqual(
    stripHtml(`a\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\nb`),
    "a\n\nb",
    "07.04"
  );
});

test("07.05 - CDATA - excessive linebreaks", t => {
  t.deepEqual(
    stripHtml(`a\n\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\nb`),
    "a\n\nb",
    "07.05"
  );
});

test("07.06 - CDATA - mixed linebreaks", t => {
  t.deepEqual(
    stripHtml(`a\n \t\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\n\t b`),
    "a\n\nb",
    "07.06"
  );
});

// 08. punctuation
// -----------------------------------------------------------------------------

test("08.01 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(stripHtml("a<b>?</b> c"), "a? c", "08.01");
});

test("08.02 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(
    stripHtml("a<b>?</b> c", { trimOnlySpaces: true }),
    "a? c",
    "08.02"
  );
});

test("08.03 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(
    stripHtml("a<b>?</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a? c",
    "08.03"
  );
});

test("08.04 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(
    stripHtml("a<b>?</b> c", { stripTogetherWithTheirContents: false }),
    "a? c",
    "08.04"
  );
});

test("08.05 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(
    stripHtml("a<b>?</b> c", { ignoreTags: ["zzz"] }),
    "a? c",
    "08.05"
  );
});

test("08.06 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(
    stripHtml("a<b>?</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [5, 10, " "]
    ],
    "08.06"
  );
});

test("08.07 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(stripHtml("a<b>?</b> c", { ignoreTags: null }), "a? c", "08.07");
});

test("08.08 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(stripHtml("a<b>!</b> c"), "a! c", "08.08");
});

test("08.09 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(
    stripHtml("a<b>!</b> c", { trimOnlySpaces: true }),
    "a! c",
    "08.09"
  );
});

test("08.10 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(
    stripHtml(" \t a<b>!</b> c \t ", { trimOnlySpaces: true }),
    "\t a! c \t",
    "08.10"
  );
});

test("08.11 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(
    stripHtml("a<b>!</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a! c",
    "08.11"
  );
});

test("08.12 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(
    stripHtml("a<b>!</b> c", { stripTogetherWithTheirContents: false }),
    "a! c",
    "08.12"
  );
});

test("08.13 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(
    stripHtml("a<b>!</b> c", { ignoreTags: ["zzz"] }),
    "a! c",
    "08.13"
  );
});

test("08.14 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(
    stripHtml("a<b>!</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [5, 10, " "]
    ],
    "08.14"
  );
});

test("08.15 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(stripHtml("a<b>!</b>c"), "a! c", "08.15");
});

test("08.16 - punctuation after tag - simplified, ellipsis", t => {
  t.deepEqual(stripHtml("a<b>...</b> c"), "a... c", "08.16");
});

test("08.17 - punctuation after tag - simplified, ellipsis", t => {
  t.deepEqual(
    stripHtml("a<b>...</b> c", { trimOnlySpaces: true }),
    "a... c",
    "08.17"
  );
});

test("08.18 - punctuation after tag - simplified, ellipsis", t => {
  t.deepEqual(
    stripHtml("a<b>...</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a... c",
    "08.18"
  );
});

test("08.19 - punctuation after tag - simplified, ellipsis", t => {
  t.deepEqual(
    stripHtml("a<b>...</b> c", { stripTogetherWithTheirContents: false }),
    "a... c",
    "08.19"
  );
});

test("08.20 - punctuation after tag - simplified, ellipsis", t => {
  t.deepEqual(
    stripHtml("a<b>...</b> c", { ignoreTags: ["zzz"] }),
    "a... c",
    "08.20"
  );
});

test("08.21 - punctuation after tag - simplified, ellipsis", t => {
  t.deepEqual(
    stripHtml("a<b>...</b> c", { returnRangesOnly: true }),
    [
      [1, 4],
      [7, 12, " "]
    ],
    "08.21"
  );
});

test("08.22 - punctuation after tag - real-life", t => {
  // control
  t.deepEqual(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      '
    ),
    "Hi! Would you like to shop now?",
    "08.22"
  );
});

test("08.23 - punctuation after tag - real-life", t => {
  t.deepEqual(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
    ),
    "Hi! Please shop now!",
    "08.23"
  );
});

test("08.24 - punctuation after tag - real-life", t => {
  // opts.trimOnlySpaces
  t.deepEqual(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Would you like to shop now?      \u00A0",
    "08.24"
  );
});

test("08.25 - punctuation after tag - real-life", t => {
  t.deepEqual(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Please shop now!      \u00A0",
    "08.25"
  );
});

// 09. opts.ignoreTags
// -----------------------------------------------------------------------------

test("09.01 - opts.ignoreTags - empty string, whitespace string and null in the array", t => {
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: ["", " ", "a", "b", null]
    }),
    "<a>",
    "09.01"
  );
});

test("09.02 - opts.ignoreTags - null inside opts.ignoreTags array", t => {
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: [null]
    }),
    "",
    "09.02"
  );
});

test("09.03 - opts.ignoreTags - null among opts.ignoreTags values", t => {
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: [null, "a"]
    }),
    "<a>",
    "09.03"
  );
});

test("09.04 - opts.ignoreTags - whitespace-only blanks inside opts.ignoreTags", t => {
  t.deepEqual(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n"]
    }),
    "a",
    "09.04"
  );
});

test("09.05 - opts.ignoreTags - some whitespace-only inside opts.ignoreTags", t => {
  t.deepEqual(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n", "a", " "]
    }),
    "a<a>",
    "09.05"
  );
});

test("09.06 - opts.ignoreTags - space before and after attribute's equal character", t => {
  t.deepEqual(
    stripHtml("<article  whatnot  =  whatyes = >zzz< / article>"),
    "zzz",
    "09.06"
  );
});

test("09.07 - opts.ignoreTags - space before and after attribute's equal character", t => {
  t.deepEqual(
    stripHtml(
      "<article  whatnot  =  whatyes = >xxx< / article> yyy <article  whatnot  =  whatyes = >zzz< / article>"
    ),
    "xxx yyy zzz",
    "09.07"
  );
});

// 10. XML (sprinkled within HTML)
// -----------------------------------------------------------------------------

test("10.01 - strips XML - strips Outlook XML fix block, tight", t => {
  t.deepEqual(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    "abc def",
    "10.01"
  );
});

test("10.02 - strips XML - strips Outlook XML fix block, leading space", t => {
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    "abc def",
    "10.02"
  );
});

test("10.03 - strips XML - strips Outlook XML fix block, trailing space", t => {
  t.deepEqual(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
    "abc def",
    "10.03"
  );
});

test("10.04 - strips XML - strips Outlook XML fix block, spaces around", t => {
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
    "abc def",
    "10.04"
  );
});

test("10.05 - strips XML - generous trailing space", t => {
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`),
    "abc\n\ndef",
    "10.05"
  );
});

test("10.06 - strips XML - trailing linebreaks", t => {
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `),
    "abc",
    "10.06"
  );
});

test("10.07 - strips XML - leading content", t => {
  t.deepEqual(
    stripHtml(`abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `),
    "abc",
    "10.07"
  );
});

test("10.08 - strips XML - leading content", t => {
  t.deepEqual(
    stripHtml(`      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`),
    "abc",
    "10.08"
  );
});

// 11. false positives
// -----------------------------------------------------------------------------

test("11.01 - false positives - equations: very sneaky considering b is a legit tag name", t => {
  t.deepEqual(
    stripHtml("Equations are: a < b and c > d"),
    "Equations are: a < b and c > d",
    "11.01"
  );
});

test("11.02 - false positives - inwards-pointing arrows", t => {
  t.deepEqual(
    stripHtml("Look here: ---> a <---"),
    "Look here: ---> a <---",
    "11.02"
  );
});

test("11.03 - false positives - arrows mixed with tags", t => {
  t.deepEqual(
    stripHtml(
      "Look here: ---> a <--- and here: ---> b <--- oh, and few tags: <div><article>\nzz</article></div>"
    ),
    "Look here: ---> a <--- and here: ---> b <--- oh, and few tags:\nzz",
    "11.03"
  );
});

test("11.04 - false positives - opening bracket", t => {
  t.deepEqual(stripHtml("<"), "<", "03.03.01");
});

test("11.05 - false positives - closing bracket", t => {
  t.deepEqual(stripHtml(">"), ">", "11.05");
});

test("11.06 - false positives - three openings", t => {
  t.deepEqual(stripHtml(">>>"), ">>>", "11.06");
});

test("11.07 - false positives - three closings", t => {
  t.deepEqual(stripHtml("<<<"), "<<<", "11.07");
});

test("11.08 - false positives - spaced three openings", t => {
  t.deepEqual(stripHtml(" <<< "), "<<<", "11.08");
});

test("11.09 - false positives - tight recognised opening tag name, missing closing", t => {
  t.deepEqual(stripHtml("<a"), "", "11.09");
});

test("11.10 - false positives - unrecognised opening tag, missing closing", t => {
  t.deepEqual(stripHtml("<yo"), "", "11.10");
});

test("11.11 - false positives - missing opening, recognised tag", t => {
  t.deepEqual(stripHtml("a>"), "a>", "11.11");
});

test("11.12 - false positives - missing opening, unrecognised tag", t => {
  t.deepEqual(stripHtml("yo>"), "yo>", "11.12");
});

test("11.13 - false positives - conditionals that appear on Outlook only", t => {
  t.deepEqual(
    stripHtml(`<!--[if (gte mso 9)|(IE)]>
  <table width="540" align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
<![endif]-->
zzz
<!--[if (gte mso 9)|(IE)]>
      </td>
    </tr>
  </table>
<![endif]-->`),
    "zzz",
    "11.13"
  );
});

test("11.14 - false positives - conditionals that are visible for Outlook only", t => {
  t.deepEqual(
    stripHtml(`<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->`),
    "shown for everything except Outlook",
    "11.14 - checking also for whitespace control"
  );
});

test("11.15 - false positives - conditionals that are visible for Outlook only", t => {
  t.deepEqual(
    stripHtml(`a<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->b`),
    "a\nshown for everything except Outlook\nb",
    "11.15 - checking also for whitespace control"
  );
});

test("11.16 - false positives - conditionals that are visible for Outlook only", t => {
  t.deepEqual(
    stripHtml(`<!--[if !mso]><!--><table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        shown for everything except Outlook
      </td>
    </tr>
  </table><!--<![endif]-->`),
    "shown for everything except Outlook",
    "11.16 - all those line breaks in-between the tags need to be taken care of too"
  );
});

test("11.17 - false positives - consecutive tags", t => {
  t.deepEqual(
    stripHtml(
      "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after"
    ),
    "Text First point Second point Third point Text straight after",
    "11.17"
  );
});

// ==============================
// 12. opts.ignoreTags
// ==============================

test("12.01 - opts.ignoreTags - ignores single letter tag", t => {
  t.deepEqual(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"]
    }),
    "Some <b>text</b> and some more text.",
    "12.01"
  );
});

test("12.02 - opts.ignoreTags - ignores singleton tag", t => {
  t.deepEqual(
    stripHtml("Some text <hr> some more <i>text</i>.", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr> some more text.",
    "12.02"
  );
});

test("12.03 - opts.ignoreTags - ignores singleton tag, XHTML", t => {
  t.deepEqual(
    stripHtml("Some text <hr/> some more <i>text</i>.", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr/> some more text.",
    "12.03"
  );
});

test("12.04 - opts.ignoreTags - ignores singleton tag, spaced XHTML", t => {
  t.deepEqual(
    stripHtml("Some text <hr / > some more <i>text</i>.", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr / > some more text.",
    "12.04"
  );
});

test("12.05 - opts.ignoreTags - ignores single zzz tag", t => {
  t.deepEqual(
    stripHtml("Some <zzz>text</zzz> and some more <i>text</i>.", {
      ignoreTags: ["zzz"]
    }),
    "Some <zzz>text</zzz> and some more text.",
    "12.05"
  );
});

test("12.06 - opts.ignoreTags - ignores zzz singleton tag", t => {
  t.deepEqual(
    stripHtml("Some text <zzz> some more <i>text</i>.", {
      ignoreTags: ["zzz"]
    }),
    "Some text <zzz> some more text.",
    "12.06"
  );
});

test("12.07 - opts.ignoreTags - ignores default ranged tag", t => {
  t.deepEqual(
    stripHtml("Some <script>text</script> and some more <i>text</i>.", {
      ignoreTags: ["script"]
    }),
    "Some <script>text</script> and some more text.",
    "12.07"
  );
});

test("12.08 - opts.ignoreTags - ignored tag unclosed, ending with EOF", t => {
  // just for kicks:
  t.deepEqual(
    stripHtml("Some <b>text</b", {
      ignoreTags: ["b"]
    }),
    "Some <b>text</b",
    "12.08 - if user insists, that missing bracket must be intentional"
  );
});

test("12.09 - opts.ignoreTags - recognised unclosed singleton tag, HTML", t => {
  t.deepEqual(
    stripHtml("Some text <hr", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr",
    "12.09"
  );
});

test("12.10 - opts.ignoreTags - recognised unclosed singleton tag, XHTML", t => {
  t.deepEqual(
    stripHtml("Some text <hr/", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr/",
    "12.10"
  );
});

test("12.11 - opts.ignoreTags - kept the tag and the slash, just trimmed", t => {
  t.deepEqual(
    stripHtml("Some text <hr / ", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr /",
    "12.11"
  );
});

test("12.12 - opts.ignoreTags - ignores unclosed self-closing zzz tag", t => {
  t.deepEqual(
    stripHtml("Some <zzz>text</zzz", {
      ignoreTags: ["zzz"]
    }),
    "Some <zzz>text</zzz",
    "12.12"
  );
});

test("12.13 - opts.ignoreTags - ignores unclosed zzz singleton tag", t => {
  t.deepEqual(
    stripHtml("Some text <zzz", {
      ignoreTags: ["zzz"]
    }),
    "Some text <zzz",
    "12.13"
  );
});

test("12.14 - opts.ignoreTags - ignores default unclosed ranged tag", t => {
  t.deepEqual(
    stripHtml("Some <script>text</script", {
      ignoreTags: ["script"]
    }),
    "Some <script>text</script",
    "12.14"
  );
});

// ==============================
// 13. whitespace control
// ==============================

test("13.01 - whitespace control - adds a space in place of stripped tags, tight", t => {
  t.deepEqual(stripHtml("a<div>b</div>c"), "a b c", "13.01");
});

test("13.02 - whitespace control - adds a space in place of stripped tags, loose", t => {
  t.deepEqual(
    stripHtml("a <div>   b    </div>    c"),
    "a b c",
    "13.02 - stays on one line because it was on one line"
  );
});

test("13.03 - whitespace control - adds a space in place of stripped tags, tabs and LF's", t => {
  t.deepEqual(
    stripHtml("\t\t\ta <div>   b    </div>    c\n\n\n"),
    "a b c",
    "13.03 - like 02 above but with trimming"
  );
});

test("13.04 - whitespace control - adds a linebreak between each substring piece", t => {
  t.deepEqual(
    stripHtml(`a


  <div>
    b
  </div>
c`),
    "a\n\nb\n\nc",
    "13.04"
  );
});

test("13.05 - whitespace control - multiple tag combo case #1", t => {
  t.deepEqual(stripHtml("z<a><b>c</b></a>y"), "z c y", "13.05");
});

test("13.06 - whitespace control - multiple tag combo case #2", t => {
  t.deepEqual(
    stripHtml(`
      z
        <a>
          <b class="something anything">
            c
          </b>
        </a>
      y`),
    "z\n\nc\n\ny",
    "13.06"
  );
});

test("13.07 - whitespace control - dirty html, trailing space", t => {
  t.deepEqual(
    stripHtml("something <article>article> here"),
    "something here",
    "13.07"
  );
});

test("13.08 - whitespace control - dirty html, few trailing spaces", t => {
  t.deepEqual(
    stripHtml("something <article>article>   here"),
    "something here",
    "13.08"
  );
});

// 14. comments
// -----------------------------------------------------------------------------

test("14.01 - strips HTML comments", t => {
  // group #1. spaces on both outsides
  t.deepEqual(
    stripHtml("aaa <!-- <tr> --> bbb"),
    "aaa bbb",
    "14.01.01 - double space"
  );
  t.deepEqual(
    stripHtml("aaa <!-- <tr>--> bbb"),
    "aaa bbb",
    "14.01.02 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr> --> bbb"),
    "aaa bbb",
    "14.01.03 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr>--> bbb"),
    "aaa bbb",
    "14.01.04 - no space"
  );

  // group #2. spaces on right only
  t.deepEqual(
    stripHtml("aaa<!-- <tr> --> bbb"),
    "aaa bbb",
    "14.01.05 - double space"
  );
  t.deepEqual(
    stripHtml("aaa<!-- <tr>--> bbb"),
    "aaa bbb",
    "14.01.06 - single space"
  );
  t.deepEqual(
    stripHtml("aaa<!--<tr> --> bbb"),
    "aaa bbb",
    "14.01.07 - single space"
  );
  t.deepEqual(
    stripHtml("aaa<!--<tr>--> bbb"),
    "aaa bbb",
    "14.01.08 - no space"
  );

  // group #3. spaces on left only
  t.deepEqual(
    stripHtml("aaa <!-- <tr> -->bbb"),
    "aaa bbb",
    "14.01.09 - double space"
  );
  t.deepEqual(
    stripHtml("aaa <!-- <tr>-->bbb"),
    "aaa bbb",
    "14.01.10 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr> -->bbb"),
    "aaa bbb",
    "14.01.11 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr>-->bbb"),
    "aaa bbb",
    "14.01.12 - no space"
  );

  // group #4. no spaces outside
  t.deepEqual(
    stripHtml("aaa<!-- <tr> -->bbb"),
    "aaa bbb",
    "14.01.13 - double space"
  );
  t.deepEqual(
    stripHtml("aaa<!-- <tr>-->bbb"),
    "aaa bbb",
    "14.01.14 - single space"
  );
  t.deepEqual(
    stripHtml("aaa<!--<tr> -->bbb"),
    "aaa bbb",
    "14.01.15 - single space"
  );
  t.deepEqual(stripHtml("aaa<!--<tr>-->bbb"), "aaa bbb", "14.01.16 - no space");
});

test("14.02 - HTML comments around string edges", t => {
  t.deepEqual(stripHtml("aaa <!-- <tr> --> "), "aaa", "14.02.01");
  t.deepEqual(stripHtml("aaa <!-- <tr> -->"), "aaa", "14.02.02");

  t.deepEqual(stripHtml(" <!-- <tr> --> aaa"), "aaa", "14.02.03");
  t.deepEqual(stripHtml("<!-- <tr> -->aaa"), "aaa", "14.02.04");

  t.deepEqual(stripHtml(" <!-- <tr> --> aaa <!-- <tr> -->"), "aaa", "14.02.05");
  t.deepEqual(stripHtml("<!-- <tr> -->aaa<!-- <tr> -->"), "aaa", "14.02.06");
  t.deepEqual(
    stripHtml("   <!-- <tr> -->aaa<!-- <tr> -->   "),
    "aaa",
    "14.02.07"
  );
});

test("14.03 - range tag is unclosed", t => {
  // no content besides ranged tag:
  t.deepEqual(stripHtml('<script>alert("123")</script'), "", "14.03.01");
  t.deepEqual(stripHtml("<script>alert('123')</script"), "", "14.03.02");
  t.deepEqual(stripHtml('<script>alert("123")<script'), "", "14.03.03");
  t.deepEqual(stripHtml("<script>alert('123')<script"), "", "14.03.04");
  t.deepEqual(stripHtml('<script>alert("123")</ script'), "", "14.03.05");
  t.deepEqual(stripHtml("<script>alert('123')</ script"), "", "14.03.06");

  // single letter left:
  t.deepEqual(stripHtml('a<script>alert("123")</script'), "a", "14.03.07");
  t.deepEqual(stripHtml("a<script>alert('123')</script"), "a", "14.03.08");
  t.deepEqual(stripHtml('a<script>alert("123")<script'), "a", "14.03.09");
  t.deepEqual(stripHtml("a<script>alert('123')<script"), "a", "14.03.10");
  t.deepEqual(stripHtml('a<script>alert("123")</ script'), "a", "14.03.11");
  t.deepEqual(stripHtml("a<script>alert('123')</ script"), "a", "14.03.12");

  // script excluded from ranged tags, so now only tags are removed, no contents between:
  t.deepEqual(
    stripHtml('a<script>alert("123")</script', {
      stripTogetherWithTheirContents: []
    }),
    'a alert("123")',
    "14.03.13"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</script", {
      stripTogetherWithTheirContents: []
    }),
    "a alert('123')",
    "14.03.14"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")<script', {
      stripTogetherWithTheirContents: []
    }),
    'a alert("123")',
    "14.03.15"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')<script", {
      stripTogetherWithTheirContents: []
    }),
    "a alert('123')",
    "14.03.16"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")</ script', {
      stripTogetherWithTheirContents: []
    }),
    'a alert("123")',
    "14.03.17"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</ script", {
      stripTogetherWithTheirContents: []
    }),
    "a alert('123')",
    "14.03.18"
  );

  // script tag ignored and left intact (opts.ignoreTags):
  t.deepEqual(
    stripHtml('a<script>alert("123")</script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</script',
    "14.03.19"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</script",
    "14.03.20"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")<script', { ignoreTags: ["script"] }),
    'a<script>alert("123")<script',
    "14.03.21"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')<script", { ignoreTags: ["script"] }),
    "a<script>alert('123')<script",
    "14.03.22"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")</ script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</ script',
    "14.03.23"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</ script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</ script",
    "14.03.24"
  );
});

test("14.04 - false positives #1 - Nunjucks code", t => {
  t.deepEqual(stripHtml("a< 2zzz==>b"), "a< 2zzz==>b", "14.04.01");
});

test("14.05 - unclosed tag followed by another tag - range tag", t => {
  t.deepEqual(stripHtml('<script>alert("123")</script<body>'), "", "14.05");
});

test("14.06 - unclosed tag followed by self-closing tag", t => {
  t.deepEqual(stripHtml('<script>alert("123")</script</body>'), "", "14.06");
});

test("14.07 - unclosed tag followed by another tag", t => {
  t.deepEqual(stripHtml('<script>alert("123")</script</ body>'), "", "14.07");
});

test("14.08 - unclosed tag followed by another tag", t => {
  t.deepEqual(stripHtml('<script>alert("123")</script<body/>'), "", "14.08");
});

test("14.09 - unclosed tag followed by another unclosed tag", t => {
  t.deepEqual(stripHtml('<script>alert("123")</script<body'), "", "14.05.09");
});

test("14.10 - unclosed tag followed by another tag - non-range tag", t => {
  t.deepEqual(
    stripHtml("<article>text here</article<body>"),
    "text here",
    "14.10"
  );
});

test("14.11 - unclosed tag followed by another tag - non-range, self-closing tag", t => {
  t.deepEqual(
    stripHtml("<article>text here</article</body>"),
    "text here",
    "14.11"
  );
});

test("14.12 - unclosed tag followed by another tag - self-closing, inner whitespace", t => {
  t.deepEqual(
    stripHtml("<article>text here</article</ body>"),
    "text here",
    "14.12"
  );
});

test("14.13 - unclosed tag followed by another tag - with closing slash", t => {
  t.deepEqual(
    stripHtml("<article>text here</article<body/>"),
    "text here",
    "14.13"
  );
});

test("14.14 - unclosed tag followed by another tag - html", t => {
  t.deepEqual(
    stripHtml("<article>text here</article<body"),
    "text here",
    "14.14"
  );
});

test("14.15 - unclosed tag followed by another tag - strips many tags", t => {
  t.deepEqual(
    stripHtml("a<something<anything<whatever<body<html"),
    "a",
    "14.15"
  );
});

test("14.16 - unclosed tag followed by another tag - bails because of spaces", t => {
  t.deepEqual(
    stripHtml("a < something < anything < whatever < body < html"),
    "a < something < anything < whatever < body < html",
    "14.16"
  );
});

test("14.17 - range tags are overlapping - both default known range tags", t => {
  t.deepEqual(
    stripHtml("<script>tra la <style>la</script>la la</style> rr"),
    "rr",
    "14.17"
  );
});

test("14.18 - range tags are overlapping - both were just custom-set", t => {
  t.deepEqual(
    stripHtml("<zzz>tra la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"]
    }),
    "rr",
    "14.18"
  );
});

test("14.19 - range tags are overlapping - nested", t => {
  t.deepEqual(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"]
    }),
    "rr",
    "14.19"
  );
});

// 15. opts.returnRangesOnly
// -----------------------------------------------------------------------------

test("15.01 - opts.returnRangesOnly - anchor wrapping text", t => {
  // both default known range tags
  t.deepEqual(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "15.01.01 - default"
  );
  t.deepEqual(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "15.01.02 - hardcoded defaults"
  );
  t.deepEqual(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.',
      { returnRangesOnly: true }
    ),
    [
      [9, 43, " "],
      [51, 56, " "]
    ],
    "15.01.03 - opts"
  );
});

test("15.02 - opts.returnRangesOnly - no tags were present at all", t => {
  // t.deepEqual(stripHtml("Some text"), "Some text", "15.02.01 - control");
  t.deepEqual(
    stripHtml("Some text", {
      returnRangesOnly: true
    }),
    [],
    "15.02.02 - returns empty array (no ranges inside)"
  );
});

// 16. opts.trimOnlySpaces
// -----------------------------------------------------------------------------

test("16.01 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", t => {
  t.deepEqual(stripHtml("\xa0 a \xa0"), "a", "16.01.01");
});

test("16.02 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all, trailing whitespace", t => {
  t.deepEqual(stripHtml(" \xa0 a \xa0 "), "a", "16.02");
});

test("16.03 - opts.trimOnlySpaces - opts.trimOnlySpaces = on", t => {
  t.deepEqual(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "16.03"
  );
});

test("16.04 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, loose", t => {
  t.deepEqual(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "16.04"
  );
});

test("16.05 - opts.trimOnlySpaces - default", t => {
  t.deepEqual(stripHtml("\xa0 <article> \xa0"), "", "16.05");
});

test("16.06 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, tag", t => {
  t.deepEqual(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: true }),
    "\xa0\xa0",
    "16.06"
  );
});

test("16.07 - opts.trimOnlySpaces - opts.trimOnlySpaces = on, two tags", t => {
  t.deepEqual(
    stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: true }),
    "\xa0 \xa0",
    "16.07"
  );
});

test("16.08 - opts.trimOnlySpaces - whitespace around", t => {
  t.deepEqual(stripHtml(" \xa0 <article> \xa0 "), "", "16.08");
});

test("16.09 - opts.trimOnlySpaces - whitespace around, trimOnlySpaces = on", t => {
  t.deepEqual(
    stripHtml(" \xa0 <article> \xa0 ", { trimOnlySpaces: true }),
    "\xa0\xa0",
    "16.09"
  );
});

test("16.10 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all", t => {
  t.deepEqual(stripHtml(" \t a \n "), "a", "16.10");
});

test("16.11 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - trimOnlySpaces = on", t => {
  t.deepEqual(
    stripHtml(" \t a \n ", { trimOnlySpaces: true }),
    "\t a \n",
    "16.11"
  );
});

test("16.12 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - CRLF", t => {
  t.deepEqual(
    stripHtml(" \t\n a \r\n ", { trimOnlySpaces: true }),
    "\t\n a \r\n",
    "16.12"
  );
});

test("16.13 - opts.trimOnlySpaces - unencoded non-breaking spaces - no HTML at all - tag", t => {
  t.deepEqual(stripHtml("\t\r\n <article> \t\r\n"), "", "16.13");
});

test("16.14 - opts.trimOnlySpaces - tabs and CRLF", t => {
  t.deepEqual(
    stripHtml("\t\r\n <article> \t\r\n", { trimOnlySpaces: true }),
    "\t\r\n\t\r\n",
    "16.14"
  );
});

test("16.15 - opts.trimOnlySpaces - spaced tabs and CRs, trimOnlySpaces = on", t => {
  t.deepEqual(
    stripHtml(" \t \r \n <article> \t \r \n ", { trimOnlySpaces: true }),
    "\t \r \n\t \r \n",
    "16.15"
  );
});

test("16.16 - opts.trimOnlySpaces - combos of tags and whitespace, trimOnlySpaces = on", t => {
  t.deepEqual(
    stripHtml(" \n <article> \xa0 <div> \xa0 </article> \t ", {
      trimOnlySpaces: true
    }),
    "\n \t",
    "16.16"
  );
});

test("16.17 - opts.trimOnlySpaces - tags, trimOnlySpaces = on", t => {
  t.deepEqual(
    stripHtml(" \na<article> \xa0 <div> \xa0 </article>b\t ", {
      trimOnlySpaces: true
    }),
    "\na b\t",
    "16.17"
  );
});

test("16.18 - opts.trimOnlySpaces - letters around are retained", t => {
  t.deepEqual(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true
    }),
    "\n a b \t",
    "16.18"
  );
});

test("16.19 - opts.trimOnlySpaces - opts.ignoreTags combo", t => {
  t.deepEqual(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"]
    }),
    "\n a <div> b \t",
    "16.19"
  );
});

test("16.20 - opts.trimOnlySpaces - opts.ignoreTags combo - plausible but recognised", t => {
  t.deepEqual(
    stripHtml(" \n a <article> \xa0 < div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"]
    }),
    "\n a < div> b \t",
    "16.20"
  );
});

// 17. opts.dumpLinkHrefsNearby
// -----------------------------------------------------------------------------

test("17.01 - opts.dumpLinkHrefsNearby - clean code, double quotes", t => {
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening'
    ),
    "Let's watch RT news this evening",
    "17.01.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "17.01.02 - control, hardcoded default"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "17.01.03 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@thesun.co.uk" target="_blank">The Sun</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "17.01.04 - mailto links without customisation"
  );
  t.deepEqual(
    stripHtml(
      'Here\'s the <a href="mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night" target="_blank">chief editor\'s</a> email.',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "17.01.05 - mailto links with customisation"
  );
});

test("17.02 - opts.dumpLinkHrefsNearby - clean code, single quotes", t => {
  t.deepEqual(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening"
    ),
    "Let's watch RT news this evening",
    "17.02.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "17.02.02 - control, hardcoded default"
  );
  t.deepEqual(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "17.02.03 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      "Let's sell some juicy gossip to the <a href='mailto:gossip@thesun.co.uk' target='_blank'>The Sun</a> right now!",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "17.02.04 - mailto links without customisation"
  );
  t.deepEqual(
    stripHtml(
      "Here's the <a href='mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night' target='_blank'>chief editor's</a> email.",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "17.02.05 - mailto links with customisation"
  );
});

test("17.03 - opts.dumpLinkHrefsNearby - dirty code, HTML is chopped but href captured", t => {
  t.deepEqual(
    stripHtml('Let\'s watch <a href="https://www.rt.com/" targ'),
    "Let's watch",
    "17.03.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml('Let\'s watch <a href="https://www.rt.com/" targ', {
      dumpLinkHrefsNearby: { enabled: true }
    }),
    "Let's watch https://www.rt.com/",
    "17.03.02 - only href contents are left after stripping"
  );
});

test("17.04 - opts.dumpLinkHrefsNearby - linked image", t => {
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "17.04.01 - control, default"
  );
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "a b",
    "17.04.02 - control, hardcoded default"
  );
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "a https://codsen.com b",
    "17.04.03 - dumps href of a linked image"
  );
});

test("17.05 - opts.dumpLinkHrefsNearby - .putOnNewLine", t => {
  // control
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "17.05.01 - control, default, off"
  );

  // control
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: false // <-------------   !
        }
      }
    ),
    "a https://codsen.com b",
    "17.05.02 - dumpLinkHrefsNearby = on; putOnNewLine = off"
  );

  // control
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true // <-------------   !
        }
      }
    ),
    "a\n\nhttps://codsen.com\n\nb",
    "17.05.03 - dumpLinkHrefsNearby = on; putOnNewLine = on"
  );

  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true,
          wrapHeads: "[", // <------------   !
          wrapTails: "]" // <-------------   !
        }
      }
    ),
    "a\n\n[https://codsen.com]\n\nb",
    "17.05.04 - dumpLinkHrefsNearby = on; putOnNewLine = on; wrapHeads = on; wrapTails = on;"
  );
});

test("17.06 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails", t => {
  // control
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`
    ),
    "a z b",
    "17.06.01 - control, default"
  );

  // default dump
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true
        }
      }
    ),
    "a z https://codsen.com b",
    "17.06.02 - heads only"
  );

  // wrap heads only
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "["
        }
      }
    ),
    "a z [https://codsen.com b",
    "17.06.03 - heads only"
  );

  // wrap heads only
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapTails: "]"
        }
      }
    ),
    "a z https://codsen.com] b",
    "17.06.04 - tails only"
  );

  // wrap heads only
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]"
        }
      }
    ),
    "a z [https://codsen.com] b",
    "17.06.05 - tails only"
  );

  // + ignoreTags
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        ignoreTags: "div",
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]"
        }
      }
    ),
    "a <div>z</div> [https://codsen.com] b",
    "17.06.06 - ignore on a div only"
  );

  // + ignoreTags
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        ignoreTags: "", // <--------- it's an empty string! Will be ignored.
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]"
        }
      }
    ),
    "a z [https://codsen.com] b",
    "17.06.07 - ignore on a div only"
  );

  // + stripTogetherWithTheirContents
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        stripTogetherWithTheirContents: "div",
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]"
        }
      }
    ),
    "a [https://codsen.com] b",
    "17.06.08 - whole div pair is removed"
  );
});

// 18. opts.onlyStripTags
// -----------------------------------------------------------------------------

test("18.01 - opts.onlyStripTags - base cases", t => {
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "18.01.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "z" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
    "18.01.02 - non-existent tag option - leaves all tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: null }
    ),
    "Let's watch RT news this evening",
    "18.01.03 - falsey option"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [] }
    ),
    "Let's watch RT news this evening",
    "18.01.04 - no tags mentioned, will strip all"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [""] }
    ),
    "Let's watch RT news this evening",
    "18.01.05 - empty strings will be removed and will become default, blank setting"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["\t", "\n"] }
    ),
    "Let's watch RT news this evening",
    "18.01.06 - same, whitespace entries will be removed, setting will become default - strip all"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "18.01.07 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "a" }
    ),
    "Let's watch <b>RT news</b> this evening",
    "18.01.08 - only strip anchor tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["a"] }
    ),
    "Let's watch <b>RT news</b> this evening",
    "18.01.09 - only strip anchor tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "b" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "18.01.10 - only strip anchor tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["b"] }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "18.01.11 - only strip anchor tags"
  );
});

test("18.02 - opts.onlyStripTags + opts.ignoreTags combo", t => {
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>'
    ),
    "Let's watch RT news this evening",
    "18.02.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a" }
    ),
    "<div>Let's watch <b>RT news</b> this evening</div>",
    "18.02.02"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { ignoreTags: "a" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "18.02.03"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a", ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "18.02.04 - both entries cancel each one out"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a", "b"], ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening</div>', // TODO - detect and skip adding the space here
    "18.02.05 - both entries cancel each one out"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a"], ignoreTags: ["a", "b"] }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "18.02.06 - both entries cancel each one out"
  );
});

test("18.03 - opts.onlyStripTags - multiline text - defaults", t => {
  t.deepEqual(
    stripHtml(
      `Abc

<b>mn</b>

def`
    ),
    `Abc

mn

def`,
    "18.03"
  );
});

test("18.04 - opts.onlyStripTags - multiline text - option on", t => {
  t.deepEqual(
    stripHtml(
      `Abc

<b>mn</b>
<i>op</i>
<u>qr</u>
<strong>st</strong>
<em>uv</em>

def`,
      {
        onlyStripTags: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "strong",
          "em",
          "u",
          "strike",
          "ul",
          "ol",
          "hr",
          "p",
          "li",
          "sub",
          "sup",
          "i",
          "b"
        ]
      }
    ),
    `Abc

mn
op
qr
st
uv

def`,
    "18.04"
  );
});

// 19. opts.cb
// -----------------------------------------------------------------------------

test("19.01 - opts.cb - baseline, no ranges requested", t => {
  // baseline, notice dirty whitespace:
  t.deepEqual(
    stripHtml(`<div style="display: inline !important;" >abc</ div>`, {
      returnRangesOnly: false
    }),
    "abc",
    "19.01"
  );
});

test("19.02 - opts.cb - baseline, ranges requested", t => {
  t.deepEqual(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true
    }),
    [
      [0, 6],
      [9, 16]
    ],
    "19.02"
  );
});

test("19.03 - opts.cb - replace hr with tralala", t => {
  const cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, "<tralala>");
  };
  t.deepEqual(stripHtml("abc<hr>def", { cb }), "abc<tralala>def", "19.03.01");
  t.deepEqual(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "19.03.02"
  );
});

test("19.04 - opts.cb - replace div with tralala", t => {
  const cb = ({
    tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr
    // proposedReturn
  }) => {
    rangesArr.push(
      deleteFrom,
      deleteTo,
      `<${tag.slashPresent ? "/" : ""}tralala>`
    );
  };
  t.deepEqual(
    stripHtml("<div >abc</ div>", { cb }),
    "<tralala>abc</tralala>",
    "19.04.01"
  );
  t.deepEqual(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true,
      cb
    }),
    [
      [0, 6, "<tralala>"],
      [9, 16, "</tralala>"]
    ],
    "19.04.02"
  );
});

test("19.05 - opts.cb - replace only hr", t => {
  const cb = ({
    tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr
    // proposedReturn
  }) => {
    if (tag.name === "hr") {
      rangesArr.push(
        deleteFrom,
        deleteTo,
        `<${tag.slashPresent ? "/" : ""}tralala>`
      );
    }
  };
  t.deepEqual(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { cb }),
    "abc<tralala>def<span>ghi</span>jkl",
    "19.05.01"
  );
  t.deepEqual(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "19.05.02"
  );
});

test("19.06 - opts.cb - readme example one", t => {
  const cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    insert,
    rangesArr
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, insert);
  };
  t.deepEqual(stripHtml("abc<hr>def", { cb }), "abc def", "19.06.01");
  t.deepEqual(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, " "]],
    "19.06.02"
  );
});

test("19.07 - opts.cb - ignored tags are also being pinged, with null values", t => {
  const capturedTags = [];
  const cb = ({
    tag,
    deleteFrom,
    deleteTo,
    insert,
    rangesArr
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, insert);
    capturedTags.push(tag.name);
  };
  const res = stripHtml("abc<hr>def<br>ghi", { cb, ignoreTags: ["hr"] });
  t.deepEqual(res, "abc<hr>def ghi", "19.07.01");
  t.deepEqual(capturedTags, ["hr", "br"], "19.07.02");
});

test("19.08 - opts.cb - ignored tags are also being pinged, with null values", t => {
  const capturedTags = [];
  const cb = ({
    tag,
    deleteFrom,
    deleteTo,
    insert,
    rangesArr
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, insert);
    capturedTags.push(tag.name);
  };
  const res = stripHtml("abc<hr>def<br>ghi", {
    returnRangesOnly: true,
    cb,
    ignoreTags: ["hr"]
  });
  t.deepEqual(res, [[10, 14, " "]], "19.08.01");
  t.deepEqual(capturedTags, ["hr", "br"], "19.08.02");
});

test("19.09 - opts.cb - cb.tag contents are right on ignored tags", t => {
  const capturedTags = [];
  // const rangesArr = [];
  const cb = ({
    tag
    // deleteFrom,
    // deleteTo,
    // insert
    // rangesArr
    // proposedReturn
  }) => {
    capturedTags.push(tag);
  };

  // notice there's no assigning to a variable, we just rely on a callback:
  stripHtml("a<br/>b", {
    cb,
    ignoreTags: ["b", "strong", "i", "em", "br", "sup"],
    onlyStripTags: [],
    stripTogetherWithTheirContents: ["script", "style", "xml"],
    skipHtmlDecoding: true,
    returnRangesOnly: true,
    trimOnlySpaces: true,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: ""
    }
  });

  t.deepEqual(
    capturedTags,
    [
      {
        attributes: [],
        lastClosingBracketAt: 5,
        lastOpeningBracketAt: 1,
        slashPresent: 4,
        leftOuterWhitespace: 1,
        onlyPlausible: false,
        nameStarts: 2,
        nameContainsLetters: true,
        nameEnds: 4,
        name: "br"
      }
    ],
    "19.09"
  );
});

test("19.10 - opts.cb - cb.tag contents are right on non-ignored tags", t => {
  const capturedTags = [];
  // const rangesArr = [];
  const cb = ({
    tag
    // deleteFrom,
    // deleteTo,
    // insert
    // rangesArr
    // proposedReturn
  }) => {
    capturedTags.push(tag);
  };

  // notice there's no assigning to a variable, we just rely on a callback:
  stripHtml("abc<br >def<br>ghi<br/>jkl<br />mno", {
    cb,
    ignoreTags: ["b", "strong", "i", "em", "br", "sup"],
    onlyStripTags: [],
    stripTogetherWithTheirContents: ["script", "style", "xml"],
    skipHtmlDecoding: true,
    returnRangesOnly: true,
    trimOnlySpaces: true,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: ""
    }
  });

  t.deepEqual(
    capturedTags,
    [
      {
        attributes: [],
        lastClosingBracketAt: 7,
        lastOpeningBracketAt: 3,
        leftOuterWhitespace: 3,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 6,
        nameStarts: 4,
        onlyPlausible: false,
        slashPresent: false
      },
      {
        attributes: [],
        lastClosingBracketAt: 14,
        lastOpeningBracketAt: 11,
        leftOuterWhitespace: 11,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 14,
        nameStarts: 12,
        onlyPlausible: false,
        slashPresent: false
      },
      {
        attributes: [],
        lastClosingBracketAt: 22,
        lastOpeningBracketAt: 18,
        leftOuterWhitespace: 18,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 21,
        nameStarts: 19,
        onlyPlausible: false,
        slashPresent: 21
      },
      {
        attributes: [],
        lastClosingBracketAt: 31,
        lastOpeningBracketAt: 26,
        leftOuterWhitespace: 26,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 29,
        nameStarts: 27,
        onlyPlausible: false,
        slashPresent: 30
      }
    ],
    "19.10"
  );
});
