import tap from "tap";
import e from "../dist/string-extract-class-names.esm";

// ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char

// ==============================
// normal use cases
// ==============================

tap.test(
  "01 - class: just class passed, nothing done, falls on default",
  (t) => {
    t.same(e(".class-name"), [".class-name"], "01.01");
    t.same(e(".class-name", true), [[0, 11]], "01.02");
    t.end();
  }
);

tap.test("02 - tag with two classes", (t) => {
  t.same(
    e("div.first-class.second-class"),
    [".first-class", ".second-class"],
    "02.01"
  );
  t.same(
    e("div.first-class.second-class", true),
    [
      [3, 15],
      [15, 28],
    ],
    "02.02"
  );
  t.end();
});

tap.test("03 - class: class within tag", (t) => {
  t.same(e("div .class-name"), [".class-name"], "03.01");
  t.same(e("div .class-name "), [".class-name"], "03.02");
  t.same(e("div       .class-name        "), [".class-name"], "03.03");
  t.same(
    e("div       .first-class.second-class        "),
    [".first-class", ".second-class"],
    "03.04"
  );

  // ------

  t.same(e("div .class-name", true), [[4, 15]], "03.05");
  t.same(e("div .class-name ", true), [[4, 15]], "03.06");
  t.same(e("div       .class-name        ", true), [[10, 21]], "03.07");
  t.same(
    e("div       .first-class.second-class        ", true),
    [
      [10, 22],
      [22, 35],
    ],
    "03.08"
  );
  t.end();
});

tap.test("04 - class: class within tag's child tag", (t) => {
  t.same(e("div .class-name a"), [".class-name"], "04.01");
  t.same(
    e("div .first-class.second-class a"),
    [".first-class", ".second-class"],
    "04.02"
  );
  // -------
  t.same(e("div .class-name a", true), [[4, 15]], "04.03");
  t.same(
    e("div .first-class.second-class a", true),
    [
      [4, 16],
      [16, 29],
    ],
    "04.04"
  );
  t.end();
});

tap.test("05 - class: more, sandwitched", (t) => {
  t.same(
    e(
      "div~!@$%^&*()+=,/';:\"?><[]{}|`.class-name~!@$%^&*()+=,/';:\"?><[]{}|`#"
    ),
    [".class-name"],
    "05.01"
  );
  t.same(
    e(
      "div~!@$%^&*()+=,/';:\"?><[]{}|`.class-name~!@$%^&*()+=,/';:\"?><[]{}|`#",
      true
    ),
    [[30, 41]],
    "05.02"
  );
  t.end();
});

tap.test("06 - class: exclamation mark", (t) => {
  t.same(e("div .class-name!a"), [".class-name"], "06.01");
  t.same(e("div.class-name!a"), [".class-name"], "06.02");
  t.same(e(".class-name!a"), [".class-name"], "06.03");
  t.same(e("!.class-name!a"), [".class-name"], "06.04");
  t.same(
    e("!.first-class.second-class!a"),
    [".first-class", ".second-class"],
    "06.05"
  );
  // -------
  t.same(e("div .class-name!a", true), [[4, 15]], "06.06");
  t.same(e("div.class-name!a", true), [[3, 14]], "06.07");
  t.same(e(".class-name!a", true), [[0, 11]], "06.08");
  t.same(e("!.class-name!a", true), [[1, 12]], "06.09");
  t.same(
    e("!.first-class.second-class!a", true),
    [
      [1, 13],
      [13, 26],
    ],
    "06.10"
  );
  t.end();
});

tap.test("07 - class: ampersand", (t) => {
  t.same(e("div .class-name&a"), [".class-name"], "07.01");
  t.same(e("div.class-name&a"), [".class-name"], "07.02");
  t.same(e(".class-name&a"), [".class-name"], "07.03");
  t.same(e("&.class-name&a"), [".class-name"], "07.04");
  t.same(
    e("&.first-class.second-class&a"),
    [".first-class", ".second-class"],
    "07.05"
  );
  // -------
  t.same(e("div .class-name&a", true), [[4, 15]], "07.06");
  t.same(e("div.class-name&a", true), [[3, 14]], "07.07");
  t.same(e(".class-name&a", true), [[0, 11]], "07.08");
  t.same(e("&.class-name&a", true), [[1, 12]], "07.09");
  t.same(
    e("&.first-class.second-class&a", true),
    [
      [1, 13],
      [13, 26],
    ],
    "07.10"
  );
  t.end();
});

tap.test("08 - class: dollar", (t) => {
  t.same(e("div .class-name$a"), [".class-name"], "08.01");
  t.same(e("div.class-name$a"), [".class-name"], "08.02");
  t.same(e(".class-name$a"), [".class-name"], "08.03");
  t.same(e("$.class-name$a"), [".class-name"], "08.04");
  t.same(e("a[title~=name] .class-name$a"), [".class-name"], "08.05");
  t.same(
    e("a[title~=name] .first-class.second-class$a"),
    [".first-class", ".second-class"],
    "08.06"
  );
  // -------
  t.same(e("div .class-name$a", true), [[4, 15]], "08.07");
  t.same(e("div.class-name$a", true), [[3, 14]], "08.08");
  t.same(e(".class-name$a", true), [[0, 11]], "08.09");
  t.same(e("$.class-name$a", true), [[1, 12]], "08.10");
  t.same(e("a[title~=name] .class-name$a", true), [[15, 26]], "08.11");
  t.same(
    e("a[title~=name] .first-class.second-class$a", true),
    [
      [15, 27],
      [27, 40],
    ],
    "08.12"
  );
  t.end();
});

tap.test("09 - class: percentage", (t) => {
  t.same(e("div .class-name%a"), [".class-name"], "09.01");
  t.same(e("div.class-name%a"), [".class-name"], "09.02");
  t.same(e(".class-name%a"), [".class-name"], "09.03");
  t.same(e("%.class-name%a"), [".class-name"], "09.04");
  t.same(e("[%~class-name] .class-name%a"), [".class-name"], "09.05");
  t.same(
    e("[%~class-name] .first-class.second-class%a"),
    [".first-class", ".second-class"],
    "09.06"
  );
  // -------
  t.same(e("div .class-name%a", true), [[4, 15]], "09.07");
  t.same(e("div.class-name%a", true), [[3, 14]], "09.08");
  t.same(e(".class-name%a", true), [[0, 11]], "09.09");
  t.same(e("%.class-name%a", true), [[1, 12]], "09.10");
  t.same(e("[%~class-name] .class-name%a", true), [[15, 26]], "09.11");
  t.same(
    e("[%~class-name] .first-class.second-class%a", true),
    [
      [15, 27],
      [27, 40],
    ],
    "09.12"
  );
  t.end();
});

tap.test("10 - class: circumflex", (t) => {
  t.same(e('a.class-name[href^="https"]'), [".class-name"], "10.01");
  t.same(
    e('a.first-class.second-class[href^="https"]'),
    [".first-class", ".second-class"],
    "10.02"
  );
  // -------
  t.same(e('a.class-name[href^="https"]', true), [[1, 12]], "10.03");
  t.same(
    e('a.first-class.second-class[href^="https"]', true),
    [
      [1, 13],
      [13, 26],
    ],
    "10.04"
  );
  t.end();
});

tap.test("11 - class: ampersand", (t) => {
  t.same(e(".class-name &"), [".class-name"], "11.01");
  t.same(
    e(".first-class.second-class &"),
    [".first-class", ".second-class"],
    "11.02"
  );
  // -------
  t.same(e(".class-name &", true), [[0, 11]], "11.03");
  t.same(
    e(".first-class.second-class &", true),
    [
      [0, 12],
      [12, 25],
    ],
    "11.04"
  );
  t.end();
});

tap.test("12 - class: asterisk", (t) => {
  t.same(e(".class-name *"), [".class-name"], "12.01");
  t.same(e("*.class-name *"), [".class-name"], "12.02");
  t.same(
    e("*.first-class.second-class*"),
    [".first-class", ".second-class"],
    "12.03"
  );
  // -------
  t.same(e(".class-name *", true), [[0, 11]], "12.04");
  t.same(e("*.class-name *", true), [[1, 12]], "12.05");
  t.same(
    e("*.first-class.second-class*", true),
    [
      [1, 13],
      [13, 26],
    ],
    "12.06"
  );
  t.end();
});

tap.test("13 - class: brackets", (t) => {
  t.same(e("p.class-name:lang(it)"), [".class-name"], "13.01");
  t.same(
    e("p.class-name:lang(it) p.class-name-other:lang(en)"),
    [".class-name", ".class-name-other"],
    "13.02"
  );
  t.same(
    e(":.first-class.second-class:"),
    [".first-class", ".second-class"],
    "13.03"
  );
  // -------
  t.same(e("p.class-name:lang(it)", true), [[1, 12]], "13.04");
  t.same(
    e("p.class-name:lang(it) p.class-name-other:lang(en)", true),
    [
      [1, 12],
      [23, 40],
    ],
    "13.05"
  );
  t.same(
    e(":.first-class.second-class:", true),
    [
      [1, 13],
      [13, 26],
    ],
    "13.06"
  );
  t.end();
});

tap.test("14 - class: plus", (t) => {
  t.same(e("div.class-name + p"), [".class-name"], "14.01");
  t.same(e("div.class-name+p"), [".class-name"], "14.02");
  t.same(
    e("+.first-class.second-class+"),
    [".first-class", ".second-class"],
    "14.03"
  );
  // -------
  t.same(e("div.class-name + p", true), [[3, 14]], "14.04");
  t.same(e("div.class-name+p", true), [[3, 14]], "14.05");
  t.same(
    e("+.first-class.second-class+", true),
    [
      [1, 13],
      [13, 26],
    ],
    "14.06"
  );
  t.end();
});

tap.test("15 - class: equals", (t) => {
  t.same(e('a.class-name[href*="npmjs"]'), [".class-name"], "15.01");
  t.same(e('a.class-name [href *= "npmjs"]'), [".class-name"], "15.02");
  t.same(
    e("=.first-class.second-class="),
    [".first-class", ".second-class"],
    "15.03"
  );
  // -------
  t.same(e('a.class-name[href*="npmjs"]', true), [[1, 12]], "15.04");
  t.same(e('a.class-name [href *= "npmjs"]', true), [[1, 12]], "15.05");
  t.same(
    e("=.first-class.second-class=", true),
    [
      [1, 13],
      [13, 26],
    ],
    "15.06"
  );
  t.end();
});

tap.test("16 - class: colon", (t) => {
  t.same(
    e(".class-name, .class-name-other"),
    [".class-name", ".class-name-other"],
    "16.01"
  );
  t.same(
    e(".class-name,.class-name-other"),
    [".class-name", ".class-name-other"],
    "16.02"
  );
  t.same(
    e(",.first-class.second-class,"),
    [".first-class", ".second-class"],
    "16.03"
  );
  // -------
  t.same(
    e(".class-name, .class-name-other", true),
    [
      [0, 11],
      [13, 30],
    ],
    "16.04"
  );
  t.same(
    e(".class-name,.class-name-other", true),
    [
      [0, 11],
      [12, 29],
    ],
    "16.05"
  );
  t.same(
    e(",.first-class.second-class,", true),
    [
      [1, 13],
      [13, 26],
    ],
    "16.06"
  );
  t.end();
});

tap.test("17 - class: right slash", (t) => {
  t.same(e(".class-name/class-name-other"), [".class-name"], "17.01");
  t.same(e(".class-name /class-name-other"), [".class-name"], "17.02");
  t.same(
    e("/.first-class.second-class/"),
    [".first-class", ".second-class"],
    "17.03"
  );
  // -------
  t.same(e(".class-name/class-name-other", true), [[0, 11]], "17.04");
  t.same(e(".class-name /class-name-other", true), [[0, 11]], "17.05");
  t.same(
    e("/.first-class.second-class/", true),
    [
      [1, 13],
      [13, 26],
    ],
    "17.06"
  );
  t.end();
});

tap.test("18 - class: apostrophe", (t) => {
  t.same(e(".class-name'"), [".class-name"], "18.01");
  t.same(e("'.class-name"), [".class-name"], "18.02");
  t.same(
    e("'.first-class.second-class'"),
    [".first-class", ".second-class"],
    "18.03"
  );
  // -------
  t.same(e(".class-name'", true), [[0, 11]], "18.04");
  t.same(e("'.class-name", true), [[1, 12]], "18.05");
  t.same(
    e("'.first-class.second-class'", true),
    [
      [1, 13],
      [13, 26],
    ],
    "18.06"
  );
  t.end();
});

tap.test("19 - class: semicolon", (t) => {
  t.same(
    e(".class-name-1;.class-name-2"),
    [".class-name-1", ".class-name-2"],
    "19.01"
  );
  t.same(
    e(".class-name-1;.class-name-2"),
    [".class-name-1", ".class-name-2"],
    "19.02"
  );
  t.same(
    e(";.class-name-1;.class-name-2;"),
    [".class-name-1", ".class-name-2"],
    "19.03"
  );
  t.same(
    e(";.first-class.second-class;"),
    [".first-class", ".second-class"],
    "19.04"
  );
  // -------
  t.same(
    e(".class-name-1;.class-name-2", true),
    [
      [0, 13],
      [14, 27],
    ],
    "19.05"
  );
  t.same(
    e(".class-name-1;.class-name-2", true),
    [
      [0, 13],
      [14, 27],
    ],
    "19.06"
  );
  t.same(
    e(";.class-name-1;.class-name-2;", true),
    [
      [1, 14],
      [15, 28],
    ],
    "19.07"
  );
  t.same(
    e(";.first-class.second-class;", true),
    [
      [1, 13],
      [13, 26],
    ],
    "19.08"
  );
  t.end();
});

tap.test("20 - class: colon", (t) => {
  t.same(e("input.class-name:read-only"), [".class-name"], "20.01");
  t.same(
    e("input:out-of-range .class-name input:out-of-range"),
    [".class-name"],
    "20.02"
  );
  t.same(
    e(
      "input:out-of-range .class-name::selection input:out-of-range::selection"
    ),
    [".class-name"],
    "20.03"
  );
  t.same(
    e(":.first-class.second-class:"),
    [".first-class", ".second-class"],
    "20.04"
  );
  // -------
  t.same(e("input.class-name:read-only", true), [[5, 16]], "20.05");
  t.same(
    e("input:out-of-range .class-name input:out-of-range", true),
    [[19, 30]],
    "20.06"
  );
  t.same(
    e(
      "input:out-of-range .class-name::selection input:out-of-range::selection",
      true
    ),
    [[19, 30]],
    "20.07"
  );
  t.same(
    e(":.first-class.second-class:", true),
    [
      [1, 13],
      [13, 26],
    ],
    "20.08"
  );
  t.end();
});

tap.test("21 - class: double quote", (t) => {
  t.same(e('.class-name a[href^="https"]'), [".class-name"], "21.01");
  t.same(
    e('a[href^="https"] .class-name a[href^="https"]'),
    [".class-name"],
    "21.02"
  );
  t.same(e('"https".class-name"https"'), [".class-name"], "21.03");
  t.same(
    e('"https".first-class.second-class"https"'),
    [".first-class", ".second-class"],
    "21.04"
  );
  // -------
  t.same(e('.class-name a[href^="https"]', true), [[0, 11]], "21.05");
  t.same(
    e('a[href^="https"] .class-name a[href^="https"]', true),
    [[17, 28]],
    "21.06"
  );
  t.same(e('"https".class-name"https"', true), [[7, 18]], "21.07");
  t.same(
    e('"https".first-class.second-class"https"', true),
    [
      [7, 19],
      [19, 32],
    ],
    "21.08"
  );
  t.end();
});

tap.test("22 - class: question mark", (t) => {
  t.same(e(".class-name ?"), [".class-name"], "22.01");
  t.same(e("? .class-name?"), [".class-name"], "22.02");
  t.same(e("?.class-name?"), [".class-name"], "22.03");
  t.same(
    e("?.first-class.second-class?"),
    [".first-class", ".second-class"],
    "22.04"
  );
  // -------
  t.same(e(".class-name ?", true), [[0, 11]], "22.05");
  t.same(e("? .class-name?", true), [[2, 13]], "22.06");
  t.same(e("?.class-name?", true), [[1, 12]], "22.07");
  t.same(
    e("?.first-class.second-class?", true),
    [
      [1, 13],
      [13, 26],
    ],
    "22.08"
  );
  t.end();
});

tap.test("23 - class: greater than sign", (t) => {
  t.same(e(".class-name> p"), [".class-name"], "23.01");
  t.same(
    e("* > .class-name > p > .class-name-other"),
    [".class-name", ".class-name-other"],
    "23.02"
  );
  t.same(
    e("*.class-name> .class-name-other> p > .class-name-another"),
    [".class-name", ".class-name-other", ".class-name-another"],
    "23.03"
  );
  t.same(
    e(">.class1.class2> .class3.class4> p > .class5.class6"),
    [".class1", ".class2", ".class3", ".class4", ".class5", ".class6"],
    "23.04"
  );
  // -------
  t.same(e(".class-name> p", true), [[0, 11]], "23.05");
  t.same(
    e("* > .class-name > p > .class-name-other", true),
    [
      [4, 15],
      [22, 39],
    ],
    "23.06"
  );
  t.same(
    e("*.class-name> .class-name-other> p > .class-name-another", true),
    [
      [1, 12],
      [14, 31],
      [37, 56],
    ],
    "23.07"
  );
  t.same(
    e(">.class1.class2> .class3.class4> p > .class5.class6", true),
    [
      [1, 8],
      [8, 15],
      [17, 24],
      [24, 31],
      [37, 44],
      [44, 51],
    ],
    "23.08"
  );
  t.end();
});

tap.test("24 - class: square brackets", (t) => {
  t.same(
    e("a[target=_blank] .class-name a[target=_blank]"),
    [".class-name"],
    "24.01"
  );
  t.same(
    e("a[target=_blank] .class-name[target=_blank]"),
    [".class-name"],
    "24.02"
  );
  t.same(
    e("a[target=_blank].class-name[target=_blank]"),
    [".class-name"],
    "24.03"
  );
  t.same(
    e("a[target=_blank].first-class.second-class[target=_blank]"),
    [".first-class", ".second-class"],
    "24.04"
  );
  // -------
  t.same(
    e("a[target=_blank] .class-name a[target=_blank]", true),
    [[17, 28]],
    "24.05"
  );
  t.same(
    e("a[target=_blank] .class-name[target=_blank]", true),
    [[17, 28]],
    "24.06"
  );
  t.same(
    e("a[target=_blank].class-name[target=_blank]", true),
    [[16, 27]],
    "24.07"
  );
  t.same(
    e("a[target=_blank].first-class.second-class[target=_blank]", true),
    [
      [16, 28],
      [28, 41],
    ],
    "24.08"
  );
  t.end();
});

tap.test("25 - class: curly brackets", (t) => {
  t.same(
    e("a{target=_blank} .class-name a{target=_blank}"),
    [".class-name"],
    "25.01"
  );
  t.same(
    e("a{target=_blank} .class-name{target=_blank}"),
    [".class-name"],
    "25.02"
  );
  t.same(
    e("a{target=_blank}.class-name{target=_blank}"),
    [".class-name"],
    "25.03"
  );
  t.same(
    e("a{target=_blank}.first-class.second-class{target=_blank}"),
    [".first-class", ".second-class"],
    "25.04"
  );
  // -------
  t.same(
    e("a{target=_blank} .class-name a{target=_blank}", true),
    [[17, 28]],
    "25.05"
  );
  t.same(
    e("a{target=_blank} .class-name{target=_blank}", true),
    [[17, 28]],
    "25.06"
  );
  t.same(
    e("a{target=_blank}.class-name{target=_blank}", true),
    [[16, 27]],
    "25.07"
  );
  t.same(
    e("a{target=_blank}.first-class.second-class{target=_blank}", true),
    [
      [16, 28],
      [28, 41],
    ],
    "25.08"
  );
  t.end();
});

tap.test("26 - class: pipe", (t) => {
  t.same(e("|.class-name|=en]"), [".class-name"], "26.01");
  t.same(e("a[lang|=en] .class-name[lang|=en]"), [".class-name"], "26.02");
  t.same(e("|.class-name|"), [".class-name"], "26.03");
  t.same(
    e("|.first-class.second-class|"),
    [".first-class", ".second-class"],
    "26.04"
  );
  // -------
  t.same(e("|.class-name|=en]", true), [[1, 12]], "26.05");
  t.same(e("a[lang|=en] .class-name[lang|=en]", true), [[12, 23]], "26.06");
  t.same(e("|.class-name|", true), [[1, 12]], "26.07");
  t.same(
    e("|.first-class.second-class|", true),
    [
      [1, 13],
      [13, 26],
    ],
    "26.08"
  );
  t.end();
});

tap.test("27 - class: tick", (t) => {
  t.same(e("`.class-name`"), [".class-name"], "27.01");
  t.same(
    e("`.first-class.second-class`"),
    [".first-class", ".second-class"],
    "27.02"
  );
  // -------
  t.same(e("`.class-name`", true), [[1, 12]], "27.03");
  t.same(
    e("`.first-class.second-class`", true),
    [
      [1, 13],
      [13, 26],
    ],
    "27.04"
  );
  t.end();
});

tap.test("28 - one-letter class names", (t) => {
  t.same(e(".h"), [".h"], "28.01");
  t.same(e(".a.b.c"), [".a", ".b", ".c"], "28.02");
  // -------
  t.same(e(".h", true), [[0, 2]], "28.03");
  t.same(
    e(".a.b.c", true),
    [
      [0, 2],
      [2, 4],
      [4, 6],
    ],
    "28.04"
  );
  t.end();
});

// ==============================
// Hash, in case if ID's are found
// ==============================

tap.test("29 - id: just id passed, nothing done, falls on default", (t) => {
  t.same(e("#id-name"), ["#id-name"], "29.01");
  t.same(e("#id-name", true), [[0, 8]], "29.02");
  t.end();
});

tap.test("30 - id: tag with id", (t) => {
  t.same(e("div#id-name#whatever"), ["#id-name", "#whatever"], "30.01");
  t.same(
    e("div#id-name.class.another"),
    ["#id-name", ".class", ".another"],
    "30.02"
  );
  // -------
  t.same(
    e("div#id-name#whatever", true),
    [
      [3, 11],
      [11, 20],
    ],
    "30.03"
  );
  t.same(
    e("div#id-name.class.another", true),
    [
      [3, 11],
      [11, 17],
      [17, 25],
    ],
    "30.04"
  );
  t.end();
});

tap.test("31 - id: id within tag", (t) => {
  t.same(e("div #id-name"), ["#id-name"], "31.01");
  t.same(e("div #id-name "), ["#id-name"], "31.02");
  t.same(e("div       #id-name        "), ["#id-name"], "31.03");
  t.same(
    e("div       #first-id#second-id        "),
    ["#first-id", "#second-id"],
    "31.04"
  );
  // -------
  t.same(e("div #id-name", true), [[4, 12]], "31.05");
  t.same(e("div #id-name ", true), [[4, 12]], "31.06");
  t.same(e("div       #id-name        ", true), [[10, 18]], "31.07");
  t.same(
    e("div       #first-id#second-id        ", true),
    [
      [10, 19],
      [19, 29],
    ],
    "31.08"
  );
  t.end();
});

tap.test("32 - id: id within tag's child tag", (t) => {
  t.same(e("div #id-name a"), ["#id-name"], "32.01");
  t.same(
    e("div #id-name#second#third a"),
    ["#id-name", "#second", "#third"],
    "32.02"
  );
  t.same(
    e("div #id-name.second.third a"),
    ["#id-name", ".second", ".third"],
    "32.03"
  );
  // -------
  t.same(e("div #id-name a", true), [[4, 12]], "32.04");
  t.same(
    e("div #id-name#second#third a", true),
    [
      [4, 12],
      [12, 19],
      [19, 25],
    ],
    "32.05"
  );
  t.same(
    e("div #id-name.second.third a", true),
    [
      [4, 12],
      [12, 19],
      [19, 25],
    ],
    "32.06"
  );
  t.end();
});

tap.test("33 - id: more, sandwitched", (t) => {
  t.same(
    e(
      "~!@$%^&*()+=,/';:\"?><[]{}|`#id-name#second#third[]yo~!@$%^&*()+=,/';:\"?><[]{}|`"
    ),
    ["#id-name", "#second", "#third"],
    "33.01"
  );
  t.same(
    e(
      "~!@$%^&*()+=,/';:\"?><[]{}|`#id-name#second#third[]yo~!@$%^&*()+=,/';:\"?><[]{}|`",
      true
    ),
    [
      [27, 35],
      [35, 42],
      [42, 48],
    ],
    "33.02"
  );
  t.end();
});

tap.test("34 - id: exclamation mark", (t) => {
  t.same(e("div #id-name!a"), ["#id-name"], "34.01");
  t.same(e("!#id-name!"), ["#id-name"], "34.02");
  t.same(
    e("!#id-name#second#third!"),
    ["#id-name", "#second", "#third"],
    "34.03"
  );
  t.same(
    e("!#id-name.second#third.fourth!"),
    ["#id-name", ".second", "#third", ".fourth"],
    "34.04"
  );
  // -------
  t.same(e("div #id-name!a", true), [[4, 12]], "34.05");
  t.same(e("!#id-name!", true), [[1, 9]], "34.06");
  t.same(
    e("!#id-name#second#third!", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
    ],
    "34.07"
  );
  t.same(
    e("!#id-name.second#third.fourth!", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
      [22, 29],
    ],
    "34.08"
  );
  t.end();
});

tap.test("35 - id: ampersand", (t) => {
  t.same(e("div #id-name&a"), ["#id-name"], "35.01");
  t.same(e("div#id-name&a"), ["#id-name"], "35.02");
  t.same(e("#id-name&a"), ["#id-name"], "35.03");
  t.same(e("&#id-name&a"), ["#id-name"], "35.04");
  t.same(
    e("&#id-name#second.third&a"),
    ["#id-name", "#second", ".third"],
    "35.05"
  );
  // -------
  t.same(e("div #id-name&a", true), [[4, 12]], "35.06");
  t.same(e("div#id-name&a", true), [[3, 11]], "35.07");
  t.same(e("#id-name&a", true), [[0, 8]], "35.08");
  t.same(e("&#id-name&a", true), [[1, 9]], "35.09");
  t.same(
    e("&#id-name#second.third&a", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
    ],
    "35.10"
  );
  t.end();
});

tap.test("36 - id: dollar", (t) => {
  t.same(e("div #id-name$a"), ["#id-name"], "36.01");
  t.same(e("div#id-name$a"), ["#id-name"], "36.02");
  t.same(e("#id-name$a"), ["#id-name"], "36.03");
  t.same(e("$#id-name$a"), ["#id-name"], "36.04");
  t.same(e("a[title~=name] #id-name$a"), ["#id-name"], "36.05");
  t.same(e("$#id-name$"), ["#id-name"], "36.06");
  t.same(e("$#id-name#second$"), ["#id-name", "#second"], "36.07");
  // -------
  t.same(e("div #id-name$a", true), [[4, 12]], "36.08");
  t.same(e("div#id-name$a", true), [[3, 11]], "36.09");
  t.same(e("#id-name$a", true), [[0, 8]], "36.10");
  t.same(e("$#id-name$a", true), [[1, 9]], "36.11");
  t.same(e("a[title~=name] #id-name$a", true), [[15, 23]], "36.12");
  t.same(e("$#id-name$", true), [[1, 9]], "36.13");
  t.same(
    e("$#id-name#second$", true),
    [
      [1, 9],
      [9, 16],
    ],
    "36.14"
  );
  t.end();
});

tap.test("37 - id: percentage", (t) => {
  t.same(e("div #id-name%a"), ["#id-name"], "37.01");
  t.same(e("div#id-name%a"), ["#id-name"], "37.02");
  t.same(e("#id-name%a"), ["#id-name"], "37.03");
  t.same(e("%#id-name%a"), ["#id-name"], "37.04");
  t.same(e("[%~class-name] #id-name%a"), ["#id-name"], "37.05");
  t.same(e("%#id-name%"), ["#id-name"], "37.06");
  t.same(e("%#id-name#second%"), ["#id-name", "#second"], "37.07");
  // -------
  t.same(e("div #id-name%a", true), [[4, 12]], "37.08");
  t.same(e("div#id-name%a", true), [[3, 11]], "37.09");
  t.same(e("#id-name%a", true), [[0, 8]], "37.10");
  t.same(e("%#id-name%a", true), [[1, 9]], "37.11");
  t.same(e("[%~class-name] #id-name%a", true), [[15, 23]], "37.12");
  t.same(e("%#id-name%", true), [[1, 9]], "37.13");
  t.same(
    e("%#id-name#second%", true),
    [
      [1, 9],
      [9, 16],
    ],
    "37.14"
  );
  t.end();
});

tap.test("38 - id: circumflex", (t) => {
  t.same(e('a#id-name[href^="https"]'), ["#id-name"], "38.01");
  t.same(e("^#id-name^"), ["#id-name"], "38.02");
  t.same(e("^#id-name#second^"), ["#id-name", "#second"], "38.03");
  // -------
  t.same(e('a#id-name[href^="https"]', true), [[1, 9]], "38.04");
  t.same(e("^#id-name^", true), [[1, 9]], "38.05");
  t.same(
    e("^#id-name#second^", true),
    [
      [1, 9],
      [9, 16],
    ],
    "38.06"
  );
  t.end();
});

tap.test("39 - id: ampersand", (t) => {
  t.same(e("#id-name &"), ["#id-name"], "39.01");
  t.same(e("&#id-name&"), ["#id-name"], "39.02");
  t.same(e("&#id-name#second&"), ["#id-name", "#second"], "39.03");
  // -------
  t.same(e("#id-name &", true), [[0, 8]], "39.04");
  t.same(e("&#id-name&", true), [[1, 9]], "39.05");
  t.same(
    e("&#id-name#second&", true),
    [
      [1, 9],
      [9, 16],
    ],
    "39.06"
  );
  t.end();
});

tap.test("40 - id: asterisk", (t) => {
  t.same(e("#id-name *"), ["#id-name"], "40.01");
  t.same(e("*#id-name *"), ["#id-name"], "40.02");
  t.same(e("*#id-name*"), ["#id-name"], "40.03");
  t.same(e("*#id-name#second*"), ["#id-name", "#second"], "40.04");
  // -------
  t.same(e("#id-name *", true), [[0, 8]], "40.05");
  t.same(e("*#id-name *", true), [[1, 9]], "40.06");
  t.same(e("*#id-name*", true), [[1, 9]], "40.07");
  t.same(
    e("*#id-name#second*", true),
    [
      [1, 9],
      [9, 16],
    ],
    "40.08"
  );
  t.end();
});

tap.test("41 - id: brackets", (t) => {
  t.same(e("p#id-name:lang(it)"), ["#id-name"], "41.01");
  t.same(
    e("p#id-name:lang(it) p#id-name-other:lang(en)"),
    ["#id-name", "#id-name-other"],
    "41.02"
  );
  t.same(e("()#id-name()"), ["#id-name"], "41.03");
  t.same(e("(#id-name)"), ["#id-name"], "41.04");
  t.same(
    e("(#id-name#second.class)"),
    ["#id-name", "#second", ".class"],
    "41.05"
  );
  // -------
  t.same(e("p#id-name:lang(it)", true), [[1, 9]], "41.06");
  t.same(
    e("p#id-name:lang(it) p#id-name-other:lang(en)", true),
    [
      [1, 9],
      [20, 34],
    ],
    "41.07"
  );
  t.same(e("()#id-name()", true), [[2, 10]], "41.08");
  t.same(e("(#id-name)", true), [[1, 9]], "41.09");
  t.same(
    e("(#id-name#second.class)", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
    ],
    "41.10"
  );
  t.end();
});

tap.test("42 - id: plus", (t) => {
  t.same(e("div#id-name + p"), ["#id-name"], "42.01");
  t.same(e("div#id-name+p"), ["#id-name"], "42.02");
  t.same(e("+#id-name+"), ["#id-name"], "42.03");
  t.same(e("+#id-name#second+"), ["#id-name", "#second"], "42.04");
  // -------
  t.same(e("div#id-name + p", true), [[3, 11]], "42.05");
  t.same(e("div#id-name+p", true), [[3, 11]], "42.06");
  t.same(e("+#id-name+", true), [[1, 9]], "42.07");
  t.same(
    e("+#id-name#second+", true),
    [
      [1, 9],
      [9, 16],
    ],
    "42.08"
  );
  t.end();
});

tap.test("43 - id: equals", (t) => {
  t.same(e('a#id-name[href*="npmjs"]'), ["#id-name"], "43.01");
  t.same(e('a#id-name [href *= "npmjs"]'), ["#id-name"], "43.02");
  t.same(e('a#id-name  [href *= "npmjs"]'), ["#id-name"], "43.03");
  t.same(e("=#id-name#second="), ["#id-name", "#second"], "43.04");
  // -------
  t.same(e('a#id-name[href*="npmjs"]', true), [[1, 9]], "43.05");
  t.same(e('a#id-name [href *= "npmjs"]', true), [[1, 9]], "43.06");
  t.same(e('a#id-name  [href *= "npmjs"]', true), [[1, 9]], "43.07");
  t.same(
    e("=#id-name#second=", true),
    [
      [1, 9],
      [9, 16],
    ],
    "43.08"
  );
  t.end();
});

tap.test("44 - id: colon", (t) => {
  t.same(
    e("#id-name, #id-name-other"),
    ["#id-name", "#id-name-other"],
    "44.01"
  );
  t.same(e("#id-name,#id-name-other"), ["#id-name", "#id-name-other"], "44.02");
  t.same(e(",#id-name,"), ["#id-name"], "44.03");
  t.same(e(",#id-name#second,"), ["#id-name", "#second"], "44.04");
  // -------
  t.same(
    e("#id-name, #id-name-other", true),
    [
      [0, 8],
      [10, 24],
    ],
    "44.05"
  );
  t.same(
    e("#id-name,#id-name-other", true),
    [
      [0, 8],
      [9, 23],
    ],
    "44.06"
  );
  t.same(e(",#id-name,", true), [[1, 9]], "44.07");
  t.same(
    e(",#id-name#second,", true),
    [
      [1, 9],
      [9, 16],
    ],
    "44.08"
  );
  t.end();
});

tap.test("45 - id: right slash", (t) => {
  t.same(e("#id-name/#id-name-other"), ["#id-name", "#id-name-other"], "45.01");
  t.same(
    e("/#id-name/#id-name-other"),
    ["#id-name", "#id-name-other"],
    "45.02"
  );
  t.same(e("/#id-name/"), ["#id-name"], "45.03");
  t.same(e("/#id-name#second/"), ["#id-name", "#second"], "45.04");
  // -------
  t.same(
    e("#id-name/#id-name-other", true),
    [
      [0, 8],
      [9, 23],
    ],
    "45.05"
  );
  t.same(
    e("/#id-name/#id-name-other", true),
    [
      [1, 9],
      [10, 24],
    ],
    "45.06"
  );
  t.same(e("/#id-name/", true), [[1, 9]], "45.07");
  t.same(
    e("/#id-name#second/", true),
    [
      [1, 9],
      [9, 16],
    ],
    "45.08"
  );
  t.end();
});

tap.test("46 - id: apostrophe", (t) => {
  t.same(e("#id-name'"), ["#id-name"], "46.01");
  t.same(e("'#id-name"), ["#id-name"], "46.02");
  t.same(e("'#id-name#second"), ["#id-name", "#second"], "46.03");
  // -------
  t.same(e("#id-name'", true), [[0, 8]], "46.04");
  t.same(e("'#id-name", true), [[1, 9]], "46.05");
  t.same(
    e("'#id-name#second", true),
    [
      [1, 9],
      [9, 16],
    ],
    "46.06"
  );
  t.end();
});

tap.test("47 - id: semicolon", (t) => {
  t.same(e("#id1;#id2"), ["#id1", "#id2"], "47.01");
  t.same(e("#id-name;#id-name-other"), ["#id-name", "#id-name-other"], "47.02");
  t.same(
    e(";#id-name;#id-name-other;"),
    ["#id-name", "#id-name-other"],
    "47.03"
  );
  t.same(e(";#id1#id2;#id3#id4;"), ["#id1", "#id2", "#id3", "#id4"], "47.04");
  // -------
  t.same(
    e("#id1;#id2", true),
    [
      [0, 4],
      [5, 9],
    ],
    "47.05"
  );
  t.same(
    e("#id-name;#id-name-other", true),
    [
      [0, 8],
      [9, 23],
    ],
    "47.06"
  );
  t.same(
    e(";#id-name;#id-name-other;", true),
    [
      [1, 9],
      [10, 24],
    ],
    "47.07"
  );
  t.same(
    e(";#id1#id2;#id3#id4;", true),
    [
      [1, 5],
      [5, 9],
      [10, 14],
      [14, 18],
    ],
    "47.08"
  );
  t.end();
});

tap.test("48 - id: colon", (t) => {
  t.same(e("input#id-name:read-only"), ["#id-name"], "48.01");
  t.same(
    e("input:out-of-range #id-name input:out-of-range"),
    ["#id-name"],
    "48.02"
  );
  t.same(
    e("input:out-of-range #id-name::selection input:out-of-range::selection"),
    ["#id-name"],
    "48.03"
  );
  t.same(
    e(
      "input:out-of-range #id-name#second.third::selection input:out-of-range::selection"
    ),
    ["#id-name", "#second", ".third"],
    "48.04"
  );
  // -------
  t.same(e("input#id-name:read-only", true), [[5, 13]], "48.05");
  t.same(
    e("input:out-of-range #id-name input:out-of-range", true),
    [[19, 27]],
    "48.06"
  );
  t.same(
    e(
      "input:out-of-range #id-name::selection input:out-of-range::selection",
      true
    ),
    [[19, 27]],
    "48.07"
  );
  t.same(
    e(
      "input:out-of-range #id-name#second.third::selection input:out-of-range::selection",
      true
    ),
    [
      [19, 27],
      [27, 34],
      [34, 40],
    ],
    "48.08"
  );
  t.end();
});

tap.test("49 - id: double quote", (t) => {
  t.same(e('#id-name a[href^="https"]'), ["#id-name"], "49.01");
  t.same(
    e('a[href^="https"] #id-name a[href^="https"]'),
    ["#id-name"],
    "49.02"
  );
  t.same(
    e('a[href^="https"] #id-name#second a[href^="https"]'),
    ["#id-name", "#second"],
    "49.03"
  );
  // -------
  t.same(e('#id-name a[href^="https"]', true), [[0, 8]], "49.04");
  t.same(
    e('a[href^="https"] #id-name a[href^="https"]', true),
    [[17, 25]],
    "49.05"
  );
  t.same(
    e('a[href^="https"] #id-name#second a[href^="https"]', true),
    [
      [17, 25],
      [25, 32],
    ],
    "49.06"
  );
  t.end();
});

tap.test("50 - id: question mark", (t) => {
  t.same(e("#id-name ?"), ["#id-name"], "50.01");
  t.same(e("?#id-name?"), ["#id-name"], "50.02");
  t.same(e("?#id-name#second?"), ["#id-name", "#second"], "50.03");
  // -------
  t.same(e("#id-name ?", true), [[0, 8]], "50.04");
  t.same(e("?#id-name?", true), [[1, 9]], "50.05");
  t.same(
    e("?#id-name#second?", true),
    [
      [1, 9],
      [9, 16],
    ],
    "50.06"
  );
  t.end();
});

tap.test("51 - id: question mark", (t) => {
  t.same(e("?#id-name?"), ["#id-name"], "51.01");
  t.same(
    e("?#id-name? > p > #id-name-other"),
    ["#id-name", "#id-name-other"],
    "51.02"
  );
  t.same(
    e("?#id-name-1? #id-name-2> p > #id-name-3"),
    ["#id-name-1", "#id-name-2", "#id-name-3"],
    "51.03"
  );
  t.same(
    e("?#id1#id2? #id3#id4> p > #id5#id6"),
    ["#id1", "#id2", "#id3", "#id4", "#id5", "#id6"],
    "51.04"
  );
  // -------
  t.same(e("?#id-name?", true), [[1, 9]], "51.05");
  t.same(
    e("?#id-name? > p > #id-name-other", true),
    [
      [1, 9],
      [17, 31],
    ],
    "51.06"
  );
  t.same(
    e("?#id-name-1? #id-name-2> p > #id-name-3", true),
    [
      [1, 11],
      [13, 23],
      [29, 39],
    ],
    "51.07"
  );
  t.same(
    e("?#id1#id2? #id3#id4> p > #id5#id6", true),
    [
      [1, 5],
      [5, 9],
      [11, 15],
      [15, 19],
      [25, 29],
      [29, 33],
    ],
    "51.08"
  );
  t.end();
});

tap.test("52 - id: square brackets", (t) => {
  t.same(
    e("a[target=_blank] #id-name a[target=_blank]"),
    ["#id-name"],
    "52.01"
  );
  t.same(e("a[target=_blank] #id-name[target=_blank]"), ["#id-name"], "52.02");
  t.same(
    e("[zzz]#id-name#second[target=_blank]"),
    ["#id-name", "#second"],
    "52.03"
  );
  t.same(e("zzz[#id-name#second]zzz"), ["#id-name", "#second"], "52.04");
  // -------
  t.same(
    e("a[target=_blank] #id-name a[target=_blank]", true),
    [[17, 25]],
    "52.05"
  );
  t.same(
    e("a[target=_blank] #id-name[target=_blank]", true),
    [[17, 25]],
    "52.06"
  );
  t.same(
    e("[zzz]#id-name#second[target=_blank]", true),
    [
      [5, 13],
      [13, 20],
    ],
    "52.07"
  );
  t.same(
    e("zzz[#id-name#second]zzz", true),
    [
      [4, 12],
      [12, 19],
    ],
    "52.08"
  );
  t.end();
});

tap.test("53 - id: curly brackets", (t) => {
  t.same(
    e("a{target=_blank} #id-name a{target=_blank}"),
    ["#id-name"],
    "53.01"
  );
  t.same(e("a{target=_blank} #id-name{target=_blank}"), ["#id-name"], "53.02");
  t.same(
    e("aaa{bbb}#id-name#second{ccc}ddd"),
    ["#id-name", "#second"],
    "53.03"
  );
  t.same(e("{#id-name#second}"), ["#id-name", "#second"], "53.04");
  t.same(e("zz{#id-name#second}zzz"), ["#id-name", "#second"], "53.05");
  // -------
  t.same(
    e("a{target=_blank} #id-name a{target=_blank}", true),
    [[17, 25]],
    "53.06"
  );
  t.same(
    e("a{target=_blank} #id-name{target=_blank}", true),
    [[17, 25]],
    "53.07"
  );
  t.same(
    e("aaa{bbb}#id-name#second{ccc}ddd", true),
    [
      [8, 16],
      [16, 23],
    ],
    "53.08"
  );
  t.same(
    e("{#id-name#second}", true),
    [
      [1, 9],
      [9, 16],
    ],
    "53.09"
  );
  t.same(
    e("zz{#id-name#second}zzz", true),
    [
      [3, 11],
      [11, 18],
    ],
    "53.10"
  );
  t.end();
});

tap.test("54 - id: pipe", (t) => {
  t.same(e("|#id-name|=en]"), ["#id-name"], "54.01");
  t.same(e("a[lang|=en] #id-name[lang|=en]"), ["#id-name"], "54.02");
  t.same(e("|#id-name#second|"), ["#id-name", "#second"], "54.03");
  // -------
  t.same(e("|#id-name|=en]", true), [[1, 9]], "54.04");
  t.same(e("a[lang|=en] #id-name[lang|=en]", true), [[12, 20]], "54.05");
  t.same(
    e("|#id-name#second|", true),
    [
      [1, 9],
      [9, 16],
    ],
    "54.06"
  );
  t.end();
});

tap.test("55 - id: tick", (t) => {
  t.same(e("`#id-name`"), ["#id-name"], "55.01");
  t.same(e("`#id-name#second`"), ["#id-name", "#second"], "55.02");
  // -------
  t.same(e("`#id-name`", true), [[1, 9]], "55.03");
  t.same(
    e("`#id-name#second`", true),
    [
      [1, 9],
      [9, 16],
    ],
    "55.04"
  );
  t.end();
});

// ==============================
// Recognising class/id names after any character which is not allowed in class/id names
// ==============================

tap.test("56 - classes separated with a space should be recognised", (t) => {
  t.same(
    e("div.first-class .second-class"),
    [".first-class", ".second-class"],
    "56.01"
  );
  t.same(
    e("div.first-class div.second-class"),
    [".first-class", ".second-class"],
    "56.02"
  );
  t.same(
    e(".first-class .second-class"),
    [".first-class", ".second-class"],
    "56.03"
  );
  // -------
  t.same(
    e("div.first-class .second-class", true),
    [
      [3, 15],
      [16, 29],
    ],
    "56.04"
  );
  t.same(
    e("div.first-class div.second-class", true),
    [
      [3, 15],
      [19, 32],
    ],
    "56.05"
  );
  t.same(
    e(".first-class .second-class", true),
    [
      [0, 12],
      [13, 26],
    ],
    "56.06"
  );
  t.end();
});

tap.test("57 - classes recognised after brackets", (t) => {
  t.same(
    e("div.class1[lang|=en]#id1[something] .class2[lang|=en] #id2"),
    [".class1", "#id1", ".class2", "#id2"],
    "57.01"
  );
  t.same(
    e("div.first-class[lang|=en] div.second-class[lang|=en]"),
    [".first-class", ".second-class"],
    "57.02"
  );
  t.same(
    e(".first-class[lang|=en] .second-class[lang|=en]"),
    [".first-class", ".second-class"],
    "57.03"
  );
  // -------
  t.same(
    e("div.class1[lang|=en]#id1[something] .class2[lang|=en] #id2", true),
    [
      [3, 10],
      [20, 24],
      [36, 43],
      [54, 58],
    ],
    "57.04"
  );
  t.same(
    e("div.first-class[lang|=en] div.second-class[lang|=en]", true),
    [
      [3, 15],
      [29, 42],
    ],
    "57.05"
  );
  t.same(
    e(".first-class[lang|=en] .second-class[lang|=en]", true),
    [
      [0, 12],
      [23, 36],
    ],
    "57.06"
  );
  t.end();
});

tap.test("58 - old bracket notation - classes", (t) => {
  t.same(e("td[class=rr]"), [".rr"], "58.01");
  t.same(e("td [ class = rr ]"), [".rr"], "58.02");
  t.same(e("td [ class = abc-def ]"), [".abc-def"], "58.03");
  t.same(e(`td [ class = "abc-def" ]`), [".abc-def"], "58.04");
  t.same(e(`td [ class = 'abc-def' ]`), [".abc-def"], "58.05");
  t.same(e(`td[class="abc-def"]`), [".abc-def"], "58.06");
  t.same(e(`td[class='abc-def']`), [".abc-def"], "58.07");
  t.end();
});

tap.test("59 - old bracket notation - classes that need trimming", (t) => {
  t.same(e(`td [ class = " abc-def " ]`), [".abc-def"], "59.01");
  t.same(e(`td [ class = ' abc-def ' ]`), [".abc-def"], "59.02");
  t.same(e(`td[class=" abc-def "]`), [".abc-def"], "59.03");
  t.same(e(`td[class=' abc-def ']`), [".abc-def"], "59.04");
  t.end();
});

tap.test("60 - old bracket notation - ids", (t) => {
  t.same(e("td[id=rr]"), ["#rr"], "60.01");
  t.same(e("td [ id = rr ]"), ["#rr"], "60.02");
  t.same(e("td [ id = abc-def ]"), ["#abc-def"], "60.03");
  t.same(e(`td [ id = "abc-def" ]`), ["#abc-def"], "60.04");
  t.same(e(`td [ id = 'abc-def' ]`), ["#abc-def"], "60.05");
  t.same(e(`td[id="abc-def"]`), ["#abc-def"], "60.06");
  t.same(e(`td[id='abc-def']`), ["#abc-def"], "60.07");
  t.end();
});

tap.test("61 - old bracket notation - ids that need trimming", (t) => {
  t.same(e(`td [ id = " abc-def " ]`), ["#abc-def"], "61.01");
  t.same(e(`td [ id = ' abc-def ' ]`), ["#abc-def"], "61.02");
  t.same(e(`td[id=" abc-def "]`), ["#abc-def"], "61.03");
  t.same(e(`td[id=' abc-def ']`), ["#abc-def"], "61.04");
  t.end();
});

tap.test("62 - old bracket notation - empty values", (t) => {
  // .
  t.same(e(`td[class=']`), [], "62.01");
  t.same(e(`td[class='']`), [], "62.02");
  t.same(e(`td[class="]`), [], "62.03");
  t.same(e(`td[class=""]`), [], "62.04");

  t.same(e(`td [ class= ' ]`), [], "62.05");
  t.same(e(`td [ class= '' ]`), [], "62.06");
  t.same(e(`td [ class= " ]`), [], "62.07");
  t.same(e(`td [ class= "" ]`), [], "62.08");
  // #
  t.same(e(`td[id=']`), [], "62.09");
  t.same(e(`td[id='']`), [], "62.10");
  t.same(e(`td[id="]`), [], "62.11");
  t.same(e(`td[id=""]`), [], "62.12");

  t.same(e(`td [ id= ' ]`), [], "62.13");
  t.same(e(`td [ id= '' ]`), [], "62.14");
  t.same(e(`td [ id= " ]`), [], "62.15");
  t.same(e(`td [ id= "" ]`), [], "62.16");

  t.end();
});

// ==============================
// Precautions
// ==============================

tap.test("63 - no params", (t) => {
  t.throws(() => {
    e(undefined);
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("64 - first input arg of a wrong type", (t) => {
  t.throws(() => {
    e(1);
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("65 - second input arg of a wrong type", (t) => {
  t.throws(() => {
    e("a", 1);
  }, /THROW_ID_03/g);
  t.end();
});

// ==============================
// encoded strings given by JS
// discovered working on emailcomb.com
// ==============================

tap.test("66 - encoded line breaks", (t) => {
  t.same(e("#unused-1\n\n\n\n\t\t\t\t\nz\t\ta"), ["#unused-1"], "66.01");
  t.same(e("#unused-1\n\n\n\n\t\t\t\t\nz\t\ta", true), [[0, 9]], "66.02");
  t.end();
});

tap.test(
  "67 - recognises JS escaped strings and repeated dots & hashes",
  (t) => {
    t.same(
      e(
        "\naaa\n...    .unused-1\n\n\n.unused-2, .unused-3\n\t\t,,,\t###\t\nz\t\ta"
      ),
      [".unused-1", ".unused-2", ".unused-3"],
      "67.01"
    );
    t.same(
      e(
        "\naaa\n...    .unused-1\n\n\n.unused-2, .unused-3\n\t\t,,,\t###\t\nz\t\ta",
        true
      ),
      [
        [12, 21],
        [24, 33],
        [35, 44],
      ],
      "67.02"
    );
    t.end();
  }
);
