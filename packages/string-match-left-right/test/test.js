import test from "ava";
import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight
} from "../dist/string-match-left-right.esm";

// 1. Input arg validation
// -----------------------------------------------------------------------------

test("01.01 - throws", t => {
  // no third arg
  const err01 = t.throws(() => {
    matchLeftIncl("zzz", 1);
  });
  t.truthy(err01.message.includes("THROW_ID_08"));

  const err02 = t.throws(() => {
    matchRightIncl("zzz", 1);
  });
  t.truthy(err02.message.includes("THROW_ID_08"));

  const err03 = t.throws(() => {
    matchLeftIncl("", 1);
  });
  t.truthy(err03.message.includes("THROW_ID_02"));

  t.deepEqual(
    matchLeftIncl("", 1, undefined, { relaxedApi: true }),
    false,
    "bypassing THROW_ID_02"
  );

  // third arg being wrong

  const err04 = t.throws(() => {
    matchRightIncl("zzz", 1, 1);
  });
  t.truthy(err04.message.includes("THROW_ID_05"));

  const err05 = t.throws(() => {
    matchRightIncl("zzz", "aaa", 1);
  });
  t.truthy(err05.message.includes("THROW_ID_03"));

  const err06 = t.throws(() => {
    matchRightIncl("zzz", "aaa", "");
  });
  t.truthy(err06.message.includes("THROW_ID_03"));

  const err07 = t.throws(() => {
    matchRightIncl("zzz", "aaa", [""]);
  });
  t.truthy(err07.message.includes("THROW_ID_03"));

  const err08 = t.throws(() => {
    matchRightIncl("zzz", "aaa", ["", ""]);
  });
  t.truthy(err08.message.includes("THROW_ID_03"));

  t.deepEqual(
    matchRightIncl("zzz", "aaa", ["", ""], { relaxedApi: true }),
    false,
    "bypassing THROW_ID_03"
  );

  // no second arg

  const err09 = t.throws(() => {
    matchLeftIncl("zzz", null, ["aaa"]);
  });
  t.truthy(err09.message.includes("THROW_ID_03"));

  const err10 = t.throws(() => {
    matchRightIncl("zzz", null, ["aaa"]);
  });
  t.truthy(err10.message.includes("THROW_ID_03"));

  const err11 = t.throws(() => {
    matchRightIncl("zzz", null, []);
  });
  t.truthy(err11.message.includes("THROW_ID_03"));

  const err12 = t.throws(() => {
    matchRightIncl("zzz", null, "");
  });
  t.truthy(err12.message.includes("THROW_ID_03"));

  // second arg completely missing onwards

  const err13 = t.throws(() => {
    matchLeftIncl("zzz");
  });
  t.truthy(err13.message.includes("THROW_ID_03"));

  const err14 = t.throws(() => {
    matchRightIncl("zzz");
  });
  t.truthy(err14.message.includes("THROW_ID_03"));

  // first arg not string

  const err15 = t.throws(() => {
    matchLeftIncl(1);
  });
  t.truthy(err15.message.includes("THROW_ID_01"));

  t.deepEqual(
    matchLeftIncl(1, undefined, undefined, { relaxedApi: true }),
    false,
    "bypassing THROW_ID_01"
  );

  const err16 = t.throws(() => {
    matchRightIncl(1);
  });
  t.truthy(err16.message.includes("THROW_ID_01"));

  const err17 = t.throws(() => {
    matchLeftIncl([1]);
  });
  t.truthy(err17.message.includes("THROW_ID_01"));

  const err18 = t.throws(() => {
    matchRightIncl([1]);
  });
  t.truthy(err18.message.includes("THROW_ID_01"));

  const err19 = t.throws(() => {
    matchLeftIncl(null);
  });
  t.truthy(err19.message.includes("THROW_ID_01"));

  const err20 = t.throws(() => {
    matchRightIncl(null);
  });
  t.truthy(err20.message.includes("THROW_ID_01"));

  const err21 = t.throws(() => {
    matchLeftIncl();
  });
  t.truthy(err21.message.includes("THROW_ID_01"));

  const err22 = t.throws(() => {
    matchRightIncl();
  });
  t.truthy(err22.message.includes("THROW_ID_01"));

  const err23 = t.throws(() => {
    matchLeftIncl(-1);
  });
  t.truthy(err23.message.includes("THROW_ID_01"));

  // fourth arg not a plain object
  const err24 = t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], true);
  });
  t.truthy(err24.message.includes("THROW_ID_06"));

  // opts.trimBeforeMatching wrong type
  const err25 = t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: "z"
    });
  });
  t.truthy(err25.message.includes("THROW_ID_09"));

  const err26 = t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: []
    });
  });
  t.truthy(err26.message.includes("THROW_ID_09"));
  t.truthy(err26.message.includes("trimCharsBeforeMatching"));
});

// 2. matchLeftIncl()
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      on a simple string`, t => {
  t.is(matchLeftIncl("abc", 2, "c"), "c", "02.01.01 - pointless, but still");
  t.is(
    matchLeftIncl("zabcdefghi", 4, ["bcd"]),
    "bcd",
    "02.01.02 - one elem to match"
  );
  t.is(
    matchLeftIncl("abcdefghi", 3, ["cd", "bcd"]),
    "cd", // first match
    "02.01.03 - multiple to match"
  );
  t.is(matchLeftIncl("abcdefghi", 3, ["aaa", "bcd"]), "bcd");
  t.is(matchLeftIncl("abcdefghi", 3, ["aaa", "zzz"]), false);
  t.throws(() => {
    matchLeftIncl("abcdefghi", 99, ["aaa", "zzz"]);
  });
  t.is(
    matchLeftIncl("abcdefghi", 99, ["aaa", "zzz"], { relaxedApi: true }),
    false
  );

  t.is(
    matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
      trimBeforeMatching: true
    }),
    "ab",
    "02.01.07.1"
  );
  t.is(
    matchLeftIncl("zxab      cdef", 9, "ab", { trimBeforeMatching: true }),
    "ab",
    "02.01.07.2"
  );

  matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
    trimBeforeMatching: true,
    cb: (char, theRemainderOfTheString, index) => {
      t.is(char, "x");
      t.is(theRemainderOfTheString, "zx");
      t.is(index, 1);
    }
  });
});

test(`02.02 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      case insensitive`, t => {
  t.is(matchLeftIncl("abc", 2, "C"), false, "02.02.01 - control");
  t.is(matchLeftIncl("abc", 2, "C", { i: true }), "C", "02.02.02 - opts.i");
  t.is(matchLeftIncl("abc", 2, "BC", { i: true }), "BC");
  t.is(
    matchLeftIncl("abC", 2, "c", { i: true }),
    "c",
    "02.02.04 - source is uppercase, needle is lowercase"
  );
});

test(`02.03 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      left substring to check is longer than what's on the left`, t => {
  t.is(matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"]), false);
  t.is(
    matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"], { i: true }),
    false,
    "02.03.02 - opts should not affect anything here"
  );
});

test(`02.04 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`, t => {
  t.is(
    matchLeftIncl("abcdef", 3, ["abcd"], {
      cb: (char, theRemainderOfTheString, index) => {
        t.is(char, undefined);
        t.is(theRemainderOfTheString, "");
        t.is(index, undefined);
        return true;
      }
    }),
    "abcd",
    "02.04"
  );
});

// 3. matchLeft()
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          on a simple string`, t => {
  t.is(matchLeft("abc", 2, "b"), "b");
  t.is(
    matchLeft("abcdefghi", 3, ["abc"]),
    "abc",
    "03.01.02 - one elem to match"
  );
  t.is(
    matchLeft("abcdefghi", 3, ["c", "bc"]),
    "c", // first one matched returned, although both did match
    "03.01.03 - multiple to match"
  );
  t.is(matchLeft("abcdefghi", 3, ["aaa", "bc"]), "bc");
  t.is(matchLeft("abcdefghi", 3, ["aaa", "zzz"]), false);
  t.throws(() => {
    matchLeft("abcdefghi", 99, ["aaa", "zzz"]);
  });
  t.is(matchLeft("abcdefghi", 99, ["aaa", "zzz"], { relaxedApi: true }), false);
  t.is(matchLeft("abc", 2, "zab"), false);
});

test(`03.02 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          case insensitive`, t => {
  t.is(matchLeft("abc", 2, "B"), false, "03.02.01 - control");
  t.is(matchLeft("abc", 2, "B", { i: true }), "B", "03.02.02 - opts.i");
});

// 4. matchRightIncl()
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, non zero arg`, t => {
  t.is(matchRightIncl("abcdef", 2, "c"), "c");
  t.is(matchRightIncl("abcdef", 2, "cde"), "cde");
  t.is(matchRightIncl("abcdef", 2, ["cde"]), "cde");
  t.is(matchRightIncl("abcdef", 2, ["gjd", "cde"]), "cde");
  t.throws(() => {
    matchRightIncl("abcdef", 99, ["cde"]);
    matchRightIncl("abcdef", 99, ["cde"], { relaxedApi: false });
  });
  t.is(matchRightIncl("abcdef", 99, ["cde"], { relaxedApi: true }), false);

  t.is(
    matchRightIncl("ab      cdef", 2, "cd", { trimBeforeMatching: true }),
    "cd"
  );

  matchRightIncl("ab      cdef", 2, "cd", {
    trimBeforeMatching: true,
    cb: (char, theRemainderOfTheString, index) => {
      t.is(char, "e");
      t.is(theRemainderOfTheString, "ef");
      t.is(index, 10);
    }
  });
});

test(`04.02 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, index zero`, t => {
  t.is(matchRightIncl("abcdef", 0, "a"), "a");
  t.is(matchRightIncl("abcdef", 0, "abc"), "abc");
  t.is(matchRightIncl("abcdef", 0, ["abc"]), "abc");
  t.is(matchRightIncl("abcdef", 0, ["fiuhjd", "gfds", "abc"]), "abc");
});

test(`04.03 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, case insensitive`, t => {
  t.is(matchRightIncl("abcdef", 2, "C"), false);
  t.is(matchRightIncl("abcdef", 2, "C", { i: true }), "C");
  t.is(matchRightIncl("abcdef", 2, ["C"], { i: true }), "C");
  t.is(matchRightIncl("abcdef", 2, ["JFHG", "URR", "C"], { i: true }), "C");
});

test(`04.04 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`, t => {
  t.is(
    matchRightIncl("abcdef", 3, ["def"], {
      cb: (char, theRemainderOfTheString, index) => {
        t.is(char, undefined);
        t.is(theRemainderOfTheString, "");
        t.is(index, 6);
        return true;
      }
    }),
    "def",
    "04.04"
  );
});

// 5. matchRight()
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`, t => {
  t.is(matchRight("abcdef", 2, "d"), "d");
  t.is(matchRight("abcdef", 2, ["d"]), "d");
  t.is(matchRight("abcdef", 2, "def"), "def");
  t.is(matchRight("abcdef", 2, ["def"]), "def");
  t.is(matchRight("abcdef", 2, ["defg"]), false);

  t.throws(() => {
    matchRight("abcdef", 99, ["defg"]);
  });
  t.is(matchRight("abcdef", 99, ["defg"], { relaxedApi: true }), false);

  t.is(matchRight("ab      cdef", 1, "cd", { trimBeforeMatching: true }), "cd");

  matchRight("ab      cdef", 1, "cd", {
    trimBeforeMatching: true,
    cb: (char, theRemainderOfTheString, index) => {
      t.is(char, "e");
      t.is(theRemainderOfTheString, "ef");
      t.is(index, 10);
    }
  });
});

test(`05.02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`, t => {
  t.is(matchRight("abcdef", 0, "b"), "b");
  t.is(matchRight("abcdef", 0, ["b"]), "b");
  t.is(matchRight("abcdef", 0, ["bc"]), "bc");
  t.is(matchRight("abcdef", 0, ["hfd", "ghja", "bc"]), "bc");
});

test(`05.03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, case insensitive`, t => {
  t.is(matchRight("abcdef", 2, "D"), false);
  t.is(matchRight("abcdef", 2, "D", { i: true }), "D");
  t.is(matchRight("abcdef", 2, ["D"], { i: true }), "D");
  t.is(matchRight("abcdef", 2, ["gDSS", "D"], { i: true }), "D");
});

test(`05.04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         adhoc test #1`, t => {
  t.is(matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 13, ">"), ">");
  t.is(matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 10, ">"), false);
});

// 6. opts.cb callbacks
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back. haha!`, t => {
  function isSpace(char) {
    return typeof char === "string" && char.trim() === "";
  }
  t.is(
    matchLeft('<a class="something">', 8, "class", { cb: isSpace }),
    "class"
  );
  t.is(
    matchLeft('<a superclass="something">', 13, "class", { cb: isSpace }),
    false
  );
  t.is(
    matchLeftIncl('<a class="something">', 8, "class=", { cb: isSpace }),
    "class="
  );
  t.is(
    matchLeftIncl('<a superclass="something">', 13, "class=", { cb: isSpace }),
    false
  );
  t.throws(() => {
    matchLeftIncl("a", 13, "class=", { cb: isSpace });
  });
  t.is(
    matchLeftIncl("a", 13, "class=", { cb: isSpace, relaxedApi: true }),
    false,
    "06.01.05 - result will fail because substring is not matched"
  );

  // PART 1. CONTROL.
  // the first part (string matching) is true, "b" is to the left of the character at index #2.
  // the second part of result calculation (callback against outside character) is true too.
  t.is(matchLeft(" bc", 2, "b", { cb: isSpace }), "b");

  // PART 2. LET'S MAKE VERSION OF '06.01.06' FAIL BECAUSE OF THE CALLBACK.
  t.is(matchLeft("abc", 2, "b", { cb: isSpace }), false);
  // observe that "a" does not satisfy the callback's requirement to be a space thus the
  // main result is false.
  // Now, let's test trimming:

  // PART 3.
  // character at index #5 is "c".
  // We're checking is "b" to the left of it, plus, is there a space to the left of "b".
  // Answer is no, because there are bunch of line breaks to the left of "c".
  t.is(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false);

  // PART 4.
  // Now let's enable the opts.trimBeforeMatching:
  t.is(
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
  t.is(
    matchLeft("ab\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
    false
  );
});

test(`06.02 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeft() - various combos`, t => {
  function isSpace(char) {
    return typeof char === "string" && char.trim() === "";
  }
  t.is(
    matchLeft("ab\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
    false
  );
  t.is(
    matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
    "b"
  );
  t.is(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false);
  t.is(
    matchLeft("ab\n\n\nc", 5, "B", {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    false
  );
  t.is(
    matchLeft(" b\n\n\nc", 5, "B", {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    "B"
  );
  t.is(matchLeft(" b\n\n\nc", 5, "B", { cb: isSpace, i: true }), false);
});

test(`06.03 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeftIncl() - callback and trimming`, t => {
  function isSpace(char) {
    return typeof char === "string" && char.trim() === "";
  }
  function isA(char) {
    return char === "a";
  }
  t.is(matchLeftIncl(" bc\n\n\n", 5, "bc", { cb: isSpace }), false);
  t.is(
    matchLeftIncl(" bc\n\n\n", 5, "bc", {
      cb: isSpace,
      trimBeforeMatching: true
    }),
    "bc"
  );
  t.is(
    matchLeftIncl("abc\n\n\n", 5, "bc", {
      cb: isSpace,
      trimBeforeMatching: true
    }),
    false
  );
  t.is(
    matchLeftIncl("abc\n\n\n", 5, "bc", { cb: isA, trimBeforeMatching: true }),
    "bc"
  );
  t.is(matchLeftIncl("abc\n\n\n", 5, "bc", { trimBeforeMatching: true }), "bc");

  // opts.i
  t.is(matchLeftIncl(" bc\n\n\n", 5, "BC", { cb: isSpace, i: true }), false);
  t.is(
    matchLeftIncl(" bc\n\n\n", 5, "BC", {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    "BC"
  );
  t.is(
    matchLeftIncl(" bc\n\n\n", 5, ["BC"], {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    "BC"
  );
  t.is(
    matchLeftIncl(" bc\n\n\n", 5, ["AAA", "BC"], {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    "BC"
  );
  t.is(
    matchLeftIncl("abc\n\n\n", 5, "BC", {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    false
  );
  t.is(
    matchLeftIncl("abc\n\n\n", 5, "BC", { trimBeforeMatching: true, i: true }),
    "BC"
  );
});

test(`06.03 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back, pt.1`, t => {
  function isSpace(char) {
    return typeof char === "string" && char.trim() === "";
  }
  t.is(matchRight('<a class="something"> text', 19, ">"), ">", "06.03.01.01");
  t.is(
    // we will catch closing double quote, index #19 and check does closing bracket follow
    // if and also does the space follow after it
    matchRight('<a class="something"> text', 19, ">", { cb: isSpace }),
    ">",
    "06.03.01.02"
  );
  t.is(
    matchRight('<a class="something">text', 19, ">", { cb: isSpace }),
    false
  );
  t.is(matchRight('<a class="something"> text', 18, '">'), '">');
  t.is(matchRightIncl('<a class="something"> text', 19, '">'), '">');
  t.is(
    matchRightIncl('<a class="something"> text', 19, '">', { cb: isSpace }),
    '">'
  );
  t.is(
    matchRightIncl('<a class="something">text', 19, '">', { cb: isSpace }),
    false
  );
});

test(`06.04 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called, pt.2`, t => {
  function isSpace(char) {
    return typeof char === "string" && char.trim() === "";
  }
  // control
  t.is(matchRight("b\n\n\nc z", 0, "c", { cb: isSpace }), false);
  t.is(
    matchRight("b\n\n\nc z", 0, "c", { cb: isSpace, trimBeforeMatching: true }),
    "c"
  );
  t.is(
    matchRight("b\n\n\ncz", 0, "c", { cb: isSpace, trimBeforeMatching: true }),
    false
  );
  t.is(matchRight("b\n\n\nc z", 0, "C", { cb: isSpace, i: true }), false);
  t.is(
    matchRight("b\n\n\nc z", 0, "C", {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    "C"
  );
  t.is(
    matchRight("b\n\n\ncz", 0, "C", {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    false
  );

  // control
  t.is(matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], { cb: isSpace }), false);
  t.is(
    matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], {
      cb: isSpace,
      trimBeforeMatching: true
    }),
    "bc"
  );
  t.is(
    matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], {
      cb: isSpace,
      trimBeforeMatching: true
    }),
    false
  );
  t.is(
    matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], { trimBeforeMatching: true }),
    "bc"
  );

  // opts.i
  t.is(
    matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], { cb: isSpace, i: true }),
    false
  );
  t.is(
    matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    "BC"
  );
  t.is(
    matchRightIncl("\n\n\nbc z", 0, ["KJG", "BC"], {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    "BC"
  );
  t.is(
    matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
      cb: isSpace,
      trimBeforeMatching: true,
      i: true
    }),
    false
  );
  t.is(
    matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
      trimBeforeMatching: true,
      i: true
    }),
    "BC"
  );
  t.is(matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], { i: true }), false);
});

// new in v2.1.0
test(`06.05 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchRight - third callback argument (index)`, t => {
  const inputStr = "some text and some more text";
  function testMe(char, theRemainderOfTheString, index) {
    t.is(char, "r");
    t.is(theRemainderOfTheString, "re text");
    t.is(index, 21);
  }
  matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });
  matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });
  matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });

  matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
  matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
  matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
});

test(`06.06 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchLeft -  third callback argument (index)`, t => {
  const inputStr = "some text and some more text";
  function testMe1(char) {
    t.is(char, "o");
  }
  function testMe2(char, theRemainderOfTheString) {
    t.is(theRemainderOfTheString, "some text and so");
  }
  function testMe3(char, theRemainderOfTheString, index) {
    t.is(index, 15);
  }
  matchLeft(inputStr, 18, ["z", "me"], { cb: testMe1 });
  matchLeft(inputStr, 18, ["z", "me"], { cb: testMe2 });
  matchLeft(inputStr, 18, ["z", "me"], { cb: testMe3 });

  matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe1 });
  matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe2 });
  matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe3 });
});

// 7. opts.trimCharsBeforeMatching
// -----------------------------------------------------------------------------

test(`07.01 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.1`, t => {
  function isSpace(char) {
    return typeof char === "string" && char.trim() === "";
  }
  // control
  t.is(matchRight("</div>", 0, ["div"]), false);
  t.is(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", " "] }),
    "div"
  );
  // two character-long opts.trimCharsBeforeMatching
  t.throws(() => {
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/ "] });
  });
  t.is(
    matchRight("< / div>", 0, ["div"], { trimCharsBeforeMatching: ["/", " "] }),
    "div"
  );
  t.is(
    matchRight("< / div>", 0, ["hgfdf", "hkjh", "div", "00"], {
      trimCharsBeforeMatching: ["/", " "]
    }),
    "div"
  );
  t.is(
    matchRight("< / div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
    false
  );

  // opts.cb
  t.is(
    matchRight("</div>", 0, ["div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/", " "]
    }),
    false
  );
  t.is(
    matchRight("< / div>", 0, ["zzzz", "div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/", " "]
    }),
    false
  );
  t.is(
    matchRight("< / div>", 0, ["div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/", " "]
    }),
    false
  );
  t.is(
    matchRight("< / div>", 0, ["div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/"]
    }),
    false
  );
  t.is(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", 1] }),
    "div"
  );
});

test(`07.02 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.2`, t => {
  // matchRight
  t.is(matchRight("</div>", 0, ["div"]), false);
  t.is(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: "/" }),
    "div",
    "07.02.02 - opts.trimCharsBeforeMatching given as string"
  );
  t.is(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
    "div",
    "07.02.03 - opts.trimCharsBeforeMatching given within array"
  );
  t.is(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["a", "/"] }),
    "div",
    "07.02.04 - opts.trimCharsBeforeMatching given within array"
  );
  t.is(
    matchRight("<adiv>", 0, ["div"], { trimCharsBeforeMatching: "A" }),
    false
  );
  t.is(
    matchRight("<adiv>", 0, ["div"], {
      i: false,
      trimCharsBeforeMatching: "A"
    }),
    false
  );
  t.is(
    matchRight("<adiv>", 0, ["div"], { i: true, trimCharsBeforeMatching: "A" }),
    "div",
    "07.02.07 - case insensitive affects trimCharsBeforeMatching too and yields results"
  );
  t.is(
    matchRight("<adiv>", 0, ["dIv"], {
      i: true,
      trimCharsBeforeMatching: ["1", "A"]
    }),
    "dIv"
  );
  // matchRightIncl
  t.is(matchRightIncl("</div>", 0, ["div"]), false);
  t.is(
    matchRightIncl("</div>", 0, ["div"], { trimCharsBeforeMatching: "<" }),
    false
  );
  t.is(
    matchRightIncl("</div>", 0, ["yo", "div"], {
      trimCharsBeforeMatching: ["<", "/"]
    }),
    "div"
  );
  t.is(
    matchRightIncl("abdiv>", 0, ["yo", "div"], {
      trimCharsBeforeMatching: ["c", "a", "b"]
    }),
    "div"
  );
  t.is(
    matchRightIncl("abdiv>", 0, ["yo", "div"], {
      trimCharsBeforeMatching: ["C", "A", "B"]
    }),
    false
  );
  t.is(
    matchRightIncl("abdiv>", 0, ["yo", "div"], {
      i: true,
      trimCharsBeforeMatching: ["C", "A", "B"]
    }),
    "div"
  );
  t.is(
    matchRightIncl("abdiv>", 0, ["yo", "dIv"], {
      i: true,
      trimCharsBeforeMatching: ["C", "A", "B"]
    }),
    "dIv"
  );
  // matchLeft
  t.is(matchLeft("</divz>", 6, ["div"]), false);
  t.is(
    matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
    "div"
  );
  t.is(
    matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["z"] }),
    "div"
  );
  t.is(
    matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["Z"] }),
    false
  );
  t.is(
    matchLeft("</divz>", 6, ["div"], {
      i: false,
      trimCharsBeforeMatching: ["Z"]
    }),
    false
  );
  t.is(
    matchLeft("</divz>", 6, ["div"], {
      i: true,
      trimCharsBeforeMatching: ["Z"]
    }),
    "div"
  );
  t.is(
    matchLeft("</divz>", 6, ["dIv"], {
      i: true,
      trimCharsBeforeMatching: ["Z"]
    }),
    "dIv"
  );
  // matchLeftIncl
  t.is(matchLeftIncl("</divz>", 6, ["div"]), false);
  t.is(
    matchLeftIncl("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
    false
  );
  t.is(
    matchLeftIncl("</divz>", 6, ["div"], {
      trimCharsBeforeMatching: ["z", ">"]
    }),
    "div"
  );
  t.is(
    matchLeftIncl("</divz>", 6, ["div"], {
      trimCharsBeforeMatching: ["a", "z", ">"]
    }),
    "div"
  );
  t.is(
    matchLeftIncl("</divz>", 6, ["div"], {
      trimCharsBeforeMatching: ["Z", ">"]
    }),
    false
  );
  t.is(
    matchLeftIncl("</divz>", 6, ["div"], {
      i: false,
      trimCharsBeforeMatching: ["a", "Z", ">"]
    }),
    false
  );
  t.is(
    matchLeftIncl("</divz>", 6, ["div"], {
      i: true,
      trimCharsBeforeMatching: ["a", "Z", ">"]
    }),
    "div"
  );
  t.is(
    matchLeftIncl("</divz>", 6, ["dIv"], {
      i: true,
      trimCharsBeforeMatching: ["a", "Z", ">"]
    }),
    "dIv"
  );
});

test(`07.03 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       throws`, t => {
  t.is(
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

  t.is(
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

  t.is(
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

  t.is(
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
});

test(`07.04 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${36}m${"marching across emoji"}\u001b[${39}m`} - matchRight()`, t => {
  t.is(
    matchRight("abc 🧢 def", 4, ["def"], {
      trimCharsBeforeMatching: [" "]
    }),
    "def"
  );
  t.is(
    matchRight("abc 🧢 def", 5, ["def"], {
      trimCharsBeforeMatching: [" "]
    }),
    "def"
  );
  t.is(
    matchRight("abc \uD83E\uDDE2 def", 4, ["def"], {
      trimCharsBeforeMatching: [" "],
      cb: (char, theRemainderOfTheString, index) => {
        t.is(char, undefined);
        t.is(theRemainderOfTheString, "");
        t.is(index, 10);
        return true;
      }
    }),
    "def",
    "07.04.03* - pinning all cb values"
  );
  t.is(
    matchRight("abc \uD83E\uDDE2 defgh", 4, ["def"], {
      trimCharsBeforeMatching: [" "],
      cb: (char, theRemainderOfTheString, index) => {
        t.is(char, "g");
        t.is(theRemainderOfTheString, "gh");
        t.is(index, 10);
        return true;
      }
    }),
    "def",
    "07.04.07* - pinning all cb values"
  );
});

test(`07.05 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchLeft()`, t => {
  //
  // \uD83E = 55358
  // \uDDE2 = 56802
  // \uD83D = 55357
  // \uDC4C = 56396
  //

  const testIndex = 9;
  const str1 = "abc \uD83E\uDDE2\uD83D\uDC4C def";
  t.is(
    matchLeft(
      str1,
      testIndex, // location of "d"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          // console.log(`${`\u001b[${33}m${'str[testIndex]'}\u001b[${39}m`} = ${JSON.stringify(str1[testIndex], null, 4)}`)
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.05.01* - jumps past two spaces and emoji - simplified"
  );

  t.is(
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
          t.is(
            char,
            "\uD83D\uDE0B", // 😋
            "07.05.06"
          );
          t.is(
            theRemainderOfTheString,
            "\uD83D\uDE0B", // 😋
            "07.05.07"
          );
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.05.05* - jumps past two spaces and emoji - complete, proper"
  );

  t.is(
    matchLeft(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      9, // location of "d"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.05.09*"
  );

  t.is(
    matchLeft(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      8, // location of "d"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.05.13*"
  );

  t.is(
    matchLeft(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      7, // location of "\uDC4C"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.05.17*"
  );

  t.is(
    matchLeft(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      6, // location of "\uD83D"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.05.21*"
  );

  t.is(
    matchLeft(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      5, // location of "\uDDE2"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.05.25*"
  );
});

test(`07.06 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchRight()`, t => {
  //
  // \uD83E = 55358
  // \uDDE2 = 56802
  // \uD83D = 55357
  // \uDC4C = 56396
  //

  t.is(
    matchRight(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      2, // location of "c"
      ["de"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "f");
          t.is(theRemainderOfTheString, "f");
          t.is(
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

  t.is(
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
          t.is(char, "e");
          t.is(
            theRemainderOfTheString,
            "e\uD83D\uDCAF", // e💯
            "07.06.07"
          );
          t.is(index, 13);
          return true;
        }
      }
    ),
    "d\uD83D\uDE0B", // d😋
    "07.06.05* - jumps past two spaces and emoji - complete, proper"
  );

  t.is(
    matchRight(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      4, // location of "\uD83E"
      ["de"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "f");
          t.is(theRemainderOfTheString, "f");
          t.is(
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

  t.is(
    matchRight(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      5, // location of "\uDDE2"
      ["de"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "f");
          t.is(theRemainderOfTheString, "f");
          t.is(
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

  t.is(
    matchRight(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      6, // location of "\uD83D"
      ["de"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "f");
          t.is(theRemainderOfTheString, "f");
          t.is(
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
});

test(`07.07 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchLeftIncl()`, t => {
  //
  // \uD83E = 55358
  // \uDDE2 = 56802
  // \uD83D = 55357
  // \uDC4C = 56396
  //

  t.is(
    matchLeftIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      4,
      ["\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "\uD83D\uDCAF");
          t.is(theRemainderOfTheString, "\uD83D\uDCAF");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "\uD83E\uDDE2\uD83D\uDC4C",
    "07.07.01*"
  );

  t.is(
    matchLeftIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      5,
      ["\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "\uD83D\uDCAF");
          t.is(theRemainderOfTheString, "\uD83D\uDCAF");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "\uD83E\uDDE2\uD83D\uDC4C",
    "07.07.05*"
  );

  t.is(
    matchLeftIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      5, // in the middle of third emoji
      ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "\uD83D\uDCAF");
          t.is(theRemainderOfTheString, "\uD83D\uDCAF");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "\uD83E\uDDE2\uD83D\uDC4C",
    "07.07.09* - inclusive, starting in the middle between the surrogates"
  );

  t.is(
    matchLeftIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      4, // at \uD83D
      ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "\uD83D\uDCAF");
          t.is(theRemainderOfTheString, "\uD83D\uDCAF");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "\uD83E\uDDE2\uD83D\uDC4C",
    "07.07.10* - inclusive, starting in the middle between the surrogates"
  );

  t.is(
    matchLeftIncl(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      6, // location of "\uD83D"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.07.14*"
  );

  t.is(
    matchLeftIncl(
      "abc \uD83E\uDDE2\uD83D\uDC4C def",
      7, // location of "\uDC4C"
      ["bc"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "a");
          t.is(theRemainderOfTheString, "a");
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.07.18*"
  );

  t.is(
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
          t.is(
            char,
            "\uD83D\uDE0B", // 😋
            "07.07.23"
          );
          t.is(
            theRemainderOfTheString,
            "\uD83D\uDE0B", // 😋
            "07.07.24"
          );
          t.is(index, 0);
          return true;
        }
      }
    ),
    "bc",
    "07.07.22*"
  );

  t.is(
    matchLeftIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      4,
      ["\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, undefined);
          t.is(theRemainderOfTheString, "");
          t.is(index, undefined);
          return true;
        }
      }
    ),
    "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
    "07.07.26*"
  );
});

test(`07.08 - ${`\u001b[${34}m${"emoji"}\u001b[${39}m`} - ${`\u001b[${35}m${"trimming emoji"}\u001b[${39}m`} - matchRightIncl()`, t => {
  //
  // \uD83E = 55358
  // \uDDE2 = 56802
  // \uD83D = 55357
  // \uDC4C = 56396
  //

  t.is(
    matchRightIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      0,
      ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "\uD83D\uDC4C");
          t.is(theRemainderOfTheString, "\uD83D\uDC4C");
          t.is(index, 4);
          return true;
        }
      }
    ),
    "\uD83D\uDCAF\uD83E\uDDE2",
    "07.08.01*"
  );

  t.is(
    matchRightIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      1,
      ["\uD83D\uDCAF\uD83E\uDDE2", "\uD83E\uDDE2\uD83D\uDC4C"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "\uD83D\uDC4C");
          t.is(theRemainderOfTheString, "\uD83D\uDC4C");
          t.is(index, 4);
          return true;
        }
      }
    ),
    "\uD83D\uDCAF\uD83E\uDDE2",
    "07.08.05*"
  );

  t.is(
    matchRightIncl(
      "\uD83D\uDCAFz\uD83D\uDC4Cy",
      0,
      ["lallala\uD83D\uDCAF", "\uD83D\uDCAFz\uD83D\uDC4C"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "y");
          t.is(theRemainderOfTheString, "y");
          t.is(index, 5);
          return true;
        }
      }
    ),
    "\uD83D\uDCAFz\uD83D\uDC4C",
    "07.08.09*"
  );

  t.is(
    matchRightIncl(
      "\uD83D\uDCAFz\uD83D\uDC4Cy",
      1,
      ["lallala\uD83D\uDCAF", "\uD83D\uDCAFz\uD83D\uDC4C"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "y");
          t.is(theRemainderOfTheString, "y");
          t.is(index, 5);
          return true;
        }
      }
    ),
    "\uD83D\uDCAFz\uD83D\uDC4C",
    "07.08.13*"
  );

  t.is(
    matchRightIncl(
      "abc \uD83E\uDDE2\uD83D\uDC4C defg",
      6, // location of "\uD83D"
      ["de"],
      {
        trimCharsBeforeMatching: ["\uD83E\uDDE2", "\uD83D\uDC4C", " "],
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, "f");
          t.is(theRemainderOfTheString, "fg");
          t.is(index, 11);
          return true;
        }
      }
    ),
    "de",
    "07.08.14*"
  );

  t.is(
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
          t.is(
            char,
            "\uD83D\uDE0B", // 😋
            "07.08.23"
          );
          t.is(
            theRemainderOfTheString,
            "\uD83D\uDE0B", // 😋
            "07.08.24"
          );
          t.is(index, 12);
          return true;
        }
      }
    ),
    "de",
    "07.08.22*"
  );

  t.is(
    matchRightIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      0,
      ["\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, undefined);
          t.is(theRemainderOfTheString, "");
          t.is(index, 6);
          return true;
        }
      }
    ),
    "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
    "07.08.26*"
  );

  t.is(
    matchRightIncl(
      "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
      1,
      ["\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C", "\uD83E\uDDE2\uD83E\uDDE2"],
      {
        cb: (char, theRemainderOfTheString, index) => {
          t.is(char, undefined);
          t.is(theRemainderOfTheString, "");
          t.is(index, 6);
          return true;
        }
      }
    ),
    "\uD83D\uDCAF\uD83E\uDDE2\uD83D\uDC4C",
    "07.07.30*"
  );
});

// 8. opts.cb and opts.cb callbacks
// -----------------------------------------------------------------------------

test(`08.01 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRight()`, t => {
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
    t.is(firstCharacter, " ");
    t.is(wholeSubstring, ' class="">');
    t.is(indexOfFirstChar, 5);
  }

  const input = '</div class="">';
  t.is(
    matchRight(input, 0, ["hello", "div"], {
      cb: hasEmptyClassRightAfterTheTagName
    }),
    false, // because slash hasn't been accounted for, it's to the right of index 0 character, "<".
    "08.01.02"
  );
  t.is(
    matchRight(input, 0, ["hello", "div"], {
      cb: hasEmptyClassRightAfterTheTagName,
      trimCharsBeforeMatching: ["/", " "]
    }),
    "div", // trims slash, finds div, calls the callback with args, they trim and check for "class".
    "08.01.03"
  );
  t.is(
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
});

test(`08.02 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRightIncl()`, t => {
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

  t.is(
    matchRightIncl('</div class="">', 0, ["</", "Khg"]),
    "</", // base from where we start
    "08.02.01"
  );
  t.is(
    matchRightIncl('</div class="">', 0, ["</"], {
      cb: hasEmptyClassRightAfterTheTagName
    }),
    false, // wrong callback function
    "08.02.02"
  );
  t.is(
    matchRightIncl('</div class="">', 0, ["</", ">"], { cb: startsWithDiv }),
    "</", // fails because space (before "class") is not accounted for
    "08.02.03"
  );
  t.is(
    matchRightIncl('</ div class="">', 0, ["</"], { cb: startsWithDiv }),
    false, // fails because space (before "class") is not accounted for
    "08.02.04"
  );
  t.is(
    matchRightIncl('</div class="">', 0, ["yo", "</"], {
      cb: startsWithDivWithTrim
    }),
    "</", // trims slash, finds div, calls the callback with args, they trim and check for "class".
    "08.02.05"
  );
});

test(`08.03 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeft()`, t => {
  function startsWithZ(firstCharacterOutside, wholeSubstringOutside = "") {
    return wholeSubstringOutside.startsWith("z");
  }

  t.is(
    matchLeft("<div><b>aaa</b></div>", 5, ["<article>", "<div>"]),
    "<div>", // 5th index is left bracket of <b>. Yes, <div> is on the left.
    "08.03.01"
  );
  t.is(
    matchLeft("z<div ><b>aaa</b></div>", 7, ["<div>"]),
    false, // 7th index is left bracket of <b>. Yes, <div> is on the left.
    "08.03.02"
  );
  t.is(
    matchLeft("z<div ><b>aaa</b></div>", 7, ["<b", "<div"], {
      trimCharsBeforeMatching: [">", " "]
    }),
    "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
    "08.03.03"
  );
  t.is(
    matchLeft("z<div ><b>aaa</b></div>", 7, ["yo yo yo", "<div", "gkhjg"], {
      cb: startsWithZ,
      trimCharsBeforeMatching: [">", " "]
    }),
    "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
    "08.03.04"
  );
  t.is(
    matchLeft("<div ><b>aaa</b></div>", 6, ["<div"], {
      cb: startsWithZ,
      trimCharsBeforeMatching: [" ", ">"]
    }),
    false, // cheeky - deliberately making the second arg of cb to be blank and fail startsWithZ
    "08.03.05"
  );
});

test(`08.04 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeftIncl()`, t => {
  function startsWithZ(firstCharacter, wholeSubstring) {
    // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
    // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
    return wholeSubstring.startsWith("z");
  }

  t.is(
    matchLeftIncl("<div><b>aaa</b></div>", 4, ["<div>", "and this"]),
    "<div>", // 4th index is right bracket of <div>, but it's inclusive so it will get included.
    // not inclusive would give "<div" by the way, that is, given index would not
    // be included in the slice.
    "08.04.01"
  );
  t.is(matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["<div>"]), false);
  t.is(
    matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["111", "<div >"]),
    "<div >"
  );
  t.is(
    matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["222", "<div >"], {
      cb: startsWithZ
    }),
    "<div >"
  );
  t.is(
    matchLeftIncl("zxy<div ><b>aaa</b></div>", 8, ["krbd", "<div >"], {
      cb: startsWithZ
    }),
    "<div >"
  );
  t.is(
    matchLeftIncl("<div ><b>aaa</b></div>", 0, ["krbd", "<div >"], {
      cb: startsWithZ
    }),
    false,
    "08.04.06 - cheeky - nothing for callback to hang onto"
  );
});

// 9. Relying only on callback to calculate result - empty input is passed
// -----------------------------------------------------------------------------

test(`09.01 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()`, t => {
  t.true(
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
  const err = t.throws(() => {
    matchLeft("abc", 1, null, {
      i: true
    });
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test(`09.02 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()`, t => {
  t.false(
    matchLeftIncl("abc", 1, "", {
      i: true,
      cb: char => char === "a"
    })
  );
  t.true(
    matchLeftIncl("abc", 1, "", {
      i: true,
      cb: char => char === "b"
    })
  );
  const err = t.throws(() => {
    matchLeftIncl("abc", 1, "", {
      i: true
    });
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test(`09.03 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()`, t => {
  t.true(
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
  const err = t.throws(() => {
    matchRight("abc", 1, "", {
      i: true
    });
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test(`09.04 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl()`, t => {
  t.false(
    matchRightIncl("abc", 1, "", {
      i: true,
      cb: char => char === "c"
    })
  );
  t.true(
    matchRightIncl("abc", 1, "", {
      i: true,
      cb: char => char === "b"
    })
  );
  const err = t.throws(() => {
    matchRightIncl("abc", 1, "", {
      i: true
    });
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test(`09.05 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight() other cb args`, t => {
  t.true(
    matchRight("abcdef", 2, "", {
      i: true,
      cb: char => char === "d"
    })
  );
  t.true(
    matchRight("abcdef", 2, "", {
      i: true,
      cb: (char, rest) => rest === "def"
    })
  );
  t.true(
    matchRight("abcdef", 2, "", {
      i: true,
      cb: (char, rest, index) => index === 3
    })
  );
});

test(`09.06 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`, t => {
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
  t.true(
    matchRight("abc   def", 2, "", {
      trimBeforeMatching: true,
      cb: char => char === "d"
    })
  );
  t.true(
    matchRight("abc   def", 2, "", {
      trimBeforeMatching: true,
      cb: (char, rest) => rest === "def"
    })
  );
  t.true(
    matchRight("abc   def", 2, "", {
      trimBeforeMatching: true,
      cb: (char, rest, index) => index === 6 // "d" is at index 6
    })
  );
});

test(`09.07 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`, t => {
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
  t.true(
    matchRightIncl("abc   def", 3, "", {
      trimBeforeMatching: true,
      cb: char => char === "d"
    })
  );
  t.true(
    matchRightIncl("abc   def", 3, "", {
      trimBeforeMatching: true,
      cb: (char, rest) => rest === "def"
    })
  );
  t.true(
    matchRightIncl("abc   def", 3, "", {
      trimBeforeMatching: true,
      cb: (char, rest, index) => index === 6 // "d" is at index 6
    })
  );
});

test(`09.08 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`, t => {
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
  t.true(
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
  t.true(
    matchLeft("abc   def", 6, "", {
      trimBeforeMatching: true,
      cb: (char, rest) => rest === "abc"
    })
  );
  t.true(
    matchLeft("abc   def", 6, "", {
      trimBeforeMatching: true,
      cb: (char, rest, index) => index === 2 // "c" is at index 2
    })
  );
});

test(`09.09 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`, t => {
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
  t.true(
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
  t.true(
    matchLeftIncl("abc   def", 5, "", {
      trimBeforeMatching: true,
      cb: (char, rest) => rest === "abc"
    })
  );
  t.true(
    matchLeftIncl("abc   def", 5, "", {
      trimBeforeMatching: true,
      cb: (char, rest, index) => index === 2 // "c" is at index 2
    })
  );
});

// The following test is an edge case but nonetheless it's an interesting-one.
// We test, what happens when the decision is driven by a callback and opts
// trimming is on, and because of trimming, string is skipped up to the ending,
// with nothing left to check against.
test(`09.10 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m - trims to nothing`}`, t => {
  // In this case, callback always yields "true", no matter what. Input string
  // traversal starts on index 5, which is space to the left of "a". Since the
  // trimming is off, iteration stops at it, calls callback, returns its true.
  t.true(
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
});

test(`09.11 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`, t => {
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
  t.true(
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
});

test(`09.12 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`, t => {
  // control
  t.false(
    matchRightIncl("_bcbcbcbc+", 1, "", {
      cb: char => char === "+"
    })
  );
  t.true(
    matchRightIncl("_bcbcbcbc+", 1, "", {
      trimCharsBeforeMatching: ["b", "c"],
      cb: char => char === "+"
    })
  );
});

test(`09.11 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`, t => {
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
  t.true(
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
});

test(`09.12 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`, t => {
  // control
  t.false(
    matchRight("_bcbcbcbc+", 1, "", {
      cb: char => char === "+"
    })
  );
  t.true(
    matchRight("_bcbcbcbc+", 1, "", {
      trimCharsBeforeMatching: ["b", "c"],
      cb: char => char === "+"
    })
  );
});

test(`09.13 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      - ${`\u001b[${32}m${"emoji"}\u001b[${39}m`} + ${`\u001b[${36}m${"trims"}\u001b[${39}m`}`, t => {
  t.false(
    matchLeft("a\uD83E\uDDE2b", 3, null, {
      cb: char => char === "a"
    })
  );
  t.true(
    matchLeft("a\uD83E\uDDE2b", 3, null, {
      cb: char => char === "\uD83E\uDDE2"
    })
  );
  t.true(
    matchLeft("a\uD83E\uDDE2b", 3, null, {
      i: true, // <--- does not matter
      cb: char => char === "\uD83E\uDDE2"
    })
  );
  t.true(
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
  t.true(
    matchLeft("a\uD83E\uDDE2b", 3, null, {
      i: true, // <--- does not matter
      cb: char => char.toLowerCase() === "A".toLowerCase(),
      trimCharsBeforeMatching: ["\uD83E\uDDE2"]
    })
  );
});

test(`09.14 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     - ${`\u001b[${32}m${"emoji"}\u001b[${39}m`} + ${`\u001b[${36}m${"trims"}\u001b[${39}m`}`, t => {
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
  t.true(
    matchRight(
      "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
      1, // <--- !
      null,
      {
        cb: char => char === "\uD83E\uDDE2"
      }
    )
  );
  t.true(
    matchRight(
      "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
      2, // <--- !
      null,
      {
        cb: char => char === "\uD83E\uDDE2"
      }
    )
  );
  t.true(
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
  t.true(
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

  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
  t.true(
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
});

test(`09.15 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  - ${`\u001b[${32}m${"emoji"}\u001b[${39}m`} + ${`\u001b[${36}m${"trims"}\u001b[${39}m`}`, t => {
  matchLeftIncl(
    "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
    3,
    null,
    {
      cb: (char, theRemainderOfTheString, index) => {
        t.is(char, "\uD83E\uDDE2");
        t.is(theRemainderOfTheString, "a\uD83D\uDC4C\uD83E\uDDE2");
        t.is(index, 3);
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
  t.true(
    matchLeftIncl(
      "a\uD83D\uDC4C\uD83E\uDDE2b", // a👌🧢b
      3,
      null,
      {
        cb: char => char === "\uD83E\uDDE2"
      }
    )
  );
});

// 10. EOL matching
// -----------------------------------------------------------------------------

test(`10.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(matchLeft("a", 0, "EOL"), false);
});

test(`10.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchLeft("a", 0, () => "EOL"),
    "EOL"
  );
});

test(`10.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - cb blocking result`, t => {
  t.is(
    matchLeft("a", 0, () => "EOL", {
      cb: () => {
        return false;
      }
    }),
    false
  );
});

test(`10.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`, t => {
  t.is(
    matchLeft("a", 0, () => "EOL", {
      cb: () => {
        return true;
      }
    }),
    "EOL"
  );
});

test(`10.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`, t => {
  matchLeft("a", 0, () => "EOL", {
    cb: (...args) => {
      t.deepEqual(
        args,
        [undefined, "", undefined] // because there's nothing outside-left of index 0
      );
      return true;
    }
  });
});

test(`10.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`, t => {
  // whitespace trims:
  t.is(
    matchLeft(" a", 1, () => "EOL"),
    false
  );
});

test(`10.07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - CHEEKY!!!`, t => {
  t.is(
    matchLeft("EOLa", 3, () => "EOL"),
    false
  );
});

test(`10.08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - !!!`, t => {
  t.is(matchLeft("EOLa", 3, "EOL"), "EOL");
});

test(`10.09 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`, t => {
  t.is(
    matchLeft(" a", 1, () => "EOL", {
      trimBeforeMatching: true
    }),
    "EOL"
  );
});

test(`10.10 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`, t => {
  // character trims:
  t.is(
    matchLeft("za", 1, () => "EOL"),
    false
  );
});

test(`10.11 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`, t => {
  t.is(
    matchLeft("za", 1, () => "EOL", {
      trimCharsBeforeMatching: ["z"]
    }),
    "EOL"
  );
});

test(`10.12 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`, t => {
  // trim combos - whitespace+character:
  t.is(
    matchLeft("z a", 2, () => "EOL"),
    false
  );
});

test(`10.13 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`, t => {
  t.is(
    matchLeft("z a", 2, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL"
  );
});

// 11. EOL mixed with strings
// -----------------------------------------------------------------------------

test(`11.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, t => {
  t.is(matchLeft("a", 0, ["EOL"]), false);
});

test(`11.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, t => {
  t.is(matchLeft("a", 0, ["EOL", "a"]), false);
});

test(`11.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, t => {
  t.is(matchLeft("a", 0, ["EOL", "z"]), false);
});

test(`11.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, t => {
  t.is(matchLeft("a", 0, ["EOL", () => "EOL"]), "EOL");
});

test(`11.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, t => {
  t.is(matchLeft("a", 0, [() => "EOL"]), "EOL");
});

test(`11.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m whitespace trims - whitespace trim opts control - one special`, t => {
  t.is(matchLeft(" a", 1, [() => "EOL"]), false);
});

// 12. whitespace trims
// -----------------------------------------------------------------------------

test(`12.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(
    matchLeft(" a", 1, [() => "EOL", () => "EOL"]),
    false,
    "12.02.07 - whitespace trim opts control - two specials"
  );
});

test(`12.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(
    matchLeft(" a", 1, [() => "EOL", "EOL"]),
    false,
    "12.02.08 - whitespace trim opts control - special mixed with cheeky"
  );
});

test(`12.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(
    matchLeft(" a", 1, ["EOL"]),
    false,
    "12.02.09 - whitespace trim opts control - cheeky only"
  );
});

test(`12.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(matchLeft("EOLa", 3, [() => "EOL"]), false, "12.02.10 - CHEEKY!!!");
});

test(`12.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(matchLeft("EOLa", 3, ["EOL"]), "EOL");
});

test(`12.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(matchLeft("EOLa", 3, ["a", () => "EOL"]), false, "12.02.12 - CHEEKY!!!");
});

test(`12.07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(matchLeft("EOLa", 3, ["a", "EOL"]), "EOL");
});

test(`12.08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(
    matchLeft(" a", 1, [() => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "12.02.14 - whitespace trim opt on"
  );
});

test(`12.09 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(
    matchLeft(" a", 1, ["a", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "12.02.15 - whitespace trim opt on"
  );
});

test(`12.10 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(
    matchLeft(" a", 1, [() => "EOL", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "12.02.16 - whitespace trim opt on"
  );
});

test(`12.11 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, t => {
  t.is(
    matchLeft(" a", 1, [() => "EOL", "a", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "12.02.17 - whitespace trim opt on"
  );
});

// 13. character trims
// -----------------------------------------------------------------------------

test(`13.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, t => {
  t.is(
    matchLeft("za", 1, [() => "EOL"]),
    false,
    "10.02.18 - whitespace trim opts control"
  );
});

test(`13.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, t => {
  t.is(
    matchLeft("za", 1, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"]
    }),
    "EOL",
    "10.02.19 - whitespace trim opt on"
  );
});

test(`13.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, t => {
  t.is(
    matchLeft("za", 1, ["a", () => "EOL"]),
    false,
    "10.02.20 - whitespace trim opts control"
  );
});

test(`13.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, t => {
  t.is(matchLeft("za", 1, ["z", () => "EOL"]), "z", "10.02.21 - z caught");
});

test(`13.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, t => {
  t.is(
    matchLeft("za", 1, ["a", () => "EOL"], {
      trimCharsBeforeMatching: ["z"]
    }),
    "EOL",
    "10.02.22 - whitespace trim opt on"
  );
});

// 14. trim combos - whitespace+character
// -----------------------------------------------------------------------------

test(`14.01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, t => {
  t.is(
    matchLeft("z a", 2, [() => "EOL"]),
    false,
    "10.02.23 - whitespace trim opts control"
  );
});

test(`14.02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, t => {
  t.is(
    matchLeft("z a", 2, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL",
    "10.02.24 - whitespace trim opt on"
  );
});

test(`14.03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, t => {
  t.is(
    matchLeft("z a", 2, ["a", () => "EOL"]),
    false,
    "10.02.25 - whitespace trim opts control"
  );
});

test(`14.04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, t => {
  t.is(
    matchLeft("z a", 2, ["a", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL",
    "10.02.26 - whitespace trim opt on"
  );
});

test(`14.05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, t => {
  t.is(
    matchLeft("z a", 2, ["z", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "z",
    "10.02.27 - whitespace trim opts control"
  );
});

test(`14.06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, t => {
  t.is(
    matchLeft("z a", 2, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL",
    "10.02.28 - whitespace trim opt on"
  );
});

test(`14.07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, t => {
  t.is(
    matchLeft("yz a", 2, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    false
  );
});

// 15. futile matching - matchLeftIncl() from zero to the left
// ------------------------------------------------------------------------------

test(`15.01 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(matchLeftIncl("a", 0, "EOL"), false);
});

test(`15.02 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchLeftIncl("a", 0, () => "EOL"),
    false
  );
});

test(`15.03 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchLeftIncl("a", 0, () => "EOL", {
      cb: () => {
        return false;
      }
    }),
    false,
    "10.03.03 - cb blocking result"
  );
});

test(`15.04 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchLeftIncl("a", 0, () => "EOL", {
      cb: () => {
        return true;
      }
    }),
    false,
    "10.03.04 - useless cb"
  );
});

test(`15.05 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchLeftIncl(" a", 1, () => "EOL"),
    false,
    "10.03.06 - whitespace trim opts control"
  );
});

test(`15.06 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchLeftIncl("EOLa", 3, () => "EOLa"),
    false
  );
  t.is(matchLeftIncl("EOLa", 3, "EOL"), false);
});

test(`15.07 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchLeftIncl(" a", 1, () => "EOL", {
      trimBeforeMatching: true
    }),
    false,
    "10.03.09 - whitespace trim opt on"
  );
});

test(`15.08 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`, t => {
  t.is(
    matchLeftIncl("za", 1, () => "EOL"),
    false,
    "10.03.10 - whitespace trim opts control"
  );
});

test(`15.09 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`, t => {
  t.is(
    matchLeftIncl("za", 1, () => "EOL", {
      trimCharsBeforeMatching: ["z"]
    }),
    false,
    "10.03.11 - whitespace trim opt on"
  );
});

test(`15.10 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, t => {
  // trim combos - whitespace+character:
  t.is(
    matchLeftIncl("z a", 2, () => "EOL"),
    false,
    "10.03.12 - whitespace trim opts control"
  );
});

test(`15.11 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, t => {
  t.is(
    matchLeftIncl("z a", 2, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    false,
    "10.03.13 - whitespace trim opt on"
  );
});

// 16. matchRight
// -----------------------------------------------------------------------------

test(`16.01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(matchRight("a", 0, "EOL"), false);
});

test(`16.02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchRight("a", 0, () => "EOL"),
    "EOL"
  );
});

test(`16.03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchRight("a", 0, () => "EOL", {
      cb: () => {
        return false;
      }
    }),
    false,
    "10.04.03 - cb blocking result"
  );
});

test(`16.04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchRight("a", 0, () => "EOL", {
      cb: () => {
        return true;
      }
    }),
    "EOL",
    "10.04.04 - useless cb, just confirms the incoming truthy result"
  );
});

test(`16.05 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  matchRight("a", 0, () => "EOL", {
    cb: (...args) => {
      t.deepEqual(
        args,
        [undefined, undefined, undefined], // because there's nothing outside-right of index 0
        "10.04.05 - useless cb"
      );
      return true;
    }
  });
});

test(`16.06 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, () => "EOL"),
    false,
    "10.04.06-1"
  );
});

test(`16.07 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchRight("a ", 1, () => "EOL"),
    "EOL",
    "10.04.06-2"
  );
});

test(`16.08 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchRight("aEOL", 0, () => "EOL"),
    false,
    "10.04.07 - CHEEKY!!!"
  );
});

test(`16.09 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(matchRight("aEOL", 0, "EOL"), "EOL", "10.04.08 - !!!");
});

test(`16.10 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, () => "EOL", {
      trimBeforeMatching: true
    }),
    "EOL",
    "10.04.09 - whitespace trim opt on"
  );
});

test(`16.11 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`, t => {
  t.is(
    matchRight("az", 0, () => "EOL"),
    false,
    "10.04.10 - whitespace trim opts control"
  );
});

test(`16.12 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`, t => {
  t.is(
    matchRight("az", 0, () => "EOL", {
      trimCharsBeforeMatching: ["z"]
    }),
    "EOL",
    "10.04.11 - whitespace trim opt on"
  );
});

test(`16.13 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, t => {
  // trim combos - whitespace+character:
  t.is(
    matchRight("a z", 0, () => "EOL"),
    false,
    "10.04.12 - whitespace trim opts control"
  );
});

test(`16.14 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, t => {
  t.is(
    matchRight("a z", 2, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL",
    "10.04.13 - whitespace trim opt on"
  );
});

// 17. matchRight() - EOL mixed with strings
// -----------------------------------------------------------------------------

test(`17.01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, t => {
  t.is(matchRight("a", 0, ["EOL"]), false);
});

test(`17.02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, t => {
  t.is(matchRight("a", 0, ["EOL", "a"]), false);
});

test(`17.03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, t => {
  t.is(matchRight("a", 0, ["EOL", "z"]), false);
});

test(`17.04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, t => {
  t.is(matchRight("a", 0, ["EOL", () => "EOL"]), "EOL"); // latter, function was matched
});

test(`17.05 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, t => {
  t.is(matchRight("a", 0, [() => "EOL"]), "EOL");
});

test(`17.06 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, [() => "EOL"]),
    false,
    "10.05.06 - whitespace trim opts control - one special"
  );
});

test(`17.07 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, [() => "EOL", () => "EOL"]),
    false,
    "10.05.07 - whitespace trim opts control - two specials"
  );
});

test(`17.08 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, [() => "EOL", "EOL"]),
    false,
    "10.05.08 - whitespace trim opts control - special mixed with cheeky"
  );
});

test(`17.09 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, ["EOL"]),
    false,
    "10.05.09 - whitespace trim opts control - cheeky only"
  );
});

test(`17.10 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(matchRight("aEOL", 0, [() => "EOL"]), false, "10.05.10 - CHEEKY!!!");
});

test(`17.11 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(matchRight("aEOL", 0, ["EOL"]), "EOL");
});

test(`17.12 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("aEOL", 0, ["z", () => "EOL"]),
    false,
    "10.05.12 - CHEEKY!!!"
  );
});

test(`17.13 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(matchRight("aEOL", 0, ["z", "EOL"]), "EOL");
});

test(`17.14 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, [() => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "10.05.14 - array"
  );
});

test(`17.15 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, ["x", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "10.05.15 - other values to match"
  );
});

test(`17.16 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, [() => "EOL", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "10.05.16 - two identical arrow functions in array, both positive"
  );
});

test(`17.17 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, t => {
  t.is(
    matchRight("a ", 0, [() => "EOL", "z", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "EOL",
    "10.05.17 - two arrow f's in arrray + non-found"
  );
});

test(`17.18 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, t => {
  t.is(matchRight("az", 0, [() => "EOL"]), false, "10.05.18 - trim off");
});

test(`17.19 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, t => {
  t.is(
    matchRight("az", 0, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"]
    }),
    "EOL",
    "10.05.19 - character trim opt on"
  );
});

test(`17.20 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, t => {
  t.is(
    matchRight("az", 0, ["x", () => "EOL"]),
    false,
    "10.05.20 - wrong character to trim"
  );
});

test(`17.21 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, t => {
  t.is(
    matchRight("az", 0, ["z", () => "EOL"]),
    "z",
    "10.05.21 - z caught first, before EOL"
  );
});

test(`17.22 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, t => {
  t.is(
    matchRight("az", 0, ["a", () => "EOL"], {
      trimCharsBeforeMatching: ["z"]
    }),
    "EOL",
    "10.05.22 - whitespace trim opt on"
  );
});

test(`17.23 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, t => {
  // trim combos - whitespace+character:
  t.is(
    matchRight("a z", 0, [() => "EOL"]),
    false,
    "10.05.23 - whitespace trim opts control"
  );
});

test(`17.24 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, t => {
  t.is(
    matchRight("a z", 0, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL",
    "10.05.24 - whitespace trim opt on"
  );
});

test(`17.25 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, t => {
  t.is(
    matchRight("a z", 0, ["x", () => "EOL"]),
    false,
    "10.05.25 - whitespace trim opts control"
  );
});

test(`17.26 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, t => {
  t.is(
    matchRight("a z", 0, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL",
    "10.05.26 - whitespace trim opt on"
  );
});

test(`17.27 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, t => {
  t.is(
    matchRight("a z", 0, ["z", () => "EOL"], {
      trimBeforeMatching: true
    }),
    "z",
    "10.05.27 - whitespace trim opts control"
  );
});

test(`17.28 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, t => {
  t.is(
    matchRight("a z", 0, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    "EOL",
    "10.05.28 - unused char to trim"
  );
});

test(`17.29 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, t => {
  t.is(
    matchRight("a zy", 0, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    false,
    "10.05.29 - y stands in the way"
  );
});

// 18.

// EOL can never be found using matchRightIncl() or matchLeftIncl() because
// "inclusive" in the name means current character is included in the query to
// match, either in the beginning of it ("matchRightIncl") or end of it
// ("matchLeftIncl"). Since current character can't be EOL, result of both
// matchRightIncl() and matchLeftIncl() that search for EOL will always be "false".

test(`18.01 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(matchRightIncl("a", 0, "EOL"), false);
});

test(`18.02 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchRightIncl("a", 0, () => "EOL"),
    false
  );
});

test(`18.03 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchRightIncl("a", 0, () => "EOL", {
      cb: () => {
        return false;
      }
    }),
    false,
    "10.06.03 - cb blocking, but still useless, result was false before cb kicked in"
  );
});

test(`18.04 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, t => {
  t.is(
    matchRightIncl("a", 0, () => "EOL", {
      cb: () => {
        return true;
      }
    }),
    false,
    "10.06.04 - useless cb"
  );
});

test(`18.05 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchRightIncl("a ", 0, () => "EOL"),
    false,
    "10.06.05 - whitespace trim opts control"
  );
});

test(`18.06 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchRightIncl("aEOL", 0, () => "aEOL"),
    false
  );
});

test(`18.07 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(matchRightIncl("aEOL", 0, "EOL"), false);
});

test(`18.08 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, t => {
  t.is(
    matchRightIncl("a ", 0, () => "EOL", {
      trimBeforeMatching: true
    }),
    false,
    "10.06.08 - whitespace trim opt on"
  );
});

test(`18.09 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`, t => {
  t.is(
    matchRightIncl("az", 0, () => "EOL"),
    false,
    "10.06.10 - whitespace trim opts control"
  );
});

test(`18.10 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`, t => {
  t.is(
    matchRightIncl("az", 0, () => "EOL", {
      trimCharsBeforeMatching: ["z"]
    }),
    false,
    "10.06.11 - whitespace trim opt on"
  );
});

test(`18.11 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, t => {
  // whitespace+character:
  t.is(
    matchRightIncl("a z", 0, () => "EOL"),
    false,
    "10.06.12 - whitespace trim opts control"
  );
});

test(`18.12 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, t => {
  t.is(
    matchRightIncl("a z", 0, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true
    }),
    false,
    "10.06.13 - whitespace trim + character trim"
  );
});

// 13. Ad-hoc
// -----------------------------------------------------------------------------

test(`13.01 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  t.is(matchRight('<a class="something"> text', 19, ">"), ">");
});

test(`13.02 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  t.is(
    matchRight('<a class="something"> text', 19, ">", {
      cb: char => typeof char === "string" && char.trim() === ""
    }),
    ">"
  );
});

test(`13.03 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  t.is(matchRightIncl('<a class="something"> text', 20, "> t"), "> t");
});

test(`13.04 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  t.is(matchRight('<a class="something"> text', 19, "> t"), "> t");
});

test(`13.05 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  t.is(
    matchRight("ab      cdef", 1, "cde", { trimBeforeMatching: true }),
    "cde"
  );
});

test(`13.06 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  t.is(
    matchRight('<a class="something"> text', 19, ">", {
      cb: char => char === " "
    }),
    ">"
  );
});

test(`13.07 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  t.is(
    matchRight("ab      cdef", 1, "cde", {
      cb: char => char === "f",
      trimBeforeMatching: true
    }),
    "cde"
  );
});

test(`13.08 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`, t => {
  matchRight("ab      cdef", 1, "cd", {
    trimBeforeMatching: true,
    cb: (char, theRemainderOfTheString, index) => {
      t.is(char, "e");
      t.is(theRemainderOfTheString, "ef");
      t.is(index, 10);
    }
  });
});

test(`13.09 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, set #02`, t => {
  t.is(
    matchRight("a<!DOCTYPE html>b", 1, ["!--", "doctype", "xml", "cdata"], {
      i: true,
      trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
    }),
    "doctype"
  );
});

// cap emoji
// \uD83E charCodeAt = 55358
// \uDDE2 charCodeAt = 56802

// \uD83D charCodeAt = 55357
// \uDC4C charCodeAt = 56396
