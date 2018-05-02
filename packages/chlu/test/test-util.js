/* eslint no-template-curly-in-string: 0 */

const test = require("ava");
const {
  isTitle,
  isFooterLink,
  getPreviousVersion,
  aContainsB,
  getSetFooterLink,
  getRow,
  filterDate
} = require("../dist/util.cjs");

// isTitle
// -------

test("01.01 - isTitle() - negative result", t => {
  t.deepEqual(isTitle(""), false, "01.01.01");
  t.deepEqual(isTitle("a.a.a"), false, "01.01.02");
  t.deepEqual(isTitle("a.a.a."), false, "01.01.03");
  t.deepEqual(isTitle("## a.a.a"), false, "01.01.04");
  t.deepEqual(isTitle("## [a.a.a] - 2017-04-24"), false, "01.01.05");
  t.deepEqual(isTitle("## [1.a.a] - 2017-04-24"), false, "01.01.06");
  t.deepEqual(isTitle("## [1.a.a](http://codsen.com)"), false, "01.01.07");
  t.deepEqual(isTitle("## [1.a.a]: http://codsen.com"), false, "01.01.08");
  t.deepEqual(isTitle("## [1.a.a]:http://codsen.com"), false, "01.01.09");
  t.deepEqual(isTitle("[1.a.a]:http://codsen.com"), false, "01.01.10");
  t.deepEqual(isTitle("1.a.a:http://codsen.com"), false, "01.01.11");
  t.deepEqual(
    isTitle(`some text
some more text 1.0.0 and
[1.0.0](http://codsen.com)
whatever
  `),
    false,
    "01.01.12"
  );
  t.deepEqual(
    isTitle(`some text
some more text 1.0 and
[1.0.0](http://codsen.com)
whatever
  `),
    false,
    "01.01.13"
  );
  t.deepEqual(isTitle("some text 1.0.0 and more text"), false, "01.01.14");
  t.deepEqual(isTitle("some text 1.0 and more text"), false, "01.01.15");
  t.deepEqual(isTitle("* some text 1.0.0 and more text"), false, "01.01.14");
  t.deepEqual(isTitle("- some text 1.0 and more text"), false, "01.01.15");
  t.deepEqual(isTitle("1.2.0 Text"), false, "01.02.16");
  t.deepEqual(isTitle("[1.2.0]"), false, "01.02.17");
  t.deepEqual(isTitle("[1.2.0] Text"), false, "01.02.18");
});

test("01.02 - isTitle() - positive result", t => {
  t.deepEqual(isTitle("## [1.2.0] - 2017-04-24"), true, "01.02.01");
  t.deepEqual(isTitle("## [1.2.0]"), true, "01.02.02");
  t.deepEqual(isTitle("## [1.2.0] aaa"), true, "01.02.03");
  t.deepEqual(isTitle("# [1.2.0]"), true, "01.02.04");
  t.deepEqual(isTitle("## 0.0.5 - 2014-12-13 - [YANKED]"), true, "01.02.05");
  t.deepEqual(isTitle("## [0.0.5] - 2014-12-13 - [YANKED]"), true, "01.02.06");
});

test("01.03 - isTitle() - non-semver, 2 digits only", t => {
  t.deepEqual(isTitle("## [1.2] - 2017-04-24"), true, "01.03.01");
  t.deepEqual(isTitle("## [1.2]"), true, "01.03.02");
  t.deepEqual(isTitle("## [1.2] aaa"), true, "01.03.03");
  t.deepEqual(isTitle("# [1.2]"), true, "01.03.04");
  t.deepEqual(isTitle("[1.2]"), false, "01.03.05");
  t.deepEqual(isTitle("[1.2] Text"), false, "01.03.06");
  t.deepEqual(isTitle("1.2 Text"), false, "01.03.07");
  t.deepEqual(isTitle("# [1.2]"), true, "01.03.08");
  t.deepEqual(isTitle("# [1.2] Text"), true, "01.03.09");
  t.deepEqual(isTitle("# 1.2 Text"), true, "01.03.10");
});

test("01.04 - isTitle() - three hashes, H3", t => {
  t.deepEqual(isTitle("### [1.2.0] - 2017-04-24"), true, "01.04.01");
  t.deepEqual(isTitle("### [1.2.0]"), true, "01.04.02");
  t.deepEqual(isTitle("### [1.2.0] aaa"), true, "01.04.03");
});

test("01.05 - isTitle() - four hashes, H4", t => {
  t.deepEqual(isTitle("#### [1.2.0] - 2017-04-24"), true, "01.05.01");
  t.deepEqual(isTitle("#### [1.2.0]"), true, "01.05.02");
  t.deepEqual(isTitle("#### [1.2.0] aaa"), true, "01.05.03");
});

test("01.05 - isTitle() - all kinds of throws", t => {
  t.throws(() => isTitle(1));
  t.throws(() => isTitle(true));
  t.throws(() => isTitle(null));
  t.notThrows(() => isTitle(undefined));
  t.notThrows(() => isTitle("zzz"));
});

// isFooterLink
// ------------

test("02.01 - isFooterLink() - negative result", t => {
  t.deepEqual(isFooterLink(""), false, "02.01.01");
  t.deepEqual(isFooterLink(), false, "02.01.02");
  t.deepEqual(isFooterLink("[1.1.0](https://github.com)"), false, "02.01.03");
  t.deepEqual(isFooterLink("1.1.0: https://github.com"), false, "02.01.04");
  t.deepEqual(isFooterLink("[1.1.0](github.com)"), false, "02.01.05");
  t.deepEqual(
    isFooterLink("## 0.0.5 - 2014-12-13 - [YANKED]"),
    false,
    "02.01.06"
  );
});

test("02.02 - isFooterLink() - positive result", t => {
  t.deepEqual(
    isFooterLink(
      "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.0...v1.1.0"
    ),
    true,
    "02.02.01"
  );
  t.deepEqual(isFooterLink("[1.1.0]: https://github.com"), true, "02.02.02");
});

test("02.03 - isFooterLink() - all kinds of throws", t => {
  t.throws(() => isFooterLink(1));
  t.throws(() => isFooterLink(true));
  t.throws(() => isFooterLink(null));
  t.notThrows(() => isFooterLink(undefined));
  t.notThrows(() => isFooterLink("zzz"));
});

// getPreviousVersion
// ------------------

test("03.01 - getPreviousVersion() - various throws", t => {
  t.throws(() => getPreviousVersion());
  t.throws(() => getPreviousVersion("zzz"));
  t.throws(() => getPreviousVersion(1, ["zzz"]));
  t.throws(() => getPreviousVersion(1, 1));
  t.throws(() => getPreviousVersion("zzz", 1));
  t.throws(() => getPreviousVersion("zzz", "1"));
  t.throws(() => getPreviousVersion("zzz", ["yyy"]));
});

test("03.02 - getPreviousVersion() - BAU", t => {
  t.deepEqual(
    getPreviousVersion("1.1.0", ["1.1.0", "1.2.0", "1.3.0", "1.0.0"]),
    "1.0.0",
    "03.02.01"
  );
  t.deepEqual(
    getPreviousVersion("3.0.0", ["1.0.0", "3.0.0", "2.0.0", "4.0.0"]),
    "2.0.0",
    "03.02.02"
  );
});

test("03.03 - getPreviousVersion() - requesting previous of a first", t => {
  t.deepEqual(
    getPreviousVersion("1.1.0", ["1.1.0", "1.2.0", "1.3.0"]),
    null,
    "03.03"
  );
});

// aContainsB
// ------------------

test("04.01 - aContainsB() - BAU", t => {
  t.deepEqual(aContainsB("aaaaaabcdddddd", "bc"), true, "04.01.01");
  t.deepEqual(aContainsB("aaaaaabcdddddd", null), false, "04.01.02");
  t.deepEqual(aContainsB("aaaaaabcdddddd"), false, "04.01.03");
});

// getSetFooterLink
// -----------

test("05.01 - getSetFooterLink() - sets correctly", t => {
  t.deepEqual(
    getSetFooterLink(
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      {
        user: "newUser",
        project: "newProject"
      }
    ),
    "[1.1.0]: https://github.com/newUser/newProject/compare/v1.0.1...v1.1.0",
    "05.01.01"
  );

  t.deepEqual(
    getSetFooterLink(
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      {
        user: "newUser"
      }
    ),
    "[1.1.0]: https://github.com/newUser/libName/compare/v1.0.1...v1.1.0",
    "05.01.02 - user only"
  );

  t.deepEqual(
    getSetFooterLink(
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      {
        project: "package"
      }
    ),
    "[1.1.0]: https://github.com/userName/package/compare/v1.0.1...v1.1.0",
    "05.01.03 - package only"
  );

  t.deepEqual(
    getSetFooterLink(
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      {
        versBefore: "4.0.0"
      }
    ),
    "[1.1.0]: https://github.com/userName/libName/compare/v4.0.0...v1.1.0",
    "05.01.04 - versBefore only"
  );

  t.deepEqual(
    getSetFooterLink(
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      {
        versAfter: "5.0.0"
      }
    ),
    "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v5.0.0",
    "05.01.05 - versAfter only"
  );

  t.deepEqual(
    getSetFooterLink(
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      {
        version: "9.9.9"
      }
    ),
    "[9.9.9]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
    "05.01.06 - version only"
  );

  t.deepEqual(
    getSetFooterLink(
      "[6.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      {
        user: "joe",
        project: "amazing",
        versBefore: "8.0.44",
        versAfter: "8.1.0",
        version: "8.1.0"
      }
    ),
    "[8.1.0]: https://github.com/joe/amazing/compare/v8.0.44...v8.1.0",
    "05.01.07 - all"
  );
});

test("06.01 - getSetFooterLink() - gets correctly", t => {
  t.deepEqual(
    getSetFooterLink(
      "[999.88.7]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
    ),
    {
      user: "userName",
      project: "libName",
      versBefore: "1.0.1",
      versAfter: "1.1.0",
      version: "999.88.7"
    },
    "06.01.01"
  );
  t.deepEqual(
    getSetFooterLink(
      "[999.88.7]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      null
    ),
    {
      user: "userName",
      project: "libName",
      versBefore: "1.0.1",
      versAfter: "1.1.0",
      version: "999.88.7"
    },
    "06.01.02 - null as second arg"
  );
  t.deepEqual(
    getSetFooterLink(
      "[999.88.7]: https://github.com/userName/libName/compare/vv1.0.1...vv1.1.0"
    ),
    {
      user: "userName",
      project: "libName",
      versBefore: "1.0.1",
      versAfter: "1.1.0",
      version: "999.88.7"
    },
    "06.01.03 - error with double v - still OK"
  );
  t.deepEqual(
    getSetFooterLink(
      "[999.88.7]: https://github.com/userName/libName/compare/1.0.1...1.1.0"
    ),
    {
      user: "userName",
      project: "libName",
      versBefore: "1.0.1",
      versAfter: "1.1.0",
      version: "999.88.7"
    },
    '06.01.04 - characters "v" missing completely'
  );
  t.deepEqual(
    getSetFooterLink(
      "[999.88.7]: https://github.com/userName/libName/compare/1.0.1...vv1.1.0"
    ),
    {
      user: "userName",
      project: "libName",
      versBefore: "1.0.1",
      versAfter: "1.1.0",
      version: "999.88.7"
    },
    "06.01.05 - one missing, one double v"
  );
});

test("06.02 - getSetFooterLink() - get errors out returning null when link is erroneous", t => {
  t.deepEqual(
    getSetFooterLink(
      "[999.88.7]: https://github.com/userName/libName/compare/v1.0.1"
    ),
    null,
    "06.02.01"
  );
});

// getRow
// ------

test("07.01 - getRow() - all kinds of throws", t => {
  t.throws(() => getRow(1));
  t.throws(() => getRow("a"));
  t.throws(() => getRow(1, 1));
  t.throws(() => getRow(1.5, ["a"]));
});

test("07.02 - getRow() - BAU", t => {
  t.deepEqual(getRow(["aaa", "bbb", "ccc"], 2), "ccc", "07.02.01 - found");
  t.deepEqual(getRow(["aaa", "bbb", "ccc"], 99), null, "07.02.01 - not found");
});

// filterDate
// ----------

test("08.01 - filterDate() - filters out date string", t => {
  t.deepEqual(
    filterDate(" ]  (March 1st, 2017)"),
    "March 1st 2017",
    "08.01.01"
  );
  t.deepEqual(filterDate("]  (March 1st, 2017)"), "March 1st 2017", "08.01.02");
  t.deepEqual(filterDate("   (March 1st, 2017)"), "March 1st 2017", "08.01.03");
  t.deepEqual(filterDate("((March 1st, 2017)"), "March 1st 2017", "08.01.04");
  t.deepEqual(filterDate("(March 1st, 2017)"), "March 1st 2017", "08.01.05");
  t.deepEqual(filterDate("March 1st, 2017)"), "March 1st 2017", "08.01.06");
  t.deepEqual(
    filterDate(", 1st of March 2017)"),
    "1st of March 2017",
    "08.01.07"
  );
  t.deepEqual(
    filterDate(" \u2014 March 1st, 2017)"),
    "March 1st 2017",
    "08.01.08"
  );
  t.deepEqual(
    filterDate("] - 2014-12-13 - [YANKED]"),
    "2014-12-13",
    "08.01.09"
  );
  t.deepEqual(filterDate("] - 2014-12-13 - YANKED"), "2014-12-13", "08.01.10");
  t.deepEqual(filterDate("] - 2014-12-13, YANKED"), "2014-12-13", "08.01.11");
  t.deepEqual(filterDate("] - 2014-12-13 -YANKED"), "2014-12-13", "08.01.12");
  t.deepEqual(filterDate("] - 2014-12-13 YANKED"), "2014-12-13", "08.01.13");
  t.deepEqual(filterDate(" - 2014-12-13 - [YANKED]"), "2014-12-13", "08.01.14");
  t.deepEqual(filterDate(" - 2014-12-13 - YANKED"), "2014-12-13", "08.01.15");
  t.deepEqual(filterDate(" - 2014-12-13, YANKED"), "2014-12-13", "08.01.16");
  t.deepEqual(filterDate(" - 2014-12-13 -YANKED"), "2014-12-13", "08.01.17");
  t.deepEqual(filterDate(" - 2014-12-13 YANKED"), "2014-12-13", "08.01.18");
  t.deepEqual(
    filterDate(" -                                    2014-12-13 YANKED"),
    "2014-12-13",
    "08.01.19 - many spaces"
  );
  t.deepEqual(
    filterDate(" - 2014-12-13                          YANKED"),
    "2014-12-13",
    "08.01.20"
  );
  t.deepEqual(filterDate(" (2017-3-17)"), "2017-3-17", "08.01.21");
  t.deepEqual(filterDate(" - 2017-07-04 🇺🇸"), "2017-07-04", "08.01.22");
  t.deepEqual(filterDate(" - 2017-07-04 - 🇺🇸"), "2017-07-04", "08.01.23");
  t.deepEqual(filterDate(" - 2017-07-04 - 🇺🇸 "), "2017-07-04", "08.01.24");
});
