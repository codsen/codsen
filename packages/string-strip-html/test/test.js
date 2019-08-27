import test from "ava";
import stripHtml from "../dist/string-strip-html.esm";

// ==============================
// normal use cases
// ==============================

test("01.01 - string is whole (opening) tag", t => {
  // 01.01.01.01-03:
  t.deepEqual(stripHtml("<a>"), "", "01.01.01.01");
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: ["b"]
    }),
    "",
    "01.01.01.02"
  );
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: ["a"]
    }),
    "<a>",
    "01.01.01.03"
  );

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
      "zzz<!a>zzz<a!>zzz<! a>zzz< !a><! a>zzz< !a>zzz<! a !>zzz<!a!>zzz< ! a ! >zzz"
    ),
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "01.16.01 - lots of dodgy exclamation marks around and within tags"
  );
  t.deepEqual(
    stripHtml(
      "zzz<!!!a>zzz<a!!!!!>zzz<!!!! a>zzz< !!!a><!! a>zzz< !!!a>zzz<!! a !!>zzz<!!!a!!!>zzz< !!!! a !!!! >zzz"
    ),
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
    "01.16.02 - this time repeated exclamation marks inside"
  );
  t.deepEqual(
    stripHtml(
      "zzz<!\n!\n!\ta>zzz<a\n!!!\n!!\t>zzz<\n!!!!\t a>zzz< !\n!!\na><!! \ta>zzz<\n\n\n\n !!!a>zzz<\t\t\t\t!! \n\n\na !!>zzz<\n\n\n!!!a\n!!!\n>zzz<\n !!!! \na\n !!!! \n>zzz"
    ),
    "zzz zzz zzz zzz zzz zzz zzz zzz zzz",
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
    "01.26.03"
  );

  t.deepEqual(
    stripHtml('aaaaaaa<br class="zzzz <br>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.26.04"
  );
  t.deepEqual(
    stripHtml('aaaaaaa<br class="zzzz" <br>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "01.26.05"
  );
  t.deepEqual(
    stripHtml("aaaaaaa<br class<br>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.26.06"
  );
  t.deepEqual(
    stripHtml("aaaaaaa<br class!<br>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "01.26.07"
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

test("01.31 - dirty code - various, #2", t => {
  t.deepEqual(
    stripHtml(
      '<div><article class="main" id=="something">text</article></div>'
    ),
    "text",
    "01.31.01"
  );
});

test("01.32 - dirty code - various, #3 - suddenly cut off healthy HTML", t => {
  t.deepEqual(
    stripHtml(
      `la <b>la</b> la<table><tr>
<td><a href="http://codsen.com" target="_blank"><img src="http://cdn.codsen.com/nonexistent.gif" width="11" height="22" border="0" style="display:block; -ms-interpolation-mode:bicubic; color: #ffffff; font-style: it`
    ),
    "la la la",
    "01.32.01 - HTML cut off in the middle of an inline CSS style"
  );
});

test("01.33 - CDATA", t => {
  // surroundings are not a linebreaks
  t.deepEqual(
    stripHtml(`a<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>b`),
    "a b",
    "01.33.01 - tight"
  );
  t.deepEqual(
    stripHtml(`a <![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]> b`),
    "a b",
    "01.33.02 - normal"
  );
  t.deepEqual(
    stripHtml(`a \t\t<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>       b`),
    "a b",
    "01.33.03 - loose"
  );

  // surroundings are linebreaks
  t.deepEqual(
    stripHtml(`a\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\nb`),
    "a\nb",
    "01.33.04 - single linebreaks"
  );
  t.deepEqual(
    stripHtml(`a\n\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\nb`),
    "a\nb",
    "01.33.05 - excessive linebreaks"
  );
  t.deepEqual(
    stripHtml(`a\n \t\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\n\t b`),
    "a\nb",
    "01.33.06 - mixed linebreaks"
  );
});

test("01.34 - dirty code - unclosed tag followed by a tag", t => {
  // tight
  t.deepEqual(
    stripHtml('111 <br class="zz"<img> 222'),
    "111 222",
    "01.34.01 - HTML"
  );
  t.deepEqual(
    stripHtml('111 <br class="zz"/<img> 222'),
    "111 222",
    "01.34.02 - XHTML"
  );

  // space
  t.deepEqual(
    stripHtml('111 <br class="zz" <img> 222'),
    "111 222",
    "01.34.03 - HTML"
  );
  t.deepEqual(
    stripHtml('111 <br class="zz"/ <img> 222'),
    "111 222",
    "01.34.04 - XHTML"
  );

  // line break
  t.deepEqual(
    stripHtml('111 <br class="zz"\n<img> 222'),
    "111\n222",
    "01.34.05 - HTML"
  );
  t.deepEqual(
    stripHtml('111 <br class="zz"/\n<img> 222'),
    "111\n222",
    "01.34.06 - XHTML"
  );

  // space and line break
  t.deepEqual(
    stripHtml('111 <br class="zz" \n<img> 222'),
    "111\n222",
    "01.34.07 - HTML"
  );
  t.deepEqual(
    stripHtml('111 <br class="zz"/ \n<img> 222'),
    "111\n222",
    "01.34.08 - XHTML"
  );

  // messy
  t.deepEqual(
    stripHtml('111 <br class="zz"\t/ \n<img> 222'),
    "111\n222",
    "01.34.09"
  );
  t.deepEqual(
    stripHtml('111 <br class="zz"\t/\r\n\t \n<img> 222'),
    "111\n222",
    "01.34.10"
  );
  t.deepEqual(stripHtml("111 <a\t/\r\n\t \n<img> 222"), "111\n222", "01.34.11");
  t.deepEqual(stripHtml("111 <a\t/\r\n\t \n<img> 222"), "111\n222", "01.34.12");
});

test("01.35 - punctuation after tag - simplified, question mark", t => {
  t.deepEqual(stripHtml("a<b>?</b> c"), "a? c", "01.35.01");
  t.deepEqual(
    stripHtml("a<b>?</b> c", { trimOnlySpaces: true }),
    "a? c",
    "01.35.02"
  );
  t.deepEqual(
    stripHtml("a<b>?</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a? c",
    "01.35.03"
  );
  t.deepEqual(
    stripHtml("a<b>?</b> c", { stripTogetherWithTheirContents: false }),
    "a? c",
    "01.35.04"
  );
  t.deepEqual(
    stripHtml("a<b>?</b> c", { ignoreTags: ["zzz"] }),
    "a? c",
    "01.35.05"
  );
  t.deepEqual(
    stripHtml("a<b>?</b> c", { returnRangesOnly: true }),
    [[1, 4], [5, 10, " "]],
    "01.35.06"
  );
  t.deepEqual(
    stripHtml("a<b>?</b> c", { ignoreTags: null }),
    "a? c",
    "01.35.07"
  );
});

test("01.36 - punctuation after tag - simplified, exclamation mark", t => {
  t.deepEqual(stripHtml("a<b>!</b> c"), "a! c", "01.36.01");
  t.deepEqual(
    stripHtml("a<b>!</b> c", { trimOnlySpaces: true }),
    "a! c",
    "01.36.02"
  );
  t.deepEqual(
    stripHtml(" \t a<b>!</b> c \t ", { trimOnlySpaces: true }),
    "\t a! c \t",
    "01.36.03"
  );
  t.deepEqual(
    stripHtml("a<b>!</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a! c",
    "01.36.04"
  );
  t.deepEqual(
    stripHtml("a<b>!</b> c", { stripTogetherWithTheirContents: false }),
    "a! c",
    "01.36.05"
  );
  t.deepEqual(
    stripHtml("a<b>!</b> c", { ignoreTags: ["zzz"] }),
    "a! c",
    "01.36.06"
  );
  t.deepEqual(
    stripHtml("a<b>!</b> c", { returnRangesOnly: true }),
    [[1, 4], [5, 10, " "]],
    "01.36.07"
  );

  // also,

  t.deepEqual(stripHtml("a<b>!</b>c"), "a! c", "01.36.08");
});

test("01.37 - punctuation after tag - simplified, ellipsis", t => {
  t.deepEqual(stripHtml("a<b>...</b> c"), "a... c", "01.37.01");
  t.deepEqual(
    stripHtml("a<b>...</b> c", { trimOnlySpaces: true }),
    "a... c",
    "01.37.02"
  );
  t.deepEqual(
    stripHtml("a<b>...</b> c", { dumpLinkHrefsNearby: { enabled: true } }),
    "a... c",
    "01.37.03"
  );
  t.deepEqual(
    stripHtml("a<b>...</b> c", { stripTogetherWithTheirContents: false }),
    "a... c",
    "01.37.04"
  );
  t.deepEqual(
    stripHtml("a<b>...</b> c", { ignoreTags: ["zzz"] }),
    "a... c",
    "01.37.05"
  );
  t.deepEqual(
    stripHtml("a<b>...</b> c", { returnRangesOnly: true }),
    [[1, 4], [7, 12, " "]],
    "01.37.06"
  );
});

test("01.38 - punctuation after tag - real-life", t => {
  // control
  t.deepEqual(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      '
    ),
    "Hi! Would you like to shop now?",
    "01.38.01"
  );
  t.deepEqual(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
    ),
    "Hi! Please shop now!",
    "01.38.02"
  );

  // opts.trimOnlySpaces
  t.deepEqual(
    stripHtml(
      '      &nbsp;     Hi! Would you like to <a href="/">shop now</a>?      &nbsp;      ',
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Would you like to shop now?      \u00A0",
    "01.38.03"
  );
  t.deepEqual(
    stripHtml(
      "      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      ",
      { trimOnlySpaces: true }
    ),
    "\u00A0     Hi! Please shop now!      \u00A0",
    "01.38.04"
  );
});

test("01.39 - opts.ignoreTags edge cases", t => {
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: ["", " ", "a", "b", null]
    }),
    "<a>",
    "01.39.01 - empty string, whitespace string and null in the array"
  );
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: [null]
    }),
    "",
    "01.39.02"
  );
  t.deepEqual(
    stripHtml("<a>", {
      ignoreTags: [null, "a"]
    }),
    "<a>",
    "01.39.03"
  );
  t.deepEqual(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n"]
    }),
    "a",
    "01.39.04"
  );
  t.deepEqual(
    stripHtml("a<a>", {
      ignoreTags: ["\t", "\n\n", "a", " "]
    }),
    "a<a>",
    "01.39.05"
  );
});

test("01.40 - opts.ignoreTags edge cases", t => {
  t.deepEqual(
    stripHtml("<article  whatnot  =  whatyes = >zzz< / article>"),
    "zzz",
    "01.40.01 - space before and after attribute's equal character"
  );
  t.deepEqual(
    stripHtml(
      "<article  whatnot  =  whatyes = >xxx< / article> yyy <article  whatnot  =  whatyes = >zzz< / article>"
    ),
    "xxx yyy zzz",
    "01.40.02 - space before and after attribute's equal character"
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

test("05.04 - dirty html, trailing whitespace", t => {
  t.deepEqual(
    stripHtml("something <article>article>  here"),
    "something here",
    "05.04.01"
  );
  t.deepEqual(
    stripHtml("something <article>article>   here"),
    "something here",
    "05.04.02"
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
// opts.returnRangesOnly
// ==============================

test("07.01 - opts.returnRangesOnly - anchor wrapping text", t => {
  // both default known range tags
  t.deepEqual(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "07.01.01 - default"
  );
  t.deepEqual(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.'
    ),
    "Some text click me and more text.",
    "07.01.02 - hardcoded defaults"
  );
  t.deepEqual(
    stripHtml(
      'Some text <a class="btn btn__large" id="z">click me</a> and more text.',
      { returnRangesOnly: true }
    ),
    [[9, 43, " "], [51, 56, " "]],
    "07.01.03 - opts"
  );
});

test("07.02 - opts.returnRangesOnly - no tags were present at all", t => {
  // t.deepEqual(stripHtml("Some text"), "Some text", "07.02.01 - control");
  t.deepEqual(
    stripHtml("Some text", {
      returnRangesOnly: true
    }),
    [],
    "07.02.02 - returns empty array (no ranges inside)"
  );
});

// ==============================
// opts.trimOnlySpaces
// ==============================

test("08.01 - opts.trimOnlySpaces", t => {
  // unencoded non-breaking spaces - no HTML at all
  t.deepEqual(stripHtml("\xa0 a \xa0"), "a", "08.01.01");
  t.deepEqual(stripHtml(" \xa0 a \xa0 "), "a", "08.01.02");
  t.deepEqual(
    stripHtml("\xa0 a \xa0", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "08.01.03"
  );
  t.deepEqual(
    stripHtml(" \xa0 a \xa0 ", { trimOnlySpaces: true }),
    "\xa0 a \xa0",
    "08.01.04"
  );

  t.deepEqual(stripHtml("\xa0 <article> \xa0"), "", "08.01.05");
  t.deepEqual(
    stripHtml("\xa0 <article> \xa0", { trimOnlySpaces: true }),
    "\xa0\xa0",
    "08.01.06"
  );
  t.deepEqual(
    stripHtml(" \xa0 <article> \xa0 <div> \xa0 ", { trimOnlySpaces: true }),
    "\xa0 \xa0",
    "08.01.07"
  );
  t.deepEqual(stripHtml(" \xa0 <article> \xa0 "), "", "08.01.08");
  t.deepEqual(
    stripHtml(" \xa0 <article> \xa0 ", { trimOnlySpaces: true }),
    "\xa0\xa0",
    "08.01.09"
  );

  //                      various

  // unencoded non-breaking spaces - no HTML at all
  t.deepEqual(stripHtml(" \t a \n "), "a", "08.01.10.01");
  t.deepEqual(
    stripHtml(" \t a \n ", { trimOnlySpaces: true }),
    "\t a \n",
    "08.01.10.02"
  );
  t.deepEqual(
    stripHtml(" \t\n a \r\n ", { trimOnlySpaces: true }),
    "\t\n a \r\n",
    "08.01.11"
  );

  // unencoded non-breaking spaces - no HTML at all
  t.deepEqual(stripHtml("\t\r\n <article> \t\r\n"), "", "08.01.12");
  t.deepEqual(
    stripHtml("\t\r\n <article> \t\r\n", { trimOnlySpaces: true }),
    "\t\r\n\t\r\n",
    "08.01.13"
  );
  t.deepEqual(
    stripHtml(" \t \r \n <article> \t \r \n ", { trimOnlySpaces: true }),
    "\t \r \n\t \r \n",
    "08.01.14"
  );

  //                 combos of tags and whitespace

  t.deepEqual(
    stripHtml(" \n <article> \xa0 <div> \xa0 </article> \t ", {
      trimOnlySpaces: true
    }),
    "\n \t",
    "08.01.15"
  );
  t.deepEqual(
    stripHtml(" \na<article> \xa0 <div> \xa0 </article>b\t ", {
      trimOnlySpaces: true
    }),
    "\na b\t",
    "08.01.16"
  );
  t.deepEqual(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true
    }),
    "\n a b \t",
    "08.01.17"
  );

  t.deepEqual(
    stripHtml(" \n a <article> \xa0 <div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"]
    }),
    "\n a <div> b \t",
    "08.01.18 - opts.ignoreTags combo"
  );
  t.deepEqual(
    stripHtml(" \n a <article> \xa0 < div> \xa0 </article> b \t ", {
      trimOnlySpaces: true,
      ignoreTags: ["div"]
    }),
    "\n a < div> b \t",
    "08.01.19 - opts.ignoreTags combo - plausible but recognised"
  );
});

// ==============================
// opts.dumpLinkHrefsNearby
// ==============================

test("09.01 - opts.dumpLinkHrefsNearby - clean code, double quotes", t => {
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening'
    ),
    "Let's watch RT news this evening",
    "09.01.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "09.01.02 - control, hardcoded default"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "09.01.03 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@thesun.co.uk" target="_blank">The Sun</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "09.01.04 - mailto links without customisation"
  );
  t.deepEqual(
    stripHtml(
      'Here\'s the <a href="mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night" target="_blank">chief editor\'s</a> email.',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "09.01.05 - mailto links with customisation"
  );
});

test("09.02 - opts.dumpLinkHrefsNearby - clean code, single quotes", t => {
  t.deepEqual(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening"
    ),
    "Let's watch RT news this evening",
    "09.02.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "09.02.02 - control, hardcoded default"
  );
  t.deepEqual(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "09.02.03 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      "Let's sell some juicy gossip to the <a href='mailto:gossip@thesun.co.uk' target='_blank'>The Sun</a> right now!",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "09.02.04 - mailto links without customisation"
  );
  t.deepEqual(
    stripHtml(
      "Here's the <a href='mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night' target='_blank'>chief editor's</a> email.",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "09.02.05 - mailto links with customisation"
  );
});

test("09.03 - opts.dumpLinkHrefsNearby - dirty code, HTML is chopped but href captured", t => {
  t.deepEqual(
    stripHtml('Let\'s watch <a href="https://www.rt.com/" targ'),
    "Let's watch",
    "09.03.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml('Let\'s watch <a href="https://www.rt.com/" targ', {
      dumpLinkHrefsNearby: { enabled: true }
    }),
    "Let's watch https://www.rt.com/",
    "09.03.02 - only href contents are left after stripping"
  );
});

test("09.04 - opts.dumpLinkHrefsNearby - linked image", t => {
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "09.04.01 - control, default"
  );
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "a b",
    "09.04.02 - control, hardcoded default"
  );
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "a https://codsen.com b",
    "09.04.03 - dumps href of a linked image"
  );
});

test("09.05 - opts.dumpLinkHrefsNearby - .putOnNewLine", t => {
  // control
  t.deepEqual(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "09.05.01 - control, default, off"
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
    "09.05.02 - dumpLinkHrefsNearby = on; putOnNewLine = off"
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
    "09.05.03 - dumpLinkHrefsNearby = on; putOnNewLine = on"
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
    "09.05.04 - dumpLinkHrefsNearby = on; putOnNewLine = on; wrapHeads = on; wrapTails = on;"
  );
});

test("09.06 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails", t => {
  // control
  t.deepEqual(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`
    ),
    "a z b",
    "09.06.01 - control, default"
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
    "09.06.02 - heads only"
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
    "09.06.03 - heads only"
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
    "09.06.04 - tails only"
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
    "09.06.05 - tails only"
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
    "09.06.06 - ignore on a div only"
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
    "09.06.07 - ignore on a div only"
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
    "09.06.08 - whole div pair is removed"
  );
});

// ==============================
// opts.onlyStripTags
// ==============================

test("10.01 - opts.onlyStripTags - base cases", t => {
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "10.01.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "z" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
    "10.01.02 - non-existent tag option - leaves all tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: null }
    ),
    "Let's watch RT news this evening",
    "10.01.03 - falsey option"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [] }
    ),
    "Let's watch RT news this evening",
    "10.01.04 - no tags mentioned, will strip all"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [""] }
    ),
    "Let's watch RT news this evening",
    "10.01.05 - empty strings will be removed and will become default, blank setting"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["\t", "\n"] }
    ),
    "Let's watch RT news this evening",
    "10.01.06 - same, whitespace entries will be removed, setting will become default - strip all"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "10.01.07 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "a" }
    ),
    "Let's watch <b>RT news</b> this evening",
    "10.01.08 - only strip anchor tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["a"] }
    ),
    "Let's watch <b>RT news</b> this evening",
    "10.01.09 - only strip anchor tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "b" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "10.01.10 - only strip anchor tags"
  );
  t.deepEqual(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["b"] }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "10.01.11 - only strip anchor tags"
  );
});

test("10.02 - opts.onlyStripTags + opts.ignoreTags combo", t => {
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>'
    ),
    "Let's watch RT news this evening",
    "10.02.01 - control, default behaviour"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a" }
    ),
    "<div>Let's watch <b>RT news</b> this evening</div>",
    "10.02.02"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { ignoreTags: "a" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "10.02.03"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a", ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "10.02.04 - both entries cancel each one out"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a", "b"], ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening</div>', // TODO - detect and skip adding the space here
    "10.02.05 - both entries cancel each one out"
  );
  t.deepEqual(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a"], ignoreTags: ["a", "b"] }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "10.02.06 - both entries cancel each one out"
  );
});

// ==============================
// opts.cb
// ==============================

test("11.01 - opts.cb - baseline, no ranges requested", t => {
  // baseline, notice dirty whitespace:
  t.deepEqual(
    stripHtml(`<div style="display: inline !important;" >abc</ div>`, {
      returnRangesOnly: false
    }),
    "abc",
    "11.01"
  );
});

test("11.02 - opts.cb - baseline, ranges requested", t => {
  t.deepEqual(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true
    }),
    [[0, 6], [9, 16]],
    "11.02"
  );
});

test("11.03 - opts.cb - replace hr with tralala", t => {
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
  t.deepEqual(stripHtml("abc<hr>def", { cb }), "abc<tralala>def", "11.03.01");
  t.deepEqual(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "11.03.02"
  );
});

test("11.04 - opts.cb - replace div with tralala", t => {
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
    "11.04.01"
  );
  t.deepEqual(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true,
      cb
    }),
    [[0, 6, "<tralala>"], [9, 16, "</tralala>"]],
    "11.04.02"
  );
});

test("11.05 - opts.cb - replace only hr", t => {
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
    "11.05.01"
  );
  t.deepEqual(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "11.05.02"
  );
});

test("11.06 - opts.cb - readme example one", t => {
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
  t.deepEqual(stripHtml("abc<hr>def", { cb }), "abc def", "11.06.01");
  t.deepEqual(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, " "]],
    "11.06.02"
  );
});

test("11.07 - opts.cb - ignored tags are also being pinged, with null values", t => {
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
  t.deepEqual(res, "abc<hr>def ghi", "11.07.01");
  t.deepEqual(capturedTags, ["hr", "br"], "11.07.02");
});

test("11.08 - opts.cb - ignored tags are also being pinged, with null values", t => {
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
  t.deepEqual(res, [[10, 14, " "]], "11.08.01");
  t.deepEqual(capturedTags, ["hr", "br"], "11.08.02");
});
