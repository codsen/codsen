const t = require("tap");
const stripHtml = require("../dist/string-strip-html.cjs");

t.test(
  "001 - missing closing bracket - opening brackets acts as delimeter",
  t => {
    t.same(stripHtml("<body>text<script>zzz</script</body>"), "text", "01");
    t.end();
  }
);

t.test("002 - missing closing brackets", t => {
  t.same(
    stripHtml(" < body > text < script > zzz <    /    script < / body >"),
    "text",
    "02 - with more whitespace"
  );
  t.end();
});

t.test("003 - missing closing brackets", t => {
  t.same(
    stripHtml("<body>text<script"),
    "text",
    "03 - missing closing bracket"
  );
  t.end();
});

t.test("004 - missing closing brackets", t => {
  t.same(stripHtml("<script>text<script"), "", "04");
  t.end();
});

t.test("005 - missing closing brackets, leading to EOL", t => {
  t.same(stripHtml("<a>text<a"), "text", "05");
  t.end();
});

t.test("006 - missing closing brackets, multiple tags", t => {
  t.same(stripHtml("<a>text<a<a"), "text", "06");
  t.end();
});

t.test("007 - missing closing brackets + line breaks", t => {
  t.same(stripHtml("<body>text<script>\nzzz\n<script</body>"), "text", "07");
  t.end();
});

t.test(
  "008 - missing closing brackets + line breaks, with lots whitespace",
  t => {
    t.same(
      stripHtml("< body > text < script >\nzzz\n< script < / body >"),
      "text",
      "08"
    );
    t.end();
  }
);

t.test("009 - missing opening bracket, but recognised tag name", t => {
  t.same(stripHtml("body>zzz</body>"), "zzz", "09");
  t.end();
});

t.test(
  "010 - missing opening bracket, but recognised tag name, inner whitespace",
  t => {
    t.same(stripHtml("body >zzz</body>"), "zzz", "10");
    t.end();
  }
);

t.test(
  "011 - missing opening bracket, but recognised tag name, closing slash",
  t => {
    t.same(stripHtml("body/>zzz</body>"), "zzz", "11");
    t.end();
  }
);

t.test(
  "012 - missing opening bracket, but recognised tag name, whitespace in front of slash",
  t => {
    t.same(stripHtml("body />zzz</body>"), "zzz", "12");
    t.end();
  }
);

t.test(
  "013 - missing opening bracket, but recognised tag name, rogue whitespace around slash",
  t => {
    t.same(stripHtml("body / >zzz</body>"), "zzz", "13");
    t.end();
  }
);

t.test(
  "014 - missing opening bracket, but recognised tag name, recognised article tag",
  t => {
    t.same(
      stripHtml('<body>\narticle class="main" / >zzz</article>\n</body>'),
      "zzz",
      "14"
    );
    t.end();
  }
);

t.test(
  "015 - missing opening bracket, but recognised tag name - at index position zero",
  t => {
    t.same(stripHtml("tralala>zzz</body>"), "tralala>zzz", "15");
    t.end();
  }
);

t.test(
  "016 - missing opening bracket, but recognised tag name - all caps, recognised",
  t => {
    t.same(stripHtml("BODY>zzz</BODY>"), "zzz", "16");
    t.end();
  }
);

t.test(
  "017 - missing opening bracket, but recognised tag name - low caps, unrecognised",
  t => {
    t.same(stripHtml("tralala>zzz</BODY>"), "tralala>zzz", "17");
    t.end();
  }
);

t.test("018 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything=>b"), "a b", "18");
  t.end();
});

t.test("019 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything= >b"), "a b", "19");
  t.end();
});

t.test("020 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything=/>b"), "a b", "20");
  t.end();
});

t.test("021 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything= />b"), "a b", "21");
  t.end();
});

t.test("022 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything=/ >b"), "a b", "22");
  t.end();
});

t.test("023 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything= / >b"), "a b", "23");
  t.end();
});

t.test("024 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything= / >b"), "a b", "24");
  t.end();
});

t.test("025 - incomplete attribute", t => {
  t.same(stripHtml("a<article anything=  / >b"), "a b", "25");
  t.end();
});

t.test("026 - multiple incomplete attributes", t => {
  t.same(stripHtml("a<article anything= whatever=>b"), "a b", "26");
  t.end();
});

t.test("027 - multiple incomplete attributes", t => {
  t.same(stripHtml("a<article anything= whatever=/>b"), "a b", "27");
  t.end();
});

t.test("028 - multiple incomplete attributes", t => {
  t.same(stripHtml("a<article anything= whatever= >b"), "a b", "28");
  t.end();
});

t.test("029 - multiple incomplete attributes", t => {
  t.same(stripHtml("a<article anything= whatever= />b"), "a b", "29");
  t.end();
});

t.test("030 - multiple incomplete attributes", t => {
  t.same(
    stripHtml('a<article anything= class="zz" whatever= id="lalala">b'),
    "a b",
    "30 - a mix thereof"
  );
  t.end();
});

t.test("031 - multiple incomplete attributes", t => {
  t.same(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"/>b'),
    "a b",
    "31 - a mix thereof"
  );
  t.end();
});

t.test("032 - multiple incomplete attributes", t => {
  t.same(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" />b'),
    "a b",
    "32 - a mix thereof"
  );
  t.end();
});

t.test("033 - multiple incomplete attributes", t => {
  t.same(
    stripHtml('a<article anything= class="zz" whatever= id="lalala" / >b'),
    "a b",
    "33 - a mix thereof"
  );
  t.end();
});

t.test("034 - multiple incomplete attributes", t => {
  t.same(
    stripHtml('a<article anything= class="zz" whatever= id="lalala"  /  >b'),
    "a b",
    "34 - a mix thereof"
  );
  t.end();
});

t.test("035 - multiple incomplete attributes", t => {
  t.same(
    stripHtml('a <article anything= class="zz" whatever= id="lalala"  /  > b'),
    "a b",
    "35 - a mix thereof"
  );
  t.end();
});

t.test("036 - multiple incomplete attributes", t => {
  t.same(
    stripHtml(
      'a <article anything = class="zz" whatever = id="lalala"  /  > b'
    ),
    "a b",
    "36 - a mix thereof"
  );
  t.end();
});

t.test("037 - tag name, equals and end of a tag", t => {
  // html
  t.same(stripHtml("a<article=>b"), "a b", "37");
  t.end();
});

t.test("038 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article =>b"), "a b", "38");
  t.end();
});

t.test("039 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article= >b"), "a b", "39");
  t.end();
});

t.test("040 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article = >b"), "a b", "40");
  t.end();
});

t.test("041 - tag name, equals and end of a tag", t => {
  // xhtml without space between the slash and closing tag
  t.same(stripHtml("a<article=/>b"), "a b", "41");
  t.end();
});

t.test("042 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article =/>b"), "a b", "42");
  t.end();
});

t.test("043 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article= />b"), "a b", "43");
  t.end();
});

t.test("044 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article = />b"), "a b", "44");
  t.end();
});

t.test("045 - tag name, equals and end of a tag", t => {
  // xhtml with space after the closing slash
  t.same(stripHtml("a<article=/ >b"), "a b", "45");
  t.end();
});

t.test("046 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article =/ >b"), "a b", "46");
  t.end();
});

t.test("047 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article= / >b"), "a b", "47");
  t.end();
});

t.test("048 - tag name, equals and end of a tag", t => {
  t.same(stripHtml("a<article = / >b"), "a b", "48");
  t.end();
});

t.test("049 - multiple equals after attribute's name", t => {
  // 1. consecutive equals
  // normal tag:
  t.same(
    stripHtml('aaaaaaa<div class =="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "49"
  );
  t.end();
});

t.test("050 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.same(
    stripHtml('aaaaaaa<script class =="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "50"
  );
  t.end();
});

t.test("051 - multiple equals after attribute's name", t => {
  // 2. consecutive equals with space
  // normal tag:
  t.same(
    stripHtml('aaaaaaa<div class = ="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "51"
  );
  t.end();
});

t.test("052 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.same(
    stripHtml('aaaaaaa<script class = ="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "52"
  );
  t.end();
});

t.test("053 - multiple equals after attribute's name", t => {
  // 3. consecutive equals with more spaces in between
  // normal tag:
  t.same(
    stripHtml('aaaaaaa<div class = = "zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "53"
  );
  t.end();
});

t.test("054 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.same(
    stripHtml('aaaaaaa<script class = = "zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "54"
  );
  t.end();
});

t.test("055 - multiple equals after attribute's name", t => {
  // 4. consecutive equals, following attribute's name tightly
  // normal tag:
  t.same(
    stripHtml('aaaaaaa<div class= = "zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "55"
  );
  t.end();
});

t.test("056 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.same(
    stripHtml('aaaaaaa<script class= = "zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "56"
  );
  t.end();
});

t.test("057 - multiple equals after attribute's name", t => {
  // 5. consecutive equals, tight
  // normal tag:
  t.same(
    stripHtml('aaaaaaa<div class=="zzzz">x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "57"
  );
  t.end();
});

t.test("058 - multiple equals after attribute's name", t => {
  // ranged tag:
  t.same(
    stripHtml('aaaaaaa<script class=="zzzz">x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "58"
  );
  t.end();
});

t.test(
  "059 - multiple quotes in the attributes - double, opening only - normal",
  t => {
    t.same(
      stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
      "aaaaaaa x bbbbbbbb",
      "59"
    );
    t.end();
  }
);

t.test(
  "060 - multiple quotes in the attributes - double, opening only - ranged",
  t => {
    t.same(
      stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
      "aaaaaaa bbbbbbbb",
      "60"
    );
    t.end();
  }
);

t.test(
  "061 - multiple quotes in the attributes - double, closing - normal",
  t => {
    t.same(
      stripHtml('aaaaaaa<div class=""zzzz">x</div>bbbbbbbb'),
      "aaaaaaa x bbbbbbbb",
      "61"
    );
    t.end();
  }
);

t.test(
  "062 - multiple quotes in the attributes - double, closing - ranged",
  t => {
    t.same(
      stripHtml('aaaaaaa<script class=""zzzz">x</script>bbbbbbbb'),
      "aaaaaaa bbbbbbbb",
      "62"
    );
    t.end();
  }
);

t.test(
  "063 - multiple quotes in the attributes - double, both closing and opening - normal",
  t => {
    t.same(
      stripHtml('aaaaaaa<div class=""zzzz"">x</div>bbbbbbbb'),
      "aaaaaaa x bbbbbbbb",
      "63"
    );
    t.end();
  }
);

t.test(
  "064 - multiple quotes in the attributes - double, both closing and opening - ranged",
  t => {
    t.same(
      stripHtml('aaaaaaa<script class=""zzzz"">x</script>bbbbbbbb'),
      "aaaaaaa bbbbbbbb",
      "64"
    );
    t.end();
  }
);

t.test(
  "065 - multiple quotes in the attributes - single, opening only - normal",
  t => {
    t.same(
      stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
      "aaaaaaa x bbbbbbbb",
      "65"
    );
    t.end();
  }
);

t.test(
  "066 - multiple quotes in the attributes - single, opening only - ranged",
  t => {
    t.same(
      stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
      "aaaaaaa bbbbbbbb",
      "66"
    );
    t.end();
  }
);

t.test(
  "067 - multiple quotes in the attributes - single, closing - normal",
  t => {
    t.same(
      stripHtml("aaaaaaa<div class=''zzzz'>x</div>bbbbbbbb"),
      "aaaaaaa x bbbbbbbb",
      "67"
    );
    t.end();
  }
);

t.test(
  "068 - multiple quotes in the attributes - single, closing - ranged",
  t => {
    t.same(
      stripHtml("aaaaaaa<script class=''zzzz'>x</script>bbbbbbbb"),
      "aaaaaaa bbbbbbbb",
      "68"
    );
    t.end();
  }
);

t.test(
  "069 - multiple quotes in the attributes - single, both closing and opening - normal",
  t => {
    t.same(
      stripHtml("aaaaaaa<div class=''zzzz''>x</div>bbbbbbbb"),
      "aaaaaaa x bbbbbbbb",
      "69"
    );
    t.end();
  }
);

t.test(
  "070 - multiple quotes in the attributes - single, both closing and opening - ranged",
  t => {
    t.same(
      stripHtml("aaaaaaa<script class=''zzzz''>x</script>bbbbbbbb"),
      "aaaaaaa bbbbbbbb",
      "70"
    );
    t.end();
  }
);

t.test(
  "071 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - normal",
  t => {
    t.same(
      stripHtml("aaaaaaa<div class= ==''zzzz''>x</div>bbbbbbbb"),
      "aaaaaaa x bbbbbbbb",
      "71"
    );
    t.end();
  }
);

t.test(
  "072 - multiple quotes in the attributes - mix of messed up equals and repeated quotes - ranged",
  t => {
    t.same(
      stripHtml("aaaaaaa<script class = ==''zzzz''>x</script>bbbbbbbb"),
      "aaaaaaa bbbbbbbb",
      "72"
    );
    t.end();
  }
);

t.test(
  "073 - multiple quotes in the attributes - mismatching quotes only - normal",
  t => {
    t.same(
      stripHtml("aaaaaaa<div class=''zzzz\"\">x</div>bbbbbbbb"),
      "aaaaaaa x bbbbbbbb",
      "73"
    );
    t.end();
  }
);

t.test(
  "074 - multiple quotes in the attributes - mismatching quotes only - ranged",
  t => {
    t.same(
      stripHtml("aaaaaaa<script class=''zzzz\"\">x</script>bbbbbbbb"),
      "aaaaaaa bbbbbbbb",
      "74"
    );
    t.end();
  }
);

t.test(
  "075 - multiple quotes in the attributes - crazy messed up - normal",
  t => {
    t.same(
      stripHtml(`aaaaaaa<div class= =='  'zzzz" " ">x</div>bbbbbbbb`),
      "aaaaaaa x bbbbbbbb",
      "75"
    );
    t.end();
  }
);

t.test(
  "076 - multiple quotes in the attributes - crazy messed up - ranged",
  t => {
    t.same(
      stripHtml('aaaaaaa<script class= ==\'  \'zzzz" " ">x</script>bbbbbbbb'),
      "aaaaaaa bbbbbbbb",
      "76"
    );
    t.end();
  }
);

t.test(
  "077 - multiple quotes in the attributes - even more crazy messed up - normal",
  t => {
    t.same(
      stripHtml('aaaaaaa<div class= ==\'  \'zzzz" " " /// >x</div>bbbbbbbb'),
      "aaaaaaa x bbbbbbbb",
      "77"
    );
    t.end();
  }
);

t.test(
  "078 - multiple quotes in the attributes - even more crazy messed up - ranged",
  t => {
    t.same(
      stripHtml(
        'aaaaaaa<script class= ==\'  \'zzzz" " " /// >x</script>bbbbbbbb'
      ),
      "aaaaaaa bbbbbbbb",
      "78"
    );
    t.end();
  }
);

t.test("079 - unclosed attributes - normal", t => {
  t.same(
    stripHtml('aaaaaaa<div class="zzzz>x</div>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "79"
  );
  t.end();
});

t.test("080 - unclosed attributes - ranged", t => {
  t.same(
    stripHtml('aaaaaaa<script class="zzzz>x</script>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "80"
  );
  t.end();
});

t.test("081 - unclosed attributes - single tag", t => {
  t.same(
    stripHtml('aaaaaaa<br class="zzzz>x<br>bbbbbbbb'),
    "aaaaaaa x bbbbbbbb",
    "81"
  );
  t.end();
});

t.test(
  "082 - unclosed attributes - new tag starts, closing quote missing",
  t => {
    t.same(
      stripHtml('aaaaaaa<br class="zzzz <br>bbbbbbbb'),
      "aaaaaaa bbbbbbbb",
      "82"
    );
    t.end();
  }
);

t.test("083 - unclosed attributes - new tag starts, both quotes present", t => {
  t.same(
    stripHtml('aaaaaaa<br class="zzzz" <br>bbbbbbbb'),
    "aaaaaaa bbbbbbbb",
    "83"
  );
  t.end();
});

t.test(
  "084 - unclosed attributes - cut off at the end of attribute's name",
  t => {
    t.same(stripHtml("aaaaaaa<br class<br>bbbbbbbb"), "aaaaaaa bbbbbbbb", "84");
    t.end();
  }
);

t.test(
  "085 - unclosed attributes - cut off with a rogue exclamation mark",
  t => {
    t.same(
      stripHtml("aaaaaaa<br class!<br>bbbbbbbb"),
      "aaaaaaa bbbbbbbb",
      "85"
    );
    t.end();
  }
);

t.test(
  "086 - duplicated consecutive attribute values - inner whitespace",
  t => {
    t.same(
      stripHtml('aa< br class1="b1" yo1   =   class2 = "b2" yo2 yo3>cc'),
      "aa cc",
      "86"
    );
    t.end();
  }
);

t.test("087 - space after bracket, multiple attrs, no equals", t => {
  t.same(stripHtml("aa< br a b >cc"), "aa< br a b >cc", "87");
  t.end();
});

t.test("088 - space after bracket, multiple attrs, no equals", t => {
  t.same(stripHtml("aa < br a b >cc"), "aa < br a b >cc", "88");
  t.end();
});

t.test("089 - space after bracket, multiple attrs, no equals", t => {
  t.same(stripHtml("aa< br a b > cc"), "aa< br a b > cc", "89");
  t.end();
});

t.test("090 - space after bracket, multiple attrs, no equals", t => {
  t.same(stripHtml("aa < br a b > cc"), "aa < br a b > cc", "90");
  t.end();
});

t.test("091 - space after bracket, multiple attrs, no equals", t => {
  t.same(stripHtml("aa  < br a b >  cc"), "aa  < br a b >  cc", "91");
  t.end();
});

t.test("092 - various, #1", t => {
  t.same(stripHtml('aa< br a b=" >cc'), "aa cc", "92");
  t.end();
});

t.test("093 - various, #2", t => {
  t.same(stripHtml('aa< br a b= " >cc'), "aa cc", "93");
  t.end();
});

t.test("094 - various, #3", t => {
  t.same(stripHtml('aa< br a b =" >cc'), "aa cc", "94");
  t.end();
});

t.test("095 - various, #4", t => {
  t.same(stripHtml('aa< br a b = " >cc'), "aa cc", "95");
  t.end();
});

t.test("096 - various, #5", t => {
  // xhtml
  t.same(stripHtml('aa< br a b=" />cc'), "aa cc", "96");
  t.end();
});

t.test("097 - various, #6", t => {
  t.same(stripHtml('aa< br a b= " />cc'), "aa cc", "97");
  t.end();
});

t.test("098 - various, #7", t => {
  t.same(stripHtml('aa< br a b =" />cc'), "aa cc", "98");
  t.end();
});

t.test("099 - various, #8", t => {
  t.same(stripHtml('aa< br a b = " />cc'), "aa cc", "99");
  t.end();
});

t.test("100 - various, #9", t => {
  t.same(stripHtml('aa< br a b=" / >cc'), "aa cc", "100");
  t.end();
});

t.test("101 - various, #10", t => {
  t.same(stripHtml('aa< br a b= " / >cc'), "aa cc", "101");
  t.end();
});

t.test("102 - various, #11", t => {
  t.same(stripHtml('aa< br a b =" / >cc'), "aa cc", "102");
  t.end();
});

t.test("103 - various, #12", t => {
  t.same(stripHtml('aa< br a b = " / >cc'), "aa cc", "103");
  t.end();
});

t.test("104 - various, #13", t => {
  t.same(stripHtml('aa< br a b=" // >cc'), "aa cc", "104");
  t.end();
});

t.test("105 - various, #14", t => {
  t.same(stripHtml('aa< br a b= " // >cc'), "aa cc", "105");
  t.end();
});

t.test("106 - various, #15", t => {
  t.same(stripHtml('aa< br a b =" // >cc'), "aa cc", "106");
  t.end();
});

t.test("107 - various, #16", t => {
  t.same(stripHtml('aa< br a b = " // >cc'), "aa cc", "107");
  t.end();
});

t.test("108 - various, #17", t => {
  t.same(
    stripHtml(
      '<div><article class="main" id=="something">text</article></div>'
    ),
    "text",
    "108"
  );
  t.end();
});

t.test("109 - various, #18 - suddenly cut off healthy HTML", t => {
  t.same(
    stripHtml(
      `la <b>la</b> la<table><tr>
<td><a href="http://codsen.com" target="_blank"><img src="http://cdn.codsen.com/nonexistent.gif" width="11" height="22" border="0" style="display:block; -ms-interpolation-mode:bicubic; color: #ffffff; font-style: it`
    ),
    "la la la",
    "109 - HTML cut off in the middle of an inline CSS style"
  );
  t.end();
});

t.test("110 - unclosed tag followed by a tag - HTML", t => {
  // tight
  t.same(stripHtml('111 <br class="zz"<img> 222'), "111 222", "110");
  t.end();
});

t.test("111 - unclosed tag followed by a tag - XHTML", t => {
  t.same(stripHtml('111 <br class="zz"/<img> 222'), "111 222", "111");
  t.end();
});

t.test("112 - unclosed tag followed by a tag - HTML", t => {
  // space
  t.same(stripHtml('111 <br class="zz" <img> 222'), "111 222", "112");
  t.end();
});

t.test("113 - unclosed tag followed by a tag - XHTML", t => {
  t.same(stripHtml('111 <br class="zz"/ <img> 222'), "111 222", "113");
  t.end();
});

t.test("114 - unclosed tag followed by a tag - HTML - line break", t => {
  //
  t.same(stripHtml('111 <br class="zz"\n<img> 222'), "111\n222", "114");
  t.end();
});

t.test("115 - unclosed tag followed by a tag - XHTML - line break", t => {
  t.same(stripHtml('111 <br class="zz"/\n<img> 222'), "111\n222", "115");
  t.end();
});

t.test(
  "116 - unclosed tag followed by a tag - space and line break, HTML",
  t => {
    //
    t.same(stripHtml('111 <br class="zz" \n<img> 222'), "111\n222", "116");
    t.end();
  }
);

t.test(
  "117 - unclosed tag followed by a tag - space and line break, XHTML",
  t => {
    t.same(stripHtml('111 <br class="zz"/ \n<img> 222'), "111\n222", "117");
    t.end();
  }
);

t.test("118 - unclosed tag followed by a tag - messy", t => {
  t.same(stripHtml('111 <br class="zz"\t/ \n<img> 222'), "111\n222", "118");
  t.end();
});

t.test("119 - unclosed tag followed by a tag", t => {
  t.same(
    stripHtml('111 <br class="zz"\t/\r\n\t \n<img> 222'),
    "111\n\n222",
    "119"
  );
  t.end();
});

t.test("120 - unclosed tag followed by a tag", t => {
  t.same(stripHtml("111 <a\t/\r\n\t \n<img> 222"), "111\n\n222", "120");
  t.end();
});

t.test("121 - dirty code - unclosed tag followed by a tag", t => {
  t.same(stripHtml("111 <a\t/\r\n\t \n<img> 222"), "111\n\n222", "121");
  t.end();
});
