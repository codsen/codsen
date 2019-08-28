import test from "ava";
import stripHtml from "../dist/string-strip-html.esm";

test("001 - missing closing bracket - opening brackets acts as delimeter", t => {
  t.deepEqual(stripHtml("<body>text<script>zzz</script</body>"), "text", "01");
});

test("002 - missing closing brackets", t => {
  t.deepEqual(
    stripHtml(" < body > text < script > zzz <    /    script < / body >"),
    "text",
    "02 - with more whitespace"
  );
});

test("003 - missing closing brackets", t => {
  t.deepEqual(
    stripHtml("<body>text<script"),
    "text",
    "03 - missing closing bracket"
  );
});

test("004 - missing closing brackets", t => {
  t.deepEqual(stripHtml("<script>text<script"), "", "04");
});

test("005 - missing closing brackets, leading to EOL", t => {
  t.deepEqual(stripHtml("<a>text<a"), "text", "05");
});

test("006 - missing closing brackets, multiple tags", t => {
  t.deepEqual(stripHtml("<a>text<a<a"), "text", "06");
});

test("007 - missing closing brackets + line breaks", t => {
  t.deepEqual(
    stripHtml("<body>text<script>\nzzz\n<script</body>"),
    "text",
    "07"
  );
});

test("008 - missing closing brackets + line breaks, with lots whitespace", t => {
  t.deepEqual(
    stripHtml("< body > text < script >\nzzz\n< script < / body >"),
    "text",
    "08"
  );
});

test("009 - missing opening bracket, but recognised tag name", t => {
  t.deepEqual(stripHtml("body>zzz</body>"), "zzz", "09");
});

test("010 - missing opening bracket, but recognised tag name, inner whitespace", t => {
  t.deepEqual(stripHtml("body >zzz</body>"), "zzz", "10");
});

test("011 - missing opening bracket, but recognised tag name, closing slash", t => {
  t.deepEqual(stripHtml("body/>zzz</body>"), "zzz", "11");
});

test("012 - missing opening bracket, but recognised tag name, whitespace in front of slash", t => {
  t.deepEqual(stripHtml("body />zzz</body>"), "zzz", "12");
});

test("013 - missing opening bracket, but recognised tag name, rogue whitespace around slash", t => {
  t.deepEqual(stripHtml("body / >zzz</body>"), "zzz", "13");
});

test("014 - missing opening bracket, but recognised tag name, recognised article tag", t => {
  t.deepEqual(
    stripHtml('<body>\narticle class="main" / >zzz</article>\n</body>'),
    "zzz",
    "14"
  );
});

test("015 - missing opening bracket, but recognised tag name - at index position zero", t => {
  t.deepEqual(stripHtml("tralala>zzz</body>"), "tralala>zzz", "15");
});

test("016 - missing opening bracket, but recognised tag name - all caps, recognised", t => {
  t.deepEqual(stripHtml("BODY>zzz</BODY>"), "zzz", "16");
});

test("017 - missing opening bracket, but recognised tag name - low caps, unrecognised", t => {
  t.deepEqual(stripHtml("tralala>zzz</BODY>"), "tralala>zzz", "17");
});

test("018 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything=>b"), "a b", "18");
});

test("019 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything= >b"), "a b", "19");
});

test("020 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything=/>b"), "a b", "20");
});

test("021 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything= />b"), "a b", "21");
});

test("022 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything=/ >b"), "a b", "22");
});

test("023 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything= / >b"), "a b", "23");
});

test("024 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything= / >b"), "a b", "24");
});

test("025 - incomplete attribute", t => {
  t.deepEqual(stripHtml("a<article anything=  / >b"), "a b", "25");
});

test("026 - multiple incomplete attributes", t => {
  t.deepEqual(stripHtml("a<article anything= whatever=>b"), "a b", "26");
});

test("027 - multiple incomplete attributes", t => {
  t.deepEqual(stripHtml("a<article anything= whatever=/>b"), "a b", "27");
});

test("028 - multiple incomplete attributes", t => {
  t.deepEqual(stripHtml("a<article anything= whatever= >b"), "a b", "28");
});

test("029 - multiple incomplete attributes", t => {
  t.deepEqual(stripHtml("a<article anything= whatever= />b"), "a b", "29");
});

test("030 - multiple incomplete attributes", t => {
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala">b'),
    "a b",
    "30 - a mix thereof"
  );
});

test("031 - multiple incomplete attributes", t => {
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"/>b'),
    "a b",
    "31 - a mix thereof"
  );
});

test("032 - multiple incomplete attributes", t => {
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" />b'),
    "a b",
    "32 - a mix thereof"
  );
});

test("033 - multiple incomplete attributes", t => {
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" / >b'),
    "a b",
    "33 - a mix thereof"
  );
});

test("034 - multiple incomplete attributes", t => {
  t.deepEqual(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"  /  >b'),
    "a b",
    "34 - a mix thereof"
  );
});

test("035 - multiple incomplete attributes", t => {
  t.deepEqual(
    stripHtml('a <article anything= class="zz" whatever= id="lalala"  /  > b'),
    "a b",
    "35 - a mix thereof"
  );
});

test("036 - multiple incomplete attributes", t => {
  t.deepEqual(
    stripHtml(
      'a <article anything = class="zz" whatever = id="lalala"  /  > b'
    ),
    "a b",
    "36 - a mix thereof"
  );
});

test("037 - tag name, equals and end of a tag", t => {
  // html
  t.deepEqual(stripHtml("a<article=>b"), "a b", "37");
});

test("038 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article =>b"), "a b", "38");
});

test("039 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article= >b"), "a b", "39");
});

test("040 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article = >b"), "a b", "40");
});

test("041 - tag name, equals and end of a tag", t => {
  // xhtml without space between the slash and closing tag
  t.deepEqual(stripHtml("a<article=/>b"), "a b", "41");
});

test("042 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article =/>b"), "a b", "42");
});

test("043 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article= />b"), "a b", "43");
});

test("044 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article = />b"), "a b", "44");
});

test("045 - tag name, equals and end of a tag", t => {
  // xhtml with space after the closing slash
  t.deepEqual(stripHtml("a<article=/ >b"), "a b", "45");
});

test("046 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article =/ >b"), "a b", "46");
});

test("047 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article= / >b"), "a b", "47");
});

test("048 - tag name, equals and end of a tag", t => {
  t.deepEqual(stripHtml("a<article = / >b"), "a b", "48");
});

test("049 - multiple equals after attribute's name", t => {
  // 1. consecutive equals
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class =="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "49"
  );
});

test("050 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class =="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "50"
  );
});

test("051 - multiple equals after attribute's name", t => {
  // 2. consecutive equals with space
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class = ="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "51"
  );
});

test("052 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class = ="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "52"
  );
});

test("053 - multiple equals after attribute's name", t => {
  // 3. consecutive equals with more spaces in between
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class = = "zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "53"
  );
});

test("054 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class = = "zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "54"
  );
});

test("055 - multiple equals after attribute's name", t => {
  // 4. consecutive equals, following attribute's name tightly
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class= = "zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "55"
  );
});

test("056 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class= = "zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "56"
  );
});

test("057 - multiple equals after attribute's name", t => {
  // 5. consecutive equals, tight
  // normal tag:
  t.deepEqual(
    stripHtml('aaaaaaa<div class=="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "57"
  );
});

test("058 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.deepEqual(
    stripHtml('aaaaaaa<script class=="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "58"
  );
});

test("059 - multiple quotes in the attributes - double, opening only - normal", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "59"
  );
});

test("060 - multiple quotes in the attributes - double, opening only - ranged", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "60"
  );
});

test("061 - multiple quotes in the attributes - double, closing - normal", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "61"
  );
});

test("062 - multiple quotes in the attributes - double, closing - ranged", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "62"
  );
});

test("063 - multiple quotes in the attributes - double, both closing and opening - normal", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class=""zzzz"">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "63"
  );
});

test("064 - multiple quotes in the attributes - double, both closing and opening - ranged", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<script class=""zzzz"">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "64"
  );
});

test("065 - multiple quotes in the attributes - single, opening only - normal", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "65"
  );
});

test("066 - multiple quotes in the attributes - single, opening only - ranged", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "66"
  );
});

test("067 - multiple quotes in the attributes - single, closing - normal", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "67"
  );
});

test("068 - multiple quotes in the attributes - single, closing - ranged", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "68"
  );
});

test("069 - multiple quotes in the attributes - single, both closing and opening - normal", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz''>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "69"
  );
});

test("070 - multiple quotes in the attributes - single, both closing and opening - ranged", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz''>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "70"
  );
});

test("071 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - normal", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<div class= ==''zzzz''>x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "71"
  );
});

test("072 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - ranged", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<script class = ==''zzzz''>x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "72"
  );
});

test("073 - multiple quotes in the attributes - mismatching quotes only - normal", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<div class=''zzzz\"\">x</div>bbbbbbbb"),
    "aaaaaaa x bbbbbbbb",
    "73"
  );
});

test("074 - multiple quotes in the attributes - mismatching quotes only - ranged", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<script class=''zzzz\"\">x</script>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "74"
  );
});

test("075 - multiple quotes in the attributes - crazy messed up - normal", t => {
  t.deepEqual(
    stripHtml(`aaaaaaa<div class= =='  'zzzz" " ">x</div>bbbbbbbb`),
    "aaaaaaa x bbbbbbbb",
    "75"
  );
});

test("076 - multiple quotes in the attributes - crazy messed up - ranged", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " ">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "76"
  );
});

test("077 - multiple quotes in the attributes - even more crazy messed up - normal", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " " /// >x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "77"
  );
});

test("078 - multiple quotes in the attributes - even more crazy messed up - ranged", t => {
  t.deepEqual(
    stripHtml(
      'aaaaaaa<script class= ==\'  \'zzzz" " " /// >x</script>bbbbbbbb'
    ),
    "aaaaaaa bbbbbbbb",
    "78"
  );
});

test("079 - unclosed attributes - normal", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class="zzzz>x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "79"
  );
});

test("080 - unclosed attributes - ranged", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<script class="zzzz>x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "80"
  );
});

test("081 - unclosed attributes - single tag", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<br class="zzzz>x<br>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "81"
  );
});

test("082 - unclosed attributes - new tag starts, closing quote missing", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<br class="zzzz <br>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "82"
  );
});

test("083 - unclosed attributes - new tag starts, both quotes present", t => {
  t.deepEqual(
    stripHtml('aaaaaaa<br class="zzzz" <br>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "83"
  );
});

test("084 - unclosed attributes - cut off at the end of attribute's name", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<br class<br>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "84"
  );
});

test("085 - unclosed attributes - cut off with a rogue exclamation mark", t => {
  t.deepEqual(
    stripHtml("aaaaaaa<br class!<br>bbbbbbbb"),
    "aaaaaaa bbbbbbbb",
    "85"
  );
});

test("086 - duplicated consecutive attribute values - inner whitespace", t => {
  t.deepEqual(
    stripHtml('aa< br class1="b1" yo1   =   class2 = "b2" yo2 yo3>cc'),
    "aa cc",
    "86"
  );
});

test("087 - space after bracket, multiple attrs, no equals", t => {
  t.deepEqual(stripHtml("aa< br a b >cc"), "aa< br a b >cc", "87");
});

test("088 - space after bracket, multiple attrs, no equals", t => {
  t.deepEqual(stripHtml("aa < br a b >cc"), "aa < br a b >cc", "88");
});

test("089 - space after bracket, multiple attrs, no equals", t => {
  t.deepEqual(stripHtml("aa< br a b > cc"), "aa< br a b > cc", "89");
});

test("090 - space after bracket, multiple attrs, no equals", t => {
  t.deepEqual(stripHtml("aa < br a b > cc"), "aa < br a b > cc", "90");
});

test("091 - space after bracket, multiple attrs, no equals", t => {
  t.deepEqual(stripHtml("aa  < br a b >  cc"), "aa  < br a b >  cc", "91");
});

test("092 - various, #1", t => {
  t.deepEqual(stripHtml('aa< br a b=" >cc'), "aa cc", "92");
});

test("093 - various, #2", t => {
  t.deepEqual(stripHtml('aa< br a b= " >cc'), "aa cc", "93");
});

test("094 - various, #3", t => {
  t.deepEqual(stripHtml('aa< br a b =" >cc'), "aa cc", "94");
});

test("095 - various, #4", t => {
  t.deepEqual(stripHtml('aa< br a b = " >cc'), "aa cc", "95");
});

test("096 - various, #5", t => {
  // xhtml
  t.deepEqual(stripHtml('aa< br a b=" />cc'), "aa cc", "96");
});

test("097 - various, #6", t => {
  t.deepEqual(stripHtml('aa< br a b= " />cc'), "aa cc", "97");
});

test("098 - various, #7", t => {
  t.deepEqual(stripHtml('aa< br a b =" />cc'), "aa cc", "98");
});

test("099 - various, #8", t => {
  t.deepEqual(stripHtml('aa< br a b = " />cc'), "aa cc", "99");
});

test("100 - various, #9", t => {
  t.deepEqual(stripHtml('aa< br a b=" / >cc'), "aa cc", "100");
});

test("101 - various, #10", t => {
  t.deepEqual(stripHtml('aa< br a b= " / >cc'), "aa cc", "101");
});

test("102 - various, #11", t => {
  t.deepEqual(stripHtml('aa< br a b =" / >cc'), "aa cc", "102");
});

test("103 - various, #12", t => {
  t.deepEqual(stripHtml('aa< br a b = " / >cc'), "aa cc", "103");
});

test("104 - various, #13", t => {
  t.deepEqual(stripHtml('aa< br a b=" // >cc'), "aa cc", "104");
});

test("105 - various, #14", t => {
  t.deepEqual(stripHtml('aa< br a b= " // >cc'), "aa cc", "105");
});

test("106 - various, #15", t => {
  t.deepEqual(stripHtml('aa< br a b =" // >cc'), "aa cc", "106");
});

test("107 - various, #16", t => {
  t.deepEqual(stripHtml('aa< br a b = " // >cc'), "aa cc", "107");
});

test("108 - various, #17", t => {
  t.deepEqual(
    stripHtml(
      '<div><article class="main" id=="something">text</article></div>'
    ),
    "text",
    "108"
  );
});

test("109 - various, #18 - suddenly cut off healthy HTML", t => {
  t.deepEqual(
    stripHtml(
      `la <b>la</b> la<table><tr>
<td><a href="http://codsen.com" target="_blank"><img src="http://cdn.codsen.com/nonexistent.gif" width="11" height="22" border="0" style="display:block; -ms-interpolation-mode:bicubic; color: #ffffff; font-style: it`
    ),
    "la la la",
    "109 - HTML cut off in the middle of an inline CSS style"
  );
});

test("110 - unclosed tag followed by a tag - HTML", t => {
  // tight
  t.deepEqual(stripHtml('111 <br class="zz"<img> 222'), "111 222", "110");
});

test("111 - unclosed tag followed by a tag - XHTML", t => {
  t.deepEqual(stripHtml('111 <br class="zz"/<img> 222'), "111 222", "111");
});

test("112 - unclosed tag followed by a tag - HTML", t => {
  // space
  t.deepEqual(stripHtml('111 <br class="zz" <img> 222'), "111 222", "112");
});

test("113 - unclosed tag followed by a tag - XHTML", t => {
  t.deepEqual(stripHtml('111 <br class="zz"/ <img> 222'), "111 222", "113");
});

test("114 - unclosed tag followed by a tag - HTML - line break", t => {
  //
  t.deepEqual(stripHtml('111 <br class="zz"\n<img> 222'), "111\n222", "114");
});

test("115 - unclosed tag followed by a tag - XHTML - line break", t => {
  t.deepEqual(stripHtml('111 <br class="zz"/\n<img> 222'), "111\n222", "115");
});

test("116 - unclosed tag followed by a tag - space and line break, HTML", t => {
  //
  t.deepEqual(stripHtml('111 <br class="zz" \n<img> 222'), "111\n222", "116");
});

test("117 - unclosed tag followed by a tag - space and line break, XHTML", t => {
  t.deepEqual(stripHtml('111 <br class="zz"/ \n<img> 222'), "111\n222", "117");
});

test("118 - unclosed tag followed by a tag - messy", t => {
  t.deepEqual(
    stripHtml('111 <br class="zz"\t/ \n<img> 222'),
    "111\n222",
    "118"
  );
});

test("119 - unclosed tag followed by a tag", t => {
  t.deepEqual(
    stripHtml('111 <br class="zz"\t/\r\n\t \n<img> 222'),
    "111\n222",
    "119"
  );
});

test("120 - unclosed tag followed by a tag", t => {
  t.deepEqual(stripHtml("111 <a\t/\r\n\t \n<img> 222"), "111\n222", "120");
});

test("121 - dirty code - unclosed tag followed by a tag", t => {
  t.deepEqual(stripHtml("111 <a\t/\r\n\t \n<img> 222"), "111\n222", "121");
});
