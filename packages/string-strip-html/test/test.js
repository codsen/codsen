import test from "ava";
import stripHtml from "../dist/string-strip-html.esm";

// ==============================
// normal use cases
// ==============================

test.skip("delete me", t => {
  t.deepEqual(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"]
    }),
    "Some <b>text</b> and some more text.",
    "04.01.01 - ignores single letter tag"
  );
});

test("01.01 - string is whole (opening) tag", t => {
  t.deepEqual(stripHtml("<a>"), "", "01.01.01");
  t.deepEqual(stripHtml("< a>"), "", "01.01.02");
  t.deepEqual(stripHtml("<a >"), "", "01.01.03");
  t.deepEqual(stripHtml("< a >"), "", "01.01.04");
  t.deepEqual(stripHtml("<     a     >"), "", "01.01.05");
  t.deepEqual(
    stripHtml(" <a>"),
    "",
    "01.01.06 - leading space is not retained"
  );
  t.deepEqual(
    stripHtml("< a> "),
    "",
    "01.01.07 - trailing space is not retained"
  );
  t.deepEqual(stripHtml("  <a >  "), "", "01.01.08");
  t.deepEqual(stripHtml("\t< a >"), "", "01.01.09");
  t.deepEqual(
    stripHtml("    \t   <     a     >      \n\n   "),
    "",
    "01.01.10 - lots of different whitespace chars"
  );
  t.deepEqual(
    stripHtml("<a>         <a>"),
    "",
    "01.01.11 - whitespace between tags is deleted too"
  );
  t.deepEqual(
    stripHtml("<a>         z"),
    "z",
    "01.01.12 - whitespace between tag and text is removed"
  );
  t.deepEqual(
    stripHtml("   <b>text</b>   "),
    "text",
    "01.01.13 - leading/trailing spaces"
  );
  t.deepEqual(
    stripHtml("\n\n\n<b>text</b>\r\r\r"),
    "text",
    "01.01.14 - but leading/trailing line breaks are deleted"
  );
  t.deepEqual(
    stripHtml(
      'z<a href="https://codsen.com" target="_blank">z<a href="xxx" target="_blank">z'
    ),
    "z z z",
    "01.01.15 - HTML tag with attributes"
  );

  // custom tag names:
  t.deepEqual(stripHtml("<custom>"), "", "01.01.16.1");
  t.deepEqual(stripHtml("<custom"), "", "01.01.16.2");
  t.deepEqual(stripHtml("<custom-tag>"), "", "01.01.17");
  t.deepEqual(stripHtml("<-tag>"), "", "01.01.18");

  // multiple
  t.deepEqual(stripHtml("<custom><custom><custom>"), "", "01.01.19");
  t.deepEqual(
    stripHtml("<custom-tag><custom-tag><custom-tag>"),
    "",
    "01.01.20"
  );
  t.deepEqual(stripHtml("<-tag><-tag><-tag>"), "", "01.01.21");

  // multiple with surroundings
  t.deepEqual(stripHtml("a<custom><custom><custom>b"), "a b", "01.01.22");
  t.deepEqual(
    stripHtml("a<custom-tag><custom-tag><custom-tag>b"),
    "a b",
    "01.01.23"
  );
  t.deepEqual(stripHtml("a<-tag><-tag><-tag>b"), "a b", "01.01.24");

  // multiple with surroundings
  t.deepEqual(stripHtml("a</custom>< /custom><custom/>b"), "a b", "01.01.25");
  t.deepEqual(
    stripHtml("a<custom-tag /></ custom-tag>< /custom-tag>b"),
    "a b",
    "01.01.26"
  );
  t.deepEqual(stripHtml("a</ -tag>< /-tag><-tag / >   b"), "a b", "01.01.27");
  t.deepEqual(
    stripHtml("a  </custom>< /custom><custom/>   b"),
    "a b",
    "01.01.28"
  );
  t.deepEqual(
    stripHtml("a\n<custom-tag /></ custom-tag>\n< /custom-tag>\n\nb"),
    "a\nb",
    "01.01.29"
  );
  t.deepEqual(
    stripHtml("a\t\t</ -tag>< /-tag><-tag / >   \t b"),
    "a b",
    "01.01.30"
  );
});

test("01.02 - string is whole (closing) tag", t => {
  t.deepEqual(stripHtml("</a>"), "", "01.02.01");
  t.deepEqual(stripHtml("< /a>"), "", "01.02.02");
  t.deepEqual(stripHtml("</ a>"), "", "01.02.03");
  t.deepEqual(stripHtml("</a >"), "", "01.02.04");
  t.deepEqual(stripHtml("< /a >"), "", "01.02.05");
  t.deepEqual(stripHtml("</ a >"), "", "01.02.06");
  t.deepEqual(stripHtml("< / a >"), "", "01.02.07");
  t.deepEqual(stripHtml("<  /   a     >"), "", "01.02.08");
  t.deepEqual(stripHtml(" </a>"), "", "01.02.09");
  t.deepEqual(stripHtml("< /a> "), "", "01.02.10");
  t.deepEqual(stripHtml("  </a >  "), "", "01.02.11");
  t.deepEqual(stripHtml("\t< /a >"), "", "01.02.12");
  t.deepEqual(
    stripHtml("    \t   <   /  a     >      \n\n   "),
    "",
    "01.02.13"
  );
});

// now tag pairs vs content

test("01.03 - tag pairs", t => {
  t.deepEqual(stripHtml("<a>zzz</a>"), "zzz", "01.03.01");
  t.deepEqual(stripHtml(" <a>zzz</a> "), "zzz", "01.03.02");
  t.deepEqual(stripHtml(" <a> zzz </a> "), "zzz", "01.03.03");
  t.deepEqual(stripHtml(" <a> zz\nz </a> "), "zz\nz", "01.03.04");
});

test("01.04 - multiple tag pairs - adds spaces - #1", t => {
  t.deepEqual(
    stripHtml("rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu"),
    "rrr zzz something\nelse zzz yyy uuu",
    "01.04"
  );
});

test("01.05 - multiple tag pairs - adds spaces - #2", t => {
  t.deepEqual(stripHtml("aaaaaaa<a>bbbbbbbb"), "aaaaaaa bbbbbbbb", "01.05.01");
  t.deepEqual(stripHtml("<a>bbbbbbbb"), "bbbbbbbb", "01.05.02");
  t.deepEqual(stripHtml("aaaaaaa<a>"), "aaaaaaa", "01.05.03");
});

test("01.06 - deletion while being on sensitive mode", t => {
  t.deepEqual(stripHtml("< div >x</div>"), "x", "01.06.01");
  t.deepEqual(
    stripHtml("aaaaaaa< br >bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.06.02"
  );
  t.deepEqual(stripHtml("aaaaaaa< div >x</div>"), "aaaaaaa x", "01.06.03");
  t.deepEqual(stripHtml("aaaaaaa < div >x</div>"), "aaaaaaa x", "01.06.04");
  t.deepEqual(stripHtml("aaaaaaa< div >x</div>"), "aaaaaaa x", "01.06.05");
});

test("01.07 - tags with attributes", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.07.01"
  );
  t.deepEqual(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.07.02"
  );
  t.deepEqual(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    "aaaaaaa x",
    "01.07.03"
  );
  t.deepEqual(
    stripHtml('aaaaaaa < div class="zzzz">x</div>'),
    "aaaaaaa x",
    "01.07.04"
  );
  t.deepEqual(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    "aaaaaaa x",
    "01.07.05"
  );
  t.deepEqual(stripHtml('< div class="zzzz">x</div>'), "x", "01.07.06");
});

test("01.08 - multiple brackets repeated", t => {
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>>>>something</div>bbbbb"),
    "aaaa something bbbbb",
    "01.08.01"
  );
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>something</div>bbbbb"),
    "aaaa something bbbbb",
    "01.08.02"
  );
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "01.08.03"
  );
  t.deepEqual(
    stripHtml("aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "01.08.04"
  );
  t.deepEqual(
    stripHtml("aaaa something<<<</div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "01.08.05"
  );
  t.deepEqual(
    stripHtml("aaaa something<<<<  / div>>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "01.08.06"
  );
  t.deepEqual(
    stripHtml("aaaa something<<<<  //// div /// >>>>>>>bbbbb"),
    "aaaa something bbbbb",
    "01.08.07"
  );
  t.deepEqual(
    stripHtml("aaaa< <  <   <    <     <     div>>>>something<<<</div>bbbbb"),
    "aaaa something bbbbb",
    "01.08.08"
  );
});

test("01.09 - checking can script slip through in any way", t => {
  t.deepEqual(
    stripHtml("x<b>y</b>z", {
      stripTogetherWithTheirContents: ["b"]
    }),
    "x z",
    "01.09.01"
  );
  t.deepEqual(
    stripHtml(
      'some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "01.09.02"
  );
  t.deepEqual(
    stripHtml(
      'some text &lt;script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'
    ),
    "some text more text",
    "01.09.03"
  );
  t.deepEqual(
    stripHtml(
      'some text &lt;script&gt;console.log("<sup>>>>>>"); alert("you\'re done!");&lt;/script&gt; more text'
    ),
    "some text more text",
    "01.09.04 - sneaky HTML character-encoded brackets"
  );
});

test("01.10 - strips style tags", t => {
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
    "01.10.01"
  );

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
    "01.10.02 - \"text/css'"
  );
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
    "01.10.03 - 'text/css\""
  );
});

test("01.11 - opts.stripTogetherWithTheirContents", t => {
  t.deepEqual(
    stripHtml("a<b>c</b>d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "01.11.01"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<   /   b   >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "01.11.02 - whitespace within the tag"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "01.11.03 - closing slash wrong side"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "01.11.04 - two closing slashes"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<   //    b   //    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "01.11.05 - multiple duplicated closing slashes"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "01.11.06 - multiple duplicated closing slashes"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a d",
    "01.11.07 - no closing slashes"
  );
  t.deepEqual(
    stripHtml("a<    b    >     c \n\n\n        <   /    b   /    >d", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a\nd",
    "01.11.08 - no closing slashes"
  );
  t.deepEqual(
    stripHtml("a<b>c</b>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"]
    }),
    "a d g",
    "01.11.09"
  );
  t.deepEqual(
    stripHtml("a<bro>c</bro>d<e>f</e>g", {
      stripTogetherWithTheirContents: ["b", "e"]
    }),
    "a c d g",
    "01.11.10 - sneaky similarity, bro starts with b"
  );
  t.deepEqual(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"]
      }
    ),
    "Text and some more.",
    "01.11.11 - strips with attributes. Now resembling real life."
  );
  t.deepEqual(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ["div", "section", "article"]
      }
    ),
    "Text and some more.",
    "01.11.12 - lots of spaces within tags"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: []
    }),
    "a c d",
    "01.11.13 - override stripTogetherWithTheirContents to an empty array"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: null
    }),
    "a c d",
    "01.11.14 - override stripTogetherWithTheirContents to an empty array"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<     b   /    >d", {
      stripTogetherWithTheirContents: false
    }),
    "a c d",
    "01.11.15 - override stripTogetherWithTheirContents to an empty array"
  );
  t.deepEqual(
    stripHtml("a<    b    >c<   //  <  b   // >   >d", {
      stripTogetherWithTheirContents: "b"
    }),
    "a d",
    "01.11.16 - opts.stripTogetherWithTheirContents is not array but string"
  );
  t.deepEqual(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: "b"
      }
    ),
    "a d",
    "01.11.17"
  );
  t.deepEqual(
    stripHtml("a<    b    >c", {
      stripTogetherWithTheirContents: ["e", "b"]
    }),
    "a c",
    "01.11.18 - single custom range tag"
  );
  t.throws(() => {
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: ["zzz", true, "b"]
      }
    );
  });
});

test("01.12 - sequence of empty <>", t => {
  t.deepEqual(stripHtml("<>"), "<>", "01.12.01");
  t.deepEqual(stripHtml("<><>"), "<><>", "01.12.02");
  t.deepEqual(stripHtml("a<><>b"), "a<><>b", "01.12.03");
  t.deepEqual(stripHtml("\na<><>b\n"), "a<><>b", "01.12.04 - just trimmed");
});

test("01.13 - brackets used for expressive purposes (very very suspicious but possible)", t => {
  // won't remove
  t.deepEqual(
    stripHtml("text <<<<<<<<<<< text"),
    "text <<<<<<<<<<< text",
    "01.13.01"
  );
  t.deepEqual(
    stripHtml("text <<<<<<<<<<< text <<<<<<<<<<< text"),
    "text <<<<<<<<<<< text <<<<<<<<<<< text",
    "01.13.02"
  );
  t.deepEqual(
    stripHtml("<article> text <<<<<<<<<<< text </article>"),
    "text <<<<<<<<<<< text",
    "01.13.03"
  );

  // will not remove
  t.deepEqual(
    stripHtml("text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3"),
    "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3",
    "01.13.04"
  );
  t.deepEqual(
    stripHtml("<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>"),
    "text1 <<<<<<<<<<< text2 >>>>>>>>> text3",
    "01.13.05"
  );
});

test("01.14 - multiple ranged tags are removed correctly", t => {
  t.deepEqual(
    stripHtml(
      "code here and here <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more <style>zzz</style> and also some here <script>yyy\nyyyyy</script> and finally here some more"
    ),
    "code here and here and also some here and finally here some more and also some here and finally here some more and also some here and finally here some more",
    "01.14.01 - with text in between"
  );
  t.deepEqual(
    stripHtml(
      "code here and here <style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script><style>zzz</style><script>yyy\nyyyyy</script> and finally here some more"
    ),
    "code here and here and finally here some more",
    "01.14.02 - tags touching each other"
  );
});

test("01.15 - slashes around tags that include slashes", t => {
  t.deepEqual(
    stripHtml(
      "///</a>///<a/>///</ a>///< /a></ a>///< /a>///</ a />///</a/>///< / a / >///"
    ),
    "/// /// /// /// /// /// /// /// ///",
    "01.15.01 - lots of dodgy slashes around and within tags"
  );
  t.deepEqual(
    stripHtml(
      "///<///a>///<a/////>///<//// a>///< ///a><// a>///< ///a>///<// a //>///<///a///>///< //// a //// >///"
    ),
    "/// /// /// /// /// /// /// /// ///",
    "01.15.02 - this time repeated slashes inside"
  );

  // line breaks within tag doesn't count - the new line breaks should not be introduced!
  t.deepEqual(
    stripHtml(
      "///</\n/\n/\ta>///<a\n///\n//\t>///<\n////\t a>///< /\n//\na><// \ta>///<\n\n\n\n ///a>///<\t\t\t\t// \n\n\na //>///<\n\n\n///a\n///\n>///<\n //// \na\n //// \n>///"
    ),
    "/// /// /// /// /// /// /// /// ///",
    "01.15.03 - and the same but with bunch of line breaks and tabs"
  );
});

test("01.16 - exclamation marks around tags that include slashes", t => {
  t.deepEqual(
    stripHtml(
      "!!!<!a>!!!<a!>!!!<! a>!!!< !a><! a>!!!< !a>!!!<! a !>!!!<!a!>!!!< ! a ! >!!!"
    ),
    "!!! !!! !!! !!! !!! !!! !!! !!! !!!",
    "01.16.01 - lots of dodgy exclamation marks around and within tags"
  );
  t.deepEqual(
    stripHtml(
      "!!!<!!!a>!!!<a!!!!!>!!!<!!!! a>!!!< !!!a><!! a>!!!< !!!a>!!!<!! a !!>!!!<!!!a!!!>!!!< !!!! a !!!! >!!!"
    ),
    "!!! !!! !!! !!! !!! !!! !!! !!! !!!",
    "01.16.02 - this time repeated exclamation marks inside"
  );
  t.deepEqual(
    stripHtml(
      "!!!<!\n!\n!\ta>!!!<a\n!!!\n!!\t>!!!<\n!!!!\t a>!!!< !\n!!\na><!! \ta>!!!<\n\n\n\n !!!a>!!!<\t\t\t\t!! \n\n\na !!>!!!<\n\n\n!!!a\n!!!\n>!!!<\n !!!! \na\n !!!! \n>!!!"
    ),
    "!!! !!! !!! !!! !!! !!! !!! !!! !!!",
    "01.16.03 - and the same but with bunch of line breaks and tabs"
  );
});

test("01.17 - only line breaks around tags cause line break to be used as a separator - not line breaks within tag", t => {
  t.deepEqual(
    stripHtml("something <a> \n\n to <a> put here to test"),
    "something\nto put here to test",
    "01.17.01"
  );
  t.deepEqual(
    stripHtml("something <a\n\n>  to <a> put here to test"),
    "something to put here to test",
    "01.17.02"
  );
  t.deepEqual(
    stripHtml("something <\n\na>  to <a> put here to test"),
    "something to put here to test",
    "01.17.03"
  );
  t.deepEqual(
    stripHtml("something <a>  to <a\n\n> put here to test"),
    "something to put here to test",
    "01.17.04"
  );
  t.deepEqual(
    stripHtml("something <a>  to <\n\na> put here to test"),
    "something to put here to test",
    "01.17.05"
  );
  t.deepEqual(
    stripHtml("something <\t\na\n>  to <a\n\n> put here to test"),
    "something to put here to test",
    "01.17.06"
  );
  t.deepEqual(
    stripHtml("something <\n\na\t>\t\t\t\t\t  to \t<\n\na\t> put here to test"),
    "something to put here to test",
    "01.17.07 - even this"
  );
});

test("01.18 - dirty code - missing closing brackets", t => {
  t.deepEqual(
    stripHtml("<body>text<script>zzz</script</body>"),
    "text",
    "01.18.01 - missing closing bracket"
  );
  t.deepEqual(
    stripHtml(" < body > text < script > zzz <    /    script < / body >"),
    "text",
    "01.18.02 - with more whitespace"
  );
  t.deepEqual(
    stripHtml("<body>text<script"),
    "text",
    "01.18.03 - missing closing bracket"
  );
  t.deepEqual(stripHtml("<script>text<script"), "", "01.18.04");
  t.deepEqual(stripHtml("<a>text<a"), "text", "01.18.05");
  t.deepEqual(stripHtml("<a>text<a<a"), "text", "01.18.06");
});

test("01.19 - dirty code - missing closing brackets + line breaks", t => {
  t.deepEqual(
    stripHtml("<body>text<script>\nzzz\n<script</body>"),
    "text",
    "01.19.01 - closing slash and bracket of a range tag"
  );
  t.deepEqual(
    stripHtml("< body > text < script >\nzzz\n< script < / body >"),
    "text",
    "01.19.02 - with lots whitespace everywhere"
  );
});

test("01.20 - dirty code - missing opening bracket, but recognised tag name", t => {
  t.deepEqual(stripHtml("body>zzz</body>"), "zzz", "01.20.01");
  t.deepEqual(stripHtml("body >zzz</body>"), "zzz", "01.20.02");
  t.deepEqual(stripHtml("body/>zzz</body>"), "zzz", "01.20.03");
  t.deepEqual(stripHtml("body />zzz</body>"), "zzz", "01.20.04");
  t.deepEqual(stripHtml("body / >zzz</body>"), "zzz", "01.20.05");
  t.deepEqual(
    stripHtml('<body>\narticle class="main" / >zzz</article>\n</body>'),
    "zzz",
    "01.20.06"
  );
  t.deepEqual(stripHtml("tralala>zzz</body>"), "tralala>zzz", "01.20.07");
  t.deepEqual(stripHtml("BODY>zzz</BODY>"), "zzz", "01.20.08");
  t.deepEqual(stripHtml("tralala>zzz</BODY>"), "tralala>zzz", "01.20.09");
});

test("01.21 - dirty code - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything=>b"), "a b", "01.21.01");
  t.deepEqual(stripHtml("a<article anything= >b"), "a b", "01.21.02");
  t.deepEqual(stripHtml("a<article anything=/>b"), "a b", "01.21.03");
  t.deepEqual(stripHtml("a<article anything= />b"), "a b", "01.21.04");
  t.deepEqual(stripHtml("a<article anything=/ >b"), "a b", "01.21.05");
  t.deepEqual(stripHtml("a<article anything= / >b"), "a b", "01.21.06");
  t.deepEqual(stripHtml("a<article anything= / >b"), "a b", "01.21.07");
  t.deepEqual(stripHtml("a<article anything=  / >b"), "a b", "01.21.08");
});

test("01.22 - dirty code - multiple incomplete attributes", t => {
  t.deepEqual(stripHtml("a<article anything= whatever=>b"), "a b", "01.22.01");
  t.deepEqual(stripHtml("a<article anything= whatever=/>b"), "a b", "01.22.02");
  t.deepEqual(stripHtml("a<article anything= whatever= >b"), "a b", "01.22.03");
  t.deepEqual(
    stripHtml("a<article anything= whatever= />b"),
    "a b",
    "01.22.04"
  );
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala">b'),
    "a b",
    "01.22.05 - a mix thereof"
  );
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"/>b'),
    "a b",
    "01.22.06 - a mix thereof"
  );
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" />b'),
    "a b",
    "01.22.07 - a mix thereof"
  );
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" / >b'),
    "a b",
    "01.22.08 - a mix thereof"
  );
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"  /  >b'),
    "a b",
    "01.22.09 - a mix thereof"
  );
  t.deepEqual(
    stripHtml('a <article anything= class="zz" whatever= id="lalala"  /  > b'),
    "a b",
    "01.22.10 - a mix thereof"
  );
  t.deepEqual(
    stripHtml(
      'a <article anything = class="zz" whatever = id="lalala"  /  > b'
    ),
    "a b",
    "01.22.11 - a mix thereof"
  );
});

test("01.23 - dirty code - tag name, equals and end of a tag", t => {
  // html
  t.deepEqual(stripHtml("a<article=>b"), "a b", "01.23.01");
  t.deepEqual(stripHtml("a<article =>b"), "a b", "01.23.02");
  t.deepEqual(stripHtml("a<article= >b"), "a b", "01.23.03");
  t.deepEqual(stripHtml("a<article = >b"), "a b", "01.23.04");

  // xhtml without space between the slash and closing tag
  t.deepEqual(stripHtml("a<article=/>b"), "a b", "01.23.05");
  t.deepEqual(stripHtml("a<article =/>b"), "a b", "01.23.06");
  t.deepEqual(stripHtml("a<article= />b"), "a b", "01.23.07");
  t.deepEqual(stripHtml("a<article = />b"), "a b", "01.23.08");

  // xhtml with space after the closing slash
  t.deepEqual(stripHtml("a<article=/ >b"), "a b", "01.23.09");
  t.deepEqual(stripHtml("a<article =/ >b"), "a b", "01.23.10");
  t.deepEqual(stripHtml("a<article= / >b"), "a b", "01.23.11");
  t.deepEqual(stripHtml("a<article = / >b"), "a b", "01.23.12");
});

test("01.24 - dirty code - multiple equals after attribute's name", t => {
  // 1. consecutive equals
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class =="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.24.01"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class =="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.24.02"
  );

  // 2. consecutive equals with space
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class = ="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.24.03"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class = ="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.24.04"
  );

  // 3. consecutive equals with more spaces in between
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class = = "zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.24.05"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class = = "zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.24.06"
  );

  // 4. consecutive equals, following attribute's name tightly
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class= = "zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.24.07"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class= = "zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.24.08"
  );

  // 5. consecutive equals, tight
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class=="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.24.09"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class=="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.24.10"
  );
});

test("01.25 - dirty code - multiple quotes in the attributes", t => {
  //
  // 1. double, opening only
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.25.01"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.25.02"
  );

  // 2. double, closing
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.25.03"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.25.04"
  );

  // 3. double, both closing and opening
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class=""zzzz"">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.25.05"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class=""zzzz"">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.25.06"
  );

  // 4. single, opening only
  // normal tag:
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "01.25.07"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.25.08"
  );

  // 5. single, closing
  // normal tag:
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "01.25.09"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.25.10"
  );

  // 6. single, both closing and opening
  // normal tag:
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz''>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "01.25.11"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz''>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.25.12"
  );

  // 7. mix of messed up equals and repeated quotes
  // normal tag:
  t.deepEqual(
    stripHtml("aaaaaaa<div class= ==''zzzz''>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "01.25.13"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml("aaaaaaa<script class = ==''zzzz''>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.25.14"
  );

  // 8. mismatching quotes only
  // normal tag:
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz\"\">x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "01.25.15"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz\"\">x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.25.16"
  );

  // 9. crazy messed up
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " ">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.25.17"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " ">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.25.18"
  );

  // 10. even more crazy messed up
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " " /// >x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.25.19"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml(
      'aaaaaaa<script class= ==\'  \'zzzz" " " /// >x</script>bbbbbbbb'
    ),
    "aaaaaaa bbbbbbbb",
    "01.25.20"
  );
});

test("01.26 - dirty code - unclosed attributes", t => {
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class="zzzz>x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.26.01"
  );
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class="zzzz>x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.26.02"
  );
  // single tag:
  t.deepEqual(
    stripHtml('aaaaaaa<br class="zzzz>x<br>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "01.26.02"
  );
});

test("01.27 - dirty code - duplicated consecutive attribute values", t => {
  t.deepEqual(
    stripHtml('aa< br class1="b1" yo1   =   class2 = "b2" yo2 yo3>cc'),
    "aa cc",
    "01.27"
  );
});

test("01.28 - dirty code - space after bracket, multiple attrs, no equals", t => {
  t.deepEqual(stripHtml("aa< br a b >cc"), "aa< br a b >cc", "01.28.01");
  t.deepEqual(stripHtml("aa < br a b >cc"), "aa < br a b >cc", "01.28.02");
  t.deepEqual(stripHtml("aa< br a b > cc"), "aa< br a b > cc", "01.28.03");
  t.deepEqual(stripHtml("aa < br a b > cc"), "aa < br a b > cc", "01.28.04");
  t.deepEqual(
    stripHtml("aa  < br a b >  cc"),
    "aa  < br a b >  cc",
    "01.28.05"
  );
});

test("01.30 - dirty code - various, #1", t => {
  t.deepEqual(stripHtml('aa< br a b=" >cc'), "aa cc", "01.30.01");
  t.deepEqual(stripHtml('aa< br a b= " >cc'), "aa cc", "01.30.02");
  t.deepEqual(stripHtml('aa< br a b =" >cc'), "aa cc", "01.30.03");
  t.deepEqual(stripHtml('aa< br a b = " >cc'), "aa cc", "01.30.04");

  // xhtml
  t.deepEqual(stripHtml('aa< br a b=" />cc'), "aa cc", "01.30.05");
  t.deepEqual(stripHtml('aa< br a b= " />cc'), "aa cc", "01.30.06");
  t.deepEqual(stripHtml('aa< br a b =" />cc'), "aa cc", "01.30.07");
  t.deepEqual(stripHtml('aa< br a b = " />cc'), "aa cc", "01.30.08");

  t.deepEqual(stripHtml('aa< br a b=" / >cc'), "aa cc", "01.30.09");
  t.deepEqual(stripHtml('aa< br a b= " / >cc'), "aa cc", "01.30.10");
  t.deepEqual(stripHtml('aa< br a b =" / >cc'), "aa cc", "01.30.11");
  t.deepEqual(stripHtml('aa< br a b = " / >cc'), "aa cc", "01.30.12");

  t.deepEqual(stripHtml('aa< br a b=" // >cc'), "aa cc", "01.30.13");
  t.deepEqual(stripHtml('aa< br a b= " // >cc'), "aa cc", "01.30.14");
  t.deepEqual(stripHtml('aa< br a b =" // >cc'), "aa cc", "01.30.15");
  t.deepEqual(stripHtml('aa< br a b = " // >cc'), "aa cc", "01.30.16");
});

test("01.31 - CDATA", t => {
  // surroundings are not a linebreaks
  t.deepEqual(
    stripHtml(`a<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>b`),
    "a b",
    "01.31.01 - tight"
  );
  t.deepEqual(
    stripHtml(`a <![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]> b`),
    "a b",
    "01.31.02 - normal"
  );
  t.deepEqual(
    stripHtml(`a \t\t<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>       b`),
    "a b",
    "01.31.03 - loose"
  );

  // surroundings are linebreaks
  t.deepEqual(
    stripHtml(`a\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\nb`),
    "a\nb",
    "01.31.04 - single linebreaks"
  );
  t.deepEqual(
    stripHtml(`a\n\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\nb`),
    "a\nb",
    "01.31.05 - excessive linebreaks"
  );
  t.deepEqual(
    stripHtml(`a\n \t\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\n\t b`),
    "a\nb",
    "01.31.06 - mixed linebreaks"
  );
});

// ==============================
// XML (sprinkled within HTML)
// ==============================

test("02.01 - strips XML", t => {
  t.deepEqual(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    "abc def",
    "02.01.01"
  );
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    "abc def",
    "02.01.02"
  );
  t.deepEqual(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
    "abc def",
    "02.01.03"
  );
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
    "abc def",
    "02.01.04"
  );
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`),
    "abc\ndef",
    "02.01.05"
  );
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `),
    "abc",
    "02.01.06"
  );
  t.deepEqual(
    stripHtml(`abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `),
    "abc",
    "02.01.07"
  );
  t.deepEqual(
    stripHtml(`      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`),
    "abc",
    "02.01.08"
  );
});

// ==============================
// false positives
// ==============================

test("03.01 - very sneaky considering b is a legit tag name", t => {
  t.deepEqual(
    stripHtml("Equations are: a < b and c > d"),
    "Equations are: a < b and c > d",
    "03.01"
  );
});

test("03.02 - arrows", t => {
  t.deepEqual(
    stripHtml("Look here: ---> a <---"),
    "Look here: ---> a <---",
    "03.02.01"
  );
  t.deepEqual(
    stripHtml(
      "Look here: ---> a <--- and here: ---> b <--- oh, and few tags: <div><article>\nzz</article></div>"
    ),
    "Look here: ---> a <--- and here: ---> b <--- oh, and few tags:\nzz",
    "03.02.02"
  );
});

test("03.03 - incomplete tag", t => {
  t.deepEqual(stripHtml("<"), "<", "03.03.01");
  t.deepEqual(stripHtml(">"), ">", "03.03.02");
  t.deepEqual(stripHtml(">>>"), ">>>", "03.03.03");
  t.deepEqual(stripHtml("<<<"), "<<<", "03.03.04");
  t.deepEqual(stripHtml(" <<< "), "<<<", "03.03.05");
  t.deepEqual(stripHtml("<a"), "", "03.03.06");
  t.deepEqual(stripHtml("<yo"), "", "03.03.07");
  t.deepEqual(stripHtml("a>"), "a>", "03.03.08");
  t.deepEqual(stripHtml("yo>"), "yo>", "03.03.09");
});

test("03.04 - conditionals that appear on Outlook only", t => {
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
    "03.04"
  );
});

test("03.05 - conditionals that are visible for Outlook only", t => {
  t.deepEqual(
    stripHtml(`<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->`),
    "shown for everything except Outlook",
    "03.05.01 - checking also for whitespace control"
  );
  t.deepEqual(
    stripHtml(`a<!--[if !mso]><!-->
  shown for everything except Outlook
  <!--<![endif]-->b`),
    "a\nshown for everything except Outlook\nb",
    "03.05.02 - checking also for whitespace control"
  );
  t.deepEqual(
    stripHtml(`<!--[if !mso]><!--><table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        shown for everything except Outlook
      </td>
    </tr>
  </table><!--<![endif]-->`),
    "shown for everything except Outlook",
    "03.05.03 - all those line breaks in-between the tags need to be taken care of too"
  );
});

test("03.06 - consecutive tags", t => {
  t.deepEqual(
    stripHtml(
      "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after"
    ),
    "Text First point Second point Third point Text straight after",
    "03.06"
  );
});

// ==============================
// 04. opts.ignoreTags
// ==============================

test("04.01 - opts.ignoreTags", t => {
  t.deepEqual(
    stripHtml("Some <b>text</b> and some more <i>text</i>.", {
      ignoreTags: ["b"]
    }),
    "Some <b>text</b> and some more text.",
    "04.01.01 - ignores single letter tag"
  );
  t.deepEqual(
    stripHtml("Some text <hr> some more <i>text</i>.", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr> some more text.",
    "04.01.02 - ignores singleton tag"
  );
  t.deepEqual(
    stripHtml("Some text <hr/> some more <i>text</i>.", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr/> some more text.",
    "04.01.03 - ignores singleton tag"
  );
  t.deepEqual(
    stripHtml("Some text <hr / > some more <i>text</i>.", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr / > some more text.",
    "04.01.04 - ignores singleton tag"
  );
  t.deepEqual(
    stripHtml("Some <zzz>text</zzz> and some more <i>text</i>.", {
      ignoreTags: ["zzz"]
    }),
    "Some <zzz>text</zzz> and some more text.",
    "04.01.05 - ignores single zzz tag"
  );
  t.deepEqual(
    stripHtml("Some text <zzz> some more <i>text</i>.", {
      ignoreTags: ["zzz"]
    }),
    "Some text <zzz> some more text.",
    "04.01.06 - ignores zzz singleton tag"
  );
  t.deepEqual(
    stripHtml("Some <script>text</script> and some more <i>text</i>.", {
      ignoreTags: ["script"]
    }),
    "Some <script>text</script> and some more text.",
    "04.01.07 - ignores default ranged tag"
  );
});

test("04.02 - opts.ignoreTags", t => {
  // just for kicks: ignored tag unclosed, ending with EOF
  t.deepEqual(
    stripHtml("Some <b>text</b", {
      ignoreTags: ["b"]
    }),
    "Some <b>text</b",
    "04.02.01 - if user insists, that missing bracket must be intentional"
  );
  t.deepEqual(
    stripHtml("Some text <hr", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr",
    "04.02.02 - recognised unclosed singleton tag"
  );
  t.deepEqual(
    stripHtml("Some text <hr/", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr/",
    "04.02.03"
  );
  t.deepEqual(
    stripHtml("Some text <hr / ", {
      ignoreTags: ["hr"]
    }),
    "Some text <hr /",
    "04.02.04 - kept the tag and the slash, just trimmed"
  );
  t.deepEqual(
    stripHtml("Some <zzz>text</zzz", {
      ignoreTags: ["zzz"]
    }),
    "Some <zzz>text</zzz",
    "04.02.05 - ignores unclosed single zzz tag"
  );
  t.deepEqual(
    stripHtml("Some text <zzz", {
      ignoreTags: ["zzz"]
    }),
    "Some text <zzz",
    "04.02.06 - ignores unclosed zzz singleton tag"
  );
  t.deepEqual(
    stripHtml("Some <script>text</script", {
      ignoreTags: ["script"]
    }),
    "Some <script>text</script",
    "04.02.07 - ignores default unclosed ranged tag"
  );
});

// ==============================
// 05. whitespace control
// ==============================

test("05.01 - adds a space", t => {
  t.deepEqual(stripHtml("a<div>b</div>c"), "a b c", "05.01.01");
  t.deepEqual(
    stripHtml("a <div>   b    </div>    c"),
    "a b c",
    "05.01.02 - stays on one line because it was on one line"
  );
  t.deepEqual(
    stripHtml("\t\t\ta <div>   b    </div>    c\n\n\n"),
    "a b c",
    "05.01.03 - like 02 above but with trimming"
  );
});

test("05.02 - adds a linebreak between each substring piece", t => {
  t.deepEqual(
    stripHtml(`a


  <div>
    b
  </div>
c`),
    "a\nb\nc",
    "05.02"
  );
});

test("05.03 - multiple tag combo case #1", t => {
  t.deepEqual(stripHtml("z<a><b>c</b></a>y"), "z c y", "05.03.01");
  t.deepEqual(
    stripHtml(`
      z
        <a>
          <b class="something anything">
            c
          </b>
        </a>
      y`),
    "z\nc\ny",
    "05.03.02"
  );
});

// ==============================
// 06. comments
// ==============================

test("06.01 - strips HTML comments", t => {
  // group #1. spaces on both outsides
  t.deepEqual(
    stripHtml("aaa <!-- <tr> --> bbb"),
    "aaa bbb",
    "06.01.01 - double space"
  );
  t.deepEqual(
    stripHtml("aaa <!-- <tr>--> bbb"),
    "aaa bbb",
    "06.01.02 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr> --> bbb"),
    "aaa bbb",
    "06.01.03 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr>--> bbb"),
    "aaa bbb",
    "06.01.04 - no space"
  );

  // group #2. spaces on right only
  t.deepEqual(
    stripHtml("aaa<!-- <tr> --> bbb"),
    "aaa bbb",
    "06.01.05 - double space"
  );
  t.deepEqual(
    stripHtml("aaa<!-- <tr>--> bbb"),
    "aaa bbb",
    "06.01.06 - single space"
  );
  t.deepEqual(
    stripHtml("aaa<!--<tr> --> bbb"),
    "aaa bbb",
    "06.01.07 - single space"
  );
  t.deepEqual(
    stripHtml("aaa<!--<tr>--> bbb"),
    "aaa bbb",
    "06.01.08 - no space"
  );

  // group #3. spaces on left only
  t.deepEqual(
    stripHtml("aaa <!-- <tr> -->bbb"),
    "aaa bbb",
    "06.01.09 - double space"
  );
  t.deepEqual(
    stripHtml("aaa <!-- <tr>-->bbb"),
    "aaa bbb",
    "06.01.10 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr> -->bbb"),
    "aaa bbb",
    "06.01.11 - single space"
  );
  t.deepEqual(
    stripHtml("aaa <!--<tr>-->bbb"),
    "aaa bbb",
    "06.01.12 - no space"
  );

  // group #4. no spaces outside
  t.deepEqual(
    stripHtml("aaa<!-- <tr> -->bbb"),
    "aaa bbb",
    "06.01.13 - double space"
  );
  t.deepEqual(
    stripHtml("aaa<!-- <tr>-->bbb"),
    "aaa bbb",
    "06.01.14 - single space"
  );
  t.deepEqual(
    stripHtml("aaa<!--<tr> -->bbb"),
    "aaa bbb",
    "06.01.15 - single space"
  );
  t.deepEqual(stripHtml("aaa<!--<tr>-->bbb"), "aaa bbb", "06.01.16 - no space");
});

test("06.02 - HTML comments around string edges", t => {
  t.deepEqual(stripHtml("aaa <!-- <tr> --> "), "aaa", "06.02.01");
  t.deepEqual(stripHtml("aaa <!-- <tr> -->"), "aaa", "06.02.02");

  t.deepEqual(stripHtml(" <!-- <tr> --> aaa"), "aaa", "06.02.03");
  t.deepEqual(stripHtml("<!-- <tr> -->aaa"), "aaa", "06.02.04");

  t.deepEqual(stripHtml(" <!-- <tr> --> aaa <!-- <tr> -->"), "aaa", "06.02.05");
  t.deepEqual(stripHtml("<!-- <tr> -->aaa<!-- <tr> -->"), "aaa", "06.02.06");
  t.deepEqual(
    stripHtml("   <!-- <tr> -->aaa<!-- <tr> -->   "),
    "aaa",
    "06.02.07"
  );
});

test("06.03 - range tag is unclosed", t => {
  // no content besides ranged tag:
  t.deepEqual(stripHtml('<script>alert("123")</script'), "", "06.03.01");
  t.deepEqual(stripHtml("<script>alert('123')</script"), "", "06.03.02");
  t.deepEqual(stripHtml('<script>alert("123")<script'), "", "06.03.03");
  t.deepEqual(stripHtml("<script>alert('123')<script"), "", "06.03.04");
  t.deepEqual(stripHtml('<script>alert("123")</ script'), "", "06.03.05");
  t.deepEqual(stripHtml("<script>alert('123')</ script"), "", "06.03.06");

  // single letter left:
  t.deepEqual(stripHtml('a<script>alert("123")</script'), "a", "06.03.07");
  t.deepEqual(stripHtml("a<script>alert('123')</script"), "a", "06.03.08");
  t.deepEqual(stripHtml('a<script>alert("123")<script'), "a", "06.03.09");
  t.deepEqual(stripHtml("a<script>alert('123')<script"), "a", "06.03.10");
  t.deepEqual(stripHtml('a<script>alert("123")</ script'), "a", "06.03.11");
  t.deepEqual(stripHtml("a<script>alert('123')</ script"), "a", "06.03.12");

  // script excluded from ranged tags, so now only tags are removed, no contents between:
  t.deepEqual(
    stripHtml('a<script>alert("123")</script', {
      stripTogetherWithTheirContents: []
    }),
    'a alert("123")',
    "06.03.13"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</script", {
      stripTogetherWithTheirContents: []
    }),
    "a alert('123')",
    "06.03.14"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")<script', {
      stripTogetherWithTheirContents: []
    }),
    'a alert("123")',
    "06.03.15"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')<script", {
      stripTogetherWithTheirContents: []
    }),
    "a alert('123')",
    "06.03.16"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")</ script', {
      stripTogetherWithTheirContents: []
    }),
    'a alert("123")',
    "06.03.17"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</ script", {
      stripTogetherWithTheirContents: []
    }),
    "a alert('123')",
    "06.03.18"
  );

  // script tag ignored and left intact (opts.ignoreTags):
  t.deepEqual(
    stripHtml('a<script>alert("123")</script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</script',
    "06.03.19"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</script",
    "06.03.20"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")<script', { ignoreTags: ["script"] }),
    'a<script>alert("123")<script',
    "06.03.21"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')<script", { ignoreTags: ["script"] }),
    "a<script>alert('123')<script",
    "06.03.22"
  );
  t.deepEqual(
    stripHtml('a<script>alert("123")</ script', { ignoreTags: ["script"] }),
    'a<script>alert("123")</ script',
    "06.03.23"
  );
  t.deepEqual(
    stripHtml("a<script>alert('123')</ script", { ignoreTags: ["script"] }),
    "a<script>alert('123')</ script",
    "06.03.24"
  );
});

test("06.04 - false positives #1 - Nunjucks code", t => {
  t.deepEqual(stripHtml("a< 2zzz==>b"), "a< 2zzz==>b", "06.04.01");
});

test("06.05 - unclosed tag followed by another tag", t => {
  // range tag:
  t.deepEqual(stripHtml('<script>alert("123")</script<body>'), "", "06.05.01");
  t.deepEqual(stripHtml('<script>alert("123")</script</body>'), "", "06.05.02");
  t.deepEqual(
    stripHtml('<script>alert("123")</script</ body>'),
    "",
    "06.05.03"
  );
  t.deepEqual(stripHtml('<script>alert("123")</script<body/>'), "", "06.05.04");
  t.deepEqual(stripHtml('<script>alert("123")</script<body'), "", "06.05.05");

  // non-range tag:
  t.deepEqual(
    stripHtml("<article>text here</article<body>"),
    "text here",
    "06.05.06"
  );
  t.deepEqual(
    stripHtml("<article>text here</article</body>"),
    "text here",
    "06.05.07"
  );
  t.deepEqual(
    stripHtml("<article>text here</article</ body>"),
    "text here",
    "06.05.08"
  );
  t.deepEqual(
    stripHtml("<article>text here</article<body/>"),
    "text here",
    "06.05.09"
  );
  t.deepEqual(
    stripHtml("<article>text here</article<body"),
    "text here",
    "06.05.10"
  );

  // many tags:
  t.deepEqual(
    stripHtml("a<something<anything<whatever<body<html"),
    "a",
    "06.05.11 - strips the tags"
  );
  t.deepEqual(
    stripHtml("a < something < anything < whatever < body < html"),
    "a < something < anything < whatever < body < html",
    "06.05.12 - bails because of spaces"
  );
});

test("06.06 - range tags are overlapping", t => {
  // both default known range tags
  t.deepEqual(
    stripHtml("<script>tra la <style>la</script>la la</style> rr"),
    "rr",
    "06.06.01"
  );

  // both were just custom-set
  t.deepEqual(
    stripHtml("<zzz>tra la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"]
    }),
    "rr",
    "06.06.02"
  );
  t.deepEqual(
    stripHtml("<zzz>tra <script>la</script> la <yyy>la</zzz>la la</yyy> rr", {
      stripTogetherWithTheirContents: ["zzz", "yyy"]
    }),
    "rr",
    "06.06.03"
  );
});

// ==============================
// throws
// ==============================

test("99.01 - missing/wrong type input args", t => {
  t.throws(() => {
    stripHtml();
  });
  t.throws(() => {
    stripHtml(null);
  });
  t.throws(() => {
    stripHtml(1);
  });
  t.throws(() => {
    stripHtml(undefined);
  });
  t.throws(() => {
    stripHtml(true);
  });
  t.notThrows(() => {
    stripHtml("");
  });
  t.notThrows(() => {
    stripHtml("zzz");
  });
  // opts:
  t.throws(() => {
    stripHtml("zzz", "aaa");
  });
  t.throws(() => {
    stripHtml("zzz", 1);
  });
  t.throws(() => {
    stripHtml("zzz", true);
  });
});

test("99.02 - rogue keys in opts", t => {
  t.throws(() => {
    stripHtml("aaa", { zzz: true });
  });
});

test("99.03 - non-string among whole tags to delete", t => {
  t.throws(() => {
    stripHtml("aaa", { stripTogetherWithTheirContents: true });
  });
  t.throws(() => {
    stripHtml("aaa", { stripTogetherWithTheirContents: [true] });
  });
  t.throws(() => {
    stripHtml("aaa", { stripTogetherWithTheirContents: ["style", 1, null] });
  });
});
