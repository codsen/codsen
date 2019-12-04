const t = require("tap");
const {
  isTitle,
  isFooterLink,
  getPreviousVersion,
  aContainsB,
  getSetFooterLink,
  getRow,
  filterDate
} = require("../dist/util.esm");

// 01. isTitle
// -------

t.test(
  `01.01 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - negative result`,
  t => {
    t.same(isTitle(""), false, "01.01.01");
    t.same(isTitle("a.a.a"), false, "01.01.02");
    t.same(isTitle("a.a.a."), false, "01.01.03");
    t.same(isTitle("## a.a.a"), false, "01.01.04");
    t.same(isTitle("## [a.a.a] - 2017-04-24"), false, "01.01.05");
    t.same(isTitle("## [1.a.a] - 2017-04-24"), false, "01.01.06");
    t.same(isTitle("## [1.a.a](http://codsen.com)"), false, "01.01.07");
    t.same(isTitle("## [1.a.a]: http://codsen.com"), false, "01.01.08");
    t.same(isTitle("## [1.a.a]:http://codsen.com"), false, "01.01.09");
    t.same(isTitle("[1.a.a]:http://codsen.com"), false, "01.01.10");
    t.same(isTitle("1.a.a:http://codsen.com"), false, "01.01.11");
    t.same(
      isTitle(`some text
some more text 1.0.0 and
[1.0.0](http://codsen.com)
whatever
  `),
      false,
      "01.01.12"
    );
    t.same(
      isTitle(`some text
some more text 1.0 and
[1.0.0](http://codsen.com)
whatever
  `),
      false,
      "01.01.13"
    );
    t.same(isTitle("some text 1.0.0 and more text"), false, "01.01.14");
    t.same(isTitle("some text 1.0 and more text"), false, "01.01.15");
    t.same(isTitle("* some text 1.0.0 and more text"), false, "01.01.14");
    t.same(isTitle("- some text 1.0 and more text"), false, "01.01.15");
    t.same(isTitle("1.2.0 Text"), false, "01.02.16");
    t.same(isTitle("[1.2.0]"), false, "01.02.17");
    t.same(isTitle("[1.2.0] Text"), false, "01.02.18");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - positive result`,
  t => {
    t.same(isTitle("## [1.2.0] - 2017-04-24"), true, "01.02.01");
    t.same(isTitle("## [1.2.0]"), true, "01.02.02");
    t.same(isTitle("## [1.2.0] aaa"), true, "01.02.03");
    t.same(isTitle("# [1.2.0]"), true, "01.02.04");
    t.same(isTitle("## 0.0.5 - 2014-12-13 - [YANKED]"), true, "01.02.05");
    t.same(isTitle("## [0.0.5] - 2014-12-13 - [YANKED]"), true, "01.02.06");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - non-semver, 2 digits only`,
  t => {
    t.same(isTitle("## [1.2] - 2017-04-24"), true, "01.03.01");
    t.same(isTitle("## [1.2]"), true, "01.03.02");
    t.same(isTitle("## [1.2] aaa"), true, "01.03.03");
    t.same(isTitle("# [1.2]"), true, "01.03.04");
    t.same(isTitle("[1.2]"), false, "01.03.05");
    t.same(isTitle("[1.2] Text"), false, "01.03.06");
    t.same(isTitle("1.2 Text"), false, "01.03.07");
    t.same(isTitle("# [1.2]"), true, "01.03.08");
    t.same(isTitle("# [1.2] Text"), true, "01.03.09");
    t.same(isTitle("# 1.2 Text"), true, "01.03.10");
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - three hashes, H3`,
  t => {
    t.same(isTitle("### [1.2.0] - 2017-04-24"), true, "01.04.01");
    t.same(isTitle("### [1.2.0]"), true, "01.04.02");
    t.same(isTitle("### [1.2.0] aaa"), true, "01.04.03");
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - four hashes, H4`,
  t => {
    t.same(isTitle("#### [1.2.0] - 2017-04-24"), true, "01.05.01");
    t.same(isTitle("#### [1.2.0]"), true, "01.05.02");
    t.same(isTitle("#### [1.2.0] aaa"), true, "01.05.03");
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${35}m${`isTitle()`}\u001b[${39}m`} - all kinds of throws`,
  t => {
    t.throws(() => isTitle(1));
    t.throws(() => isTitle(true));
    t.throws(() => isTitle(null));
    t.doesNotThrow(() => isTitle(undefined));
    t.doesNotThrow(() => isTitle("zzz"));
    t.end();
  }
);

// 02. isFooterLink
// ------------

t.test(
  `02.01 - ${`\u001b[${33}m${`isFooterLink()`}\u001b[${39}m`} - negative result`,
  t => {
    t.same(isFooterLink(""), false, "02.01.01");
    t.same(isFooterLink(), false, "02.01.02");
    t.same(isFooterLink("[1.1.0](https://github.com)"), false, "02.01.03");
    t.same(isFooterLink("1.1.0: https://github.com"), false, "02.01.04");
    t.same(isFooterLink("[1.1.0](github.com)"), false, "02.01.05");
    t.same(isFooterLink("## 0.0.5 - 2014-12-13 - [YANKED]"), false, "02.01.06");
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`isFooterLink()`}\u001b[${39}m`} - positive result`,
  t => {
    t.same(
      isFooterLink(
        "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.0...v1.1.0"
      ),
      true,
      "02.02.01"
    );
    t.same(isFooterLink("[1.1.0]: https://github.com"), true, "02.02.02");
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`isFooterLink()`}\u001b[${39}m`} - all kinds of throws`,
  t => {
    t.throws(() => isFooterLink(1));
    t.throws(() => isFooterLink(true));
    t.throws(() => isFooterLink(null));
    t.doesNotThrow(() => isFooterLink(undefined));
    t.doesNotThrow(() => isFooterLink("zzz"));
    t.end();
  }
);

// 03. getPreviousVersion
// ------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`getPreviousVersion()`}\u001b[${39}m`} - various throws`,
  t => {
    t.throws(() => getPreviousVersion());
    t.throws(() => getPreviousVersion("zzz"));
    t.throws(() => getPreviousVersion(1, ["zzz"]));
    t.throws(() => getPreviousVersion(1, 1));
    t.throws(() => getPreviousVersion("zzz", 1));
    t.throws(() => getPreviousVersion("zzz", "1"));
    t.throws(() => getPreviousVersion("zzz", ["yyy"]));
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`getPreviousVersion()`}\u001b[${39}m`} - BAU`,
  t => {
    // without "v."
    t.same(
      getPreviousVersion("1.1.0", ["1.1.0", "1.2.0", "1.3.0", "1.0.0"]),
      "1.0.0",
      "03.02.01"
    );
    t.same(
      getPreviousVersion("3.0.0", ["1.0.0", "3.0.0", "2.0.0", "4.0.0"]),
      "2.0.0",
      "03.02.02"
    );
    t.same(
      getPreviousVersion("3.0.0", ["1.0.9", "3.0.0", "2.9.10", "4.0.0"]),
      "2.9.10",
      "03.02.03"
    );

    // with "v."
    t.same(
      getPreviousVersion("v1.1.0", ["v1.1.0", "v1.2.0", "v1.3.0", "v1.0.0"]),
      "1.0.0",
      "03.02.04"
    );
    t.same(
      getPreviousVersion("v3.0.0", ["v1.0.0", "v3.0.0", "v2.0.0", "v4.0.0"]),
      "2.0.0",
      "03.02.05"
    );
    t.same(
      getPreviousVersion("v3.0.0", ["v1.0.9", "v3.0.0", "v2.9.10", "v4.0.0"]),
      "2.9.10",
      "03.02.06"
    );

    // mixed
    t.same(
      getPreviousVersion("v1.1.0", ["1.1.0", "1.2.0", "1.3.0", "1.0.0"]),
      "1.0.0",
      "03.02.07"
    );
    t.same(
      getPreviousVersion("v3.0.0", ["1.0.0", "3.0.0", "2.0.0", "4.0.0"]),
      "2.0.0",
      "03.02.08"
    );
    t.same(
      getPreviousVersion("3.0.0", ["v1.0.9", "v3.0.0", "v2.9.10", "v4.0.0"]),
      "2.9.10",
      "03.02.09"
    );
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`getPreviousVersion()`}\u001b[${39}m`} - requesting previous of a first`,
  t => {
    t.same(
      getPreviousVersion("1.1.0", ["1.1.0", "1.2.0", "1.3.0"]),
      null,
      "03.03"
    );
    t.end();
  }
);

// 04. aContainsB
// ------------------

t.test(`04.01 - ${`\u001b[${33}m${`aContainsB()`}\u001b[${39}m`} - BAU`, t => {
  t.same(aContainsB("aaaaaabcdddddd", "bc"), true, "04.01.01");
  t.same(aContainsB("aaaaaabcdddddd", null), false, "04.01.02");
  t.same(aContainsB("aaaaaabcdddddd"), false, "04.01.03");
  t.end();
});

// 05. getSetFooterLink
// -----------

t.test(
  `05.01 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${33}m${`sets`}\u001b[${39}m`} correctly GitHub`,
  t => {
    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          user: "newUser",
          project: "newProject",
          type: "github",
          mode: "set"
        }
      ),
      "[1.1.0]: https://github.com/newUser/newProject/compare/v1.0.1...v1.1.0",
      "05.01.01"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          user: "newUser",
          type: "github",
          mode: "set"
        }
      ),
      "[1.1.0]: https://github.com/newUser/libName/compare/v1.0.1...v1.1.0",
      "05.01.02 - user only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          project: "package",
          type: "github",
          mode: "set"
        }
      ),
      "[1.1.0]: https://github.com/userName/package/compare/v1.0.1...v1.1.0",
      "05.01.03 - package only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          versBefore: "4.0.0",
          type: "github",
          mode: "set"
        }
      ),
      "[1.1.0]: https://github.com/userName/libName/compare/v4.0.0...v1.1.0",
      "05.01.04 - versBefore only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          versAfter: "5.0.0",
          type: "github",
          mode: "set"
        }
      ),
      "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v5.0.0",
      "05.01.05 - versAfter only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
        {
          version: "9.9.9",
          type: "github",
          mode: "set"
        }
      ),
      "[9.9.9]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0",
      "05.01.06 - version only"
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
          mode: "set"
        }
      ),
      "[8.2.0]: https://github.com/joe/amazing/compare/v8.0.44...v8.1.0",
      "05.01.07 - all variables given, Github -> Github"
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
          mode: "set"
        }
      ),
      "[8.2.0]: https://bitbucket.org/joe/amazing/branches/compare/v8.1.0%0Dv8.0.44#diff",
      "05.01.08 - all variables given, Github -> Bitbucket"
    );
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly GitHub`,
  t => {
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
        type: "github"
      },
      "05.02.01"
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
        type: "github"
      },
      "05.02.02 - null as second arg"
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
        type: "github"
      },
      "05.02.03 - error with double v - still OK"
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
        type: "github"
      },
      '05.02.04 - characters "v" missing completely'
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
        type: "github"
      },
      "05.02.05 - one missing, one double v"
    );
    t.end();
  }
);

//
//                            B I T B U C K E T
//

// https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.4
// https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1

t.test(
  `05.03 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${33}m${`sets`}\u001b[${39}m`} correctly Bitbucket`,
  t => {
    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          user: "newUser",
          project: "newProject",
          type: "bitbucket",
          mode: "set"
        }
      ),
      "[1.1.0]: https://bitbucket.org/newUser/newProject/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "05.03.01"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          user: "newUser",
          type: "bitbucket",
          mode: "set"
        }
      ),
      "[1.1.0]: https://bitbucket.org/newUser/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "05.03.02 - user only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          project: "package",
          type: "bitbucket",
          mode: "set"
        }
      ),
      "[1.1.0]: https://bitbucket.org/userName/package/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "05.03.03 - package only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          versBefore: "4.0.0",
          type: "bitbucket",
          mode: "set"
        }
      ),
      "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv4.0.0#diff",
      "05.03.04 - versBefore only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          versAfter: "5.0.0",
          type: "bitbucket",
          mode: "set"
        }
      ),
      "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v5.0.0%0Dv1.0.1#diff",
      "05.03.05 - versAfter only"
    );

    t.same(
      getSetFooterLink(
        "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          version: "9.9.9",
          type: "bitbucket",
          mode: "set"
        }
      ),
      "[9.9.9]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
      "05.03.06 - version only"
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
          mode: "set"
        }
      ),
      "[8.1.0]: https://bitbucket.org/joe/amazing/branches/compare/v8.1.0%0Dv8.0.44#diff",
      "05.03.07 - all"
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
          mode: "set"
        }
      ),
      "[8.2.0]: https://bitbucket.org/joe/amazing/branches/compare/v8.1.0%0Dv8.0.44#diff",
      "05.03.08 - all + conversion from GitHub to Bitbucket"
    );
    t.end();
  }
);

t.test(
  `05.04 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with ... - without diff`,
  t => {
    // passing {mode: "get"}:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0...v1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.04.01 - URL IS WRONG! It should contain %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0...vv1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.04.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      '05.04.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...vv1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.04.04 - one missing, one double v"
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
        type: "bitbucket"
      },
      "05.04.05 - URL IS WRONG! It should contain %0D not ..."
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
        type: "bitbucket"
      },
      "05.04.06 - error with double v - still OK"
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
        type: "bitbucket"
      },
      '05.04.07 - characters "v" missing completely'
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
        type: "bitbucket"
      },
      "05.04.08 - one missing, one double v"
    );
    t.end();
  }
);

t.test(
  `05.05 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with %0D - without diff`,
  t => {
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.05.01 - diff is separated by %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0%0Dvv1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.05.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0D1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      '05.05.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0Dvv1.0.1",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.05.04 - one missing, one double v"
    );
    t.end();
  }
);

t.test(
  `05.06 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with ... - with diff`,
  t => {
    // with explicit {mode: "get"} object passed:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0...v1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.06.01 - URL IS WRONG! It should contain %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0...vv1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.06.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      '05.06.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0...vv1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.06.04 - one missing, one double v"
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
        type: "bitbucket"
      },
      "05.06.05 - URL IS WRONG! It should contain %0D not ..."
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
        type: "bitbucket"
      },
      "05.06.06 - error with double v - still OK"
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
        type: "bitbucket"
      },
      '05.06.07 - characters "v" missing completely'
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
        type: "bitbucket"
      },
      "05.06.08 - one missing, one double v"
    );
    t.end();
  }
);

t.test(
  `05.07 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${31}m${`gets`}\u001b[${39}m`} correctly Bitbucket, url is with %0D - with diff`,
  t => {
    // with explicit {mode: "get"} object being passed:
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.07.01 - diff is separated by %0D not ..."
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/vv1.1.0%0Dvv1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.07.02 - error with double v - still OK"
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0D1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      '05.07.03 - characters "v" missing completely'
    );
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/1.1.0%0Dvv1.0.1#diff",
        {
          mode: "get"
        }
      ),
      {
        user: "userName",
        project: "libName",
        versBefore: "1.0.1",
        versAfter: "1.1.0",
        version: "999.88.7",
        type: "bitbucket"
      },
      "05.07.04 - one missing, one double v"
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
        type: "bitbucket"
      },
      "05.07.05 - diff is separated by %0D not ..."
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
        type: "bitbucket"
      },
      "05.07.06 - error with double v - still OK"
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
        type: "bitbucket"
      },
      '05.07.07 - characters "v" missing completely'
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
        type: "bitbucket"
      },
      "05.07.08 - one missing, one double v"
    );
    t.end();
  }
);

t.test(
  `05.08 - ${`\u001b[${35}m${`getSetFooterLink()`}\u001b[${39}m`} - ${`\u001b[${36}m${`get`}\u001b[${39}m`} errors-out, returning null, when link is erroneous`,
  t => {
    t.same(
      getSetFooterLink(
        "[999.88.7]: https://bitbucket.org/userName/libName/branches/compare/v1.0.1",
        {
          mode: "get"
        }
      ),
      null,
      "05.08"
    );
    t.end();
  }
);

// 06. getRow
// ------

t.test(
  `06.01 - ${`\u001b[${33}m${`getRow()`}\u001b[${39}m`} - all kinds of throws`,
  t => {
    t.throws(() => getRow(1));
    t.throws(() => getRow("a"));
    t.throws(() => getRow(1, 1));
    t.throws(() => getRow(1.5, ["a"]));
    t.end();
  }
);

t.test(`06.02 - ${`\u001b[${33}m${`getRow()`}\u001b[${39}m`} - BAU`, t => {
  t.same(getRow(["aaa", "bbb", "ccc"], 2), "ccc", "07.02.01 - found");
  t.same(getRow(["aaa", "bbb", "ccc"], 99), null, "07.02.01 - not found");
  t.end();
});

// 07. filterDate
// ----------

t.test(
  `07.01 - ${`\u001b[${35}m${`filterDate()`}\u001b[${39}m`} - filters out date string`,
  t => {
    t.same(filterDate(" ]  (March 1st, 2017)"), "March 1st 2017", "07.01.01");
    t.same(filterDate("]  (March 1st, 2017)"), "March 1st 2017", "07.01.02");
    t.same(filterDate("   (March 1st, 2017)"), "March 1st 2017", "07.01.03");
    t.same(filterDate("((March 1st, 2017)"), "March 1st 2017", "07.01.04");
    t.same(filterDate("(March 1st, 2017)"), "March 1st 2017", "07.01.05");
    t.same(filterDate("March 1st, 2017)"), "March 1st 2017", "07.01.06");
    t.same(filterDate(", 1st of March 2017)"), "1st of March 2017", "07.01.07");
    t.same(
      filterDate(" \u2014 March 1st, 2017)"),
      "March 1st 2017",
      "07.01.08"
    );
    t.same(filterDate("] - 2014-12-13 - [YANKED]"), "2014-12-13", "07.01.09");
    t.same(filterDate("] - 2014-12-13 - YANKED"), "2014-12-13", "07.01.10");
    t.same(filterDate("] - 2014-12-13, YANKED"), "2014-12-13", "07.01.11");
    t.same(filterDate("] - 2014-12-13 -YANKED"), "2014-12-13", "07.01.12");
    t.same(filterDate("] - 2014-12-13 YANKED"), "2014-12-13", "07.01.13");
    t.same(filterDate(" - 2014-12-13 - [YANKED]"), "2014-12-13", "07.01.14");
    t.same(filterDate(" - 2014-12-13 - YANKED"), "2014-12-13", "07.01.15");
    t.same(filterDate(" - 2014-12-13, YANKED"), "2014-12-13", "07.01.16");
    t.same(filterDate(" - 2014-12-13 -YANKED"), "2014-12-13", "07.01.17");
    t.same(filterDate(" - 2014-12-13 YANKED"), "2014-12-13", "07.01.18");
    t.same(
      filterDate(" -                                    2014-12-13 YANKED"),
      "2014-12-13",
      "07.01.19 - many spaces"
    );
    t.same(
      filterDate(" - 2014-12-13                          YANKED"),
      "2014-12-13",
      "07.01.20"
    );
    t.same(filterDate(" (2017-3-17)"), "2017-3-17", "07.01.21");
    t.same(filterDate(" - 2017-07-04 🇺🇸"), "2017-07-04", "07.01.22");
    t.same(filterDate(" - 2017-07-04 - 🇺🇸"), "2017-07-04", "07.01.23");
    t.same(filterDate(" - 2017-07-04 - 🇺🇸 "), "2017-07-04", "07.01.24");
    t.end();
  }
);
