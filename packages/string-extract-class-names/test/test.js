// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  decodeCssSelector,
  extract as e,
  readCssSelectorToken,
} from "../dist/string-extract-class-names.esm.js";

// ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char

// ==============================
// normal use cases
// ==============================

test("01 - class: just class passed, nothing done, falls on default", () => {
  equal(e(".class-name"), { res: [".class-name"], ranges: [[0, 11]] }, "01.01");
});

test("02 - tag with two classes", () => {
  equal(
    e("div.first-class.second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [15, 28],
      ],
    },
    "02.01",
  );
});

test("03 - class: class within tag", () => {
  equal(
    e("div .class-name"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "03.01",
  );
  equal(
    e("div .class-name "),
    { res: [".class-name"], ranges: [[4, 15]] },
    "03.02",
  );
  equal(
    e("div       .class-name        "),
    { res: [".class-name"], ranges: [[10, 21]] },
    "03.03",
  );
  equal(
    e("div       .first-class.second-class        "),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [10, 22],
        [22, 35],
      ],
    },
    "03.04",
  );
});

test("04 - class: class within tag's child tag", () => {
  equal(
    e("div .class-name a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "04.01",
  );
  equal(
    e("div .first-class.second-class a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [4, 16],
        [16, 29],
      ],
    },
    "04.02",
  );
});

test("05 - class: more, sandwitched", () => {
  equal(
    e(
      "div~!@$%^&*()+=,/';:\"?><[]{}|`.class-name~!@$%^&*()+=,/';:\"?><[]{}|`#",
    ),
    { res: [".class-name"], ranges: [[30, 41]] },
    "05.01",
  );
});

test("06 - class: exclamation mark", () => {
  equal(
    e("div .class-name!a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "06.01",
  );
  equal(
    e("div.class-name!a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "06.02",
  );
  equal(
    e(".class-name!a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "06.03",
  );
  equal(
    e("!.class-name!a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "06.04",
  );
  equal(
    e("!.first-class.second-class!a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "06.05",
  );
});

test("07 - class: ampersand", () => {
  equal(
    e("div .class-name&a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "07.01",
  );
  equal(
    e("div.class-name&a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "07.02",
  );
  equal(
    e(".class-name&a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "07.03",
  );
  equal(
    e("&.class-name&a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "07.04",
  );
  equal(
    e("&.first-class.second-class&a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "07.05",
  );
});

test("08 - class: dollar", () => {
  equal(
    e("div .class-name$a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "08.01",
  );
  equal(
    e("div.class-name$a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "08.02",
  );
  equal(
    e(".class-name$a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "08.03",
  );
  equal(
    e("$.class-name$a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "08.04",
  );
  equal(
    e("a[title~=name] .class-name$a"),
    { res: [".class-name"], ranges: [[15, 26]] },
    "08.05",
  );
  equal(
    e("a[title~=name] .first-class.second-class$a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [15, 27],
        [27, 40],
      ],
    },
    "08.06",
  );
});

test("09 - class: percentage", () => {
  equal(
    e("div .class-name%a"),
    { res: [".class-name"], ranges: [[4, 15]] },
    "09.01",
  );
  equal(
    e("div.class-name%a"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "09.02",
  );
  equal(
    e(".class-name%a"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "09.03",
  );
  equal(
    e("%.class-name%a"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "09.04",
  );
  equal(
    e("[%~class-name] .class-name%a"),
    { res: [".class-name"], ranges: [[15, 26]] },
    "09.05",
  );
  equal(
    e("[%~class-name] .first-class.second-class%a"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [15, 27],
        [27, 40],
      ],
    },
    "09.06",
  );
});

test("10 - class: circumflex", () => {
  equal(
    e('a.class-name[href^="https"]'),
    { res: [".class-name"], ranges: [[1, 12]] },
    "10.01",
  );
  equal(
    e('a.first-class.second-class[href^="https"]'),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "10.02",
  );
});

test("11 - class: ampersand", () => {
  equal(
    e(".class-name &"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "11.01",
  );
  equal(
    e(".first-class.second-class &"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [0, 12],
        [12, 25],
      ],
    },
    "11.02",
  );
});

test("12 - class: asterisk", () => {
  equal(
    e(".class-name *"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "12.01",
  );
  equal(
    e("*.class-name *"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "12.02",
  );
  equal(
    e("*.first-class.second-class*"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "12.03",
  );
});

test("13 - class: brackets", () => {
  equal(
    e("p.class-name:lang(it)"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "13.01",
  );
  equal(
    e("p.class-name:lang(it) p.class-name-other:lang(en)"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [1, 12],
        [23, 40],
      ],
    },
    "13.02",
  );
  equal(
    e(":.first-class.second-class:"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "13.03",
  );
});

test("14 - class: plus", () => {
  equal(
    e("div.class-name + p"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "14.01",
  );
  equal(
    e("div.class-name+p"),
    { res: [".class-name"], ranges: [[3, 14]] },
    "14.02",
  );
  equal(
    e("+.first-class.second-class+"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "14.03",
  );
});

test("15 - class: equals", () => {
  equal(
    e('a.class-name[href*="npmjs"], ranges: }'),
    { res: [".class-name"], ranges: [[1, 12]] },
    "15.01",
  );
  equal(
    e('a.class-name [href *= "npmjs"], ranges: }'),
    { res: [".class-name"], ranges: [[1, 12]] },
    "15.02",
  );
  equal(
    e("=.first-class.second-class="),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "15.03",
  );
});

test("16 - class: colon", () => {
  equal(
    e(".class-name, .class-name-other"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [0, 11],
        [13, 30],
      ],
    },
    "16.01",
  );
  equal(
    e(".class-name,.class-name-other"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [0, 11],
        [12, 29],
      ],
    },
    "16.02",
  );
  equal(
    e(",.first-class.second-class,"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "16.03",
  );
});

test("17 - class: right slash", () => {
  equal(
    e(".class-name/class-name-other"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "17.01",
  );
  equal(
    e(".class-name /class-name-other"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "17.02",
  );
  equal(
    e("/.first-class.second-class/"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "17.03",
  );
});

test("18 - class: apostrophe", () => {
  equal(
    e(".class-name'"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "18.01",
  );
  equal(
    e("'.class-name"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "18.02",
  );
  equal(
    e("'.first-class.second-class'"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "18.03",
  );
});

test("19 - class: semicolon", () => {
  equal(
    e(".class-name-1;.class-name-2"),
    {
      res: [".class-name-1", ".class-name-2"],
      ranges: [
        [0, 13],
        [14, 27],
      ],
    },
    "19.01",
  );
  equal(
    e(".class-name-1;.class-name-2"),
    {
      res: [".class-name-1", ".class-name-2"],
      ranges: [
        [0, 13],
        [14, 27],
      ],
    },
    "19.02",
  );
  equal(
    e(";.class-name-1;.class-name-2;"),
    {
      res: [".class-name-1", ".class-name-2"],
      ranges: [
        [1, 14],
        [15, 28],
      ],
    },
    "19.03",
  );
  equal(
    e(";.first-class.second-class;"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "19.04",
  );
});

test("20 - class: colon", () => {
  equal(
    e("input.class-name:read-only"),
    { res: [".class-name"], ranges: [[5, 16]] },
    "20.01",
  );
  equal(
    e("input:out-of-range .class-name input:out-of-range"),
    { res: [".class-name"], ranges: [[19, 30]] },
    "20.02",
  );
  equal(
    e(
      "input:out-of-range .class-name::selection input:out-of-range::selection",
    ),
    { res: [".class-name"], ranges: [[19, 30]] },
    "20.03",
  );
  equal(
    e(":.first-class.second-class:"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "20.04",
  );
});

test("21 - class: double quote", () => {
  equal(
    e('.class-name a[href^="https"]'),
    { res: [".class-name"], ranges: [[0, 11]] },
    "21.01",
  );
  equal(
    e('a[href^="https"] .class-name a[href^="https"]'),
    { res: [".class-name"], ranges: [[17, 28]] },
    "21.02",
  );
  equal(
    e('"https".class-name"https"'),
    { res: [".class-name"], ranges: [[7, 18]] },
    "21.03",
  );
  equal(
    e('"https".first-class.second-class"https"'),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [7, 19],
        [19, 32],
      ],
    },
    "21.04",
  );
});

test("22 - class: question mark", () => {
  equal(
    e(".class-name ?"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "22.01",
  );
  equal(
    e("? .class-name?"),
    { res: [".class-name"], ranges: [[2, 13]] },
    "22.02",
  );
  equal(
    e("?.class-name?"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "22.03",
  );
  equal(
    e("?.first-class.second-class?"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "22.04",
  );
});

test("23 - class: greater than sign", () => {
  equal(
    e(".class-name> p"),
    { res: [".class-name"], ranges: [[0, 11]] },
    "23.01",
  );
  equal(
    e("* > .class-name > p > .class-name-other"),
    {
      res: [".class-name", ".class-name-other"],
      ranges: [
        [4, 15],
        [22, 39],
      ],
    },
    "23.02",
  );
  equal(
    e("*.class-name> .class-name-other> p > .class-name-another"),
    {
      res: [".class-name", ".class-name-other", ".class-name-another"],
      ranges: [
        [1, 12],
        [14, 31],
        [37, 56],
      ],
    },
    "23.03",
  );
  equal(
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
    "23.04",
  );
});

test("24 - class: square brackets", () => {
  equal(
    e("a[target=_blank] .class-name a[target=_blank]"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "24.01",
  );
  equal(
    e("a[target=_blank] .class-name[target=_blank]"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "24.02",
  );
  equal(
    e("a[target=_blank].class-name[target=_blank]"),
    { res: [".class-name"], ranges: [[16, 27]] },
    "24.03",
  );
  equal(
    e("a[target=_blank].first-class.second-class[target=_blank]"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [16, 28],
        [28, 41],
      ],
    },
    "24.04",
  );
});

test("25 - class: curly brackets", () => {
  equal(
    e("a{target=_blank} .class-name a{target=_blank}"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "25.01",
  );
  equal(
    e("a{target=_blank} .class-name{target=_blank}"),
    { res: [".class-name"], ranges: [[17, 28]] },
    "25.02",
  );
  equal(
    e("a{target=_blank}.class-name{target=_blank}"),
    { res: [".class-name"], ranges: [[16, 27]] },
    "25.03",
  );
  equal(
    e("a{target=_blank}.first-class.second-class{target=_blank}"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [16, 28],
        [28, 41],
      ],
    },
    "25.04",
  );
});

test("26 - class: pipe", () => {
  equal(
    e("|.class-name|=en]"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "26.01",
  );
  equal(
    e("a[lang|=en] .class-name[lang|=en]"),
    { res: [".class-name"], ranges: [[12, 23]] },
    "26.02",
  );
  equal(
    e("|.class-name|"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "26.03",
  );
  equal(
    e("|.first-class.second-class|"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "26.04",
  );
});

test("27 - class: tick", () => {
  equal(
    e("`.class-name`"),
    { res: [".class-name"], ranges: [[1, 12]] },
    "27.01",
  );
  equal(
    e("`.first-class.second-class`"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [1, 13],
        [13, 26],
      ],
    },
    "27.02",
  );
});

test("28 - one-letter class names", () => {
  equal(e(".h"), { res: [".h"], ranges: [[0, 2]] }, "28.01");
  equal(
    e(".a.b.c"),
    {
      res: [".a", ".b", ".c"],
      ranges: [
        [0, 2],
        [2, 4],
        [4, 6],
      ],
    },
    "28.02",
  );
});

// ==============================
// Hash, in case if ID's are found
// ==============================

test("29 - id: just id passed, nothing done, falls on default", () => {
  equal(e("#id-name"), { res: ["#id-name"], ranges: [[0, 8]] }, "29.01");
});

test("30 - id: tag with id", () => {
  equal(
    e("div#id-name#whatever"),
    {
      res: ["#id-name", "#whatever"],
      ranges: [
        [3, 11],
        [11, 20],
      ],
    },
    "30.01",
  );
  equal(
    e("div#id-name.class.another"),
    {
      res: ["#id-name", ".class", ".another"],
      ranges: [
        [3, 11],
        [11, 17],
        [17, 25],
      ],
    },
    "30.02",
  );
});

test("31 - id: id within tag", () => {
  equal(e("div #id-name"), { res: ["#id-name"], ranges: [[4, 12]] }, "31.01");
  equal(e("div #id-name "), { res: ["#id-name"], ranges: [[4, 12]] }, "31.02");
  equal(
    e("div       #id-name        "),
    { res: ["#id-name"], ranges: [[10, 18]] },
    "31.03",
  );
  equal(
    e("div       #first-id#second-id        "),
    {
      res: ["#first-id", "#second-id"],
      ranges: [
        [10, 19],
        [19, 29],
      ],
    },
    "31.04",
  );
});

test("32 - id: id within tag's child tag", () => {
  equal(e("div #id-name a"), { res: ["#id-name"], ranges: [[4, 12]] }, "32.01");
  equal(
    e("div #id-name#second#third a"),
    {
      res: ["#id-name", "#second", "#third"],
      ranges: [
        [4, 12],
        [12, 19],
        [19, 25],
      ],
    },
    "32.02",
  );
  equal(
    e("div #id-name.second.third a"),
    {
      res: ["#id-name", ".second", ".third"],
      ranges: [
        [4, 12],
        [12, 19],
        [19, 25],
      ],
    },
    "32.03",
  );
});

test("33 - id: more, sandwitched", () => {
  equal(
    e(
      "~!@$%^&*()+=,/';:\"?><[]{}|`#id-name#second#third[]yo~!@$%^&*()+=,/';:\"?><[]{}|`",
    ),
    {
      res: ["#id-name", "#second", "#third"],
      ranges: [
        [27, 35],
        [35, 42],
        [42, 48],
      ],
    },
    "33.01",
  );
});

test("34 - id: exclamation mark", () => {
  equal(e("div #id-name!a"), { res: ["#id-name"], ranges: [[4, 12]] }, "34.01");
  equal(e("!#id-name!"), { res: ["#id-name"], ranges: [[1, 9]] }, "34.02");
  equal(
    e("!#id-name#second#third!"),
    {
      res: ["#id-name", "#second", "#third"],
      ranges: [
        [1, 9],
        [9, 16],
        [16, 22],
      ],
    },
    "34.03",
  );
  equal(
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
    "34.04",
  );
});

test("35 - id: ampersand", () => {
  equal(e("div #id-name&a"), { res: ["#id-name"], ranges: [[4, 12]] }, "35.01");
  equal(e("div#id-name&a"), { res: ["#id-name"], ranges: [[3, 11]] }, "35.02");
  equal(e("#id-name&a"), { res: ["#id-name"], ranges: [[0, 8]] }, "35.03");
  equal(e("&#id-name&a"), { res: ["#id-name"], ranges: [[1, 9]] }, "35.04");
  equal(
    e("&#id-name#second.third&a"),
    {
      res: ["#id-name", "#second", ".third"],
      ranges: [
        [1, 9],
        [9, 16],
        [16, 22],
      ],
    },
    "35.05",
  );
});

test("36 - id: dollar", () => {
  equal(e("div #id-name$a"), { res: ["#id-name"], ranges: [[4, 12]] }, "36.01");
  equal(e("div#id-name$a"), { res: ["#id-name"], ranges: [[3, 11]] }, "36.02");
  equal(e("#id-name$a"), { res: ["#id-name"], ranges: [[0, 8]] }, "36.03");
  equal(e("$#id-name$a"), { res: ["#id-name"], ranges: [[1, 9]] }, "36.04");
  equal(
    e("a[title~=name] #id-name$a"),
    { res: ["#id-name"], ranges: [[15, 23]] },
    "36.05",
  );
  equal(e("$#id-name$"), { res: ["#id-name"], ranges: [[1, 9]] }, "36.06");
  equal(
    e("$#id-name#second$"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "36.07",
  );
});

test("37 - id: percentage", () => {
  equal(e("div #id-name%a"), { res: ["#id-name"], ranges: [[4, 12]] }, "37.01");
  equal(e("div#id-name%a"), { res: ["#id-name"], ranges: [[3, 11]] }, "37.02");
  equal(e("#id-name%a"), { res: ["#id-name"], ranges: [[0, 8]] }, "37.03");
  equal(e("%#id-name%a"), { res: ["#id-name"], ranges: [[1, 9]] }, "37.04");
  equal(
    e("[%~class-name] #id-name%a"),
    { res: ["#id-name"], ranges: [[15, 23]] },
    "37.05",
  );
  equal(e("%#id-name%"), { res: ["#id-name"], ranges: [[1, 9]] }, "37.06");
  equal(
    e("%#id-name#second%"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "37.07",
  );
});

test("38 - id: circumflex", () => {
  equal(
    e('a#id-name[href^="https"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "38.01",
  );
  equal(e("^#id-name^"), { res: ["#id-name"], ranges: [[1, 9]] }, "38.02");
  equal(
    e("^#id-name#second^"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "38.03",
  );
});

test("39 - id: ampersand", () => {
  equal(e("#id-name &"), { res: ["#id-name"], ranges: [[0, 8]] }, "39.01");
  equal(e("&#id-name&"), { res: ["#id-name"], ranges: [[1, 9]] }, "39.02");
  equal(
    e("&#id-name#second&"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "39.03",
  );
});

test("40 - id: asterisk", () => {
  equal(e("#id-name *"), { res: ["#id-name"], ranges: [[0, 8]] }, "40.01");
  equal(e("*#id-name *"), { res: ["#id-name"], ranges: [[1, 9]] }, "40.02");
  equal(e("*#id-name*"), { res: ["#id-name"], ranges: [[1, 9]] }, "40.03");
  equal(
    e("*#id-name#second*"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "40.04",
  );
});

test("41 - id: brackets", () => {
  equal(
    e("p#id-name:lang(it)"),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "41.01",
  );
  equal(
    e("p#id-name:lang(it) p#id-name-other:lang(en)"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [20, 34],
      ],
    },
    "41.02",
  );
  equal(e("()#id-name()"), { res: ["#id-name"], ranges: [[2, 10]] }, "41.03");
  equal(e("(#id-name)"), { res: ["#id-name"], ranges: [[1, 9]] }, "41.04");
  equal(
    e("(#id-name#second.class)"),
    {
      res: ["#id-name", "#second", ".class"],
      ranges: [
        [1, 9],
        [9, 16],
        [16, 22],
      ],
    },
    "41.05",
  );
});

test("42 - id: plus", () => {
  equal(
    e("div#id-name + p"),
    { res: ["#id-name"], ranges: [[3, 11]] },
    "42.01",
  );
  equal(e("div#id-name+p"), { res: ["#id-name"], ranges: [[3, 11]] }, "42.02");
  equal(e("+#id-name+"), { res: ["#id-name"], ranges: [[1, 9]] }, "42.03");
  equal(
    e("+#id-name#second+"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "42.04",
  );
});

test("43 - id: equals", () => {
  equal(
    e('a#id-name[href*="npmjs"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "43.01",
  );
  equal(
    e('a#id-name [href *= "npmjs"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "43.02",
  );
  equal(
    e('a#id-name  [href *= "npmjs"]'),
    { res: ["#id-name"], ranges: [[1, 9]] },
    "43.03",
  );
  equal(
    e("=#id-name#second="),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "43.04",
  );
});

test("44 - id: colon", () => {
  equal(
    e("#id-name, #id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [10, 24],
      ],
    },
    "44.01",
  );
  equal(
    e("#id-name,#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [9, 23],
      ],
    },
    "44.02",
  );
  equal(e(",#id-name,"), { res: ["#id-name"], ranges: [[1, 9]] }, "44.03");
  equal(
    e(",#id-name#second,"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "44.04",
  );
});

test("45 - id: right slash", () => {
  equal(
    e("#id-name/#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [9, 23],
      ],
    },
    "45.01",
  );
  equal(
    e("/#id-name/#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [10, 24],
      ],
    },
    "45.02",
  );
  equal(e("/#id-name/"), { res: ["#id-name"], ranges: [[1, 9]] }, "45.03");
  equal(
    e("/#id-name#second/"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "45.04",
  );
});

test("46 - id: apostrophe", () => {
  equal(e("#id-name'"), { res: ["#id-name"], ranges: [[0, 8]] }, "46.01");
  equal(e("'#id-name"), { res: ["#id-name"], ranges: [[1, 9]] }, "46.02");
  equal(
    e("'#id-name#second"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "46.03",
  );
});

test("47 - id: semicolon", () => {
  equal(
    e("#id1;#id2"),
    {
      res: ["#id1", "#id2"],
      ranges: [
        [0, 4],
        [5, 9],
      ],
    },
    "47.01",
  );
  equal(
    e("#id-name;#id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [0, 8],
        [9, 23],
      ],
    },
    "47.02",
  );
  equal(
    e(";#id-name;#id-name-other;"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [10, 24],
      ],
    },
    "47.03",
  );
  equal(
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
    "47.04",
  );
});

test("48 - id: colon", () => {
  equal(
    e("input#id-name:read-only"),
    { res: ["#id-name"], ranges: [[5, 13]] },
    "48.01",
  );
  equal(
    e("input:out-of-range #id-name input:out-of-range"),
    { res: ["#id-name"], ranges: [[19, 27]] },
    "48.02",
  );
  equal(
    e("input:out-of-range #id-name::selection input:out-of-range::selection"),
    { res: ["#id-name"], ranges: [[19, 27]] },
    "48.03",
  );
  equal(
    e(
      "input:out-of-range #id-name#second.third::selection input:out-of-range::selection",
    ),
    {
      res: ["#id-name", "#second", ".third"],
      ranges: [
        [19, 27],
        [27, 34],
        [34, 40],
      ],
    },
    "48.04",
  );
});

test("49 - id: double quote", () => {
  equal(
    e('#id-name a[href^="https"]'),
    { res: ["#id-name"], ranges: [[0, 8]] },
    "49.01",
  );
  equal(
    e('a[href^="https"] #id-name a[href^="https"]'),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "49.02",
  );
  equal(
    e('a[href^="https"] #id-name#second a[href^="https"]'),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [17, 25],
        [25, 32],
      ],
    },
    "49.03",
  );
});

test("50 - id: question mark", () => {
  equal(e("#id-name ?"), { res: ["#id-name"], ranges: [[0, 8]] }, "50.01");
  equal(e("?#id-name?"), { res: ["#id-name"], ranges: [[1, 9]] }, "50.02");
  equal(
    e("?#id-name#second?"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "50.03",
  );
});

test("51 - id: question mark", () => {
  equal(e("?#id-name?"), { res: ["#id-name"], ranges: [[1, 9]] }, "51.01");
  equal(
    e("?#id-name? > p > #id-name-other"),
    {
      res: ["#id-name", "#id-name-other"],
      ranges: [
        [1, 9],
        [17, 31],
      ],
    },
    "51.02",
  );
  equal(
    e("?#id-name-1? #id-name-2> p > #id-name-3"),
    {
      res: ["#id-name-1", "#id-name-2", "#id-name-3"],
      ranges: [
        [1, 11],
        [13, 23],
        [29, 39],
      ],
    },
    "51.03",
  );
  equal(
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
    "51.04",
  );
});

test("52 - id: square brackets", () => {
  equal(
    e("a[target=_blank] #id-name a[target=_blank]"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "52.01",
  );
  equal(
    e("a[target=_blank] #id-name[target=_blank]"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "52.02",
  );
  equal(
    e("[zzz]#id-name#second[target=_blank]"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [5, 13],
        [13, 20],
      ],
    },
    "52.03",
  );
  equal(
    e("zzz[#id-name#second]zzz"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [4, 12],
        [12, 19],
      ],
    },
    "52.04",
  );
});

test("53 - id: curly brackets", () => {
  equal(
    e("a{target=_blank} #id-name a{target=_blank}"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "53.01",
  );
  equal(
    e("a{target=_blank} #id-name{target=_blank}"),
    { res: ["#id-name"], ranges: [[17, 25]] },
    "53.02",
  );
  equal(
    e("aaa{bbb}#id-name#second{ccc}ddd"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [8, 16],
        [16, 23],
      ],
    },
    "53.03",
  );
  equal(
    e("{#id-name#second}"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "53.04",
  );
  equal(
    e("zz{#id-name#second}zzz"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [3, 11],
        [11, 18],
      ],
    },
    "53.05",
  );
});

test("54 - id: pipe", () => {
  equal(e("|#id-name|=en]"), { res: ["#id-name"], ranges: [[1, 9]] }, "54.01");
  equal(
    e("a[lang|=en] #id-name[lang|=en]"),
    { res: ["#id-name"], ranges: [[12, 20]] },
    "54.02",
  );
  equal(
    e("|#id-name#second|"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "54.03",
  );
});

test("55 - id: tick", () => {
  equal(e("`#id-name`"), { res: ["#id-name"], ranges: [[1, 9]] }, "55.01");
  equal(
    e("`#id-name#second`"),
    {
      res: ["#id-name", "#second"],
      ranges: [
        [1, 9],
        [9, 16],
      ],
    },
    "55.02",
  );
});

// ==============================
// Recognising class/id names after any character which is not allowed in class/id names
// ==============================

test("56 - classes separated with a space should be recognised", () => {
  equal(
    e("div.first-class .second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [16, 29],
      ],
    },
    "56.01",
  );
  equal(
    e("div.first-class div.second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [19, 32],
      ],
    },
    "56.02",
  );
  equal(
    e(".first-class .second-class"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [0, 12],
        [13, 26],
      ],
    },
    "56.03",
  );
});

test("57 - classes recognised after brackets", () => {
  equal(
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
    "57.01",
  );
  equal(
    e("div.first-class[lang|=en] div.second-class[lang|=en]"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [3, 15],
        [29, 42],
      ],
    },
    "57.02",
  );
  equal(
    e(".first-class[lang|=en] .second-class[lang|=en]"),
    {
      res: [".first-class", ".second-class"],
      ranges: [
        [0, 12],
        [23, 36],
      ],
    },
    "57.03",
  );
});

test("58 - old bracket notation - classes", () => {
  equal(e("td[class=rr]"), { res: [".rr"], ranges: [[9, 11]] }, "58.01");
  equal(e("td [ class = rr ]"), { res: [".rr"], ranges: [[13, 15]] }, "58.02");
  equal(
    e("td [ class = abc-def ]"),
    { res: [".abc-def"], ranges: [[13, 20]] },
    "58.03",
  );
  equal(
    e('td [ class = "abc-def" ]'),
    { res: [".abc-def"], ranges: [[14, 21]] },
    "58.04",
  );
  equal(
    e("td [ class = 'abc-def' ]"),
    { res: [".abc-def"], ranges: [[14, 21]] },
    "58.05",
  );
  equal(
    e('td[class="abc-def"]'),
    { res: [".abc-def"], ranges: [[10, 17]] },
    "58.06",
  );
  equal(
    e("td[class='abc-def']"),
    { res: [".abc-def"], ranges: [[10, 17]] },
    "58.07",
  );
});

test("59 - old bracket notation - classes that need trimming", () => {
  equal(
    e('td [ class = " abc-def " ]'),
    { res: [".abc-def"], ranges: [[15, 22]] },
    "59.01",
  );
  equal(
    e("td [ class = ' abc-def ' ]"),
    { res: [".abc-def"], ranges: [[15, 22]] },
    "59.02",
  );
  equal(
    e('td[class=" abc-def "]'),
    { res: [".abc-def"], ranges: [[11, 18]] },
    "59.03",
  );
  equal(
    e("td[class=' abc-def ']"),
    { res: [".abc-def"], ranges: [[11, 18]] },
    "59.04",
  );
});

test("60 - old bracket notation - ids", () => {
  equal(e("td[id=rr]"), { res: ["#rr"], ranges: [[6, 8]] }, "60.01");
  equal(e("td [ id = rr ]"), { res: ["#rr"], ranges: [[10, 12]] }, "60.02");
  equal(
    e("td [ id = abc-def ]"),
    { res: ["#abc-def"], ranges: [[10, 17]] },
    "60.03",
  );
  equal(
    e('td [ id = "abc-def" ]'),
    { res: ["#abc-def"], ranges: [[11, 18]] },
    "60.04",
  );
  equal(
    e("td [ id = 'abc-def' ]"),
    { res: ["#abc-def"], ranges: [[11, 18]] },
    "60.05",
  );
  equal(
    e('td[id="abc-def"]'),
    { res: ["#abc-def"], ranges: [[7, 14]] },
    "60.06",
  );
  equal(
    e("td[id='abc-def']"),
    { res: ["#abc-def"], ranges: [[7, 14]] },
    "60.07",
  );
});

test("61 - old bracket notation - ids that need trimming", () => {
  equal(
    e('td [ id = " abc-def " ]'),
    { res: ["#abc-def"], ranges: [[12, 19]] },
    "61.01",
  );
  equal(
    e("td [ id = ' abc-def ' ]"),
    { res: ["#abc-def"], ranges: [[12, 19]] },
    "61.02",
  );
  equal(
    e('td[id=" abc-def "]'),
    { res: ["#abc-def"], ranges: [[8, 15]] },
    "61.03",
  );
  equal(
    e("td[id=' abc-def ']"),
    { res: ["#abc-def"], ranges: [[8, 15]] },
    "61.04",
  );
});

test("62 - old bracket notation - empty values", () => {
  // .
  equal(e("td[class=']"), { res: [], ranges: null }, "62.01");
  equal(e("td[class='']"), { res: [], ranges: null }, "62.02");
  equal(e('td[class="]'), { res: [], ranges: null }, "62.03");
  equal(e('td[class=""]'), { res: [], ranges: null }, "62.04");

  equal(e("td [ class= ' ]"), { res: [], ranges: null }, "62.05");
  equal(e("td [ class= '' ]"), { res: [], ranges: null }, "62.06");
  equal(e('td [ class= " ]'), { res: [], ranges: null }, "62.07");
  equal(e('td [ class= "" ]'), { res: [], ranges: null }, "62.08");
  // #
  equal(e("td[id=']"), { res: [], ranges: null }, "62.09");
  equal(e("td[id='']"), { res: [], ranges: null }, "62.10");
  equal(e('td[id="]'), { res: [], ranges: null }, "62.11");
  equal(e('td[id=""]'), { res: [], ranges: null }, "62.12");

  equal(e("td [ id= ' ]"), { res: [], ranges: null }, "62.13");
  equal(e("td [ id= '' ]"), { res: [], ranges: null }, "62.14");
  equal(e('td [ id= " ]'), { res: [], ranges: null }, "62.15");
  equal(e('td [ id= "" ]'), { res: [], ranges: null }, "62.16");
});

// ==============================
// Precautions
// ==============================

test("63 - missing input args", () => {
  throws(
    () => {
      e(undefined);
    },
    /THROW_ID_01/g,
    "63.01",
  );
});

test("64 - the first input arg of a wrong type", () => {
  throws(
    () => {
      e(1);
    },
    /THROW_ID_01/g,
    "64.01",
  );
});

// ==============================
// encoded strings given by JS
// discovered working on emailcomb.com
// ==============================

test("65 - encoded line breaks", () => {
  equal(
    e("#unused-1\n\n\n\n\t\t\t\t\nz\t\ta"),
    { res: ["#unused-1"], ranges: [[0, 9]] },
    "65.01",
  );
});

test("66 - recognises JS escaped strings and repeated dots & hashes", () => {
  equal(
    e(
      "\naaa\n...    .unused-1\n\n\n.unused-2, .unused-3\n\t\t,,,\t###\t\nz\t\ta",
    ),
    {
      res: [".unused-1", ".unused-2", ".unused-3"],
      ranges: [
        [12, 21],
        [24, 33],
        [35, 44],
      ],
    },
    "66.01",
  );
});

test("67 - escaped punctuation stays within the raw selector", () => {
  equal(
    e(String.raw`.\@sm\:block`),
    {
      res: [String.raw`.\@sm\:block`],
      ranges: [[0, 12]],
    },
    "67.01",
  );
  equal(
    e(String.raw`#item\#one`),
    {
      res: [String.raw`#item\#one`],
      ranges: [[0, 10]],
    },
    "67.02",
  );
  equal(e(".foo:hover"), { res: [".foo"], ranges: [[0, 4]] }, "67.03");
  equal(
    e(String.raw`.foo\:hover`),
    {
      res: [String.raw`.foo\:hover`],
      ranges: [[0, 11]],
    },
    "67.04",
  );
  equal(
    e(String.raw`.foo\.bar`),
    {
      res: [String.raw`.foo\.bar`],
      ranges: [[0, 9]],
    },
    "67.05",
  );
  equal(
    e(String.raw`div\.not-a-class .actual`),
    { res: [".actual"], ranges: [[17, 24]] },
    "67.06",
  );
  equal(
    e(String.raw`.foo\\.bar`),
    {
      res: [String.raw`.foo\\`, ".bar"],
      ranges: [
        [0, 6],
        [6, 10],
      ],
    },
    "67.07",
  );
});

test("68 - escaped identifiers in attribute selector notation", () => {
  equal(
    e(String.raw`td[class=\@sm\:block]`),
    {
      res: [String.raw`.\@sm\:block`],
      ranges: [[9, 20]],
    },
    "68.01",
  );
  equal(
    e(String.raw`td[class="\@sm\:block"]`),
    {
      res: [String.raw`.\@sm\:block`],
      ranges: [[10, 21]],
    },
    "68.02",
  );
  equal(
    e(String.raw`td[id=\@sm\:block]`),
    {
      res: [String.raw`#\@sm\:block`],
      ranges: [[6, 17]],
    },
    "68.03",
  );
  equal(
    e(String.raw`td[id='\@sm\:block']`),
    {
      res: [String.raw`#\@sm\:block`],
      ranges: [[7, 18]],
    },
    "68.04",
  );
});

test("69 - CSS selector escape decoding", () => {
  equal(decodeCssSelector(String.raw`.\@sm\:block`), ".@sm:block", "69.01");
  equal(decodeCssSelector(".foo:hover"), ".foo:hover", "69.02");
  equal(decodeCssSelector(String.raw`.foo\:hover`), ".foo:hover", "69.03");
  equal(decodeCssSelector(String.raw`#item\#one`), "#item#one", "69.04");
  equal(decodeCssSelector(String.raw`.\40 sm\3A block`), ".@sm:block", "69.05");
  equal(
    decodeCssSelector(String.raw`.\000040sm\00003Ablock`),
    ".@sm:block",
    "69.06",
  );
  equal(decodeCssSelector(String.raw`#\31 23`), "#123", "69.07");
  equal(decodeCssSelector(String.raw`.\0 x`), ".�x", "69.08");
  equal(decodeCssSelector(String.raw`.\D800 x`), ".�x", "69.09");
  equal(decodeCssSelector(String.raw`.\110000 x`), ".�x", "69.10");
  equal(decodeCssSelector(String.raw`.\💩-pile`), ".💩-pile", "69.11");
  equal(decodeCssSelector(String.raw`.foo\\bar`), ".foo\\bar", "69.12");
  equal(decodeCssSelector(".foo\\"), ".foo�", "69.13");
  equal(decodeCssSelector(".foo\\\nbar"), ".foo\\\nbar", "69.14");
  equal(decodeCssSelector(".\\40\r\nsm"), ".@sm", "69.15");
});

test("70 - reads one lossless and canonical selector token", () => {
  equal(
    readCssSelectorToken(String.raw`x.\@sm\:block:hover`, 1),
    {
      value: ".@sm:block",
      raw: String.raw`.\@sm\:block`,
      range: [1, 13],
    },
    "70.01",
  );
  equal(
    readCssSelectorToken(".foo:hover", 0),
    { value: ".foo", raw: ".foo", range: [0, 4] },
    "70.02",
  );
  equal(
    readCssSelectorToken(String.raw`.foo\:hover`, 0),
    {
      value: ".foo:hover",
      raw: String.raw`.foo\:hover`,
      range: [0, 11],
    },
    "70.03",
  );
  equal(
    readCssSelectorToken(".foo.bar", 0),
    { value: ".foo", raw: ".foo", range: [0, 4] },
    "70.04",
  );
  equal(readCssSelectorToken(String.raw`x\.not-a-class`, 2), null, "70.05");
  equal(
    readCssSelectorToken(String.raw`x\\.actual`, 3),
    { value: ".actual", raw: ".actual", range: [3, 10] },
    "70.06",
  );
  equal(readCssSelectorToken(".", 0), null, "70.07");
  equal(readCssSelectorToken("plain", 0), null, "70.08");
  equal(readCssSelectorToken(".foo", -1), null, "70.09");
  equal(readCssSelectorToken(".foo", 99), null, "70.10");
});

test("71 - hexadecimal escapes retain their raw terminators and ranges", () => {
  equal(
    e(String.raw`.\40 sm\3A block:hover`),
    {
      res: [String.raw`.\40 sm\3A block`],
      ranges: [[0, 16]],
    },
    "71.01",
  );
  equal(
    e(String.raw`.\000040sm\00003Ablock:hover`),
    {
      res: [String.raw`.\000040sm\00003Ablock`],
      ranges: [[0, 22]],
    },
    "71.02",
  );
  equal(
    e(".\\40\r\nsm:hover"),
    {
      res: [".\\40\r\nsm"],
      ranges: [[0, 8]],
    },
    "71.03",
  );
  equal(
    readCssSelectorToken(String.raw`x#\31 23:hover`, 1),
    {
      value: "#123",
      raw: String.raw`#\31 23`,
      range: [1, 8],
    },
    "71.04",
  );
});

test("72 - escape helper input validation", () => {
  throws(
    () => {
      decodeCssSelector();
    },
    /THROW_ID_02/g,
    "72.01",
  );
  throws(
    () => {
      readCssSelectorToken(undefined, 0);
    },
    /THROW_ID_03/g,
    "72.02",
  );
  throws(
    () => {
      readCssSelectorToken(".foo", "0");
    },
    /THROW_ID_04/g,
    "72.03",
  );
});

test("73 - only CSS whitespace terminates selector identifiers", () => {
  let nbspSelector = ".foo\u00a0bar";
  let emSpaceSelector = ".foo\u2003bar";
  let escapedNbspSelector = ".foo\\\u00a0bar";

  equal(e(nbspSelector), { res: [nbspSelector], ranges: [[0, 8]] }, "73.01");
  equal(
    e(emSpaceSelector),
    { res: [emSpaceSelector], ranges: [[0, 8]] },
    "73.02",
  );
  equal(
    readCssSelectorToken(`x${nbspSelector}:hover`, 1),
    {
      value: nbspSelector,
      raw: nbspSelector,
      range: [1, 9],
    },
    "73.03",
  );
  equal(decodeCssSelector(nbspSelector), nbspSelector, "73.04");
  equal(
    e(escapedNbspSelector),
    { res: [escapedNbspSelector], ranges: [[0, 9]] },
    "73.05",
  );
  equal(
    readCssSelectorToken(escapedNbspSelector, 0),
    {
      value: nbspSelector,
      raw: escapedNbspSelector,
      range: [0, 9],
    },
    "73.06",
  );
  equal(decodeCssSelector(escapedNbspSelector), nbspSelector, "73.07");
  equal(
    e(".a\t.b\n#c\r.d\f#e .f"),
    {
      res: [".a", ".b", "#c", ".d", "#e", ".f"],
      ranges: [
        [0, 2],
        [3, 5],
        [6, 8],
        [9, 11],
        [12, 14],
        [15, 17],
      ],
    },
    "73.08",
  );
  equal(decodeCssSelector(emSpaceSelector), emSpaceSelector, "73.09");
});

test("74 - failed attribute selectors do not affect later selectors", () => {
  equal(
    e("[class=]#id [class=] .class"),
    {
      res: ["#id", ".class"],
      ranges: [
        [8, 11],
        [21, 27],
      ],
    },
    "74.01",
  );
  equal(
    e('[class=""]#id [class=""] .class'),
    {
      res: ["#id", ".class"],
      ranges: [
        [10, 13],
        [25, 31],
      ],
    },
    "74.02",
  );
  equal(
    e("[class=1]#id [class=1] .class"),
    {
      res: ["#id", ".class"],
      ranges: [
        [9, 12],
        [23, 29],
      ],
    },
    "74.03",
  );
  equal(
    e("[id=].class [id=] #id"),
    {
      res: [".class", "#id"],
      ranges: [
        [5, 11],
        [18, 21],
      ],
    },
    "74.04",
  );
  equal(
    e("[id=''].class [id=''] #id"),
    {
      res: [".class", "#id"],
      ranges: [
        [7, 13],
        [22, 25],
      ],
    },
    "74.05",
  );
  equal(
    e("[id=1].class [id=1] #id"),
    {
      res: [".class", "#id"],
      ranges: [
        [6, 12],
        [20, 23],
      ],
    },
    "74.06",
  );
});

test("75 - exact tokens follow CSS identifier rules", () => {
  equal(readCssSelectorToken(".1a", 0), null, "75.01");
  equal(readCssSelectorToken(".-", 0), null, "75.02");
  equal(readCssSelectorToken("#1a", 0), null, "75.03");
  equal(readCssSelectorToken(".\u0001a", 0), null, "75.04");
  equal(
    readCssSelectorToken(".a\u0001b", 0),
    { value: ".a", raw: ".a", range: [0, 2] },
    "75.05",
  );
  equal(
    readCssSelectorToken(".\u0000x", 0),
    { value: ".�x", raw: ".\u0000x", range: [0, 3] },
    "75.06",
  );
  equal(
    readCssSelectorToken(".\ud800x", 0),
    { value: ".�x", raw: ".\ud800x", range: [0, 3] },
    "75.07",
  );
  equal(
    readCssSelectorToken(".💩x", 0),
    { value: ".💩x", raw: ".💩x", range: [0, 4] },
    "75.08",
  );
  equal(
    readCssSelectorToken(".a\\", 0),
    { value: ".a�", raw: ".a\\", range: [0, 3] },
    "75.09",
  );
  equal(
    readCssSelectorToken(".a\\\nb", 0),
    { value: ".a", raw: ".a", range: [0, 2] },
    "75.10",
  );
  equal(
    readCssSelectorToken(".-name", 0),
    { value: ".-name", raw: ".-name", range: [0, 6] },
    "75.11",
  );
  equal(
    readCssSelectorToken(".--name", 0),
    { value: ".--name", raw: ".--name", range: [0, 7] },
    "75.12",
  );
  equal(
    readCssSelectorToken(String.raw`.\31 name`, 0),
    { value: ".1name", raw: String.raw`.\31 name`, range: [0, 9] },
    "75.13",
  );
  equal(decodeCssSelector(".\u0000\ud800"), ".��", "75.14");
  equal(decodeCssSelector(".\\\u0000"), ".�", "75.15");
  equal(decodeCssSelector(".\udc00"), ".�", "75.16");
});

test.run();
