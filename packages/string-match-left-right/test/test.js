const t = require("tap");
const {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight
} = require("../dist/string-match-left-right.cjs");

// 1. Input arg validation
// -----------------------------------------------------------------------------

t.test("01.01 - throws", t => {
  // no third arg
  t.throws(() => {
    matchLeftIncl("zzz", 1);
  }, /THROW_ID_08/);

  t.throws(() => {
    matchRightIncl("zzz", 1);
  }, /THROW_ID_08/);

  t.throws(() => {
    matchLeftIncl("", 1);
  }, /THROW_ID_02/);

  t.same(
    matchLeftIncl("", 1, undefined, { relaxedApi: true }),
    false,
    "bypassing THROW_ID_02"
  );

  // third arg being wrong

  t.throws(() => {
    matchRightIncl("zzz", 1, 1);
  }, /THROW_ID_05/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", 1);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", "");
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", [""]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", ["", ""]);
  }, /THROW_ID_03/);

  t.same(
    matchRightIncl("zzz", "aaa", ["", ""], { relaxedApi: true }),
    false,
    "bypassing THROW_ID_03"
  );

  // no second arg

  t.throws(() => {
    matchLeftIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, []);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, "");
  }, /THROW_ID_03/);

  // second arg completely missing onwards

  t.throws(() => {
    matchLeftIncl("zzz");
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz");
  }, /THROW_ID_03/);

  // first arg not string

  t.throws(() => {
    matchLeftIncl(1);
  }, /THROW_ID_01/);

  t.same(
    matchLeftIncl(1, undefined, undefined, { relaxedApi: true }),
    false,
    "bypassing THROW_ID_01"
  );

  t.throws(() => {
    matchRightIncl(1);
  }, /THROW_ID_01/);

  t.throws(() => {
    matchLeftIncl([1]);
  }, /THROW_ID_01/);

  t.throws(() => {
    matchRightIncl([1]);
  }, /THROW_ID_01/);

  t.throws(() => {
    matchLeftIncl(null);
  }, /THROW_ID_01/);

  t.throws(() => {
    matchRightIncl(null);
  }, /THROW_ID_01/);

  t.throws(() => {
    matchLeftIncl();
  }, /THROW_ID_01/);

  t.throws(() => {
    matchRightIncl();
  }, /THROW_ID_01/);

  t.throws(() => {
    matchLeftIncl(-1);
  }, /THROW_ID_01/);

  // fourth arg not a plain object
  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], true);
  }, /THROW_ID_06/);

  // opts.trimBeforeMatching wrong type
  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: "z"
    });
  }, /THROW_ID_09/);

  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: []
    });
  }, /trimCharsBeforeMatching/);

  t.end();
});

// 2. matchLeftIncl()
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      on a simple string`,
  t => {
    t.equal(
      matchLeftIncl("abc", 2, "c"),
      "c",
      "02.01.01 - pointless, but still"
    );
    t.equal(
      matchLeftIncl("zabcdefghi", 4, ["bcd"]),
      "bcd",
      "02.01.02 - one elem to match"
    );
    t.equal(
      matchLeftIncl("abcdefghi", 3, ["cd", "bcd"]),
      "cd", // first match
      "02.01.03 - multiple to match"
    );
    t.equal(matchLeftIncl("abcdefghi", 3, ["aaa", "bcd"]), "bcd");
    t.equal(matchLeftIncl("abcdefghi", 3, ["aaa", "zzz"]), false);
    t.throws(() => {
      matchLeftIncl("abcdefghi", 99, ["aaa", "zzz"]);
    });
    t.equal(
      matchLeftIncl("abcdefghi", 99, ["aaa", "zzz"], { relaxedApi: true }),
      false
    );

    t.equal(
      matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
        trimBeforeMatching: true
      }),
      "ab",
      "02.01.07.1"
    );
    t.equal(
      matchLeftIncl("zxab      cdef", 9, "ab", { trimBeforeMatching: true }),
      "ab",
      "02.01.07.2"
    );

    matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "x");
        t.equal(theRemainderOfTheString, "zx");
        t.equal(index, 1);
      }
    });
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      case insensitive`,
  t => {
    t.equal(matchLeftIncl("abc", 2, "C"), false, "02.02.01 - control");
    t.equal(
      matchLeftIncl("abc", 2, "C", { i: true }),
      "C",
      "02.02.02 - opts.i"
    );
    t.equal(matchLeftIncl("abc", 2, "BC", { i: true }), "BC");
    t.equal(
      matchLeftIncl("abC", 2, "c", { i: true }),
      "c",
      "02.02.04 - source is uppercase, needle is lowercase"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      left substring to check is longer than what's on the left`,
  t => {
    t.equal(matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"]), false);
    t.equal(
      matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"], { i: true }),
      false,
      "02.03.02 - opts should not affect anything here"
    );
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`,
  t => {
    t.equal(
      matchLeftIncl("abcdef", 3, ["abcd"], {
        cb: (char, theRemainderOfTheString, index) => {
          t.equal(char, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, undefined);
          return true;
        }
      }),
      "abcd",
      "02.04"
    );
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}     with spaces`,
  t => {
    t.equal(
      matchLeftIncl("a b c d e f", 6, ["klmn", "abcd"]),
      false,
      "02.04.01"
    );
    t.equal(
      matchLeftIncl("a b c d e f", 6, ["klmn", "abcd"], {
        skipWhitespace: true
      }),
      "abcd",
      "02.04"
    );
    t.end();
  }
);

// 3. matchLeft()
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          on a simple string`,
  t => {
    t.equal(matchLeft("abc", 2, "b"), "b");
    t.equal(
      matchLeft("abcdefghi", 3, ["abc"]),
      "abc",
      "03.01.02 - one elem to match"
    );
    t.equal(
      matchLeft("abcdefghi", 3, ["c", "bc"]),
      "c", // first one matched returned, although both did match
      "03.01.03 - multiple to match"
    );
    t.equal(matchLeft("abcdefghi", 3, ["aaa", "bc"]), "bc");
    t.equal(matchLeft("abcdefghi", 3, ["aaa", "zzz"]), false);
    t.throws(() => {
      matchLeft("abcdefghi", 99, ["aaa", "zzz"]);
    });
    t.equal(
      matchLeft("abcdefghi", 99, ["aaa", "zzz"], { relaxedApi: true }),
      false
    );
    t.equal(matchLeft("abc", 2, "zab"), false);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          case insensitive`,
  t => {
    t.equal(matchLeft("abc", 2, "B"), false, "03.02.01 - control");
    t.equal(matchLeft("abc", 2, "B", { i: true }), "B", "03.02.02 - opts.i");
    t.end();
  }
);

// 4. matchRightIncl()
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, non zero arg`,
  t => {
    t.equal(matchRightIncl("abcdef", 2, "c"), "c");
    t.equal(matchRightIncl("abcdef", 2, "cde"), "cde");
    t.equal(matchRightIncl("abcdef", 2, ["cde"]), "cde");
    t.equal(matchRightIncl("abcdef", 2, ["gjd", "cde"]), "cde");
    t.throws(() => {
      matchRightIncl("abcdef", 99, ["cde"]);
      matchRightIncl("abcdef", 99, ["cde"], { relaxedApi: false });
    });
    t.equal(matchRightIncl("abcdef", 99, ["cde"], { relaxedApi: true }), false);

    t.equal(
      matchRightIncl("ab      cdef", 2, "cd", { trimBeforeMatching: true }),
      "cd"
    );

    matchRightIncl("ab      cdef", 2, "cd", {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "e");
        t.equal(theRemainderOfTheString, "ef");
        t.equal(index, 10);
      }
    });
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, index zero`,
  t => {
    t.equal(matchRightIncl("abcdef", 0, "a"), "a");
    t.equal(matchRightIncl("abcdef", 0, "abc"), "abc");
    t.equal(matchRightIncl("abcdef", 0, ["abc"]), "abc");
    t.equal(matchRightIncl("abcdef", 0, ["fiuhjd", "gfds", "abc"]), "abc");
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, case insensitive`,
  t => {
    t.equal(matchRightIncl("abcdef", 2, "C"), false);
    t.equal(matchRightIncl("abcdef", 2, "C", { i: true }), "C");
    t.equal(matchRightIncl("abcdef", 2, ["C"], { i: true }), "C");
    t.equal(
      matchRightIncl("abcdef", 2, ["JFHG", "URR", "C"], { i: true }),
      "C"
    );
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`,
  t => {
    t.equal(
      matchRightIncl("abcdef", 3, ["def"], {
        cb: (char, theRemainderOfTheString, index) => {
          t.equal(char, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, 6);
          return true;
        }
      }),
      "def",
      "04.04"
    );
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     jumps over spaces`,
  t => {
    t.equal(matchRightIncl("a< ! - -z", 1, ["<![", "<!--"]), false, "04.05.01");
    t.equal(
      matchRightIncl("a< ! - -z", 1, ["<![", "<!--"], {
        skipWhitespace: true
      }),
      "<!--",
      "04.05.02"
    );
    t.equal(
      matchRightIncl("a< ! - z", 1, ["<![", "<!--"], {
        skipWhitespace: true
      }),
      false,
      "04.05.03"
    );
    t.end();
  }
);

// 5. matchRight()
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`,
  t => {
    t.equal(matchRight("abcdef", 2, "d"), "d");
    t.equal(matchRight("abcdef", 2, ["d"]), "d");
    t.equal(matchRight("abcdef", 2, "def"), "def");
    t.equal(matchRight("abcdef", 2, ["def"]), "def");
    t.equal(matchRight("abcdef", 2, ["defg"]), false);

    t.throws(() => {
      matchRight("abcdef", 99, ["defg"]);
    });
    t.equal(matchRight("abcdef", 99, ["defg"], { relaxedApi: true }), false);

    t.equal(
      matchRight("ab      cdef", 1, "cd", { trimBeforeMatching: true }),
      "cd"
    );
    t.equal(
      matchRight("ab      cdef", 1, "cd", { skipWhitespace: true }),
      "cd"
    );
    t.equal(
      matchRight("ab      c def", 1, "cd", { skipWhitespace: true }),
      "cd"
    );

    matchRight("ab      cdef", 1, "cd", {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "e");
        t.equal(theRemainderOfTheString, "ef");
        t.equal(index, 10);
      }
    });
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`,
  t => {
    t.equal(matchRight("abcdef", 0, "b"), "b");
    t.equal(matchRight("abcdef", 0, ["b"]), "b");
    t.equal(matchRight("abcdef", 0, ["bc"]), "bc");
    t.equal(matchRight("abcdef", 0, ["hfd", "ghja", "bc"]), "bc");
    t.end();
  }
);

t.test(
  `05.03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, case insensitive`,
  t => {
    t.equal(matchRight("abcdef", 2, "D"), false);
    t.equal(matchRight("abcdef", 2, "D", { i: true }), "D");
    t.equal(matchRight("abcdef", 2, ["D"], { i: true }), "D");
    t.equal(matchRight("abcdef", 2, ["gDSS", "D"], { i: true }), "D");
    t.end();
  }
);

t.test(
  `05.04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         adhoc test #1`,
  t => {
    t.equal(matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 13, ">"), ">");
    t.equal(
      matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 10, ">"),
      false
    );
    t.end();
  }
);

// 6. opts.cb callbacks
// -----------------------------------------------------------------------------

t.test(
  `06.01 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back. haha!`,
  t => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(
      matchLeft('<a class="something">', 8, "class", { cb: isSpace }),
      "class"
    );
    t.equal(
      matchLeft('<a superclass="something">', 13, "class", { cb: isSpace }),
      false
    );
    t.equal(
      matchLeftIncl('<a class="something">', 8, "class=", { cb: isSpace }),
      "class="
    );
    t.equal(
      matchLeftIncl('<a superclass="something">', 13, "class=", {
        cb: isSpace
      }),
      false
    );
    t.throws(() => {
      matchLeftIncl("a", 13, "class=", { cb: isSpace });
    });
    t.equal(
      matchLeftIncl("a", 13, "class=", { cb: isSpace, relaxedApi: true }),
      false,
      "06.01.05 - result will fail because substring is not matched"
    );

    // PART 1. CONTROL.
    // the first part (string matching) is true, "b" is to the left of the character at index #2.
    // the second part of result calculation (callback against outside character) is true too.
    t.equal(matchLeft(" bc", 2, "b", { cb: isSpace }), "b");

    // PART 2. LET'S MAKE VERSION OF '06.01.06' FAIL BECAUSE OF THE CALLBACK.
    t.equal(matchLeft("abc", 2, "b", { cb: isSpace }), false);
    // observe that "a" does not satisfy the callback's requirement to be a space thus the
    // main result is false.
    // Now, let's test trimming:

    // PART 3.
    // character at index #5 is "c".
    // We're checking is "b" to the left of it, plus, is there a space to the left of "b".
    // Answer is no, because there are bunch of line breaks to the left of "c".
    t.equal(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false);

    // PART 4.
    // Now let's enable the opts.trimBeforeMatching:
    t.equal(
      matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      "b"
    );
    // Answer is now true, because character at index #5 is "c", we look to the left of it, skip
    // all trimmable characters and encounter "b". And then, there's a space to the left of it to
    // satisfy the callback.

    // PART 5.
    // Now let's prove callback is still working.
    // Let's make it fail because of a callback.
    // Replacing space to the left of "b" with "a".
    t.equal(
      matchLeft("ab\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      false
    );
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeft() - various combos`,
  t => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(
      matchLeft("ab\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      false
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      "b"
    );
    t.equal(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false);
    t.equal(
      matchLeft("ab\n\n\nc", 5, "B", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      false
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "B", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      "B"
    );
    t.equal(matchLeft(" b\n\n\nc", 5, "B", { cb: isSpace, i: true }), false);
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeftIncl() - callback and trimming`,
  t => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    function isA(char) {
      return char === "a";
    }
    t.equal(matchLeftIncl(" bc\n\n\n", 5, "bc", { cb: isSpace }), false);
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "bc", {
        cb: isSpace,
        trimBeforeMatching: true
      }),
      "bc"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", {
        cb: isSpace,
        trimBeforeMatching: true
      }),
      false
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", {
        cb: isA,
        trimBeforeMatching: true
      }),
      "bc"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", { trimBeforeMatching: true }),
      "bc"
    );

    // opts.i
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "BC", { cb: isSpace, i: true }),
      false
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "BC", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      "BC"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, ["BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      "BC"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, ["AAA", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      "BC"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "BC", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      false
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "BC", {
        trimBeforeMatching: true,
        i: true
      }),
      "BC"
    );
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back, pt.1`,
  t => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(
      matchRight('<a class="something"> text', 19, ">"),
      ">",
      "06.03.01.01"
    );
    t.equal(
      // we will catch closing double quote, index #19 and check does closing bracket follow
      // if and also does the space follow after it
      matchRight('<a class="something"> text', 19, ">", { cb: isSpace }),
      ">",
      "06.03.01.02"
    );
    t.equal(
      matchRight('<a class="something">text', 19, ">", { cb: isSpace }),
      false
    );
    t.equal(matchRight('<a class="something"> text', 18, '">'), '">');
    t.equal(matchRightIncl('<a class="something"> text', 19, '">'), '">');
    t.equal(
      matchRightIncl('<a class="something"> text', 19, '">', { cb: isSpace }),
      '">'
    );
    t.equal(
      matchRightIncl('<a class="something">text', 19, '">', { cb: isSpace }),
      false
    );
    t.end();
  }
);

t.test(
  `06.04 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called, pt.2`,
  t => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    // control
    t.equal(matchRight("b\n\n\nc z", 0, "c", { cb: isSpace }), false);
    t.equal(
      matchRight("b\n\n\nc z", 0, "c", {
        cb: isSpace,
        trimBeforeMatching: true
      }),
      "c"
    );
    t.equal(
      matchRight("b\n\n\ncz", 0, "c", {
        cb: isSpace,
        trimBeforeMatching: true
      }),
      false
    );
    t.equal(matchRight("b\n\n\nc z", 0, "C", { cb: isSpace, i: true }), false);
    t.equal(
      matchRight("b\n\n\nc z", 0, "C", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      "C"
    );
    t.equal(
      matchRight("b\n\n\ncz", 0, "C", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      false
    );

    // control
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], { cb: isSpace }),
      false
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], {
        cb: isSpace,
        trimBeforeMatching: true
      }),
      "bc"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], {
        cb: isSpace,
        trimBeforeMatching: true
      }),
      false
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], {
        trimBeforeMatching: true
      }),
      "bc"
    );

    // opts.i
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], { cb: isSpace, i: true }),
      false
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      "BC"
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["KJG", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      "BC"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true
      }),
      false
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
        trimBeforeMatching: true,
        i: true
      }),
      "BC"
    );
    t.equal(matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], { i: true }), false);
    t.end();
  }
);

// new in v2.1.0
t.test(
  `06.05 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchRight - third callback argument (index)`,
  t => {
    const inputStr = "some text and some more text";
    function testMe(char, theRemainderOfTheString, index) {
      t.equal(char, "r");
      t.equal(theRemainderOfTheString, "re text");
      t.equal(index, 21);
    }
    matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });

    matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
    t.end();
  }
);

t.test(
  `06.06 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchLeft -  third callback argument (index)`,
  t => {
    const inputStr = "some text and some more text";
    function testMe1(char) {
      t.equal(char, "o");
    }
    function testMe2(char, theRemainderOfTheString) {
      t.equal(theRemainderOfTheString, "some text and so");
    }
    function testMe3(char, theRemainderOfTheString, index) {
      t.equal(index, 15);
    }
    matchLeft(inputStr, 18, ["z", "me"], { cb: testMe1 });
    matchLeft(inputStr, 18, ["z", "me"], { cb: testMe2 });
    matchLeft(inputStr, 18, ["z", "me"], { cb: testMe3 });

    matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe1 });
    matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe2 });
    matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe3 });

    t.end();
  }
);

// 7. opts.trimCharsBeforeMatching
// -----------------------------------------------------------------------------

t.test(
  `07.01 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.1`,
  t => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    // control
    t.equal(matchRight("</div>", 0, ["div"]), false);
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", " "] }),
      "div"
    );
    // two character-long opts.trimCharsBeforeMatching
    t.throws(() => {
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/ "] });
    });
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        trimCharsBeforeMatching: ["/", " "]
      }),
      "div"
    );
    t.equal(
      matchRight("< / div>", 0, ["hgfdf", "hkjh", "div", "00"], {
        trimCharsBeforeMatching: ["/", " "]
      }),
      "div"
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
      false
    );

    // opts.cb
    t.equal(
      matchRight("</div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "]
      }),
      false
    );
    t.equal(
      matchRight("< / div>", 0, ["zzzz", "div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "]
      }),
      false
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "]
      }),
      false
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/"]
      }),
      false
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", 1] }),
      "div"
    );
    t.end();
  }
);

t.test(
  `07.02 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.2`,
  t => {
    // matchRight
    t.equal(matchRight("</div>", 0, ["div"]), false);
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: "/" }),
      "div",
      "07.02.02 - opts.trimCharsBeforeMatching given as string"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
      "div",
      "07.02.03 - opts.trimCharsBeforeMatching given within array"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["a", "/"] }),
      "div",
      "07.02.04 - opts.trimCharsBeforeMatching given within array"
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], { trimCharsBeforeMatching: "A" }),
      false
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], {
        i: false,
        trimCharsBeforeMatching: "A"
      }),
      false
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], {
        i: true,
        trimCharsBeforeMatching: "A"
      }),
      "div",
      "07.02.07 - case insensitive affects trimCharsBeforeMatching too and yields results"
    );
    t.equal(
      matchRight("<adiv>", 0, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["1", "A"]
      }),
      "dIv"
    );
    // matchRightIncl
    t.equal(matchRightIncl("</div>", 0, ["div"]), false);
    t.equal(
      matchRightIncl("</div>", 0, ["div"], { trimCharsBeforeMatching: "<" }),
      false
    );
    t.equal(
      matchRightIncl("</div>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["<", "/"]
      }),
      "div"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["c", "a", "b"]
      }),
      "div"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["C", "A", "B"]
      }),
      false
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        i: true,
        trimCharsBeforeMatching: ["C", "A", "B"]
      }),
      "div"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "dIv"], {
        i: true,
        trimCharsBeforeMatching: ["C", "A", "B"]
      }),
      "dIv"
    );
    // matchLeft
    t.equal(matchLeft("</divz>", 6, ["div"]), false);
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
      "div"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["z"] }),
      "div"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["Z"] }),
      false
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], {
        i: false,
        trimCharsBeforeMatching: ["Z"]
      }),
      false
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], {
        i: true,
        trimCharsBeforeMatching: ["Z"]
      }),
      "div"
    );
    t.equal(
      matchLeft("</divz>", 6, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["Z"]
      }),
      "dIv"
    );
    // matchLeftIncl
    t.equal(matchLeftIncl("</divz>", 6, ["div"]), false);
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
      false
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["z", ">"]
      }),
      "div"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["a", "z", ">"]
      }),
      "div"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["Z", ">"]
      }),
      false
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        i: false,
        trimCharsBeforeMatching: ["a", "Z", ">"]
      }),
      false
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        i: true,
        trimCharsBeforeMatching: ["a", "Z", ">"]
      }),
      "div"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["a", "Z", ">"]
      }),
      "dIv"
    );
    t.end();
  }
);

t.test(
  `07.03 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       throws`,
  t => {
    t.equal(
      matchRight("</div>", 0, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"]
      }),
      "div"
    );
    t.throws(() => {
      matchRight("</div>", 0, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"] // <--- has to be character-by-character
      });
    });

    t.equal(
      matchLeft("</div>", 5, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"]
      }),
      "div"
    );
    t.throws(() => {
      matchLeft("</div>", 5, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"] // <--- has to be character-by-character
      });
    });

    t.equal(
      matchRightIncl("</div>", 1, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"]
      }),
      "div"
    );
    t.throws(() => {
      matchRightIncl("</div>", 1, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"] // <--- has to be character-by-character
      });
    });

    t.equal(
      matchLeftIncl("</div>", 4, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"]
      }),
      "div"
    );
    t.throws(() => {
      matchLeftIncl("</div>", 4, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"] // <--- has to be character-by-character
      });
    });
    t.end();
  }
);

t.test(
  `07.04 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${36}m${"marching across emoji"}\u001b[${39}m`} - matchRight()`,
  t => {
    t.equal(
      matchRight("abc 🧢 def", 4, ["def"], {
        trimCharsBeforeMatching: [" "]
      }),
      "def"
    );
    t.equal(
      matchRight("abc 🧢 def", 5, ["def"], {
        trimCharsBeforeMatching: [" "]
      }),
      "def"
    );
    t.equal(
      matchRight("abc \uD83E\uDDE2 def", 4, ["def"], {
        trimCharsBeforeMatching: [" "],
        cb: (char, theRemainderOfTheString, index) => {
          t.equal(char, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, 10);
          return true;
        }
      }),
      "def",
      "07.04.03* - pinning all cb values"
    );
    t.equal(
      matchRight("abc \uD83E\uDDE2 defgh", 4, ["def"], {
        trimCharsBeforeMatching: [" "],
        cb: (char, theRemainderOfTheString, index) => {
          t.equal(char, "g");
          t.equal(theRemainderOfTheString, "gh");
          t.equal(index, 10);
          return true;
        }
      }),
      "def",
      "07.04.07* - pinning all cb values"
    );
    t.end();
  }
);

t.test(
  `07.05 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchLeft()`,
  t => {
    //
    // \uD83E = 55358
    // \uDDE2 = 56802
    // \uD83D = 55357
    // \uDC4C = 56396
    //

    const testIndex = 9;
    const str1 = "abc \uD83E\uDDE2\uD83D\uDC4C def";
    t.equal(
      matchLeft(
        str1,
        testIndex, // location of "d"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            // console.log(`${`\u001b[${33}m${'str[testIndex]'}\u001b[${39}m`} = ${JSON.stringify(str1[testIndex], null, 4)}`)
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.05.01* - jumps past two spaces and emoji - simplified"
    );

    t.equal(
      // UNESCAPED EQUIVALENT:
      // matchLeft('😋bc 👌🧢 def', 9, ['💯!', 'bc'], {
      //   trimCharsBeforeMatching: ['🧢', '👌', ' '],

      matchLeft(
        "\uD83D\uDE0Bbc \uD83D\uDC4C\uD83E\uDDE2 def",
        10,
        ["\uD83D\uDCAF!", "bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(
              char,
              "\uD83D\uDE0B", // 😋
              "07.05.06"
            );
            t.equal(
              theRemainderOfTheString,
              "\uD83D\uDE0B", // 😋
              "07.05.07"
            );
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.05.05* - jumps past two spaces and emoji - complete, proper"
    );

    t.equal(
      matchLeft(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        9, // location of "d"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.05.09*"
    );

    t.equal(
      matchLeft(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        8, // location of "d"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.05.13*"
    );

    t.equal(
      matchLeft(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        7, // location of "\uDC4C"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.05.17*"
    );

    t.equal(
      matchLeft(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        6, // location of "\uD83D"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.05.21*"
    );

    t.equal(
      matchLeft(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        5, // location of "\uDDE2"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.05.25*"
    );
    t.end();
  }
);

t.test(
  `07.06 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchRight()`,
  t => {
    //
    // \uD83E = 55358
    // \uDDE2 = 56802
    // \uD83D = 55357
    // \uDC4C = 56396
    //

    t.equal(
      matchRight(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        2, // location of "c"
        ["de"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "f");
            t.equal(theRemainderOfTheString, "f");
            t.equal(
              index,
              11, // remember we count indexes, so emoji counts as two
              "07.06.04"
            );
            return true;
          }
        }
      ),
      "de",
      "07.06.01* - jumps past two spaces and emoji - simplified"
    );

    t.equal(
      // UNESCAPED EQUIVALENT:
      // matchRight('💯bc 👌🧢 d😋e💯', 9, ['💯!', 'd😋'], {
      //   trimCharsBeforeMatching: ['🧢', '👌', ' '],

      matchRight(
        "\uD83D\uDCAFbc \uD83D\uDC4C\uD83E\uDDE2 d\uD83D\uDE0Be\uD83D\uDCAF",
        3, // c
        ["\uD83D\uDCAF!", "d\uD83D\uDE0B"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "e");
            t.equal(
              theRemainderOfTheString,
              "e\uD83D\uDCAF", // e💯
              "07.06.07"
            );
            t.equal(index, 13);
            return true;
          }
        }
      ),
      "d\uD83D\uDE0B", // d😋
      "07.06.05* - jumps past two spaces and emoji - complete, proper"
    );

    t.equal(
      matchRight(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        4, // location of "\uD83E"
        ["de"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "f");
            t.equal(theRemainderOfTheString, "f");
            t.equal(
              index,
              11, // remember we count indexes, so emoji counts as two
              "07.06.12"
            );
            return true;
          }
        }
      ),
      "de",
      "07.06.09*"
    );

    t.equal(
      matchRight(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        5, // location of "\uDDE2"
        ["de"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "f");
            t.equal(theRemainderOfTheString, "f");
            t.equal(
              index,
              11, // remember we count indexes, so emoji counts as two
              "07.06.16"
            );
            return true;
          }
        }
      ),
      "de",
      "07.06.13*"
    );

    t.equal(
      matchRight(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        6, // location of "\uD83D"
        ["de"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "f");
            t.equal(theRemainderOfTheString, "f");
            t.equal(
              index,
              11, // remember we count indexes, so emoji counts as two
              "07.06.20"
            );
            return true;
          }
        }
      ),
      "de",
      "07.06.17*"
    );
    t.end();
  }
);

t.test(
  `07.07 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchLeftIncl()`,
  t => {
    //
    // \uD83E = 55358
    // \uDDE2 = 56802
    // \uD83D = 55357
    // \uDC4C = 56396
    //

    t.equal(
      matchLeftIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        4,
        ["\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "\uD83D\uDCAF");
            t.equal(theRemainderOfTheString, "\uD83D\uDCAF");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "\uD83E\uDDE2\uD83D\uDC4C",
      "07.07.01*"
    );

    t.equal(
      matchLeftIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        5,
        ["\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "\uD83D\uDCAF");
            t.equal(theRemainderOfTheString, "\uD83D\uDCAF");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "\uD83E\uDDE2\uD83D\uDC4C",
      "07.07.05*"
    );

    t.equal(
      matchLeftIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        5, // in the middle of third emoji
        ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "\uD83D\uDCAF");
            t.equal(theRemainderOfTheString, "\uD83D\uDCAF");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "\uD83E\uDDE2\uD83D\uDC4C",
      "07.07.09* - inclusive, starting in the middle between the surrogates"
    );

    t.equal(
      matchLeftIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        4, // at \uD83D
        ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "\uD83D\uDCAF");
            t.equal(theRemainderOfTheString, "\uD83D\uDCAF");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "\uD83E\uDDE2\uD83D\uDC4C",
      "07.07.10* - inclusive, starting in the middle between the surrogates"
    );

    t.equal(
      matchLeftIncl(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        6, // location of "\uD83D"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.07.14*"
    );

    t.equal(
      matchLeftIncl(
        "abc \uD83E\uDDE2\uD83D\uDC4C def",
        7, // location of "\uDC4C"
        ["bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "a");
            t.equal(theRemainderOfTheString, "a");
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.07.18*"
    );

    t.equal(
      // UNESCAPED EQUIVALENT:
      // matchLeftIncl('😋bc 👌🧢 def', 9, ['💯!', 'bc'], {
      //   trimCharsBeforeMatching: ['🧢', '👌', ' '],

      matchLeftIncl(
        "\uD83D\uDE0Bbc \uD83D\uDC4C\uD83E\uDDE2 def",
        9,
        ["\uD83D\uDCAF!", "bc"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(
              char,
              "\uD83D\uDE0B", // 😋
              "07.07.23"
            );
            t.equal(
              theRemainderOfTheString,
              "\uD83D\uDE0B", // 😋
              "07.07.24"
            );
            t.equal(index, 0);
            return true;
          }
        }
      ),
      "bc",
      "07.07.22*"
    );

    t.equal(
      matchLeftIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        4,
        ["\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, undefined);
            t.equal(theRemainderOfTheString, "");
            t.equal(index, undefined);
            return true;
          }
        }
      ),
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      "07.07.26*"
    );
    t.end();
  }
);

t.test(
  `07.08 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchRightIncl()`,
  t => {
    //
    // \uD83E = 55358
    // \uDDE2 = 56802
    // \uD83D = 55357
    // \uDC4C = 56396
    //

    t.equal(
      matchRightIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        0,
        ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "\uD83D\uDC4C");
            t.equal(theRemainderOfTheString, "\uD83D\uDC4C");
            t.equal(index, 4);
            return true;
          }
        }
      ),
      "\uD83D\uDCAF\uD83E\uDDE2",
      "07.08.01*"
    );

    t.equal(
      matchRightIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        1,
        ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "\uD83D\uDC4C");
            t.equal(theRemainderOfTheString, "\uD83D\uDC4C");
            t.equal(index, 4);
            return true;
          }
        }
      ),
      "\uD83D\uDCAF\uD83E\uDDE2",
      "07.08.05*"
    );

    t.equal(
      matchRightIncl(
        "\uD83D\uDCAFz\uD83D\uDC4Cy",
        0,
        ["lallala\uD83D\uDCAF", "\uD83D\uDCAFz\uD83D\uDC4C"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "y");
            t.equal(theRemainderOfTheString, "y");
            t.equal(index, 5);
            return true;
          }
        }
      ),
      "\uD83D\uDCAFz\uD83D\uDC4C",
      "07.08.09*"
    );

    t.equal(
      matchRightIncl(
        "\uD83D\uDCAFz\uD83D\uDC4Cy",
        1,
        ["lallala\uD83D\uDCAF", "\uD83D\uDCAFz\uD83D\uDC4C"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "y");
            t.equal(theRemainderOfTheString, "y");
            t.equal(index, 5);
            return true;
          }
        }
      ),
      "\uD83D\uDCAFz\uD83D\uDC4C",
      "07.08.13*"
    );

    t.equal(
      matchRightIncl(
        "abc \uD83E\uDDE2\uD83D\uDC4C defg",
        6, // location of "\uD83D"
        ["de"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, "f");
            t.equal(theRemainderOfTheString, "fg");
            t.equal(index, 11);
            return true;
          }
        }
      ),
      "de",
      "07.08.14*"
    );

    t.equal(
      // UNESCAPED EQUIVALENT:
      // matchRightIncl('😋bc 👌🧢 de😋', 3, ['💯!', 'bc'], {
      //   trimCharsBeforeMatching: ['🧢', '👌', ' '],

      matchRightIncl(
        "\uD83D\uDE0Bbc \uD83D\uDC4C\uD83E\uDDE2 de\uD83D\uDE0B",
        3,
        ["\uD83D\uDCAF!", "de"],
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " ", "c"],
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(
              char,
              "\uD83D\uDE0B", // 😋
              "07.08.23"
            );
            t.equal(
              theRemainderOfTheString,
              "\uD83D\uDE0B", // 😋
              "07.08.24"
            );
            t.equal(index, 12);
            return true;
          }
        }
      ),
      "de",
      "07.08.22*"
    );

    t.equal(
      matchRightIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        0,
        ["\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, undefined);
            t.equal(theRemainderOfTheString, "");
            t.equal(index, 6);
            return true;
          }
        }
      ),
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      "07.08.26*"
    );

    t.equal(
      matchRightIncl(
        "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
        1,
        ["\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
        {
          cb: (char, theRemainderOfTheString, index) => {
            t.equal(char, undefined);
            t.equal(theRemainderOfTheString, "");
            t.equal(index, 6);
            return true;
          }
        }
      ),
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      "07.07.30*"
    );
    t.end();
  }
);

// 8. opts.cb and opts.cb callbacks
// -----------------------------------------------------------------------------

t.test(
  `08.01 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRight()`,
  t => {
    function hasEmptyClassRightAfterTheTagName(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.trim().startsWith('class=""');
    }
    function hasEmptyClassRightAfterTheTagName2(
      firstCharacter,
      wholeSubstring,
      indexOfFirstChar
    ) {
      t.equal(firstCharacter, " ");
      t.equal(wholeSubstring, ' class="">');
      t.equal(indexOfFirstChar, 5);
    }

    const input = '</div class="">';
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName
      }),
      false, // because slash hasn't been accounted for, it's to the right of index 0 character, "<".
      "08.01.02"
    );
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName,
        trimCharsBeforeMatching: ["/", " "]
      }),
      "div", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "08.01.03"
    );
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName,
        trimCharsBeforeMatching: ["/", " "]
      }),
      "div", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "08.01.04"
    );

    matchRight(input, 0, ["zz", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2
    });
    matchRight(input, 0, ["zz", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "]
    });
    matchRight(input, 0, ["ghjs", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "]
    });
    matchRight(input, 0, ["zz", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2
    });
    matchRight(input, 0, ["zz", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "]
    });
    matchRight(input, 0, ["ghjs", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "]
    });
    t.end();
  }
);

t.test(
  `08.02 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRightIncl()`,
  t => {
    function hasEmptyClassRightAfterTheTagName(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.trim().startsWith('class=""');
    }
    function startsWithDiv(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.startsWith("div");
    }
    function startsWithDivWithTrim(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.trim().startsWith("div");
    }

    t.equal(
      matchRightIncl('</div class="">', 0, ["</", "Khg"]),
      "</", // base from where we start
      "08.02.01"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["</"], {
        cb: hasEmptyClassRightAfterTheTagName
      }),
      false, // wrong callback function
      "08.02.02"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["</", ">"], { cb: startsWithDiv }),
      "</", // fails because space (before "class") is not accounted for
      "08.02.03"
    );
    t.equal(
      matchRightIncl('</ div class="">', 0, ["</"], { cb: startsWithDiv }),
      false, // fails because space (before "class") is not accounted for
      "08.02.04"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["yo", "</"], {
        cb: startsWithDivWithTrim
      }),
      "</", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "08.02.05"
    );
    t.end();
  }
);

t.test(
  `08.03 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeft()`,
  t => {
    function startsWithZ(firstCharacterOutside, wholeSubstringOutside = "") {
      return wholeSubstringOutside.startsWith("z");
    }

    t.equal(
      matchLeft("<div><b>aaa</b></div>", 5, ["<article>", "<div>"]),
      "<div>", // 5th index is left bracket of <b>. Yes, <div> is on the left.
      "08.03.01"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["<div>"]),
      false, // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "08.03.02"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["<b", "<div"], {
        trimCharsBeforeMatching: [">", " "]
      }),
      "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "08.03.03"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["yo yo yo", "<div", "gkhjg"], {
        cb: startsWithZ,
        trimCharsBeforeMatching: [">", " "]
      }),
      "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "08.03.04"
    );
    t.equal(
      matchLeft("<div ><b>aaa</b></div>", 6, ["<div"], {
        cb: startsWithZ,
        trimCharsBeforeMatching: [" ", ">"]
      }),
      false, // cheeky - deliberately making the second arg of cb to be blank and fail startsWithZ
      "08.03.05"
    );
    t.end();
  }
);

t.test(
  `08.04 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeftIncl()`,
  t => {
    function startsWithZ(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.startsWith("z");
    }

    t.equal(
      matchLeftIncl("<div><b>aaa</b></div>", 4, ["<div>", "and this"]),
      "<div>", // 4th index is right bracket of <div>, but it's inclusive so it will get included.
      // not inclusive would give "<div" by the way, that is, given index would not
      // be included in the slice.
      "08.04.01"
    );
    t.equal(matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["<div>"]), false);
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["111", "<div >"]),
      "<div >"
    );
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["222", "<div >"], {
        cb: startsWithZ
      }),
      "<div >"
    );
    t.equal(
      matchLeftIncl("zxy<div ><b>aaa</b></div>", 8, ["krbd", "<div >"], {
        cb: startsWithZ
      }),
      "<div >"
    );
    t.equal(
      matchLeftIncl("<div ><b>aaa</b></div>", 0, ["krbd", "<div >"], {
        cb: startsWithZ
      }),
      false,
      "08.04.06 - cheeky - nothing for callback to hang onto"
    );
    t.end();
  }
);

// 9. Relying only on callback to calculate result - empty input is passed
// -----------------------------------------------------------------------------

t.test(
  `09.01 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()`,
  t => {
    t.ok(
      matchLeft("abc", 1, null, {
        i: true,
        cb: char => char === "a"
      })
    );
    t.false(
      matchLeft("abc", 1, null, {
        i: true,
        cb: char => char === "c"
      })
    );
    t.throws(() => {
      matchLeft("abc", 1, null, {
        i: true
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

t.test(
  `09.02 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()`,
  t => {
    t.false(
      matchLeftIncl("abc", 1, "", {
        i: true,
        cb: char => char === "a"
      })
    );
    t.ok(
      matchLeftIncl("abc", 1, "", {
        i: true,
        cb: char => char === "b"
      })
    );
    t.throws(() => {
      matchLeftIncl("abc", 1, "", {
        i: true
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

t.test(
  `09.03 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()`,
  t => {
    t.ok(
      matchRight("abc", 1, "", {
        i: true,
        cb: char => char === "c"
      })
    );
    t.false(
      matchRight("abc", 1, "", {
        i: true,
        cb: char => char === "a"
      })
    );
    t.throws(() => {
      matchRight("abc", 1, "", {
        i: true
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

t.test(
  `09.04 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl()`,
  t => {
    t.false(
      matchRightIncl("abc", 1, "", {
        i: true,
        cb: char => char === "c"
      })
    );
    t.ok(
      matchRightIncl("abc", 1, "", {
        i: true,
        cb: char => char === "b"
      })
    );
    t.throws(() => {
      matchRightIncl("abc", 1, "", {
        i: true
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

t.test(
  `09.05 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight() other cb args`,
  t => {
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: char => char === "d"
      })
    );
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char, rest) => rest === "def"
      })
    );
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char, rest, index) => index === 3
      })
    );
    t.end();
  }
);

t.test(
  `09.06 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchRight("abc   def", 2, "", {
        cb: char => char === "d"
      })
    );
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char, rest) => rest === "def"
      })
    );
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char, rest, index) => index === 6 // "d" is at index 6
      })
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: char => char === "d"
      })
    );
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "def"
      })
    );
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 6 // "d" is at index 6
      })
    );
    t.end();
  }
);

t.test(
  `09.07 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: char => char === "d"
      })
    );
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char, rest) => rest === "def"
      })
    );
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char, rest, index) => index === 6 // "d" is at index 6
      })
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: char => char === "d"
      })
    );
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "def"
      })
    );
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 6 // "d" is at index 6
      })
    );
    t.end();
  }
);

t.test(
  `09.08 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchLeft(
        "abc   def",
        6, // <--- location of "d"
        "",
        {
          cb: char => char === "c"
        }
      )
    );
    t.false(
      matchLeft("abc   def", 6, "", {
        cb: (char, rest) => rest === "abc"
      })
    );
    t.false(
      matchLeft("abc   def", 6, "", {
        cb: (char, rest, index) => index === 2 // "c" is at index 2
      })
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchLeft(
        "abc   def",
        6, // <--- location of "d"
        "",
        {
          trimBeforeMatching: true,
          cb: char => char === "c"
        }
      )
    );
    t.ok(
      matchLeft("abc   def", 6, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "abc"
      })
    );
    t.ok(
      matchLeft("abc   def", 6, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 2 // "c" is at index 2
      })
    );
    t.end();
  }
);

t.test(
  `09.09 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchLeftIncl(
        "abc   def",
        5, // <--- location of "d"
        "",
        {
          cb: char => char === "c"
        }
      )
    );
    t.false(
      matchLeftIncl("abc   def", 5, "", {
        cb: (char, rest) => rest === "abc"
      })
    );
    t.false(
      matchLeftIncl("abc   def", 5, "", {
        cb: (char, rest, index) => index === 2 // "c" is at index 2
      })
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchLeftIncl(
        "abc   def",
        5, // <--- location of "d"
        "",
        {
          trimBeforeMatching: true,
          cb: char => char === "c"
        }
      )
    );
    t.ok(
      matchLeftIncl("abc   def", 5, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "abc"
      })
    );
    t.ok(
      matchLeftIncl("abc   def", 5, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 2 // "c" is at index 2
      })
    );
    t.end();
  }
);

// The following test is an edge case but nonetheless it's an interesting-one.
// We test, what happens when the decision is driven by a callback and opts
// trimming is on, and because of trimming, string is skipped up to the ending,
// with nothing left to check against.
t.test(
  `09.10 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m - trims to nothing`}`,
  t => {
    // In this case, callback always yields "true", no matter what. Input string
    // traversal starts on index 5, which is space to the left of "a". Since the
    // trimming is off, iteration stops at it, calls callback, returns its true.
    t.ok(
      matchLeftIncl(
        "      abc",
        5, // <--- location of space to the left of "a"
        "",
        {
          cb: () => true
        }
      )
    );
    // Now, even the callback yields "true" in all cases, opts.trimBeforeMatching
    // is on too, which means, starting at index 5 and marching left it encounters
    // only spaces and reaches the end of the string. There's nothing left to give to
    // the callback, so even before calling the callback it terminates with "false".
    t.false(
      matchLeftIncl(
        "      abc",
        5, // <--- location of space to the left of "a"
        "",
        {
          trimBeforeMatching: true,
          cb: () => true // <---- notice it's yielding "true" for all the cases
        }
      )
    );
    t.end();
  }
);

t.test(
  `09.11 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchLeftIncl(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          cb: char => char === "_"
        }
      )
    );
    t.ok(
      matchLeftIncl(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          trimCharsBeforeMatching: ["b", "c"],
          cb: char => char === "_"
        }
      )
    );
    t.end();
  }
);

t.test(
  `09.12 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchRightIncl("_bcbcbcbc+", 1, "", {
        cb: char => char === "+"
      })
    );
    t.ok(
      matchRightIncl("_bcbcbcbc+", 1, "", {
        trimCharsBeforeMatching: ["b", "c"],
        cb: char => char === "+"
      })
    );
    t.end();
  }
);

t.test(
  `09.11 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchLeft(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          cb: char => char === "_"
        }
      )
    );
    t.ok(
      matchLeft(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          trimCharsBeforeMatching: ["b", "c"],
          cb: char => char === "_"
        }
      )
    );
    t.end();
  }
);

t.test(
  `09.12 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  t => {
    // control
    t.false(
      matchRight("_bcbcbcbc+", 1, "", {
        cb: char => char === "+"
      })
    );
    t.ok(
      matchRight("_bcbcbcbc+", 1, "", {
        trimCharsBeforeMatching: ["b", "c"],
        cb: char => char === "+"
      })
    );
    t.end();
  }
);

t.test(
  `09.13 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      - ${`\u001b[${32}m${"emoji"}\u001b[${39}m`} + ${`\u001b[${36}m${"trims"}\u001b[${39}m`}`,
  t => {
    t.false(
      matchLeft("a\uD83E\uDDE2b", 3, null, {
        cb: char => char === "a"
      })
    );
    t.ok(
      matchLeft("a\uD83E\uDDE2b", 3, null, {
        cb: char => char === "\uD83E\uDDE2"
      })
    );
    t.ok(
      matchLeft("a\uD83E\uDDE2b", 3, null, {
        i: true, // <--- does not matter
        cb: char => char === "\uD83E\uDDE2"
      })
    );
    t.ok(
      matchLeft("a\uD83E\uDDE2b", 3, null, {
        cb: char => char === "a",
        trimCharsBeforeMatching: ["\uD83E\uDDE2"]
      })
    );
    t.false(
      matchLeft("a\uD83E\uDDE2b", 3, null, {
        cb: char => char === "A",
        trimCharsBeforeMatching: ["\uD83E\uDDE2"]
      })
    );
    t.ok(
      matchLeft("a\uD83E\uDDE2b", 3, null, {
        i: true, // <--- does not matter
        cb: char => char.toLowerCase() === "A".toLowerCase(),
        trimCharsBeforeMatching: ["\uD83E\uDDE2"]
      })
    );
    t.end();
  }
);

t.test(
  `09.14 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     - ${`\u001b[${32}m${"emoji"}\u001b[${39}m`} + ${`\u001b[${36}m${"trims"}\u001b[${39}m`}`,
  t => {
    // following tests go in pairs to check starting at the middle between surrogates:

    // is b on the right?
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          cb: char => char === "b"
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          cb: char => char === "b"
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1,
        null,
        {
          i: true, // also, check case-insensitive
          cb: char => char === "b"
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2,
        null,
        {
          i: true, // also, check case-insensitive
          cb: char => char === "b"
        }
      )
    );

    // is emoji on the right?
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          cb: char => char === "\uD83E\uDDE2"
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          cb: char => char === "\uD83E\uDDE2"
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1,
        null,
        {
          i: true, // also, check case-insensitive
          cb: char => char === "\uD83E\uDDE2"
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2,
        null,
        {
          i: true, // also, check case-insensitive
          cb: char => char === "\uD83E\uDDE2"
        }
      )
    );

    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          cb: char => char === "\uD83E\uDDE2"
        }
      )
    );

    // Some ad-hoc tests. With trims.
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: char => char === "\uD83D\uDC4C" // 🧢
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "\uD83D\uDC4C" // 👌
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: char => char === "\uD83E\uDDE2" // 🧢
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        0, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "b"
        }
      )
    );

    // is b on the right? - One emoji to trim, starting at 1
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "b"
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "b"
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "B"
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char.toLowerCase() === "B".toLowerCase()
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "B"
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: char => char === "B"
        }
      )
    );

    // is b on the right? - One emoji to trim, starting at 2
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "b"
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "b"
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char === "B"
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char.toLowerCase() === "B".toLowerCase()
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83E\uDDE2"],
          cb: char => char.toLowerCase() === "B".toLowerCase()
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"], // <--- wrong character trimmed
          cb: char => char === "b"
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"], // <--- wrong character trimmed
          cb: char => char === "B"
        }
      )
    );

    // cheeky overrides
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => false
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => true
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => false
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => true
        }
      )
    );

    // cheeky + opts.i
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => false
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        1, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => true
        }
      )
    );
    t.false(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => false
        }
      )
    );
    t.ok(
      matchRight(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        2, // <--- !
        null,
        {
          i: true,
          trimCharsBeforeMatching: ["\uD83D\uDC4C"],
          cb: () => true
        }
      )
    );
    t.end();
  }
);

t.test(
  `09.15 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  - ${`\u001b[${32}m${"emoji"}\u001b[${39}m`} + ${`\u001b[${36}m${"trims"}\u001b[${39}m`}`,
  t => {
    matchLeftIncl(
      "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
      3,
      null,
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.equal(char, "\uD83E\uDDE2");
          t.equal(theRemainderOfTheString, "a\uD83D\uDC4C\uD83E\uDDE2");
          t.equal(index, 3);
          return char === "a";
        }
      }
    );
    t.false(
      matchLeftIncl(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        3,
        null,
        {
          cb: char => char === "a"
        }
      )
    );
    t.false(
      matchLeftIncl(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        3,
        null,
        {
          cb: char => char === "\uD83D\uDC4C"
        }
      )
    );
    t.ok(
      matchLeftIncl(
        "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
        3,
        null,
        {
          cb: char => char === "\uD83E\uDDE2"
        }
      )
    );
    t.end();
  }
);

// 10. EOL matching
// -----------------------------------------------------------------------------

t.test(
  `10.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(matchLeft("a", 0, "EOL"), false);
    t.end();
  }
);

t.test(
  `10.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchLeft("a", 0, () => "EOL"),
      "EOL"
    );
    t.end();
  }
);

t.test(
  `10.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - cb blocking result`,
  t => {
    t.equal(
      matchLeft("a", 0, () => "EOL", {
        cb: () => {
          return false;
        }
      }),
      false
    );
    t.end();
  }
);

t.test(
  `10.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`,
  t => {
    t.equal(
      matchLeft("a", 0, () => "EOL", {
        cb: () => {
          return true;
        }
      }),
      "EOL"
    );
    t.end();
  }
);

t.test(
  `10.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`,
  t => {
    matchLeft("a", 0, () => "EOL", {
      cb: (...args) => {
        t.same(
          args,
          [undefined, "", undefined] // because there's nothing outside-left of index 0
        );
        return true;
      }
    });
    t.end();
  }
);

t.test(
  `10.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  t => {
    // whitespace trims:
    t.equal(
      matchLeft(" a", 1, () => "EOL"),
      false
    );
    t.end();
  }
);

t.test(
  `10.07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - CHEEKY!!!`,
  t => {
    t.equal(
      matchLeft("EOLa", 3, () => "EOL"),
      false
    );
    t.end();
  }
);

t.test(
  `10.08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - !!!`,
  t => {
    t.equal(matchLeft("EOLa", 3, "EOL"), "EOL");
    t.end();
  }
);

t.test(
  `10.09 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  t => {
    t.equal(
      matchLeft(" a", 1, () => "EOL", {
        trimBeforeMatching: true
      }),
      "EOL"
    );
    t.end();
  }
);

t.test(
  `10.10 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  t => {
    // character trims:
    t.equal(
      matchLeft("za", 1, () => "EOL"),
      false
    );
    t.end();
  }
);

t.test(
  `10.11 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  t => {
    t.equal(
      matchLeft("za", 1, () => "EOL", {
        trimCharsBeforeMatching: ["z"]
      }),
      "EOL"
    );
    t.end();
  }
);

t.test(
  `10.12 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  t => {
    // trim combos - whitespace+character:
    t.equal(
      matchLeft("z a", 2, () => "EOL"),
      false
    );
    t.end();
  }
);

t.test(
  `10.13 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  t => {
    t.equal(
      matchLeft("z a", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL"
    );
    t.end();
  }
);

// 11. EOL mixed with strings
// -----------------------------------------------------------------------------

t.test(
  `11.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  t => {
    t.equal(matchLeft("a", 0, ["EOL"]), false);
    t.end();
  }
);

t.test(
  `11.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  t => {
    t.equal(matchLeft("a", 0, ["EOL", "a"]), false);
    t.end();
  }
);

t.test(
  `11.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  t => {
    t.equal(matchLeft("a", 0, ["EOL", "z"]), false);
    t.end();
  }
);

t.test(
  `11.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  t => {
    t.equal(matchLeft("a", 0, ["EOL", () => "EOL"]), "EOL");
    t.end();
  }
);

t.test(
  `11.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  t => {
    t.equal(matchLeft("a", 0, [() => "EOL"]), "EOL");
    t.end();
  }
);

t.test(
  `11.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m whitespace trims - whitespace trim opts control - one special`,
  t => {
    t.equal(matchLeft(" a", 1, [() => "EOL"]), false);
    t.end();
  }
);

// 12. whitespace trims
// -----------------------------------------------------------------------------

t.test(
  `12.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", () => "EOL"]),
      false,
      "12.02.07 - whitespace trim opts control - two specials"
    );
    t.end();
  }
);

t.test(
  `12.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", "EOL"]),
      false,
      "12.02.08 - whitespace trim opts control - special mixed with cheeky"
    );
    t.end();
  }
);

t.test(
  `12.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft(" a", 1, ["EOL"]),
      false,
      "12.02.09 - whitespace trim opts control - cheeky only"
    );
    t.end();
  }
);

t.test(
  `12.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(matchLeft("EOLa", 3, [() => "EOL"]), false, "12.02.10 - CHEEKY!!!");
    t.end();
  }
);

t.test(
  `12.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(matchLeft("EOLa", 3, ["EOL"]), "EOL");
    t.end();
  }
);

t.test(
  `12.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("EOLa", 3, ["a", () => "EOL"]),
      false,
      "12.02.12 - CHEEKY!!!"
    );
    t.end();
  }
);

t.test(
  `12.07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(matchLeft("EOLa", 3, ["a", "EOL"]), "EOL");
    t.end();
  }
);

t.test(
  `12.08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "12.02.14 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `12.09 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft(" a", 1, ["a", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "12.02.15 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `12.10 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "12.02.16 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `12.11 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", "a", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "12.02.17 - whitespace trim opt on"
    );
    t.end();
  }
);

// 13. character trims
// -----------------------------------------------------------------------------

t.test(
  `13.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("za", 1, [() => "EOL"]),
      false,
      "10.02.18 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `13.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("za", 1, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"]
      }),
      "EOL",
      "10.02.19 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `13.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("za", 1, ["a", () => "EOL"]),
      false,
      "10.02.20 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `13.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  t => {
    t.equal(matchLeft("za", 1, ["z", () => "EOL"]), "z", "10.02.21 - z caught");
    t.end();
  }
);

t.test(
  `13.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("za", 1, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"]
      }),
      "EOL",
      "10.02.22 - whitespace trim opt on"
    );
    t.end();
  }
);

// 14. trim combos - whitespace+character
// -----------------------------------------------------------------------------

t.test(
  `14.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("z a", 2, [() => "EOL"]),
      false,
      "10.02.23 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `14.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("z a", 2, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL",
      "10.02.24 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `14.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("z a", 2, ["a", () => "EOL"]),
      false,
      "10.02.25 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `14.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("z a", 2, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL",
      "10.02.26 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `14.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("z a", 2, ["z", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "z",
      "10.02.27 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `14.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("z a", 2, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL",
      "10.02.28 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `14.07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  t => {
    t.equal(
      matchLeft("yz a", 2, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      false
    );
    t.end();
  }
);

// 15. futile matching - matchLeftIncl() from zero to the left
// ------------------------------------------------------------------------------

t.test(
  `15.01 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(matchLeftIncl("a", 0, "EOL"), false);
    t.end();
  }
);

t.test(
  `15.02 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL"),
      false
    );
    t.end();
  }
);

t.test(
  `15.03 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL", {
        cb: () => {
          return false;
        }
      }),
      false,
      "10.03.03 - cb blocking result"
    );
    t.end();
  }
);

t.test(
  `15.04 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL", {
        cb: () => {
          return true;
        }
      }),
      false,
      "10.03.04 - useless cb"
    );
    t.end();
  }
);

t.test(
  `15.05 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchLeftIncl(" a", 1, () => "EOL"),
      false,
      "10.03.06 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `15.06 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchLeftIncl("EOLa", 3, () => "EOLa"),
      false
    );
    t.equal(matchLeftIncl("EOLa", 3, "EOL"), false);
    t.end();
  }
);

t.test(
  `15.07 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchLeftIncl(" a", 1, () => "EOL", {
        trimBeforeMatching: true
      }),
      false,
      "10.03.09 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `15.08 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  t => {
    t.equal(
      matchLeftIncl("za", 1, () => "EOL"),
      false,
      "10.03.10 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `15.09 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  t => {
    t.equal(
      matchLeftIncl("za", 1, () => "EOL", {
        trimCharsBeforeMatching: ["z"]
      }),
      false,
      "10.03.11 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `15.10 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  t => {
    // trim combos - whitespace+character:
    t.equal(
      matchLeftIncl("z a", 2, () => "EOL"),
      false,
      "10.03.12 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `15.11 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  t => {
    t.equal(
      matchLeftIncl("z a", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      false,
      "10.03.13 - whitespace trim opt on"
    );
    t.end();
  }
);

// 16. matchRight
// -----------------------------------------------------------------------------

t.test(
  `16.01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(matchRight("a", 0, "EOL"), false);
    t.end();
  }
);

t.test(
  `16.02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchRight("a", 0, () => "EOL"),
      "EOL"
    );
    t.end();
  }
);

t.test(
  `16.03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchRight("a", 0, () => "EOL", {
        cb: () => {
          return false;
        }
      }),
      false,
      "10.04.03 - cb blocking result"
    );
    t.end();
  }
);

t.test(
  `16.04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchRight("a", 0, () => "EOL", {
        cb: () => {
          return true;
        }
      }),
      "EOL",
      "10.04.04 - useless cb, just confirms the incoming truthy result"
    );
    t.end();
  }
);

t.test(
  `16.05 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    matchRight("a", 0, () => "EOL", {
      cb: (...args) => {
        t.same(
          args,
          [undefined, undefined, undefined], // because there's nothing outside-right of index 0
          "10.04.05 - useless cb"
        );
        return true;
      }
    });
    t.end();
  }
);

t.test(
  `16.06 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, () => "EOL"),
      false,
      "10.04.06-1"
    );
    t.end();
  }
);

t.test(
  `16.07 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 1, () => "EOL"),
      "EOL",
      "10.04.06-2"
    );
    t.end();
  }
);

t.test(
  `16.08 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchRight("aEOL", 0, () => "EOL"),
      false,
      "10.04.07 - CHEEKY!!!"
    );
    t.end();
  }
);

t.test(
  `16.09 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(matchRight("aEOL", 0, "EOL"), "EOL", "10.04.08 - !!!");
    t.end();
  }
);

t.test(
  `16.10 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, () => "EOL", {
        trimBeforeMatching: true
      }),
      "EOL",
      "10.04.09 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `16.11 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  t => {
    t.equal(
      matchRight("az", 0, () => "EOL"),
      false,
      "10.04.10 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `16.12 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  t => {
    t.equal(
      matchRight("az", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"]
      }),
      "EOL",
      "10.04.11 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `16.13 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  t => {
    // trim combos - whitespace+character:
    t.equal(
      matchRight("a z", 0, () => "EOL"),
      false,
      "10.04.12 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `16.14 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  t => {
    t.equal(
      matchRight("a z", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL",
      "10.04.13 - whitespace trim opt on"
    );
    t.end();
  }
);

// 17. matchRight() - EOL mixed with strings
// -----------------------------------------------------------------------------

t.test(
  `17.01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  t => {
    t.equal(matchRight("a", 0, ["EOL"]), false);
    t.end();
  }
);

t.test(
  `17.02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  t => {
    t.equal(matchRight("a", 0, ["EOL", "a"]), false);
    t.end();
  }
);

t.test(
  `17.03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  t => {
    t.equal(matchRight("a", 0, ["EOL", "z"]), false);
    t.end();
  }
);

t.test(
  `17.04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  t => {
    t.equal(matchRight("a", 0, ["EOL", () => "EOL"]), "EOL"); // latter, function was matched
    t.end();
  }
);

t.test(
  `17.05 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  t => {
    t.equal(matchRight("a", 0, [() => "EOL"]), "EOL");
    t.end();
  }
);

t.test(
  `17.06 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, [() => "EOL"]),
      false,
      "10.05.06 - whitespace trim opts control - one special"
    );
    t.end();
  }
);

t.test(
  `17.07 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", () => "EOL"]),
      false,
      "10.05.07 - whitespace trim opts control - two specials"
    );
    t.end();
  }
);

t.test(
  `17.08 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", "EOL"]),
      false,
      "10.05.08 - whitespace trim opts control - special mixed with cheeky"
    );
    t.end();
  }
);

t.test(
  `17.09 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, ["EOL"]),
      false,
      "10.05.09 - whitespace trim opts control - cheeky only"
    );
    t.end();
  }
);

t.test(
  `17.10 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("aEOL", 0, [() => "EOL"]),
      false,
      "10.05.10 - CHEEKY!!!"
    );
    t.end();
  }
);

t.test(
  `17.11 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(matchRight("aEOL", 0, ["EOL"]), "EOL");
    t.end();
  }
);

t.test(
  `17.12 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("aEOL", 0, ["z", () => "EOL"]),
      false,
      "10.05.12 - CHEEKY!!!"
    );
    t.end();
  }
);

t.test(
  `17.13 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(matchRight("aEOL", 0, ["z", "EOL"]), "EOL");
    t.end();
  }
);

t.test(
  `17.14 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, [() => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "10.05.14 - array"
    );
    t.end();
  }
);

t.test(
  `17.15 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, ["x", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "10.05.15 - other values to match"
    );
    t.end();
  }
);

t.test(
  `17.16 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "10.05.16 - two identical arrow functions in array, both positive"
    );
    t.end();
  }
);

t.test(
  `17.17 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  t => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", "z", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "EOL",
      "10.05.17 - two arrow f's in arrray + non-found"
    );
    t.end();
  }
);

t.test(
  `17.18 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  t => {
    t.equal(matchRight("az", 0, [() => "EOL"]), false, "10.05.18 - trim off");
    t.end();
  }
);

t.test(
  `17.19 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  t => {
    t.equal(
      matchRight("az", 0, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"]
      }),
      "EOL",
      "10.05.19 - character trim opt on"
    );
    t.end();
  }
);

t.test(
  `17.20 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  t => {
    t.equal(
      matchRight("az", 0, ["x", () => "EOL"]),
      false,
      "10.05.20 - wrong character to trim"
    );
    t.end();
  }
);

t.test(
  `17.21 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  t => {
    t.equal(
      matchRight("az", 0, ["z", () => "EOL"]),
      "z",
      "10.05.21 - z caught first, before EOL"
    );
    t.end();
  }
);

t.test(
  `17.22 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  t => {
    t.equal(
      matchRight("az", 0, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"]
      }),
      "EOL",
      "10.05.22 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `17.23 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  t => {
    // trim combos - whitespace+character:
    t.equal(
      matchRight("a z", 0, [() => "EOL"]),
      false,
      "10.05.23 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `17.24 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  t => {
    t.equal(
      matchRight("a z", 0, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL",
      "10.05.24 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `17.25 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  t => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"]),
      false,
      "10.05.25 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `17.26 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  t => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL",
      "10.05.26 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `17.27 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  t => {
    t.equal(
      matchRight("a z", 0, ["z", () => "EOL"], {
        trimBeforeMatching: true
      }),
      "z",
      "10.05.27 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `17.28 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  t => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      "EOL",
      "10.05.28 - unused char to trim"
    );
    t.end();
  }
);

t.test(
  `17.29 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  t => {
    t.equal(
      matchRight("a zy", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      false,
      "10.05.29 - y stands in the way"
    );
    t.end();
  }
);

// 18.

// EOL can never be found using matchRightIncl() or matchLeftIncl() because
// "inclusive" in the name means current character is included in the query to
// match, either in the beginning of it ("matchRightIncl") or end of it
// ("matchLeftIncl"). Since current character can't be EOL, result of both
// matchRightIncl() and matchLeftIncl() that search for EOL will always be "false".

t.test(
  `18.01 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(matchRightIncl("a", 0, "EOL"), false);
    t.end();
  }
);

t.test(
  `18.02 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL"),
      false
    );
    t.end();
  }
);

t.test(
  `18.03 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL", {
        cb: () => {
          return false;
        }
      }),
      false,
      "10.06.03 - cb blocking, but still useless, result was false before cb kicked in"
    );
    t.end();
  }
);

t.test(
  `18.04 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  t => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL", {
        cb: () => {
          return true;
        }
      }),
      false,
      "10.06.04 - useless cb"
    );
    t.end();
  }
);

t.test(
  `18.05 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchRightIncl("a ", 0, () => "EOL"),
      false,
      "10.06.05 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `18.06 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchRightIncl("aEOL", 0, () => "aEOL"),
      false
    );
    t.end();
  }
);

t.test(
  `18.07 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(matchRightIncl("aEOL", 0, "EOL"), false);
    t.end();
  }
);

t.test(
  `18.08 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  t => {
    t.equal(
      matchRightIncl("a ", 0, () => "EOL", {
        trimBeforeMatching: true
      }),
      false,
      "10.06.08 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `18.09 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  t => {
    t.equal(
      matchRightIncl("az", 0, () => "EOL"),
      false,
      "10.06.10 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `18.10 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  t => {
    t.equal(
      matchRightIncl("az", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"]
      }),
      false,
      "10.06.11 - whitespace trim opt on"
    );
    t.end();
  }
);

t.test(
  `18.11 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  t => {
    // whitespace+character:
    t.equal(
      matchRightIncl("a z", 0, () => "EOL"),
      false,
      "10.06.12 - whitespace trim opts control"
    );
    t.end();
  }
);

t.test(
  `18.12 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  t => {
    t.equal(
      matchRightIncl("a z", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true
      }),
      false,
      "10.06.13 - whitespace trim + character trim"
    );
    t.end();
  }
);

// 13. Ad-hoc
// -----------------------------------------------------------------------------

t.test(
  `13.01 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    t.equal(matchRight('<a class="something"> text', 19, ">"), ">");
    t.end();
  }
);

t.test(
  `13.02 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    t.equal(
      matchRight('<a class="something"> text', 19, ">", {
        cb: char => typeof char === "string" && char.trim() === ""
      }),
      ">"
    );
    t.end();
  }
);

t.test(
  `13.03 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    t.equal(matchRightIncl('<a class="something"> text', 20, "> t"), "> t");
    t.end();
  }
);

t.test(
  `13.04 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    t.equal(matchRight('<a class="something"> text', 19, "> t"), "> t");
    t.end();
  }
);

t.test(
  `13.05 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    t.equal(
      matchRight("ab      cd ef", 1, "cde", { trimBeforeMatching: true }),
      "cde"
    );
    t.end();
  }
);

t.test(
  `13.06 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    t.equal(
      matchRight('<a class="something"> text', 19, ">", {
        cb: char => char === " "
      }),
      ">"
    );
    t.end();
  }
);

t.test(
  `13.07 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    t.equal(
      matchRight("ab      cdef", 1, "cde", {
        cb: char => char === "f",
        trimBeforeMatching: true
      }),
      "cde"
    );
    t.end();
  }
);

t.test(
  `13.08 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  t => {
    matchRight("ab      cdef", 1, "cd", {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "e");
        t.equal(theRemainderOfTheString, "ef");
        t.equal(index, 10);
      }
    });
    t.end();
  }
);

t.test(`13.09 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, set #02`, t => {
  t.equal(
    matchRight("a<!DOCTYPE html>b", 1, ["!--", "doctype", "xml", "cdata"], {
      i: true,
      trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
    }),
    "doctype"
  );
  t.end();
});

// cap emoji
// \uD83E charCodeAt = 55358
// \uDDE2 charCodeAt = 56802

// \uD83D charCodeAt = 55357
// \uDC4C charCodeAt = 56396
