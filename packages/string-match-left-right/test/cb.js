import tap from "tap";
import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm";

// opts.cb callbacks
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back. haha!`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(
      matchLeft('<a class="something">', 8, "class", { cb: isSpace }),
      "class",
      "01.01"
    );
    t.equal(
      matchLeft('<a superclass="something">', 13, "class", { cb: isSpace }),
      false,
      "01.02"
    );
    t.equal(
      matchLeftIncl('<a class="something">', 8, "class=", { cb: isSpace }),
      "class=",
      "01.03"
    );
    t.equal(
      matchLeftIncl('<a superclass="something">', 13, "class=", {
        cb: isSpace,
      }),
      false,
      "01.04"
    );
    t.equal(matchLeftIncl("a", 13, "class=", { cb: isSpace }), false, "01.05");

    // PART 1. CONTROL.
    // the first part (string matching) is true, "b" is to the left of the character at index #2.
    // the second part of result calculation (callback against outside character) is true too.
    t.equal(matchLeft(" bc", 2, "b", { cb: isSpace }), "b", "01.06");

    // PART 2. LET'S MAKE VERSION OF '06.01.06' FAIL BECAUSE OF THE CALLBACK.
    t.equal(matchLeft("abc", 2, "b", { cb: isSpace }), false, "01.07");
    // observe that "a" does not satisfy the callback's requirement to be a space thus the
    // main result is false.
    // Now, let's test trimming:

    // PART 3.
    // character at index #5 is "c".
    // We're checking is "b" to the left of it, plus, is there a space to the left of "b".
    // Answer is no, because there are bunch of line breaks to the left of "c".
    t.equal(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false, "01.08");

    // PART 4.
    // Now let's enable the opts.trimBeforeMatching:
    t.equal(
      matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      "b",
      "01.09"
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
      false,
      "01.10"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeft() - various combos`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(
      matchLeft("ab\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      false,
      "02.01"
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      "b",
      "02.02"
    );
    t.equal(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false, "02.03");
    t.equal(
      matchLeft("ab\n\n\nc", 5, "B", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "02.04"
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "B", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "B",
      "02.05"
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "B", { cb: isSpace, i: true }),
      false,
      "02.06"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeftIncl() - callback and trimming`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    function isA(char) {
      return char === "a";
    }
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "bc", { cb: isSpace }),
      false,
      "03.01"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "bc", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      "bc",
      "03.02"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      false,
      "03.03"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", {
        cb: isA,
        trimBeforeMatching: true,
      }),
      "bc",
      "03.04"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", { trimBeforeMatching: true }),
      "bc",
      "03.05"
    );

    // opts.i
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "BC", { cb: isSpace, i: true }),
      false,
      "03.06"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "BC", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "03.07"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, ["BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "03.08"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, ["AAA", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "03.09"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "BC", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "03.10"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "BC", {
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "03.11"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back, pt.1`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(matchRight('<a class="something"> text', 19, ">"), ">", "04.01");
    t.equal(
      // we will catch closing double quote, index #19 and check does closing bracket follow
      // if and also does the space follow after it
      matchRight('<a class="something"> text', 19, ">", { cb: isSpace }),
      ">",
      "04.02"
    );
    t.equal(
      matchRight('<a class="something">text', 19, ">", { cb: isSpace }),
      false,
      "04.03"
    );
    t.equal(matchRight('<a class="something"> text', 18, '">'), '">', "04.04");
    t.equal(
      matchRightIncl('<a class="something"> text', 19, '">'),
      '">',
      "04.05"
    );
    t.equal(
      matchRightIncl('<a class="something"> text', 19, '">', { cb: isSpace }),
      '">',
      "04.06"
    );
    t.equal(
      matchRightIncl('<a class="something">text', 19, '">', { cb: isSpace }),
      false,
      "04.07"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called, pt.2`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    // control
    t.equal(matchRight("b\n\n\nc z", 0, "c", { cb: isSpace }), false, "05.01");
    t.equal(
      matchRight("b\n\n\nc z", 0, "c", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      "c",
      "05.02"
    );
    t.equal(
      matchRight("b\n\n\ncz", 0, "c", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      false,
      "05.03"
    );
    t.equal(
      matchRight("b\n\n\nc z", 0, "C", { cb: isSpace, i: true }),
      false,
      "05.04"
    );
    t.equal(
      matchRight("b\n\n\nc z", 0, "C", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "C",
      "05.05"
    );
    t.equal(
      matchRight("b\n\n\ncz", 0, "C", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "05.06"
    );

    // control
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], { cb: isSpace }),
      false,
      "05.07"
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      "bc",
      "05.08"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      false,
      "05.09"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], {
        trimBeforeMatching: true,
      }),
      "bc",
      "05.10"
    );

    // opts.i
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], { cb: isSpace, i: true }),
      false,
      "05.11"
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "05.12"
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["KJG", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "05.13"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "05.14"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "05.15"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], { i: true }),
      false,
      "05.16"
    );
    t.end();
  }
);

// new in v2.1.0
tap.test(
  `06 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchRight - third callback argument (index)`,
  (t) => {
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

tap.test(
  `07 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchLeft -  third callback argument (index)`,
  (t) => {
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

tap.test(
  `08 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRight()`,
  (t) => {
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
        cb: hasEmptyClassRightAfterTheTagName,
      }),
      false, // because slash hasn't been accounted for, it's to the right of index 0 character, "<".
      "08.01"
    );
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName,
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "08.02"
    );
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName,
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "08.03"
    );

    matchRight(input, 0, ["zz", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
    });
    matchRight(input, 0, ["zz", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    matchRight(input, 0, ["ghjs", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    matchRight(input, 0, ["zz", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
    });
    matchRight(input, 0, ["zz", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    matchRight(input, 0, ["ghjs", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    t.end();
  }
);

tap.test(
  `09 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRightIncl()`,
  (t) => {
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
      "09.01"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["</"], {
        cb: hasEmptyClassRightAfterTheTagName,
      }),
      false, // wrong callback function
      "09.02"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["</", ">"], { cb: startsWithDiv }),
      "</", // succeeds because div follows "</"
      "09.03"
    );
    t.equal(
      matchRightIncl('</ div class="">', 0, ["</"], { cb: startsWithDiv }),
      false, // fails because space (before "class") is not accounted for
      "09.04"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["yo", "</"], {
        cb: startsWithDivWithTrim,
      }),
      "</", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "09.05"
    );
    t.end();
  }
);

tap.test(
  `10 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeft()`,
  (t) => {
    function startsWithZ(firstCharacterOutside, wholeSubstringOutside = "") {
      return wholeSubstringOutside.startsWith("z");
    }

    t.equal(
      matchLeft("<div><b>aaa</b></div>", 5, ["<article>", "<div>"]),
      "<div>", // 5th index is left bracket of <b>. Yes, <div> is on the left.
      "10.01"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["<div>"]),
      false, // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "10.02"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["<b", "<div"], {
        trimCharsBeforeMatching: [">", " "],
      }),
      "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "10.03"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["yo yo yo", "<div", "gkhjg"], {
        cb: startsWithZ,
        trimCharsBeforeMatching: [">", " "],
      }),
      "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "10.04"
    );
    t.equal(
      matchLeft("<div ><b>aaa</b></div>", 6, ["<div"], {
        cb: startsWithZ,
        trimCharsBeforeMatching: [" ", ">"],
      }),
      false, // cheeky - deliberately making the second arg of cb to be blank and fail startsWithZ
      "10.05"
    );
    t.end();
  }
);

tap.test(
  `11 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeftIncl()`,
  (t) => {
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
      "11.01"
    );
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["<div>"]),
      false,
      "11.02"
    );
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["111", "<div >"]),
      "<div >",
      "11.03"
    );
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["222", "<div >"], {
        cb: startsWithZ,
      }),
      "<div >",
      "11.04"
    );
    t.equal(
      matchLeftIncl("zxy<div ><b>aaa</b></div>", 8, ["krbd", "<div >"], {
        cb: startsWithZ,
      }),
      "<div >",
      "11.05"
    );
    t.equal(
      matchLeftIncl("<div ><b>aaa</b></div>", 0, ["krbd", "<div >"], {
        cb: startsWithZ,
      }),
      false,
      "11.06 - cheeky - nothing for callback to hang onto"
    );
    t.end();
  }
);

// Relying only on callback to calculate result - empty input is passed
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()`,
  (t) => {
    t.ok(
      matchLeft("abc", 1, null, {
        i: true,
        cb: (char) => char === "a",
      }),
      "12.01"
    );
    t.false(
      matchLeft("abc", 1, null, {
        i: true,
        cb: (char) => char === "c",
      }),
      "12.02"
    );
    t.throws(() => {
      matchLeft("abc", 1, null, {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()`,
  (t) => {
    t.false(
      matchLeftIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "a",
      }),
      "13.01"
    );
    t.ok(
      matchLeftIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "b",
      }),
      "13.02"
    );
    t.throws(() => {
      matchLeftIncl("abc", 1, "", {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()`,
  (t) => {
    t.ok(
      matchRight("abc", 1, "", {
        i: true,
        cb: (char) => char === "c",
      }),
      "14.01"
    );
    t.false(
      matchRight("abc", 1, "", {
        i: true,
        cb: (char) => char === "a",
      }),
      "14.02"
    );
    t.throws(() => {
      matchRight("abc", 1, "", {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl()`,
  (t) => {
    t.false(
      matchRightIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "c",
      }),
      "15.01"
    );
    t.ok(
      matchRightIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "b",
      }),
      "15.02"
    );
    t.throws(() => {
      matchRightIncl("abc", 1, "", {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight() other cb args`,
  (t) => {
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char) => char === "d",
      }),
      "16.01"
    );
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char, rest) => rest === "def",
      }),
      "16.02"
    );
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char, rest, index) => index === 3,
      }),
      "16.03"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char) => char === "d",
      }),
      "17.01"
    );
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char, rest) => rest === "def",
      }),
      "17.02"
    );
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "17.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char) => char === "d",
      }),
      "17.04"
    );
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "def",
      }),
      "17.05"
    );
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "17.06"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char) => char === "d",
      }),
      "18.01"
    );
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char, rest) => rest === "def",
      }),
      "18.02"
    );
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "18.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char) => char === "d",
      }),
      "18.04"
    );
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "def",
      }),
      "18.05"
    );
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "18.06"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeft(
        "abc   def",
        6, // <--- location of "d"
        "",
        {
          cb: (char) => char === "c",
        }
      ),
      "19.01"
    );
    t.false(
      matchLeft("abc   def", 6, "", {
        cb: (char, rest) => rest === "abc",
      }),
      "19.02"
    );
    t.false(
      matchLeft("abc   def", 6, "", {
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "19.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchLeft(
        "abc   def",
        6, // <--- location of "d"
        "",
        {
          trimBeforeMatching: true,
          cb: (char) => char === "c",
        }
      ),
      "19.04"
    );
    t.ok(
      matchLeft("abc   def", 6, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "abc",
      }),
      "19.05"
    );
    t.ok(
      matchLeft("abc   def", 6, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "19.06"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeftIncl(
        "abc   def",
        5, // <--- location of "d"
        "",
        {
          cb: (char) => char === "c",
        }
      ),
      "20.01"
    );
    t.false(
      matchLeftIncl("abc   def", 5, "", {
        cb: (char, rest) => rest === "abc",
      }),
      "20.02"
    );
    t.false(
      matchLeftIncl("abc   def", 5, "", {
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "20.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchLeftIncl(
        "abc   def",
        5, // <--- location of "d"
        "",
        {
          trimBeforeMatching: true,
          cb: (char) => char === "c",
        }
      ),
      "20.04"
    );
    t.ok(
      matchLeftIncl("abc   def", 5, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "abc",
      }),
      "20.05"
    );
    t.ok(
      matchLeftIncl("abc   def", 5, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "20.06"
    );
    t.end();
  }
);

// The following test is an edge case but nonetheless it's an interesting-one.
// We test, what happens when the decision is driven by a callback and opts
// trimming is on, and because of trimming, string is skipped up to the ending,
// with nothing left to check against.
tap.test(
  `21 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m - trims to nothing`}`,
  (t) => {
    // In this case, callback always yields "true", no matter what. Input string
    // traversal starts on index 5, which is space to the left of "a". Since the
    // trimming is off, iteration stops at it, calls callback, returns its true.
    t.ok(
      matchLeftIncl(
        "      abc",
        5, // <--- location of space to the left of "a"
        "",
        {
          cb: () => true,
        }
      ),
      "21.01"
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
          cb: () => true, // <---- notice it's yielding "true" for all the cases
        }
      ),
      "21.02"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeftIncl(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          cb: (char) => char === "_",
        }
      ),
      "22.01"
    );
    t.ok(
      matchLeftIncl(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          trimCharsBeforeMatching: ["b", "c"],
          cb: (char) => char === "_",
        }
      ),
      "22.02"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRightIncl("_bcbcbcbc+", 1, "", {
        cb: (char) => char === "+",
      }),
      "23.01"
    );
    t.ok(
      matchRightIncl("_bcbcbcbc+", 1, "", {
        trimCharsBeforeMatching: ["b", "c"],
        cb: (char) => char === "+",
      }),
      "23.02"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeft(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          cb: (char) => char === "_",
        }
      ),
      "24.01"
    );
    t.ok(
      matchLeft(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          trimCharsBeforeMatching: ["b", "c"],
          cb: (char) => char === "_",
        }
      ),
      "24.02"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRight("_bcbcbcbc+", 1, "", {
        cb: (char) => char === "+",
      }),
      "25.01"
    );
    t.ok(
      matchRight("_bcbcbcbc+", 1, "", {
        trimCharsBeforeMatching: ["b", "c"],
        cb: (char) => char === "+",
      }),
      "25.02"
    );
    t.end();
  }
);
