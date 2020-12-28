import tap from "tap";
import { extract as e } from "../dist/string-extract-class-names.esm";

// ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char

// ==============================
// normal use cases
// ==============================

tap.only(
  "01 - class: just class passed, nothing done, falls on default",
  (t) => {
    t.strictSame(
      e(".class-name"),
      { res: [".class-name"], ranges: [[0, 11]] },
      "01.01"
    );
    t.end();
  }
);

tap.test("02 - tag with two classes", (t) => {
  t.strictSame(
    e("div.first-class.second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [15, 28],
      ],
    },
    "02.01"
  );
  t.end();
});

tap.test("03 - class: class within tag", (t) => {
  t.strictSame(
    e("div .class-name"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "03.01"
  );
  t.strictSame(
    e("div .class-name "),
    { res: [".class-name"], ranges: [[4, 15]] },
    "03.02"
  );
  t.strictSame(
    e("div       .class-name        "),
    { res: [".class-name"], ranges: [[10, 21]] },
    "03.03"
  );
  t.strictSame(
    e("div       .first-class.second-class        "),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [10, 22],
        [22, 35],
      ],
    },
    "03.04"
  );

  t.end();
});

tap.test("04 - class: class within tag's child tag", (t) => {
  t.strictSame(
    e("div .class-name a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "04.01"
  );
  t.strictSame(
    e("div .first-class.second-class a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [4, 16],
        [16, 29],
      ],
    },
    "04.02"
  );
  t.end();
});

tap.test("05 - class: more, sandwitched", (t) => {
  t.strictSame(
    e(
      "div~!@$%^&*()+=,/';:\"?><[]{}|`.class-name~!@$%^&*()+=,/';:\"?><[]{}|`#"
    ),
    { res: [".class-name"], ranges: [[30, 41]] },
    "05.01"
  );
  t.end();
});

tap.test("06 - class: exclamation mark", (t) => {
  t.strictSame(
    e("div .class-name!a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "06.01"
  );
  t.strictSame(
    e("div.class-name!a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "06.02"
  );
  t.strictSame(
    e(".class-name!a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "06.03"
  );
  t.strictSame(
    e("!.class-name!a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "06.04"
  );
  t.strictSame(
    e("!.first-class.second-class!a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "06.05"
  );
  t.end();
});

tap.test("07 - class: ampersand", (t) => {
  t.strictSame(
    e("div .class-name&a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "07.01"
  );
  t.strictSame(
    e("div.class-name&a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "07.02"
  );
  t.strictSame(
    e(".class-name&a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "07.03"
  );
  t.strictSame(
    e("&.class-name&a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "07.04"
  );
  t.strictSame(
    e("&.first-class.second-class&a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "07.05"
  );
  t.end();
});

tap.test("08 - class: dollar", (t) => {
  t.strictSame(
    e("div .class-name$a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "08.01"
  );
  t.strictSame(
    e("div.class-name$a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "08.02"
  );
  t.strictSame(
    e(".class-name$a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "08.03"
  );
  t.strictSame(
    e("$.class-name$a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "08.04"
  );
  t.strictSame(
    e("a[title~=name] .class-name$a"),
    { res: [".class-name"], ranges: [[15, 26]] },
    "08.05"
  );
  t.strictSame(
    e("a[title~=name] .first-class.second-class$a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [15, 27],
        [27, 40],
      ],
    },
    "08.06"
  );
  t.end();
});

tap.test("09 - class: percentage", (t) => {
  t.strictSame(
    e("div .class-name%a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "09.01"
  );
  t.strictSame(
    e("div.class-name%a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "09.02"
  );
  t.strictSame(
    e(".class-name%a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "09.03"
  );
  t.strictSame(
    e("%.class-name%a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "09.04"
  );
  t.strictSame(
    e("[%~class-name] .class-name%a"),
    { res: [".class-name"], ranges: [[15, 26]] },
    "09.05"
  );
  t.strictSame(
    e("[%~class-name] .first-class.second-class%a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [15, 27],
        [27, 40],
      ],
    },
    "09.06"
  );
  t.end();
});

tap.test("10 - class: circumflex", (t) => {
  t.strictSame(
    e('a.class-name[href^="https"]'),
    { res: [".class-name"], ranges: [[1, 12]] },
    "10.01"
  );
  t.strictSame(
    e('a.first-class.second-class[href^="https"]'),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "10.02"
  );
  t.end();
});

tap.test("11 - class: ampersand", (t) => {
  t.strictSame(
    e(".class-name &"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "11.01"
  );
  t.strictSame(
    e(".first-class.second-class &"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [0, 12],
        [12, 25],
      ],
    },
    "11.02"
  );
  t.end();
});

tap.test("12 - class: asterisk", (t) => {
  t.strictSame(
    e(".class-name *"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "12.01"
  );
  t.strictSame(
    e("*.class-name *"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "12.02"
  );
  t.strictSame(
    e("*.first-class.second-class*"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "12.03"
  );
  t.end();
});

tap.test("13 - class: brackets", (t) => {
  t.strictSame(
    e("p.class-name:lang(it)"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "13.01"
  );
  t.strictSame(
    e("p.class-name:lang(it) p.class-name-other:lang(en)"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [1, 12],
        [23, 40],
      ],
    },
    "13.02"
  );
  t.strictSame(
    e(":.first-class.second-class:"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "13.03"
  );
  t.end();
});

tap.test("14 - class: plus", (t) => {
  t.strictSame(
    e("div.class-name + p"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "14.01"
  );
  t.strictSame(
    e("div.class-name+p"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "14.02"
  );
  t.strictSame(
    e("+.first-class.second-class+"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "14.03"
  );
  t.end();
});

tap.test("15 - class: equals", (t) => {
  t.strictSame(
    e('a.class-name[href*="npmjs"], ranges: }'),
    { res: [".class-name"], ranges: [[1, 12]] },
    "15.01"
  );
  t.strictSame(
    e('a.class-name [href *= "npmjs"], ranges: }'),
    { res: [".class-name"], ranges: [[1, 12]] },
    "15.02"
  );
  t.strictSame(
    e("=.first-class.second-class="),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "15.03"
  );
  t.end();
});

tap.test("16 - class: colon", (t) => {
  t.strictSame(
    e(".class-name, .class-name-other"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [0, 11],
        [13, 30],
      ],
    },
    "16.01"
  );
  t.strictSame(
    e(".class-name,.class-name-other"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [0, 11],
        [12, 29],
      ],
    },
    "16.02"
  );
  t.strictSame(
    e(",.first-class.second-class,"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "16.03"
  );
  t.end();
});

tap.test("17 - class: right slash", (t) => {
  t.strictSame(
    e(".class-name/class-name-other"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "17.01"
  );
  t.strictSame(
    e(".class-name /class-name-other"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "17.02"
  );
  t.strictSame(
    e("/.first-class.second-class/"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "17.03"
  );
  t.end();
});

tap.test("18 - class: apostrophe", (t) => {
  t.strictSame(
    e(".class-name'"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "18.01"
  );
  t.strictSame(
    e("'.class-name"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "18.02"
  );
  t.strictSame(
    e("'.first-class.second-class'"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "18.03"
  );
  t.end();
});

tap.test("19 - class: semicolon", (t) => {
  t.strictSame(
    e(".class-name-1;.class-name-2"),
    {
      res: [".class-name-1", ".class-name-2"],
      ranges: [
        [0, 13],
        [14, 27],
      ],
    },
    "19.01"
  );
  t.strictSame(
    e(".class-name-1;.class-name-2"),
    {
      res: [".class-name-1", ".class-name-2"],
      ranges: [
        [0, 13],
        [14, 27],
      ],
    },
    "19.02"
  );
  t.strictSame(
    e(";.class-name-1;.class-name-2;"),
    {
      res: [".class-name-1", ".class-name-2"],
      ranges: [
        [1, 14],
        [15, 28],
      ],
    },
    "19.03"
  );
  t.strictSame(
    e(";.first-class.second-class;"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "19.04"
  );
  t.end();
});

tap.test("20 - class: colon", (t) => {
  t.strictSame(
    e("input.class-name:read-only"),
    { res: [".class-name"], ranges: [[5, 16]] },
    "20.01"
  );
  t.strictSame(
    e("input:out-of-range .class-name input:out-of-range"),
    { res: [".class-name"], ranges: [[19, 30]] },
    "20.02"
  );
  t.strictSame(
    e(
      "input:out-of-range .class-name::selection input:out-of-range::selection"
    ),
    { res: [".class-name"], ranges: [[19, 30]] },
    "20.03"
  );
  t.strictSame(
    e(":.first-class.second-class:"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "20.04"
  );
  t.end();
});

tap.test("21 - class: double quote", (t) => {
  t.strictSame(
    e('.class-name a[href^="https"]'),
    { res: [".class-name"], ranges: [[0, 11]] },
    "21.01"
  );
  t.strictSame(
    e('a[href^="https"] .class-name a[href^="https"]'),
    { res: [".class-name"], ranges: [[17, 28]] },
    "21.02"
  );
  t.strictSame(
    e('"https".class-name"https"'),
    { res: [".class-name"], ranges: [[7, 18]] },
    "21.03"
  );
  t.strictSame(
    e('"https".first-class.second-class"https"'),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [7, 19],
        [19, 32],
      ],
    },
    "21.04"
  );
  t.end();
});

tap.test("22 - class: question mark", (t) => {
  t.strictSame(
    e(".class-name ?"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "22.01"
  );
  t.strictSame(
    e("? .class-name?"),
    { res: [".class-name"], ranges: [[2, 13]] },
    "22.02"
  );
  t.strictSame(
    e("?.class-name?"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "22.03"
  );
  t.strictSame(
    e("?.first-class.second-class?"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "22.04"
  );
  t.end();
});

tap.test("23 - class: greater than sign", (t) => {
  t.strictSame(
    e(".class-name> p"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "23.01"
  );
  t.strictSame(
    e("* > .class-name > p > .class-name-other"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [4, 15],
        [22, 39],
      ],
    },
    "23.02"
  );
  t.strictSame(
    e("*.class-name> .class-name-other> p > .class-name-another"),
    {
      res: [".class-name", ".class-name-other", ".class-name-another"],
      ranges: [
        [1, 12],
        [14, 31],
        [37, 56],
      ],
    },
    "23.03"
  );
  t.strictSame(
    e(">.class1.class2> .class3.class4> p > .class5.class6"),
    {
      res: [".class1", ".class2", ".class3", ".class4", ".class5", ".class6"],
      ranges: [
        [1, 8],
        [8, 15],
        [17, 24],
        [24, 31],
        [37, 44],
        [44, 51],
      ],
    },
    "23.04"
  );
  t.end();
});

tap.test("24 - class: square brackets", (t) => {
  t.strictSame(
    e("a[target=_blank] .class-name a[target=_blank]"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "24.01"
  );
  t.strictSame(
    e("a[target=_blank] .class-name[target=_blank]"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "24.02"
  );
  t.strictSame(
    e("a[target=_blank].class-name[target=_blank]"),
    { res: [".class-name"], ranges: [[16, 27]] },
    "24.03"
  );
  t.strictSame(
    e("a[target=_blank].first-class.second-class[target=_blank]"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [16, 28],
        [28, 41],
      ],
    },
    "24.04"
  );
  t.end();
});

tap.test("25 - class: curly brackets", (t) => {
  t.strictSame(
    e("a{target=_blank} .class-name a{target=_blank}"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "25.01"
  );
  t.strictSame(
    e("a{target=_blank} .class-name{target=_blank}"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "25.02"
  );
  t.strictSame(
    e("a{target=_blank}.class-name{target=_blank}"),
    { res: [".class-name"], ranges: [[16, 27]] },
    "25.03"
  );
  t.strictSame(
    e("a{target=_blank}.first-class.second-class{target=_blank}"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [16, 28],
        [28, 41],
      ],
    },
    "25.04"
  );
  t.end();
});

tap.test("26 - class: pipe", (t) => {
  t.strictSame(
    e("|.class-name|=en]"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "26.01"
  );
  t.strictSame(
    e("a[lang|=en] .class-name[lang|=en]"),
    { res: [".class-name"], ranges: [[12, 23]] },
    "26.02"
  );
  t.strictSame(
    e("|.class-name|"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "26.03"
  );
  t.strictSame(
    e("|.first-class.second-class|"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "26.04"
  );
  t.end();
});

tap.test("27 - class: tick", (t) => {
  t.strictSame(
    e("`.class-name`"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "27.01"
  );
  t.strictSame(
    e("`.first-class.second-class`"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "27.02"
  );
  t.end();
});

tap.test("28 - one-letter class names", (t) => {
  t.strictSame(e(".h"), { res: [".h"], ranges: [[0, 2]] }, "28.01");
  t.strictSame(
    e(".a.b.c"),
    {
      res: [".a", ".b", ".c"],
      ranges: [
        [0, 2],
        [2, 4],
        [4, 6],
      ],
    },
    "28.02"
  );
  t.end();
});

// ==============================
// Hash, in case if ID's are found
// ==============================

tap.test("29 - id: just id passed, nothing done, falls on default", (t) => {
  t.strictSame(e("#id-name"), { res: ["#id-name"], ranges: [[0, 8]] }, "29.01");
  t.end();
});

tap.test("30 - id: tag with id", (t) => {
  t.strictSame(
    e("div#id-name#whatever"),
    {
      res: ["#id-name", "#whatever"],
      ranges: [
        [3, 11],
        [11, 20],
      ],
    },
    "30.01"
  );
  t.strictSame(
    e("div#id-name.class.another"),
    {
      res: ["#id-name", ".class", ".another"],
      ranges: [
        [3, 11],
        [11, 17],
        [17, 25],
      ],
    },
    "30.02"
  );
  t.end();
});

tap.test("31 - id: id within tag", (t) => {
  t.strictSame(
    e("div #id-name"),
    { res: ["#id-name"], ranges: [[4, 12]] },
    "31.01"
  );
  t.strictSame(
    e("div #id-name "),
    { res: ["#id-name"], ranges: [[4, 12]] },
    "31.02"
  );
  t.strictSame(
    e("div       #id-name        "),
    { res: ["#id-name"], ranges: [[10, 18]] },
    "31.03"
  );
  t.strictSame(
    e("div       #first-id#second-id        "),
    {
      res: ["#first-id", "#second-id"],
      ranges: [
        [10, 19],
        [19, 29],
      ],
    },
    "31.04"
  );
  t.end();
});

tap.test("32 - id: id within tag's child tag", (t) => {
  t.strictSame(
    e("div #id-name a"),
    { res: ["#id-name"], ranges: [[4, 12]] },
    "32.01"
  );
  t.strictSame(
    e("div #id-name#second#third a"),
    {
      res: ["#id-name", "#second", "#third"],
      ranges: [
        [4, 12],
        [12, 19],
        [19, 25],
      ],
    },
    "32.02"
  );
  t.strictSame(
    e("div #id-name.second.third a"),
    {
      res: ["#id-name", ".second", ".third"],
      ranges: [
        [4, 12],
        [12, 19],
        [19, 25],
      ],
    },
    "32.03"
  );
  t.end();
});

tap.test("33 - id: more, sandwitched", (t) => {
  t.strictSame(
    e(
      "~!@$%^&*()+=,/';:\"?><[]{}|`#id-name#second#third[]yo~!@$%^&*()+=,/';:\"?><[]{}|`"
    ),
    {
      res: ["#id-name", "#second", "#third"],
      ranges: [
        [27, 35],
        [35, 42],
        [42, 48],
      ],
    },
    "33.01"
  );
  t.end();
});

tap.test("34 - id: exclamation mark", (t) => {
  t.strictSame(
    e("div #id-name!a"),
    { res: ["#id-name"], ranges: [[4, 12]] },
    "34.01"
  );
  t.strictSame(
    e("!#id-name!"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "34.02"
  );
  t.strictSame(
    e("!#id-name#second#third!"),
    {
      res: ["#id-name", "#second", "#third"],
      ranges: [
        [1, 9],
        [9, 16],
        [16, 22],
      ],
    },
    "34.03"
  );
  t.strictSame(
    e("!#id-name.second#third.fourth!"),
    {
      res: ["#id-name", ".second", "#third", ".fourth"],
      ranges: [
        [1, 9],
        [9, 16],
        [16, 22],
        [22, 29],
      ],
    },
    "34.04"
  );
  t.end();
});

tap.test("35 - id: ampersand", (t) => {
  t.strictSame(
    e("div #id-name&a"),
    { res: ["#id-name"], ranges: [[4, 12]] },
    "35.01"
  );
  t.strictSame(
    e("div#id-name&a"),
    { res: ["#id-name"], ranges: [[3, 11]] },
    "35.02"
  );
  t.strictSame(
    e("#id-name&a"),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "35.03"
  );
  t.strictSame(
    e("&#id-name&a"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "35.04"
  );
  t.strictSame(
    e("&#id-name#second.third&a"),
    {
      res: ["#id-name", "#second", ".third"],
      ranges: [
        [1, 9],
        [9, 16],
        [16, 22],
      ],
    },
    "35.05"
  );
  t.end();
});

tap.test("36 - id: dollar", (t) => {
  t.strictSame(
    e("div #id-name$a"),
    { res: ["#id-name"], ranges: [[4, 12]] },
    "36.01"
  );
  t.strictSame(
    e("div#id-name$a"),
    { res: ["#id-name"], ranges: [[3, 11]] },
    "36.02"
  );
  t.strictSame(
    e("#id-name$a"),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "36.03"
  );
  t.strictSame(
    e("$#id-name$a"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "36.04"
  );
  t.strictSame(
    e("a[title~=name] #id-name$a"),
    { res: ["#id-name"], ranges: [[15, 23]] },
    "36.05"
  );
  t.strictSame(
    e("$#id-name$"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "36.06"
  );
  t.strictSame(
    e("$#id-name#second$"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "36.07"
  );
  t.end();
});

tap.test("37 - id: percentage", (t) => {
  t.strictSame(
    e("div #id-name%a"),
    { res: ["#id-name"], ranges: [[4, 12]] },
    "37.01"
  );
  t.strictSame(
    e("div#id-name%a"),
    { res: ["#id-name"], ranges: [[3, 11]] },
    "37.02"
  );
  t.strictSame(
    e("#id-name%a"),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "37.03"
  );
  t.strictSame(
    e("%#id-name%a"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "37.04"
  );
  t.strictSame(
    e("[%~class-name] #id-name%a"),
    { res: ["#id-name"], ranges: [[15, 23]] },
    "37.05"
  );
  t.strictSame(
    e("%#id-name%"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "37.06"
  );
  t.strictSame(
    e("%#id-name#second%"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "37.07"
  );
  t.end();
});

tap.test("38 - id: circumflex", (t) => {
  t.strictSame(
    e('a#id-name[href^="https"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "38.01"
  );
  t.strictSame(
    e("^#id-name^"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "38.02"
  );
  t.strictSame(
    e("^#id-name#second^"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "38.03"
  );
  t.end();
});

tap.test("39 - id: ampersand", (t) => {
  t.strictSame(
    e("#id-name &"),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "39.01"
  );
  t.strictSame(
    e("&#id-name&"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "39.02"
  );
  t.strictSame(
    e("&#id-name#second&"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "39.03"
  );
  t.end();
});

tap.test("40 - id: asterisk", (t) => {
  t.strictSame(
    e("#id-name *"),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "40.01"
  );
  t.strictSame(
    e("*#id-name *"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "40.02"
  );
  t.strictSame(
    e("*#id-name*"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "40.03"
  );
  t.strictSame(
    e("*#id-name#second*"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "40.04"
  );
  t.end();
});

tap.test("41 - id: brackets", (t) => {
  t.strictSame(
    e("p#id-name:lang(it)"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "41.01"
  );
  t.strictSame(
    e("p#id-name:lang(it) p#id-name-other:lang(en)"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [20, 34],
      ],
    },
    "41.02"
  );
  t.strictSame(
    e("()#id-name()"),
    { res: ["#id-name"], ranges: [[2, 10]] },
    "41.03"
  );
  t.strictSame(
    e("(#id-name)"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "41.04"
  );
  t.strictSame(
    e("(#id-name#second.class)"),
    {
      res: ["#id-name", "#second", ".class"],
      ranges: [
        [1, 9],
        [9, 16],
        [16, 22],
      ],
    },
    "41.05"
  );
  t.end();
});

tap.test("42 - id: plus", (t) => {
  t.strictSame(
    e("div#id-name + p"),
    { res: ["#id-name"], ranges: [[3, 11]] },
    "42.01"
  );
  t.strictSame(
    e("div#id-name+p"),
    { res: ["#id-name"], ranges: [[3, 11]] },
    "42.02"
  );
  t.strictSame(
    e("+#id-name+"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "42.03"
  );
  t.strictSame(
    e("+#id-name#second+"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "42.04"
  );
  t.end();
});

tap.test("43 - id: equals", (t) => {
  t.strictSame(
    e('a#id-name[href*="npmjs"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "43.01"
  );
  t.strictSame(
    e('a#id-name [href *= "npmjs"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "43.02"
  );
  t.strictSame(
    e('a#id-name  [href *= "npmjs"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "43.03"
  );
  t.strictSame(
    e("=#id-name#second="),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "43.04"
  );
  t.end();
});

tap.test("44 - id: colon", (t) => {
  t.strictSame(
    e("#id-name, #id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [10, 24],
      ],
    },
    "44.01"
  );
  t.strictSame(
    e("#id-name,#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [9, 23],
      ],
    },
    "44.02"
  );
  t.strictSame(
    e(",#id-name,"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "44.03"
  );
  t.strictSame(
    e(",#id-name#second,"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "44.04"
  );

  t.end();
});

tap.test("45 - id: right slash", (t) => {
  t.strictSame(
    e("#id-name/#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [9, 23],
      ],
    },
    "45.01"
  );
  t.strictSame(
    e("/#id-name/#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [10, 24],
      ],
    },
    "45.02"
  );
  t.strictSame(
    e("/#id-name/"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "45.03"
  );
  t.strictSame(
    e("/#id-name#second/"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "45.04"
  );

  t.end();
});

tap.test("46 - id: apostrophe", (t) => {
  t.strictSame(
    e("#id-name'"),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "46.01"
  );
  t.strictSame(
    e("'#id-name"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "46.02"
  );
  t.strictSame(
    e("'#id-name#second"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "46.03"
  );
  t.end();
});

tap.test("47 - id: semicolon", (t) => {
  t.strictSame(
    e("#id1;#id2"),
    {
      res: ["#id1", "#id2"],
      ranges: [
        [0, 4],
        [5, 9],
      ],
    },
    "47.01"
  );
  t.strictSame(
    e("#id-name;#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [9, 23],
      ],
    },
    "47.02"
  );
  t.strictSame(
    e(";#id-name;#id-name-other;"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [10, 24],
      ],
    },
    "47.03"
  );
  t.strictSame(
    e(";#id1#id2;#id3#id4;"),
    {
      res: ["#id1", "#id2", "#id3", "#id4"],
      ranges: [
        [1, 5],
        [5, 9],
        [10, 14],
        [14, 18],
      ],
    },
    "47.04"
  );

  t.end();
});

tap.test("48 - id: colon", (t) => {
  t.strictSame(
    e("input#id-name:read-only"),
    { res: ["#id-name"], ranges: [[5, 13]] },
    "48.01"
  );
  t.strictSame(
    e("input:out-of-range #id-name input:out-of-range"),
    { res: ["#id-name"], ranges: [[19, 27]] },
    "48.02"
  );
  t.strictSame(
    e("input:out-of-range #id-name::selection input:out-of-range::selection"),
    { res: ["#id-name"], ranges: [[19, 27]] },
    "48.03"
  );
  t.strictSame(
    e(
      "input:out-of-range #id-name#second.third::selection input:out-of-range::selection"
    ),
    {
      res: ["#id-name", "#second", ".third"],
      ranges: [
        [19, 27],
        [27, 34],
        [34, 40],
      ],
    },
    "48.04"
  );

  t.end();
});

tap.test("49 - id: double quote", (t) => {
  t.strictSame(
    e('#id-name a[href^="https"]'),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "49.01"
  );
  t.strictSame(
    e('a[href^="https"] #id-name a[href^="https"]'),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "49.02"
  );
  t.strictSame(
    e('a[href^="https"] #id-name#second a[href^="https"]'),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [17, 25],
        [25, 32],
      ],
    },
    "49.03"
  );
  t.end();
});

tap.test("50 - id: question mark", (t) => {
  t.strictSame(
    e("#id-name ?"),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "50.01"
  );
  t.strictSame(
    e("?#id-name?"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "50.02"
  );
  t.strictSame(
    e("?#id-name#second?"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "50.03"
  );
  t.end();
});

tap.test("51 - id: question mark", (t) => {
  t.strictSame(
    e("?#id-name?"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "51.01"
  );
  t.strictSame(
    e("?#id-name? > p > #id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [17, 31],
      ],
    },
    "51.02"
  );
  t.strictSame(
    e("?#id-name-1? #id-name-2> p > #id-name-3"),
    {
      res: ["#id-name-1", "#id-name-2", "#id-name-3"],
      ranges: [
        [1, 11],
        [13, 23],
        [29, 39],
      ],
    },
    "51.03"
  );
  t.strictSame(
    e("?#id1#id2? #id3#id4> p > #id5#id6"),
    {
      res: ["#id1", "#id2", "#id3", "#id4", "#id5", "#id6"],
      ranges: [
        [1, 5],
        [5, 9],
        [11, 15],
        [15, 19],
        [25, 29],
        [29, 33],
      ],
    },
    "51.04"
  );

  t.end();
});

tap.test("52 - id: square brackets", (t) => {
  t.strictSame(
    e("a[target=_blank] #id-name a[target=_blank]"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "52.01"
  );
  t.strictSame(
    e("a[target=_blank] #id-name[target=_blank]"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "52.02"
  );
  t.strictSame(
    e("[zzz]#id-name#second[target=_blank]"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [5, 13],
        [13, 20],
      ],
    },
    "52.03"
  );
  t.strictSame(
    e("zzz[#id-name#second]zzz"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [4, 12],
        [12, 19],
      ],
    },
    "52.04"
  );

  t.end();
});

tap.test("53 - id: curly brackets", (t) => {
  t.strictSame(
    e("a{target=_blank} #id-name a{target=_blank}"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "53.01"
  );
  t.strictSame(
    e("a{target=_blank} #id-name{target=_blank}"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "53.02"
  );
  t.strictSame(
    e("aaa{bbb}#id-name#second{ccc}ddd"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [8, 16],
        [16, 23],
      ],
    },
    "53.03"
  );
  t.strictSame(
    e("{#id-name#second}"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "53.04"
  );
  t.strictSame(
    e("zz{#id-name#second}zzz"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [3, 11],
        [11, 18],
      ],
    },
    "53.05"
  );

  t.end();
});

tap.test("54 - id: pipe", (t) => {
  t.strictSame(
    e("|#id-name|=en]"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "54.01"
  );
  t.strictSame(
    e("a[lang|=en] #id-name[lang|=en]"),
    { res: ["#id-name"], ranges: [[12, 20]] },
    "54.02"
  );
  t.strictSame(
    e("|#id-name#second|"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "54.03"
  );
  t.end();
});

tap.test("55 - id: tick", (t) => {
  t.strictSame(
    e("`#id-name`"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "55.01"
  );
  t.strictSame(
    e("`#id-name#second`"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "55.02"
  );
  t.end();
});

// ==============================
// Recognising class/id names after any character which is not allowed in class/id names
// ==============================

tap.test("56 - classes separated with a space should be recognised", (t) => {
  t.strictSame(
    e("div.first-class .second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [16, 29],
      ],
    },
    "56.01"
  );
  t.strictSame(
    e("div.first-class div.second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [19, 32],
      ],
    },
    "56.02"
  );
  t.strictSame(
    e(".first-class .second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [0, 12],
        [13, 26],
      ],
    },
    "56.03"
  );

  t.end();
});

tap.test("57 - classes recognised after brackets", (t) => {
  t.strictSame(
    e("div.class1[lang|=en]#id1[something] .class2[lang|=en] #id2"),
    {
      res: [".class1", "#id1", ".class2", "#id2"],
      ranges: [
        [3, 10],
        [20, 24],
        [36, 43],
        [54, 58],
      ],
    },
    "57.01"
  );
  t.strictSame(
    e("div.first-class[lang|=en] div.second-class[lang|=en]"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [29, 42],
      ],
    },
    "57.02"
  );
  t.strictSame(
    e(".first-class[lang|=en] .second-class[lang|=en]"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [0, 12],
        [23, 36],
      ],
    },
    "57.03"
  );
  t.end();
});

tap.test("58 - old bracket notation - classes", (t) => {
  t.strictSame(e("td[class=rr]"), { res: [".rr"], ranges: [[9, 11]] }, "58.01");
  t.strictSame(
    e("td [ class = rr ]"),
    { res: [".rr"], ranges: [[13, 15]] },
    "58.02"
  );
  t.strictSame(
    e("td [ class = abc-def ]"),
    { res: [".abc-def"], ranges: [[13, 20]] },
    "58.03"
  );
  t.strictSame(
    e(`td [ class = "abc-def" ]`),
    { res: [".abc-def"], ranges: [[14, 21]] },
    "58.04"
  );
  t.strictSame(
    e(`td [ class = 'abc-def' ]`),
    { res: [".abc-def"], ranges: [[14, 21]] },
    "58.05"
  );
  t.strictSame(
    e(`td[class="abc-def"]`),
    { res: [".abc-def"], ranges: [[10, 17]] },
    "58.06"
  );
  t.strictSame(
    e(`td[class='abc-def']`),
    { res: [".abc-def"], ranges: [[10, 17]] },
    "58.07"
  );
  t.end();
});

tap.test("59 - old bracket notation - classes that need trimming", (t) => {
  t.strictSame(
    e(`td [ class = " abc-def " ]`),
    { res: [".abc-def"], ranges: [[15, 22]] },
    "59.01"
  );
  t.strictSame(
    e(`td [ class = ' abc-def ' ]`),
    { res: [".abc-def"], ranges: [[15, 22]] },
    "59.02"
  );
  t.strictSame(
    e(`td[class=" abc-def "]`),
    { res: [".abc-def"], ranges: [[11, 18]] },
    "59.03"
  );
  t.strictSame(
    e(`td[class=' abc-def ']`),
    { res: [".abc-def"], ranges: [[11, 18]] },
    "59.04"
  );
  t.end();
});

tap.test("60 - old bracket notation - ids", (t) => {
  t.strictSame(e("td[id=rr]"), { res: ["#rr"], ranges: [[6, 8]] }, "60.01");
  t.strictSame(
    e("td [ id = rr ]"),
    { res: ["#rr"], ranges: [[10, 12]] },
    "60.02"
  );
  t.strictSame(
    e("td [ id = abc-def ]"),
    { res: ["#abc-def"], ranges: [[10, 17]] },
    "60.03"
  );
  t.strictSame(
    e(`td [ id = "abc-def" ]`),
    { res: ["#abc-def"], ranges: [[11, 18]] },
    "60.04"
  );
  t.strictSame(
    e(`td [ id = 'abc-def' ]`),
    { res: ["#abc-def"], ranges: [[11, 18]] },
    "60.05"
  );
  t.strictSame(
    e(`td[id="abc-def"]`),
    { res: ["#abc-def"], ranges: [[7, 14]] },
    "60.06"
  );
  t.strictSame(
    e(`td[id='abc-def']`),
    { res: ["#abc-def"], ranges: [[7, 14]] },
    "60.07"
  );
  t.end();
});

tap.test("61 - old bracket notation - ids that need trimming", (t) => {
  t.strictSame(
    e(`td [ id = " abc-def " ]`),
    { res: ["#abc-def"], ranges: [[12, 19]] },
    "61.01"
  );
  t.strictSame(
    e(`td [ id = ' abc-def ' ]`),
    { res: ["#abc-def"], ranges: [[12, 19]] },
    "61.02"
  );
  t.strictSame(
    e(`td[id=" abc-def "]`),
    { res: ["#abc-def"], ranges: [[8, 15]] },
    "61.03"
  );
  t.strictSame(
    e(`td[id=' abc-def ']`),
    { res: ["#abc-def"], ranges: [[8, 15]] },
    "61.04"
  );
  t.end();
});

tap.test("62 - old bracket notation - empty values", (t) => {
  // .
  t.strictSame(e(`td[class=']`), { res: [], ranges: null }, "62.01");
  t.strictSame(e(`td[class='']`), { res: [], ranges: null }, "62.02");
  t.strictSame(e(`td[class="]`), { res: [], ranges: null }, "62.03");
  t.strictSame(e(`td[class=""]`), { res: [], ranges: null }, "62.04");

  t.strictSame(e(`td [ class= ' ]`), { res: [], ranges: null }, "62.05");
  t.strictSame(e(`td [ class= '' ]`), { res: [], ranges: null }, "62.06");
  t.strictSame(e(`td [ class= " ]`), { res: [], ranges: null }, "62.07");
  t.strictSame(e(`td [ class= "" ]`), { res: [], ranges: null }, "62.08");
  // #
  t.strictSame(e(`td[id=']`), { res: [], ranges: null }, "62.09");
  t.strictSame(e(`td[id='']`), { res: [], ranges: null }, "62.10");
  t.strictSame(e(`td[id="]`), { res: [], ranges: null }, "62.11");
  t.strictSame(e(`td[id=""]`), { res: [], ranges: null }, "62.12");

  t.strictSame(e(`td [ id= ' ]`), { res: [], ranges: null }, "62.13");
  t.strictSame(e(`td [ id= '' ]`), { res: [], ranges: null }, "62.14");
  t.strictSame(e(`td [ id= " ]`), { res: [], ranges: null }, "62.15");
  t.strictSame(e(`td [ id= "" ]`), { res: [], ranges: null }, "62.16");

  t.end();
});

// ==============================
// Precautions
// ==============================

tap.test("63 - missing input args", (t) => {
  t.throws(() => {
    e(undefined);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("64 - the first input arg of a wrong type", (t) => {
  t.throws(() => {
    e(1);
  }, /THROW_ID_01/g);
  t.end();
});

// ==============================
// encoded strings given by JS
// discovered working on emailcomb.com
// ==============================

tap.test("66 - encoded line breaks", (t) => {
  t.strictSame(
    e("#unused-1\n\n\n\n\t\t\t\t\nz\t\ta"),
    { res: ["#unused-1"], ranges: [[0, 9]] },
    "66.01"
  );
  t.end();
});

tap.test(
  "67 - recognises JS escaped strings and repeated dots & hashes",
  (t) => {
    t.strictSame(
      e(
        "\naaa\n...    .unused-1\n\n\n.unused-2, .unused-3\n\t\t,,,\t###\t\nz\t\ta"
      ),
      {
        res: [".unused-1", ".unused-2", ".unused-3"],
        ranges: [
          [12, 21],
          [24, 33],
          [35, 44],
        ],
      },
      "67.01"
    );
    t.end();
  }
);
