import tap from "tap";
import {
  isTitle,
  isFooterLink,
  getPreviousVersion,
  aContainsB,
  getSetFooterLink,
  getRow,
  filterDate,
} from "../src/util";

// 01. isTitle
// -------

tap.test(
  `01 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - negative result`,
  (t) => {
    t.same(isTitle(""), false, "01.01");
    t.same(isTitle("a.a.a"), false, "01.02");
    t.same(isTitle("a.a.a."), false, "01.03");
    t.same(isTitle("## a.a.a"), false, "01.04");
    t.same(isTitle("## [a.a.a] - 2017-04-24"), false, "01.05");
    t.same(isTitle("## [1.a.a] - 2017-04-24"), false, "01.06");
    t.same(isTitle("## [1.a.a](http://codsen.com)"), false, "01.07");
    t.same(isTitle("## [1.a.a]: http://codsen.com"), false, "01.08");
    t.same(isTitle("## [1.a.a]:http://codsen.com"), false, "01.09");
    t.same(isTitle("[1.a.a]:http://codsen.com"), false, "01.10");
    t.same(isTitle("1.a.a:http://codsen.com"), false, "01.11");
    t.same(
      isTitle(`some text
some more text 1.0.0 and
[1.0.0](http://codsen.com)
whatever
  `),
      false,
      "01.12"
    );
    t.same(
      isTitle(`some text
some more text 1.0 and
[1.0.0](http://codsen.com)
whatever
  `),
      false,
      "01.13"
    );
    t.same(isTitle("some text 1.0.0 and more text"), false, "01.14");
    t.same(isTitle("some text 1.0 and more text"), false, "01.15");
    t.same(isTitle("* some text 1.0.0 and more text"), false, "01.16");
    t.same(isTitle("- some text 1.0 and more text"), false, "01.17");
    t.same(isTitle("1.2.0 Text"), false, "01.18");
    t.same(isTitle("[1.2.0]"), false, "01.19");
    t.same(isTitle("[1.2.0] Text"), false, "01.20");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - positive result`,
  (t) => {
    t.same(isTitle("## [1.2.0] - 2017-04-24"), true, "02.01");
    t.same(isTitle("## [1.2.0]"), true, "02.02");
    t.same(isTitle("## [1.2.0] aaa"), true, "02.03");
    t.same(isTitle("# [1.2.0]"), true, "02.04");
    t.same(isTitle("## 0.0.5 - 2014-12-13 - [YANKED]"), true, "02.05");
    t.same(isTitle("## [0.0.5] - 2014-12-13 - [YANKED]"), true, "02.06");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - non-semver, 2 digits only`,
  (t) => {
    t.same(isTitle("## [1.2] - 2017-04-24"), true, "03.01");
    t.same(isTitle("## [1.2]"), true, "03.02");
    t.same(isTitle("## [1.2] aaa"), true, "03.03");
    t.same(isTitle("# [1.2]"), true, "03.04");
    t.same(isTitle("[1.2]"), false, "03.05");
    t.same(isTitle("[1.2] Text"), false, "03.06");
    t.same(isTitle("1.2 Text"), false, "03.07");
    t.same(isTitle("# [1.2]"), true, "03.08");
    t.same(isTitle("# [1.2] Text"), true, "03.09");
    t.same(isTitle("# 1.2 Text"), true, "03.10");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - three hashes, H3`,
  (t) => {
    t.same(isTitle("### [1.2.0] - 2017-04-24"), true, "04.01");
    t.same(isTitle("### [1.2.0]"), true, "04.02");
    t.same(isTitle("### [1.2.0] aaa"), true, "04.03");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - four hashes, H4`,
  (t) => {
    t.same(isTitle("#### [1.2.0] - 2017-04-24"), true, "05.01");
    t.same(isTitle("#### [1.2.0]"), true, "05.02");
    t.same(isTitle("#### [1.2.0] aaa"), true, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - all kinds of throws`,
  (t) => {
    t.throws(() => isTitle(1), "06.01");
    t.throws(() => isTitle(true), "06.02");
    t.throws(() => isTitle(null), "06.03");
    t.doesNotThrow(() => isTitle(undefined), "06.04");
    t.doesNotThrow(() => isTitle("zzz"), "06.05");
    t.end();
  }
);

// 02. isFooterLink
// ------------

tap.test(
  `07 - ${`\u001b[${33}m${`isFooterLink()`}\u001b[${39}m`} - negative result`,
  (t) => {
    t.same(isFooterLink(""), false, "07.01");
    t.same(isFooterLink(), false, "07.02");
    t.same(isFooterLink("[1.1.0](https://github.com)"), false, "07.03");
    t.same(isFooterLink("1.1.0: https://github.com"), false, "07.04");
    t.same(isFooterLink("[1.1.0](github.com)"), false, "07.05");
    t.same(isFooterLink("## 0.0.5 - 2014-12-13 - [YANKED]"), false, "07.06");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`isFooterLink()`}\u001b[${39}m`} - positive result`,
  (t) => {
    t.same(
      isFooterLink(
        "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.0...v1.1.0"
      ),
      true,
      "08.01"
    );
    t.same(isFooterLink("[1.1.0]: https://github.com"), true, "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`isFooterLink()`}\u001b[${39}m`} - all kinds of throws`,
  (t) => {
    t.throws(() => isFooterLink(1), "09.01");
    t.throws(() => isFooterLink(true), "09.02");
    t.throws(() => isFooterLink(null), "09.03");
    t.doesNotThrow(() => isFooterLink(undefined), "09.04");
    t.doesNotThrow(() => isFooterLink("zzz"), "09.05");
    t.end();
  }
);

// 03. getPreviousVersion
// ------------------

tap.test(
  `10 - ${`\u001b[${35}m${`getPreviousVersion()`}\u001b[${39}m`} - various throws`,
  (t) => {
    t.throws(() => getPreviousVersion(), "10.01");
    t.throws(() => getPreviousVersion("zzz"), "10.02");
    t.throws(() => getPreviousVersion(1, ["zzz"]), "10.03");
    t.throws(() => getPreviousVersion(1, 1), "10.04");
    t.throws(() => getPreviousVersion("zzz", 1), "10.05");
    t.throws(() => getPreviousVersion("zzz", "1"), "10.06");
    t.throws(() => getPreviousVersion("zzz", ["yyy"]), "10.07");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`getPreviousVersion()`}\u001b[${39}m`} - BAU`,
  (t) => {
    // without "v."
    t.same(
      getPreviousVersion("1.1.0", ["1.1.0", "1.2.0", "1.3.0", "1.0.0"]),
      "1.0.0",
      "11.01"
    );
    t.same(
      getPreviousVersion("3.0.0", ["1.0.0", "3.0.0", "2.0.0", "4.0.0"]),
      "2.0.0",
      "11.02"
    );
    t.same(
      getPreviousVersion("3.0.0", ["1.0.9", "3.0.0", "2.9.10", "4.0.0"]),
      "2.9.10",
      "11.03"
    );

    // with "v."
    t.same(
      getPreviousVersion("v1.1.0", ["v1.1.0", "v1.2.0", "v1.3.0", "v1.0.0"]),
      "1.0.0",
      "11.04"
    );
    t.same(
      getPreviousVersion("v3.0.0", ["v1.0.0", "v3.0.0", "v2.0.0", "v4.0.0"]),
      "2.0.0",
      "11.05"
    );
    t.same(
      getPreviousVersion("v3.0.0", ["v1.0.9", "v3.0.0", "v2.9.10", "v4.0.0"]),
      "2.9.10",
      "11.06"
    );

    // mixed
    t.same(
      getPreviousVersion("v1.1.0", ["1.1.0", "1.2.0", "1.3.0", "1.0.0"]),
      "1.0.0",
      "11.07"
    );
    t.same(
      getPreviousVersion("v3.0.0", ["1.0.0", "3.0.0", "2.0.0", "4.0.0"]),
      "2.0.0",
      "11.08"
    );
    t.same(
      getPreviousVersion("3.0.0", ["v1.0.9", "v3.0.0", "v2.9.10", "v4.0.0"]),
      "2.9.10",
      "11.09"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`getPreviousVersion()`}\u001b[${39}m`} - requesting previous of a first`,
  (t) => {
    t.same(
      getPreviousVersion("1.1.0", ["1.1.0", "1.2.0", "1.3.0"]),
      null,
      "12"
    );
    t.end();
  }
);

// 04. aContainsB
// ------------------

tap.test(`13 - ${`\u001b[${33}m${`aContainsB()`}\u001b[${39}m`} - BAU`, (t) => {
  t.same(aContainsB("aaaaaabcdddddd", "bc"), true, "13.01");
  t.same(aContainsB("aaaaaabcdddddd", null), false, "13.02");
  t.same(aContainsB("aaaaaabcdddddd"), false, "13.03");
  t.end();
});

// 05. getSetFooterLink
// -----------

tap.test(
  `14 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${33}m${`sets`}\u001b[${39}m`} correctly GitHub`,
  (t) => {
    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          user: "newUser",
          project: "newProject",
          type: "github",
          mode: "set",
        }
      ),
      "[1.1.0]: https://github.com/newUser/newProject/compare/v1.0.1...v1.1.0",
      "14.01"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          user: "newUser",
          type: "github",
          mode: "set",
        }
      ),
      "[1.1.0]: https://github.com/newUser/libName/compare/v1.0.1...v1.1.0",
      "14.02 - user only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          project: "package",
          type: "github",
          mode: "set",
        }
      ),
      "[1.1.0]: https://github.com/userName/package/compare/v1.0.1...v1.1.0",
      "14.03 - package only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          versBefore: "4.0.0",
          type: "github",
          mode: "set",
        }
      ),
      "[1.1.0]: https://github.com/userName/libName/compare/v4.0.0...v1.1.0",
      "14.04 - versBefore only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          versAfter: "5.0.0",
          type: "github",
          mode: "set",
        }
      ),
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v5.0.0",
      "14.05 - versAfter only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          version: "9.9.9",
          type: "github",
          mode: "set",
        }
      ),
      "[9.9.9]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      "14.06 - version only"
    );

    t.same(
      getSetFooterLink(
        "[6.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          user: "joe",
          project: "amazing",
          versBefore: "8.0.44",
          versAfter: "8.1.0",
          version: "8.2.0", // <----- this is naughty, it should match versAfter in real life
          type: "github",
          mode: "set",
        }
      ),
      "[8.2.0]: https://github.com/joe/amazing/compare/v8.0.44...v8.1.0",
      "14.07 - all variables given, Github -> Github"
    );

    t.same(
      getSetFooterLink(
        "[6.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          user: "joe",
          project: "amazing",
          versBefore: "8.0.44",
          versAfter: "8.1.0",
          version: "8.2.0", // <----- this is naughty, it should match versAfter in real life
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[8.2.0]: https://bitbucket.org/joe/amazing/branches/compare/v8.1.0%0Dv8.0.44#diff",
      "14.08 - all variables given, Github -> Bitbucket"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly GitHub`,
  (t) => {
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "github",
      },
      "15.01"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        null
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "github",
      },
      "15.02 - null as second arg"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://github.com/userName/libName/compare/vv1.0.1...vv1.1.0"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "github",
      },
      "15.03 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://github.com/userName/libName/compare/1.0.1...1.1.0"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "github",
      },
      '15.04 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://github.com/userName/libName/compare/1.0.1...vv1.1.0"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "github",
      },
      "15.05 - one missing, one double v"
    );
    t.end();
  }
);

//
//                            B I T B U C K E T
//

// https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.4
// https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1

tap.test(
  `16 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${33}m${`sets`}\u001b[${39}m`} correctly Bitbucket`,
  (t) => {
    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          user: "newUser",
          project: "newProject",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[1.1.0]: https://bitbucket.org/newUser/newProject/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "16.01"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          user: "newUser",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[1.1.0]: https://bitbucket.org/newUser/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "16.02 - user only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          project: "package",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[1.1.0]: https://bitbucket.org/userName/package/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "16.03 - package only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          versBefore: "4.0.0",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv4.0.0#diff",
      "16.04 - versBefore only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          versAfter: "5.0.0",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v5.0.0%0Dv1.0.1#diff",
      "16.05 - versAfter only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          version: "9.9.9",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[9.9.9]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "16.06 - version only"
    );

    t.same(
      getSetFooterLink(
        "[6.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          user: "joe",
          project: "amazing",
          versBefore: "8.0.44",
          versAfter: "8.1.0",
          version: "8.1.0",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[8.1.0]: https://bitbucket.org/joe/amazing/branches/compare/v8.1.0%0Dv8.0.44#diff",
      "16.07 - all"
    );

    t.same(
      getSetFooterLink(
        "[6.1.0]: https://github.com/userName/libName/compare/1.0.1...1.1.0",
        {
          user: "joe",
          project: "amazing",
          versBefore: "8.0.44",
          versAfter: "8.1.0",
          version: "8.2.0",
          type: "bitbucket",
          mode: "set",
        }
      ),
      "[8.2.0]: https://bitbucket.org/joe/amazing/branches/compare/v8.1.0%0Dv8.0.44#diff",
      "16.08 - all + conversion from GitHub to Bitbucket"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with ... - without diff`,
  (t) => {
    // passing {mode: "get"}:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0...v1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "17.01 - URL IS WRONG! It should contain %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0...vv1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "17.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      '17.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...vv1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "17.04 - one missing, one double v"
    );

    // not passing the {mode: "get"} object also works:

    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0...v1.0.1"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "17.05 - URL IS WRONG! It should contain %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0...vv1.0.1"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "17.06 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...1.0.1"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      '17.07 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...vv1.0.1"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "17.08 - one missing, one double v"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with %0D - without diff`,
  (t) => {
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "18.01 - diff is separated by %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0%0Dvv1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "18.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0D1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      '18.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0Dvv1.0.1",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "18.04 - one missing, one double v"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with ... - with diff`,
  (t) => {
    // with explicit {mode: "get"} object passed:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0...v1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "19.01 - URL IS WRONG! It should contain %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0...vv1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "19.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      '19.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...vv1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "19.04 - one missing, one double v"
    );

    // without explicit {mode: "get"} object passed:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0...v1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "19.05 - URL IS WRONG! It should contain %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0...vv1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "19.06 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      '19.07 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...vv1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "19.08 - one missing, one double v"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with %0D - with diff`,
  (t) => {
    // with explicit {mode: "get"} object being passed:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "20.01 - diff is separated by %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0%0Dvv1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "20.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0D1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      '20.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0Dvv1.0.1#diff",
        {
          mode: "get",
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "20.04 - one missing, one double v"
    );

    // without explicit {mode: "get"} object passed:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "20.05 - diff is separated by %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0%0Dvv1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "20.06 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0D1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      '20.07 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0Dvv1.0.1#diff"
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket",
      },
      "20.08 - one missing, one double v"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${36}m${`get`}\u001b[${39}m`} errors-out, returning null, when link is erroneous`,
  (t) => {
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.0.1",
        {
          mode: "get",
        }
      ),
      null,
      "21"
    );
    t.end();
  }
);

// 06. getRow
// ------

tap.test(
  `22 - ${`\u001b[${33}m${`getRow()`}\u001b[${39}m`} - all kinds of throws`,
  (t) => {
    t.throws(() => getRow(1), "22.01");
    t.throws(() => getRow("a"), "22.02");
    t.throws(() => getRow(1, 1), "22.03");
    t.throws(() => getRow(1.5, ["a"]), "22.04");
    t.end();
  }
);

tap.test(`23 - ${`\u001b[${33}m${`getRow()`}\u001b[${39}m`} - BAU`, (t) => {
  t.same(getRow(["aaa", "bbb", "ccc"], 2), "ccc", "23.01 - found");
  t.same(getRow(["aaa", "bbb", "ccc"], 99), null, "23.02 - not found");
  t.end();
});

// 07. filterDate
// ----------

tap.test(
  `24 - ${`\u001b[${35}m${`filterDate()`}\u001b[${39}m`} - filters out date string`,
  (t) => {
    t.same(filterDate(" ]  (March 1st, 2017)"), "March 1st 2017", "24.01");
    t.same(filterDate("]  (March 1st, 2017)"), "March 1st 2017", "24.02");
    t.same(filterDate("   (March 1st, 2017)"), "March 1st 2017", "24.03");
    t.same(filterDate("((March 1st, 2017)"), "March 1st 2017", "24.04");
    t.same(filterDate("(March 1st, 2017)"), "March 1st 2017", "24.05");
    t.same(filterDate("March 1st, 2017)"), "March 1st 2017", "24.06");
    t.same(filterDate(", 1st of March 2017)"), "1st of March 2017", "24.07");
    t.same(filterDate(" \u2014 March 1st, 2017)"), "March 1st 2017", "24.08");
    t.same(filterDate("] - 2014-12-13 - [YANKED]"), "2014-12-13", "24.09");
    t.same(filterDate("] - 2014-12-13 - YANKED"), "2014-12-13", "24.10");
    t.same(filterDate("] - 2014-12-13, YANKED"), "2014-12-13", "24.11");
    t.same(filterDate("] - 2014-12-13 -YANKED"), "2014-12-13", "24.12");
    t.same(filterDate("] - 2014-12-13 YANKED"), "2014-12-13", "24.13");
    t.same(filterDate(" - 2014-12-13 - [YANKED]"), "2014-12-13", "24.14");
    t.same(filterDate(" - 2014-12-13 - YANKED"), "2014-12-13", "24.15");
    t.same(filterDate(" - 2014-12-13, YANKED"), "2014-12-13", "24.16");
    t.same(filterDate(" - 2014-12-13 -YANKED"), "2014-12-13", "24.17");
    t.same(filterDate(" - 2014-12-13 YANKED"), "2014-12-13", "24.18");
    t.same(
      filterDate(" -                                    2014-12-13 YANKED"),
      "2014-12-13",
      "24.19 - many spaces"
    );
    t.same(
      filterDate(" - 2014-12-13                          YANKED"),
      "2014-12-13",
      "24.20"
    );
    t.same(filterDate(" (2017-3-17)"), "2017-3-17", "24.21");
    t.same(filterDate(" - 2017-07-04 🇺🇸"), "2017-07-04", "24.22");
    t.same(filterDate(" - 2017-07-04 - 🇺🇸"), "2017-07-04", "24.23");
    t.same(filterDate(" - 2017-07-04 - 🇺🇸 "), "2017-07-04", "24.24");
    t.end();
  }
);
