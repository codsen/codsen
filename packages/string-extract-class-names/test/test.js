const t = require("tap");
const e = require("../dist/string-extract-class-names.cjs");

// ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char

// ==============================
// normal use cases
// ==============================

t.test(
  "01.01 - class: just class passed, nothing done, falls on default",
  (t) => {
    t.same(e(".class-name"), [".class-name"], "01.01.01");
    t.same(e(".class-name", true), [[0, 11]], "01.01.02");
    t.end();
  }
);

t.test("01.02 - tag with two classes", (t) => {
  t.same(
    e("div.first-class.second-class"),
    [".first-class", ".second-class"],
    "01.02.01"
  );
  t.same(
    e("div.first-class.second-class", true),
    [
      [3, 15],
      [15, 28],
    ],
    "01.02.02"
  );
  t.end();
});

t.test("01.03 - class: class within tag", (t) => {
  t.same(e("div .class-name"), [".class-name"], "01.03.01");
  t.same(e("div .class-name "), [".class-name"], "01.03.02");
  t.same(e("div       .class-name        "), [".class-name"], "01.03.03");
  t.same(
    e("div       .first-class.second-class        "),
    [".first-class", ".second-class"],
    "01.03.04"
  );

  // ------

  t.same(e("div .class-name", true), [[4, 15]], "01.03.05");
  t.same(e("div .class-name ", true), [[4, 15]], "01.03.06");
  t.same(e("div       .class-name        ", true), [[10, 21]], "01.03.07");
  t.same(
    e("div       .first-class.second-class        ", true),
    [
      [10, 22],
      [22, 35],
    ],
    "01.03.08"
  );
  t.end();
});

t.test("01.04 - class: class within tag's child tag", (t) => {
  t.same(e("div .class-name a"), [".class-name"], "01.04.01");
  t.same(
    e("div .first-class.second-class a"),
    [".first-class", ".second-class"],
    "01.04.02"
  );
  // -------
  t.same(e("div .class-name a", true), [[4, 15]], "01.04.03");
  t.same(
    e("div .first-class.second-class a", true),
    [
      [4, 16],
      [16, 29],
    ],
    "01.04.04"
  );
  t.end();
});

t.test("01.05 - class: more, sandwitched", (t) => {
  t.same(
    e(
      "div~!@$%^&*()+=,/';:\"?><[]{}|`.class-name~!@$%^&*()+=,/';:\"?><[]{}|`#"
    ),
    [".class-name"],
    "01.05.01"
  );
  t.same(
    e(
      "div~!@$%^&*()+=,/';:\"?><[]{}|`.class-name~!@$%^&*()+=,/';:\"?><[]{}|`#",
      true
    ),
    [[30, 41]],
    "01.05.02"
  );
  t.end();
});

t.test("01.06 - class: exclamation mark", (t) => {
  t.same(e("div .class-name!a"), [".class-name"], "01.06.01");
  t.same(e("div.class-name!a"), [".class-name"], "01.06.02");
  t.same(e(".class-name!a"), [".class-name"], "01.06.03");
  t.same(e("!.class-name!a"), [".class-name"], "01.06.04");
  t.same(
    e("!.first-class.second-class!a"),
    [".first-class", ".second-class"],
    "01.06.05"
  );
  // -------
  t.same(e("div .class-name!a", true), [[4, 15]], "01.06.06");
  t.same(e("div.class-name!a", true), [[3, 14]], "01.06.07");
  t.same(e(".class-name!a", true), [[0, 11]], "01.06.08");
  t.same(e("!.class-name!a", true), [[1, 12]], "01.06.09");
  t.same(
    e("!.first-class.second-class!a", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.06.10"
  );
  t.end();
});

t.test("01.07 - class: ampersand", (t) => {
  t.same(e("div .class-name&a"), [".class-name"], "01.07.01");
  t.same(e("div.class-name&a"), [".class-name"], "01.07.02");
  t.same(e(".class-name&a"), [".class-name"], "01.07.03");
  t.same(e("&.class-name&a"), [".class-name"], "01.07.04");
  t.same(
    e("&.first-class.second-class&a"),
    [".first-class", ".second-class"],
    "01.07.05"
  );
  // -------
  t.same(e("div .class-name&a", true), [[4, 15]], "01.07.06");
  t.same(e("div.class-name&a", true), [[3, 14]], "01.07.07");
  t.same(e(".class-name&a", true), [[0, 11]], "01.07.08");
  t.same(e("&.class-name&a", true), [[1, 12]], "01.07.09");
  t.same(
    e("&.first-class.second-class&a", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.07.10"
  );
  t.end();
});

t.test("01.08 - class: dollar", (t) => {
  t.same(e("div .class-name$a"), [".class-name"], "01.08.01");
  t.same(e("div.class-name$a"), [".class-name"], "01.08.02");
  t.same(e(".class-name$a"), [".class-name"], "01.08.03");
  t.same(e("$.class-name$a"), [".class-name"], "01.08.04");
  t.same(e("a[title~=name] .class-name$a"), [".class-name"], "01.08.05");
  t.same(
    e("a[title~=name] .first-class.second-class$a"),
    [".first-class", ".second-class"],
    "01.08.06"
  );
  // -------
  t.same(e("div .class-name$a", true), [[4, 15]], "01.08.07");
  t.same(e("div.class-name$a", true), [[3, 14]], "01.08.08");
  t.same(e(".class-name$a", true), [[0, 11]], "01.08.09");
  t.same(e("$.class-name$a", true), [[1, 12]], "01.08.10");
  t.same(e("a[title~=name] .class-name$a", true), [[15, 26]], "01.08.11");
  t.same(
    e("a[title~=name] .first-class.second-class$a", true),
    [
      [15, 27],
      [27, 40],
    ],
    "01.08.12"
  );
  t.end();
});

t.test("01.09 - class: percentage", (t) => {
  t.same(e("div .class-name%a"), [".class-name"], "01.09.01");
  t.same(e("div.class-name%a"), [".class-name"], "01.09.02");
  t.same(e(".class-name%a"), [".class-name"], "01.09.03");
  t.same(e("%.class-name%a"), [".class-name"], "01.09.04");
  t.same(e("[%~class-name] .class-name%a"), [".class-name"], "01.09.05");
  t.same(
    e("[%~class-name] .first-class.second-class%a"),
    [".first-class", ".second-class"],
    "01.09.06"
  );
  // -------
  t.same(e("div .class-name%a", true), [[4, 15]], "01.09.07");
  t.same(e("div.class-name%a", true), [[3, 14]], "01.09.08");
  t.same(e(".class-name%a", true), [[0, 11]], "01.09.09");
  t.same(e("%.class-name%a", true), [[1, 12]], "01.09.10");
  t.same(e("[%~class-name] .class-name%a", true), [[15, 26]], "01.09.11");
  t.same(
    e("[%~class-name] .first-class.second-class%a", true),
    [
      [15, 27],
      [27, 40],
    ],
    "01.09.12"
  );
  t.end();
});

t.test("01.10 - class: circumflex", (t) => {
  t.same(e('a.class-name[href^="https"]'), [".class-name"], "01.10.01");
  t.same(
    e('a.first-class.second-class[href^="https"]'),
    [".first-class", ".second-class"],
    "01.10.02"
  );
  // -------
  t.same(e('a.class-name[href^="https"]', true), [[1, 12]], "01.10.03");
  t.same(
    e('a.first-class.second-class[href^="https"]', true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.10.04"
  );
  t.end();
});

t.test("01.11 - class: ampersand", (t) => {
  t.same(e(".class-name &"), [".class-name"], "01.11.01");
  t.same(
    e(".first-class.second-class &"),
    [".first-class", ".second-class"],
    "01.11.02"
  );
  // -------
  t.same(e(".class-name &", true), [[0, 11]], "01.11.03");
  t.same(
    e(".first-class.second-class &", true),
    [
      [0, 12],
      [12, 25],
    ],
    "01.11.04"
  );
  t.end();
});

t.test("01.12 - class: asterisk", (t) => {
  t.same(e(".class-name *"), [".class-name"], "01.12.01");
  t.same(e("*.class-name *"), [".class-name"], "01.12.02");
  t.same(
    e("*.first-class.second-class*"),
    [".first-class", ".second-class"],
    "01.12.03"
  );
  // -------
  t.same(e(".class-name *", true), [[0, 11]], "01.12.04");
  t.same(e("*.class-name *", true), [[1, 12]], "01.12.05");
  t.same(
    e("*.first-class.second-class*", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.12.06"
  );
  t.end();
});

t.test("01.13 - class: brackets", (t) => {
  t.same(e("p.class-name:lang(it)"), [".class-name"], "01.13.01");
  t.same(
    e("p.class-name:lang(it) p.class-name-other:lang(en)"),
    [".class-name", ".class-name-other"],
    "01.13.02"
  );
  t.same(
    e(":.first-class.second-class:"),
    [".first-class", ".second-class"],
    "01.13.03"
  );
  // -------
  t.same(e("p.class-name:lang(it)", true), [[1, 12]], "01.13.04");
  t.same(
    e("p.class-name:lang(it) p.class-name-other:lang(en)", true),
    [
      [1, 12],
      [23, 40],
    ],
    "01.13.05"
  );
  t.same(
    e(":.first-class.second-class:", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.13.06"
  );
  t.end();
});

t.test("01.14 - class: plus", (t) => {
  t.same(e("div.class-name + p"), [".class-name"], "01.14.01");
  t.same(e("div.class-name+p"), [".class-name"], "01.14.02");
  t.same(
    e("+.first-class.second-class+"),
    [".first-class", ".second-class"],
    "01.14.03"
  );
  // -------
  t.same(e("div.class-name + p", true), [[3, 14]], "01.14.04");
  t.same(e("div.class-name+p", true), [[3, 14]], "01.14.05");
  t.same(
    e("+.first-class.second-class+", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.14.06"
  );
  t.end();
});

t.test("01.15 - class: equals", (t) => {
  t.same(e('a.class-name[href*="npmjs"]'), [".class-name"], "01.15.01");
  t.same(e('a.class-name [href *= "npmjs"]'), [".class-name"], "01.15.02");
  t.same(
    e("=.first-class.second-class="),
    [".first-class", ".second-class"],
    "01.15.03"
  );
  // -------
  t.same(e('a.class-name[href*="npmjs"]', true), [[1, 12]], "01.15.04");
  t.same(e('a.class-name [href *= "npmjs"]', true), [[1, 12]], "01.15.05");
  t.same(
    e("=.first-class.second-class=", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.15.06"
  );
  t.end();
});

t.test("01.16 - class: colon", (t) => {
  t.same(
    e(".class-name, .class-name-other"),
    [".class-name", ".class-name-other"],
    "01.16.01"
  );
  t.same(
    e(".class-name,.class-name-other"),
    [".class-name", ".class-name-other"],
    "01.16.02"
  );
  t.same(
    e(",.first-class.second-class,"),
    [".first-class", ".second-class"],
    "01.16.03"
  );
  // -------
  t.same(
    e(".class-name, .class-name-other", true),
    [
      [0, 11],
      [13, 30],
    ],
    "01.16.04"
  );
  t.same(
    e(".class-name,.class-name-other", true),
    [
      [0, 11],
      [12, 29],
    ],
    "01.16.05"
  );
  t.same(
    e(",.first-class.second-class,", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.16.06"
  );
  t.end();
});

t.test("01.17 - class: right slash", (t) => {
  t.same(e(".class-name/class-name-other"), [".class-name"], "01.17.01");
  t.same(e(".class-name /class-name-other"), [".class-name"], "01.17.02");
  t.same(
    e("/.first-class.second-class/"),
    [".first-class", ".second-class"],
    "01.17.03"
  );
  // -------
  t.same(e(".class-name/class-name-other", true), [[0, 11]], "01.17.04");
  t.same(e(".class-name /class-name-other", true), [[0, 11]], "01.17.05");
  t.same(
    e("/.first-class.second-class/", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.17.06"
  );
  t.end();
});

t.test("01.18 - class: apostrophe", (t) => {
  t.same(e(".class-name'"), [".class-name"], "01.18.01");
  t.same(e("'.class-name"), [".class-name"], "01.18.02");
  t.same(
    e("'.first-class.second-class'"),
    [".first-class", ".second-class"],
    "01.18.03"
  );
  // -------
  t.same(e(".class-name'", true), [[0, 11]], "01.18.04");
  t.same(e("'.class-name", true), [[1, 12]], "01.18.05");
  t.same(
    e("'.first-class.second-class'", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.18.06"
  );
  t.end();
});

t.test("01.19 - class: semicolon", (t) => {
  t.same(
    e(".class-name-1;.class-name-2"),
    [".class-name-1", ".class-name-2"],
    "01.19.01"
  );
  t.same(
    e(".class-name-1;.class-name-2"),
    [".class-name-1", ".class-name-2"],
    "01.19.02"
  );
  t.same(
    e(";.class-name-1;.class-name-2;"),
    [".class-name-1", ".class-name-2"],
    "01.19.03"
  );
  t.same(
    e(";.first-class.second-class;"),
    [".first-class", ".second-class"],
    "01.19.04"
  );
  // -------
  t.same(
    e(".class-name-1;.class-name-2", true),
    [
      [0, 13],
      [14, 27],
    ],
    "01.19.05"
  );
  t.same(
    e(".class-name-1;.class-name-2", true),
    [
      [0, 13],
      [14, 27],
    ],
    "01.19.06"
  );
  t.same(
    e(";.class-name-1;.class-name-2;", true),
    [
      [1, 14],
      [15, 28],
    ],
    "01.19.07"
  );
  t.same(
    e(";.first-class.second-class;", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.19.08"
  );
  t.end();
});

t.test("01.20 - class: colon", (t) => {
  t.same(e("input.class-name:read-only"), [".class-name"], "01.20.01");
  t.same(
    e("input:out-of-range .class-name input:out-of-range"),
    [".class-name"],
    "01.20.02"
  );
  t.same(
    e(
      "input:out-of-range .class-name::selection input:out-of-range::selection"
    ),
    [".class-name"],
    "01.20.03"
  );
  t.same(
    e(":.first-class.second-class:"),
    [".first-class", ".second-class"],
    "01.20.04"
  );
  // -------
  t.same(e("input.class-name:read-only", true), [[5, 16]], "01.20.05");
  t.same(
    e("input:out-of-range .class-name input:out-of-range", true),
    [[19, 30]],
    "01.20.06"
  );
  t.same(
    e(
      "input:out-of-range .class-name::selection input:out-of-range::selection",
      true
    ),
    [[19, 30]],
    "01.20.07"
  );
  t.same(
    e(":.first-class.second-class:", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.20.08"
  );
  t.end();
});

t.test("01.21 - class: double quote", (t) => {
  t.same(e('.class-name a[href^="https"]'), [".class-name"], "01.21.01");
  t.same(
    e('a[href^="https"] .class-name a[href^="https"]'),
    [".class-name"],
    "01.21.02"
  );
  t.same(e('"https".class-name"https"'), [".class-name"], "01.21.03");
  t.same(
    e('"https".first-class.second-class"https"'),
    [".first-class", ".second-class"],
    "01.21.04"
  );
  // -------
  t.same(e('.class-name a[href^="https"]', true), [[0, 11]], "01.21.05");
  t.same(
    e('a[href^="https"] .class-name a[href^="https"]', true),
    [[17, 28]],
    "01.21.06"
  );
  t.same(e('"https".class-name"https"', true), [[7, 18]], "01.21.07");
  t.same(
    e('"https".first-class.second-class"https"', true),
    [
      [7, 19],
      [19, 32],
    ],
    "01.21.08"
  );
  t.end();
});

t.test("01.22 - class: question mark", (t) => {
  t.same(e(".class-name ?"), [".class-name"], "01.22.01");
  t.same(e("? .class-name?"), [".class-name"], "01.22.02");
  t.same(e("?.class-name?"), [".class-name"], "01.22.03");
  t.same(
    e("?.first-class.second-class?"),
    [".first-class", ".second-class"],
    "01.22.04"
  );
  // -------
  t.same(e(".class-name ?", true), [[0, 11]], "01.22.05");
  t.same(e("? .class-name?", true), [[2, 13]], "01.22.06");
  t.same(e("?.class-name?", true), [[1, 12]], "01.22.07");
  t.same(
    e("?.first-class.second-class?", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.22.08"
  );
  t.end();
});

t.test("01.23 - class: greater than sign", (t) => {
  t.same(e(".class-name> p"), [".class-name"], "01.23.01");
  t.same(
    e("* > .class-name > p > .class-name-other"),
    [".class-name", ".class-name-other"],
    "01.23.02"
  );
  t.same(
    e("*.class-name> .class-name-other> p > .class-name-another"),
    [".class-name", ".class-name-other", ".class-name-another"],
    "01.23.03"
  );
  t.same(
    e(">.class1.class2> .class3.class4> p > .class5.class6"),
    [".class1", ".class2", ".class3", ".class4", ".class5", ".class6"],
    "01.23.04"
  );
  // -------
  t.same(e(".class-name> p", true), [[0, 11]], "01.23.05");
  t.same(
    e("* > .class-name > p > .class-name-other", true),
    [
      [4, 15],
      [22, 39],
    ],
    "01.23.06"
  );
  t.same(
    e("*.class-name> .class-name-other> p > .class-name-another", true),
    [
      [1, 12],
      [14, 31],
      [37, 56],
    ],
    "01.23.07"
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
    "01.23.08"
  );
  t.end();
});

t.test("01.24 - class: square brackets", (t) => {
  t.same(
    e("a[target=_blank] .class-name a[target=_blank]"),
    [".class-name"],
    "01.24.01"
  );
  t.same(
    e("a[target=_blank] .class-name[target=_blank]"),
    [".class-name"],
    "01.24.02"
  );
  t.same(
    e("a[target=_blank].class-name[target=_blank]"),
    [".class-name"],
    "01.24.03"
  );
  t.same(
    e("a[target=_blank].first-class.second-class[target=_blank]"),
    [".first-class", ".second-class"],
    "01.24.04"
  );
  // -------
  t.same(
    e("a[target=_blank] .class-name a[target=_blank]", true),
    [[17, 28]],
    "01.24.05"
  );
  t.same(
    e("a[target=_blank] .class-name[target=_blank]", true),
    [[17, 28]],
    "01.24.06"
  );
  t.same(
    e("a[target=_blank].class-name[target=_blank]", true),
    [[16, 27]],
    "01.24.07"
  );
  t.same(
    e("a[target=_blank].first-class.second-class[target=_blank]", true),
    [
      [16, 28],
      [28, 41],
    ],
    "01.24.08"
  );
  t.end();
});

t.test("01.25 - class: curly brackets", (t) => {
  t.same(
    e("a{target=_blank} .class-name a{target=_blank}"),
    [".class-name"],
    "01.25.01"
  );
  t.same(
    e("a{target=_blank} .class-name{target=_blank}"),
    [".class-name"],
    "01.25.02"
  );
  t.same(
    e("a{target=_blank}.class-name{target=_blank}"),
    [".class-name"],
    "01.25.03"
  );
  t.same(
    e("a{target=_blank}.first-class.second-class{target=_blank}"),
    [".first-class", ".second-class"],
    "01.25.04"
  );
  // -------
  t.same(
    e("a{target=_blank} .class-name a{target=_blank}", true),
    [[17, 28]],
    "01.25.05"
  );
  t.same(
    e("a{target=_blank} .class-name{target=_blank}", true),
    [[17, 28]],
    "01.25.06"
  );
  t.same(
    e("a{target=_blank}.class-name{target=_blank}", true),
    [[16, 27]],
    "01.25.07"
  );
  t.same(
    e("a{target=_blank}.first-class.second-class{target=_blank}", true),
    [
      [16, 28],
      [28, 41],
    ],
    "01.25.08"
  );
  t.end();
});

t.test("01.26 - class: pipe", (t) => {
  t.same(e("|.class-name|=en]"), [".class-name"], "01.26.01");
  t.same(e("a[lang|=en] .class-name[lang|=en]"), [".class-name"], "01.26.02");
  t.same(e("|.class-name|"), [".class-name"], "01.26.03");
  t.same(
    e("|.first-class.second-class|"),
    [".first-class", ".second-class"],
    "01.26.04"
  );
  // -------
  t.same(e("|.class-name|=en]", true), [[1, 12]], "01.26.05");
  t.same(e("a[lang|=en] .class-name[lang|=en]", true), [[12, 23]], "01.26.06");
  t.same(e("|.class-name|", true), [[1, 12]], "01.26.07");
  t.same(
    e("|.first-class.second-class|", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.26.08"
  );
  t.end();
});

t.test("01.27 - class: tick", (t) => {
  t.same(e("`.class-name`"), [".class-name"], "01.27.01");
  t.same(
    e("`.first-class.second-class`"),
    [".first-class", ".second-class"],
    "01.27.02"
  );
  // -------
  t.same(e("`.class-name`", true), [[1, 12]], "01.27.03");
  t.same(
    e("`.first-class.second-class`", true),
    [
      [1, 13],
      [13, 26],
    ],
    "01.27.04"
  );
  t.end();
});

t.test("01.28 - one-letter class names", (t) => {
  t.same(e(".h"), [".h"], "01.28.01");
  t.same(e(".a.b.c"), [".a", ".b", ".c"], "01.28.02");
  // -------
  t.same(e(".h", true), [[0, 2]], "01.28.03");
  t.same(
    e(".a.b.c", true),
    [
      [0, 2],
      [2, 4],
      [4, 6],
    ],
    "01.28.04"
  );
  t.end();
});

// ==============================
// Hash, in case if ID's are found
// ==============================

t.test("02.01 - id: just id passed, nothing done, falls on default", (t) => {
  t.same(e("#id-name"), ["#id-name"], "02.01.01");
  t.same(e("#id-name", true), [[0, 8]], "02.01.02");
  t.end();
});

t.test("02.02 - id: tag with id", (t) => {
  t.same(e("div#id-name#whatever"), ["#id-name", "#whatever"], "02.02.01");
  t.same(
    e("div#id-name.class.another"),
    ["#id-name", ".class", ".another"],
    "02.02.02"
  );
  // -------
  t.same(
    e("div#id-name#whatever", true),
    [
      [3, 11],
      [11, 20],
    ],
    "02.02.03"
  );
  t.same(
    e("div#id-name.class.another", true),
    [
      [3, 11],
      [11, 17],
      [17, 25],
    ],
    "02.02.04"
  );
  t.end();
});

t.test("02.03 - id: id within tag", (t) => {
  t.same(e("div #id-name"), ["#id-name"], "02.03.01");
  t.same(e("div #id-name "), ["#id-name"], "02.03.02");
  t.same(e("div       #id-name        "), ["#id-name"], "02.03.03");
  t.same(
    e("div       #first-id#second-id        "),
    ["#first-id", "#second-id"],
    "02.03.04"
  );
  // -------
  t.same(e("div #id-name", true), [[4, 12]], "02.03.05");
  t.same(e("div #id-name ", true), [[4, 12]], "02.03.06");
  t.same(e("div       #id-name        ", true), [[10, 18]], "02.03.07");
  t.same(
    e("div       #first-id#second-id        ", true),
    [
      [10, 19],
      [19, 29],
    ],
    "02.03.08"
  );
  t.end();
});

t.test("02.04 - id: id within tag's child tag", (t) => {
  t.same(e("div #id-name a"), ["#id-name"], "02.04.01");
  t.same(
    e("div #id-name#second#third a"),
    ["#id-name", "#second", "#third"],
    "02.04.02"
  );
  t.same(
    e("div #id-name.second.third a"),
    ["#id-name", ".second", ".third"],
    "02.04.03"
  );
  // -------
  t.same(e("div #id-name a", true), [[4, 12]], "02.04.04");
  t.same(
    e("div #id-name#second#third a", true),
    [
      [4, 12],
      [12, 19],
      [19, 25],
    ],
    "02.04.05"
  );
  t.same(
    e("div #id-name.second.third a", true),
    [
      [4, 12],
      [12, 19],
      [19, 25],
    ],
    "02.04.06"
  );
  t.end();
});

t.test("02.05 - id: more, sandwitched", (t) => {
  t.same(
    e(
      "~!@$%^&*()+=,/';:\"?><[]{}|`#id-name#second#third[]yo~!@$%^&*()+=,/';:\"?><[]{}|`"
    ),
    ["#id-name", "#second", "#third"],
    "02.05.01"
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
    "02.05.02"
  );
  t.end();
});

t.test("02.06 - id: exclamation mark", (t) => {
  t.same(e("div #id-name!a"), ["#id-name"], "02.06.01");
  t.same(e("!#id-name!"), ["#id-name"], "02.06.02");
  t.same(
    e("!#id-name#second#third!"),
    ["#id-name", "#second", "#third"],
    "02.06.03"
  );
  t.same(
    e("!#id-name.second#third.fourth!"),
    ["#id-name", ".second", "#third", ".fourth"],
    "02.06.04"
  );
  // -------
  t.same(e("div #id-name!a", true), [[4, 12]], "02.06.05");
  t.same(e("!#id-name!", true), [[1, 9]], "02.06.06");
  t.same(
    e("!#id-name#second#third!", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
    ],
    "02.06.07"
  );
  t.same(
    e("!#id-name.second#third.fourth!", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
      [22, 29],
    ],
    "02.06.08"
  );
  t.end();
});

t.test("02.07 - id: ampersand", (t) => {
  t.same(e("div #id-name&a"), ["#id-name"], "02.07.01");
  t.same(e("div#id-name&a"), ["#id-name"], "02.07.02");
  t.same(e("#id-name&a"), ["#id-name"], "02.07.03");
  t.same(e("&#id-name&a"), ["#id-name"], "02.07.04");
  t.same(
    e("&#id-name#second.third&a"),
    ["#id-name", "#second", ".third"],
    "02.07.05"
  );
  // -------
  t.same(e("div #id-name&a", true), [[4, 12]], "02.07.06");
  t.same(e("div#id-name&a", true), [[3, 11]], "02.07.07");
  t.same(e("#id-name&a", true), [[0, 8]], "02.07.08");
  t.same(e("&#id-name&a", true), [[1, 9]], "02.07.09");
  t.same(
    e("&#id-name#second.third&a", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
    ],
    "02.07.10"
  );
  t.end();
});

t.test("02.08 - id: dollar", (t) => {
  t.same(e("div #id-name$a"), ["#id-name"], "02.08.01");
  t.same(e("div#id-name$a"), ["#id-name"], "02.08.02");
  t.same(e("#id-name$a"), ["#id-name"], "02.08.03");
  t.same(e("$#id-name$a"), ["#id-name"], "02.08.04");
  t.same(e("a[title~=name] #id-name$a"), ["#id-name"], "02.08.05");
  t.same(e("$#id-name$"), ["#id-name"], "02.08.06");
  t.same(e("$#id-name#second$"), ["#id-name", "#second"], "02.08.07");
  // -------
  t.same(e("div #id-name$a", true), [[4, 12]], "02.08.08");
  t.same(e("div#id-name$a", true), [[3, 11]], "02.08.09");
  t.same(e("#id-name$a", true), [[0, 8]], "02.08.10");
  t.same(e("$#id-name$a", true), [[1, 9]], "02.08.11");
  t.same(e("a[title~=name] #id-name$a", true), [[15, 23]], "02.08.12");
  t.same(e("$#id-name$", true), [[1, 9]], "02.08.13");
  t.same(
    e("$#id-name#second$", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.08.14"
  );
  t.end();
});

t.test("02.09 - id: percentage", (t) => {
  t.same(e("div #id-name%a"), ["#id-name"], "02.09.01");
  t.same(e("div#id-name%a"), ["#id-name"], "02.09.02");
  t.same(e("#id-name%a"), ["#id-name"], "02.09.03");
  t.same(e("%#id-name%a"), ["#id-name"], "02.09.04");
  t.same(e("[%~class-name] #id-name%a"), ["#id-name"], "02.09.05");
  t.same(e("%#id-name%"), ["#id-name"], "02.09.06");
  t.same(e("%#id-name#second%"), ["#id-name", "#second"], "02.09.07");
  // -------
  t.same(e("div #id-name%a", true), [[4, 12]], "02.09.08");
  t.same(e("div#id-name%a", true), [[3, 11]], "02.09.09");
  t.same(e("#id-name%a", true), [[0, 8]], "02.09.10");
  t.same(e("%#id-name%a", true), [[1, 9]], "02.09.11");
  t.same(e("[%~class-name] #id-name%a", true), [[15, 23]], "02.09.12");
  t.same(e("%#id-name%", true), [[1, 9]], "02.09.13");
  t.same(
    e("%#id-name#second%", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.09.14"
  );
  t.end();
});

t.test("02.10 - id: circumflex", (t) => {
  t.same(e('a#id-name[href^="https"]'), ["#id-name"], "02.10.01");
  t.same(e("^#id-name^"), ["#id-name"], "02.10.02");
  t.same(e("^#id-name#second^"), ["#id-name", "#second"], "02.10.03");
  // -------
  t.same(e('a#id-name[href^="https"]', true), [[1, 9]], "02.10.04");
  t.same(e("^#id-name^", true), [[1, 9]], "02.10.05");
  t.same(
    e("^#id-name#second^", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.10.06"
  );
  t.end();
});

t.test("02.11 - id: ampersand", (t) => {
  t.same(e("#id-name &"), ["#id-name"], "02.11.01");
  t.same(e("&#id-name&"), ["#id-name"], "02.11.02");
  t.same(e("&#id-name#second&"), ["#id-name", "#second"], "02.11.03");
  // -------
  t.same(e("#id-name &", true), [[0, 8]], "02.11.04");
  t.same(e("&#id-name&", true), [[1, 9]], "02.11.05");
  t.same(
    e("&#id-name#second&", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.11.06"
  );
  t.end();
});

t.test("02.12 - id: asterisk", (t) => {
  t.same(e("#id-name *"), ["#id-name"], "02.12.01");
  t.same(e("*#id-name *"), ["#id-name"], "02.12.02");
  t.same(e("*#id-name*"), ["#id-name"], "02.12.03");
  t.same(e("*#id-name#second*"), ["#id-name", "#second"], "02.12.04");
  // -------
  t.same(e("#id-name *", true), [[0, 8]], "02.12.05");
  t.same(e("*#id-name *", true), [[1, 9]], "02.12.06");
  t.same(e("*#id-name*", true), [[1, 9]], "02.12.07");
  t.same(
    e("*#id-name#second*", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.12.08"
  );
  t.end();
});

t.test("02.13 - id: brackets", (t) => {
  t.same(e("p#id-name:lang(it)"), ["#id-name"], "02.13.01");
  t.same(
    e("p#id-name:lang(it) p#id-name-other:lang(en)"),
    ["#id-name", "#id-name-other"],
    "02.13.02"
  );
  t.same(e("()#id-name()"), ["#id-name"], "02.13.03");
  t.same(e("(#id-name)"), ["#id-name"], "02.13.04");
  t.same(
    e("(#id-name#second.class)"),
    ["#id-name", "#second", ".class"],
    "02.13.05"
  );
  // -------
  t.same(e("p#id-name:lang(it)", true), [[1, 9]], "02.13.06");
  t.same(
    e("p#id-name:lang(it) p#id-name-other:lang(en)", true),
    [
      [1, 9],
      [20, 34],
    ],
    "02.13.07"
  );
  t.same(e("()#id-name()", true), [[2, 10]], "02.13.08");
  t.same(e("(#id-name)", true), [[1, 9]], "02.13.09");
  t.same(
    e("(#id-name#second.class)", true),
    [
      [1, 9],
      [9, 16],
      [16, 22],
    ],
    "02.13.10"
  );
  t.end();
});

t.test("02.14 - id: plus", (t) => {
  t.same(e("div#id-name + p"), ["#id-name"], "02.14.01");
  t.same(e("div#id-name+p"), ["#id-name"], "02.14.02");
  t.same(e("+#id-name+"), ["#id-name"], "02.14.03");
  t.same(e("+#id-name#second+"), ["#id-name", "#second"], "02.14.04");
  // -------
  t.same(e("div#id-name + p", true), [[3, 11]], "02.14.05");
  t.same(e("div#id-name+p", true), [[3, 11]], "02.14.06");
  t.same(e("+#id-name+", true), [[1, 9]], "02.14.07");
  t.same(
    e("+#id-name#second+", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.14.08"
  );
  t.end();
});

t.test("02.15 - id: equals", (t) => {
  t.same(e('a#id-name[href*="npmjs"]'), ["#id-name"], "02.15.01");
  t.same(e('a#id-name [href *= "npmjs"]'), ["#id-name"], "02.15.02");
  t.same(e('a#id-name  [href *= "npmjs"]'), ["#id-name"], "02.15.03");
  t.same(e("=#id-name#second="), ["#id-name", "#second"], "02.15.04");
  // -------
  t.same(e('a#id-name[href*="npmjs"]', true), [[1, 9]], "02.15.05");
  t.same(e('a#id-name [href *= "npmjs"]', true), [[1, 9]], "02.15.06");
  t.same(e('a#id-name  [href *= "npmjs"]', true), [[1, 9]], "02.15.07");
  t.same(
    e("=#id-name#second=", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.15.08"
  );
  t.end();
});

t.test("02.16 - id: colon", (t) => {
  t.same(
    e("#id-name, #id-name-other"),
    ["#id-name", "#id-name-other"],
    "02.16.01"
  );
  t.same(
    e("#id-name,#id-name-other"),
    ["#id-name", "#id-name-other"],
    "02.16.02"
  );
  t.same(e(",#id-name,"), ["#id-name"], "02.16.03");
  t.same(e(",#id-name#second,"), ["#id-name", "#second"], "02.16.04");
  // -------
  t.same(
    e("#id-name, #id-name-other", true),
    [
      [0, 8],
      [10, 24],
    ],
    "02.16.05"
  );
  t.same(
    e("#id-name,#id-name-other", true),
    [
      [0, 8],
      [9, 23],
    ],
    "02.16.06"
  );
  t.same(e(",#id-name,", true), [[1, 9]], "02.16.07");
  t.same(
    e(",#id-name#second,", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.16.08"
  );
  t.end();
});

t.test("02.17 - id: right slash", (t) => {
  t.same(
    e("#id-name/#id-name-other"),
    ["#id-name", "#id-name-other"],
    "02.17.01"
  );
  t.same(
    e("/#id-name/#id-name-other"),
    ["#id-name", "#id-name-other"],
    "02.17.02"
  );
  t.same(e("/#id-name/"), ["#id-name"], "02.17.03");
  t.same(e("/#id-name#second/"), ["#id-name", "#second"], "02.17.04");
  // -------
  t.same(
    e("#id-name/#id-name-other", true),
    [
      [0, 8],
      [9, 23],
    ],
    "02.17.05"
  );
  t.same(
    e("/#id-name/#id-name-other", true),
    [
      [1, 9],
      [10, 24],
    ],
    "02.17.06"
  );
  t.same(e("/#id-name/", true), [[1, 9]], "02.17.07");
  t.same(
    e("/#id-name#second/", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.17.08"
  );
  t.end();
});

t.test("02.18 - id: apostrophe", (t) => {
  t.same(e("#id-name'"), ["#id-name"], "02.18.01");
  t.same(e("'#id-name"), ["#id-name"], "02.18.02");
  t.same(e("'#id-name#second"), ["#id-name", "#second"], "02.18.03");
  // -------
  t.same(e("#id-name'", true), [[0, 8]], "02.18.04");
  t.same(e("'#id-name", true), [[1, 9]], "02.18.05");
  t.same(
    e("'#id-name#second", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.18.06"
  );
  t.end();
});

t.test("02.19 - id: semicolon", (t) => {
  t.same(e("#id1;#id2"), ["#id1", "#id2"], "02.19.01");
  t.same(
    e("#id-name;#id-name-other"),
    ["#id-name", "#id-name-other"],
    "02.19.02"
  );
  t.same(
    e(";#id-name;#id-name-other;"),
    ["#id-name", "#id-name-other"],
    "02.19.03"
  );
  t.same(
    e(";#id1#id2;#id3#id4;"),
    ["#id1", "#id2", "#id3", "#id4"],
    "02.19.04"
  );
  // -------
  t.same(
    e("#id1;#id2", true),
    [
      [0, 4],
      [5, 9],
    ],
    "02.19.05"
  );
  t.same(
    e("#id-name;#id-name-other", true),
    [
      [0, 8],
      [9, 23],
    ],
    "02.19.06"
  );
  t.same(
    e(";#id-name;#id-name-other;", true),
    [
      [1, 9],
      [10, 24],
    ],
    "02.19.07"
  );
  t.same(
    e(";#id1#id2;#id3#id4;", true),
    [
      [1, 5],
      [5, 9],
      [10, 14],
      [14, 18],
    ],
    "02.19.08"
  );
  t.end();
});

t.test("02.20 - id: colon", (t) => {
  t.same(e("input#id-name:read-only"), ["#id-name"], "02.20.01");
  t.same(
    e("input:out-of-range #id-name input:out-of-range"),
    ["#id-name"],
    "02.20.02"
  );
  t.same(
    e("input:out-of-range #id-name::selection input:out-of-range::selection"),
    ["#id-name"],
    "02.20.03"
  );
  t.same(
    e(
      "input:out-of-range #id-name#second.third::selection input:out-of-range::selection"
    ),
    ["#id-name", "#second", ".third"],
    "02.20.04"
  );
  // -------
  t.same(e("input#id-name:read-only", true), [[5, 13]], "02.20.05");
  t.same(
    e("input:out-of-range #id-name input:out-of-range", true),
    [[19, 27]],
    "02.20.06"
  );
  t.same(
    e(
      "input:out-of-range #id-name::selection input:out-of-range::selection",
      true
    ),
    [[19, 27]],
    "02.20.07"
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
    "02.20.08"
  );
  t.end();
});

t.test("02.21 - id: double quote", (t) => {
  t.same(e('#id-name a[href^="https"]'), ["#id-name"], "02.21.01");
  t.same(
    e('a[href^="https"] #id-name a[href^="https"]'),
    ["#id-name"],
    "02.21.02"
  );
  t.same(
    e('a[href^="https"] #id-name#second a[href^="https"]'),
    ["#id-name", "#second"],
    "02.21.03"
  );
  // -------
  t.same(e('#id-name a[href^="https"]', true), [[0, 8]], "02.21.04");
  t.same(
    e('a[href^="https"] #id-name a[href^="https"]', true),
    [[17, 25]],
    "02.21.05"
  );
  t.same(
    e('a[href^="https"] #id-name#second a[href^="https"]', true),
    [
      [17, 25],
      [25, 32],
    ],
    "02.21.06"
  );
  t.end();
});

t.test("02.22 - id: question mark", (t) => {
  t.same(e("#id-name ?"), ["#id-name"], "02.22.01");
  t.same(e("?#id-name?"), ["#id-name"], "02.22.02");
  t.same(e("?#id-name#second?"), ["#id-name", "#second"], "02.22.03");
  // -------
  t.same(e("#id-name ?", true), [[0, 8]], "02.22.04");
  t.same(e("?#id-name?", true), [[1, 9]], "02.22.05");
  t.same(
    e("?#id-name#second?", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.22.06"
  );
  t.end();
});

t.test("02.23 - id: question mark", (t) => {
  t.same(e("?#id-name?"), ["#id-name"], "02.23.01");
  t.same(
    e("?#id-name? > p > #id-name-other"),
    ["#id-name", "#id-name-other"],
    "02.23.02"
  );
  t.same(
    e("?#id-name-1? #id-name-2> p > #id-name-3"),
    ["#id-name-1", "#id-name-2", "#id-name-3"],
    "02.23.03"
  );
  t.same(
    e("?#id1#id2? #id3#id4> p > #id5#id6"),
    ["#id1", "#id2", "#id3", "#id4", "#id5", "#id6"],
    "02.23.04"
  );
  // -------
  t.same(e("?#id-name?", true), [[1, 9]], "02.23.05");
  t.same(
    e("?#id-name? > p > #id-name-other", true),
    [
      [1, 9],
      [17, 31],
    ],
    "02.23.06"
  );
  t.same(
    e("?#id-name-1? #id-name-2> p > #id-name-3", true),
    [
      [1, 11],
      [13, 23],
      [29, 39],
    ],
    "02.23.07"
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
    "02.23.08"
  );
  t.end();
});

t.test("02.24 - id: square brackets", (t) => {
  t.same(
    e("a[target=_blank] #id-name a[target=_blank]"),
    ["#id-name"],
    "02.24.01"
  );
  t.same(
    e("a[target=_blank] #id-name[target=_blank]"),
    ["#id-name"],
    "02.24.02"
  );
  t.same(
    e("[zzz]#id-name#second[target=_blank]"),
    ["#id-name", "#second"],
    "02.24.03"
  );
  t.same(e("zzz[#id-name#second]zzz"), ["#id-name", "#second"], "02.24.04");
  // -------
  t.same(
    e("a[target=_blank] #id-name a[target=_blank]", true),
    [[17, 25]],
    "02.24.05"
  );
  t.same(
    e("a[target=_blank] #id-name[target=_blank]", true),
    [[17, 25]],
    "02.24.06"
  );
  t.same(
    e("[zzz]#id-name#second[target=_blank]", true),
    [
      [5, 13],
      [13, 20],
    ],
    "02.24.07"
  );
  t.same(
    e("zzz[#id-name#second]zzz", true),
    [
      [4, 12],
      [12, 19],
    ],
    "02.24.08"
  );
  t.end();
});

t.test("02.25 - id: curly brackets", (t) => {
  t.same(
    e("a{target=_blank} #id-name a{target=_blank}"),
    ["#id-name"],
    "02.25.01"
  );
  t.same(
    e("a{target=_blank} #id-name{target=_blank}"),
    ["#id-name"],
    "02.25.02"
  );
  t.same(
    e("aaa{bbb}#id-name#second{ccc}ddd"),
    ["#id-name", "#second"],
    "02.25.03"
  );
  t.same(e("{#id-name#second}"), ["#id-name", "#second"], "02.25.04");
  t.same(e("zz{#id-name#second}zzz"), ["#id-name", "#second"], "02.25.05");
  // -------
  t.same(
    e("a{target=_blank} #id-name a{target=_blank}", true),
    [[17, 25]],
    "02.25.06"
  );
  t.same(
    e("a{target=_blank} #id-name{target=_blank}", true),
    [[17, 25]],
    "02.25.07"
  );
  t.same(
    e("aaa{bbb}#id-name#second{ccc}ddd", true),
    [
      [8, 16],
      [16, 23],
    ],
    "02.25.08"
  );
  t.same(
    e("{#id-name#second}", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.25.09"
  );
  t.same(
    e("zz{#id-name#second}zzz", true),
    [
      [3, 11],
      [11, 18],
    ],
    "02.25.10"
  );
  t.end();
});

t.test("02.26 - id: pipe", (t) => {
  t.same(e("|#id-name|=en]"), ["#id-name"], "02.26.01");
  t.same(e("a[lang|=en] #id-name[lang|=en]"), ["#id-name"], "02.26.02");
  t.same(e("|#id-name#second|"), ["#id-name", "#second"], "02.26.03");
  // -------
  t.same(e("|#id-name|=en]", true), [[1, 9]], "02.26.04");
  t.same(e("a[lang|=en] #id-name[lang|=en]", true), [[12, 20]], "02.26.05");
  t.same(
    e("|#id-name#second|", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.26.06"
  );
  t.end();
});

t.test("02.27 - id: tick", (t) => {
  t.same(e("`#id-name`"), ["#id-name"], "02.27.01");
  t.same(e("`#id-name#second`"), ["#id-name", "#second"], "02.27.02");
  // -------
  t.same(e("`#id-name`", true), [[1, 9]], "02.27.03");
  t.same(
    e("`#id-name#second`", true),
    [
      [1, 9],
      [9, 16],
    ],
    "02.27.04"
  );
  t.end();
});

// ==============================
// Recognising class/id names after any character which is not allowed in class/id names
// ==============================

t.test("03.01 - classes separated with a space should be recognised", (t) => {
  t.same(
    e("div.first-class .second-class"),
    [".first-class", ".second-class"],
    "03.01.01"
  );
  t.same(
    e("div.first-class div.second-class"),
    [".first-class", ".second-class"],
    "03.01.02"
  );
  t.same(
    e(".first-class .second-class"),
    [".first-class", ".second-class"],
    "03.01.03"
  );
  // -------
  t.same(
    e("div.first-class .second-class", true),
    [
      [3, 15],
      [16, 29],
    ],
    "03.01.04"
  );
  t.same(
    e("div.first-class div.second-class", true),
    [
      [3, 15],
      [19, 32],
    ],
    "03.01.05"
  );
  t.same(
    e(".first-class .second-class", true),
    [
      [0, 12],
      [13, 26],
    ],
    "03.01.06"
  );
  t.end();
});

t.test("03.02 - classes recognised after brackets", (t) => {
  t.same(
    e("div.class1[lang|=en]#id1[something] .class2[lang|=en] #id2"),
    [".class1", "#id1", ".class2", "#id2"],
    "03.02.01"
  );
  t.same(
    e("div.first-class[lang|=en] div.second-class[lang|=en]"),
    [".first-class", ".second-class"],
    "03.02.02"
  );
  t.same(
    e(".first-class[lang|=en] .second-class[lang|=en]"),
    [".first-class", ".second-class"],
    "03.02.03"
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
    "03.02.04"
  );
  t.same(
    e("div.first-class[lang|=en] div.second-class[lang|=en]", true),
    [
      [3, 15],
      [29, 42],
    ],
    "03.02.05"
  );
  t.same(
    e(".first-class[lang|=en] .second-class[lang|=en]", true),
    [
      [0, 12],
      [23, 36],
    ],
    "03.02.06"
  );
  t.end();
});

t.test("03.03 - old bracket notation - classes", (t) => {
  t.same(e("td[class=rr]"), [".rr"], "03.03.01");
  t.same(e("td [ class = rr ]"), [".rr"], "03.03.02");
  t.same(e("td [ class = abc-def ]"), [".abc-def"], "03.03.03");
  t.same(e(`td [ class = "abc-def" ]`), [".abc-def"], "03.03.04");
  t.same(e(`td [ class = 'abc-def' ]`), [".abc-def"], "03.03.05");
  t.same(e(`td[class="abc-def"]`), [".abc-def"], "03.03.06");
  t.same(e(`td[class='abc-def']`), [".abc-def"], "03.03.07");
  t.end();
});

t.test("03.04 - old bracket notation - classes that need trimming", (t) => {
  t.same(e(`td [ class = " abc-def " ]`), [".abc-def"], "03.04.01");
  t.same(e(`td [ class = ' abc-def ' ]`), [".abc-def"], "03.04.02");
  t.same(e(`td[class=" abc-def "]`), [".abc-def"], "03.04.03");
  t.same(e(`td[class=' abc-def ']`), [".abc-def"], "03.04.04");
  t.end();
});

t.test("03.05 - old bracket notation - ids", (t) => {
  t.same(e("td[id=rr]"), ["#rr"], "03.05.01");
  t.same(e("td [ id = rr ]"), ["#rr"], "03.05.02");
  t.same(e("td [ id = abc-def ]"), ["#abc-def"], "03.05.03");
  t.same(e(`td [ id = "abc-def" ]`), ["#abc-def"], "03.05.04");
  t.same(e(`td [ id = 'abc-def' ]`), ["#abc-def"], "03.05.05");
  t.same(e(`td[id="abc-def"]`), ["#abc-def"], "03.05.06");
  t.same(e(`td[id='abc-def']`), ["#abc-def"], "03.05.07");
  t.end();
});

t.test("03.06 - old bracket notation - ids that need trimming", (t) => {
  t.same(e(`td [ id = " abc-def " ]`), ["#abc-def"], "03.06.01");
  t.same(e(`td [ id = ' abc-def ' ]`), ["#abc-def"], "03.06.02");
  t.same(e(`td[id=" abc-def "]`), ["#abc-def"], "03.06.03");
  t.same(e(`td[id=' abc-def ']`), ["#abc-def"], "03.06.04");
  t.end();
});

t.test("03.07 - old bracket notation - empty values", (t) => {
  // .
  t.same(e(`td[class=']`), [], "03.07.01");
  t.same(e(`td[class='']`), [], "03.07.02");
  t.same(e(`td[class="]`), [], "03.07.03");
  t.same(e(`td[class=""]`), [], "03.07.04");

  t.same(e(`td [ class= ' ]`), [], "03.07.05");
  t.same(e(`td [ class= '' ]`), [], "03.07.06");
  t.same(e(`td [ class= " ]`), [], "03.07.07");
  t.same(e(`td [ class= "" ]`), [], "03.07.08");
  // #
  t.same(e(`td[id=']`), [], "03.07.09");
  t.same(e(`td[id='']`), [], "03.07.10");
  t.same(e(`td[id="]`), [], "03.07.11");
  t.same(e(`td[id=""]`), [], "03.07.12");

  t.same(e(`td [ id= ' ]`), [], "03.07.13");
  t.same(e(`td [ id= '' ]`), [], "03.07.14");
  t.same(e(`td [ id= " ]`), [], "03.07.15");
  t.same(e(`td [ id= "" ]`), [], "03.07.16");

  t.end();
});

// ==============================
// Precautions
// ==============================

t.test("04.01 - no params", (t) => {
  t.throws(() => {
    e(undefined);
  }, /THROW_ID_01/g);
  t.end();
});

t.test("04.02 - first input arg of a wrong type", (t) => {
  t.throws(() => {
    e(1);
  }, /THROW_ID_02/g);
  t.end();
});

t.test("04.03 - second input arg of a wrong type", (t) => {
  t.throws(() => {
    e("a", 1);
  }, /THROW_ID_03/g);
  t.end();
});

// ==============================
// encoded strings given by JS
// discovered working on emailcomb.com
// ==============================

t.test("05.01 - encoded line breaks", (t) => {
  t.same(e("#unused-1\n\n\n\n\t\t\t\t\nz\t\ta"), ["#unused-1"], "05.01.01");
  t.same(e("#unused-1\n\n\n\n\t\t\t\t\nz\t\ta", true), [[0, 9]], "05.01.02");
  t.end();
});

t.test(
  "05.02 - recognises JS escaped strings and repeated dots & hashes",
  (t) => {
    t.same(
      e(
        "\naaa\n...    .unused-1\n\n\n.unused-2, .unused-3\n\t\t,,,\t###\t\nz\t\ta"
      ),
      [".unused-1", ".unused-2", ".unused-3"],
      "05.02.01"
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
      "05.02.02"
    );
    t.end();
  }
);
