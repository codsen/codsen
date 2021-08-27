import tap from "tap";
import {
  // matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// matchRight()
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`,
  (t) => {
    t.equal(matchRight("abcdef", 2, "d"), "d", "01.01");
    t.equal(matchRight("abcdef", 2, ["d"]), "d", "01.02");
    t.equal(matchRight("abcdef", 2, "def"), "def", "01.03");
    t.equal(matchRight("abcdef", 2, ["def"]), "def", "01.04");
    t.equal(matchRight("abcdef", 2, ["defg"]), false, "01.05");

    t.equal(matchRight("abcdef", 99, ["defg"]), false, "01.06");

    t.equal(
      matchRight("ab      cdef", 1, "cd", { trimBeforeMatching: true }),
      "cd",
      "01.07"
    );

    matchRight("ab      cdef", 1, "cd", {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "e");
        t.equal(theRemainderOfTheString, "ef");
        t.equal(index, 10);
      },
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`,
  (t) => {
    t.equal(matchRight("abcdef", 0, "b"), "b", "02.01");
    t.equal(matchRight("abcdef", 0, ["b"]), "b", "02.02");
    t.equal(matchRight("abcdef", 0, ["bc"]), "bc", "02.03");
    t.equal(matchRight("abcdef", 0, ["hfd", "ghja", "bc"]), "bc", "02.04");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, case insensitive`,
  (t) => {
    t.equal(matchRight("abcdef", 2, "D"), false, "03.01");
    t.equal(matchRight("abcdef", 2, "D", { i: true }), "D", "03.02");
    t.equal(matchRight("abcdef", 2, ["D"], { i: true }), "D", "03.03");
    t.equal(matchRight("abcdef", 2, ["gDSS", "D"], { i: true }), "D", "03.04");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         adhoc test #1`,
  (t) => {
    t.equal(
      matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 13, ">"),
      ">",
      "04.01"
    );
    t.equal(
      matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 10, ">"),
      false,
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char`,
  (t) => {
    t.equal(
      matchRight("a<!->z", 0, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, "z");
          t.equal(theRemainderOfTheString, "z");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "05.01"
    );
    t.equal(
      matchRightIncl("a<!->z", 1, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, "z");
          t.equal(theRemainderOfTheString, "z");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char, space follows`,
  (t) => {
    t.equal(
      matchRight("a<!-> ", 0, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, " ");
          t.equal(theRemainderOfTheString, " ");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "06.01"
    );
    t.equal(
      matchRightIncl("a<!-> ", 1, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, " ");
          t.equal(theRemainderOfTheString, " ");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char, EOF follows`,
  (t) => {
    t.equal(
      matchRight("a<!->", 0, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "07.01"
    );
    t.equal(
      matchRightIncl("a<!->", 1, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, fail`,
  (t) => {
    t.equal(
      matchRight("a<--b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      "!--",
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, pass`,
  (t) => {
    // enforcing the exclamation mark:
    t.equal(
      matchRight("a<--b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
        firstMustMatch: true,
      }),
      false,
      "09"
    );

    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, succeed`,
  (t) => {
    t.equal(
      matchRight("a<!-b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      "!--",
      "10.01"
    );

    // enforcing the exclamation mark:
    t.equal(
      matchRight("a<!-b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
        firstMustMatch: true,
      }),
      "!--",
      "10.02"
    );

    // now matchRightIncl():

    t.equal(
      matchRightIncl("a<!-b", 2, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      "!--",
      "10.03"
    );

    // enforcing the exclamation mark:
    t.equal(
      matchRightIncl("a<!-b", 2, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
        firstMustMatch: true,
      }),
      "!--",
      "10.04"
    );

    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, false`,
  (t) => {
    t.equal(
      matchRight(`a<!--[if gte mso 9]>x<![endif]-->z`, 1, ["![cdata"], {
        i: true,
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      false,
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, adhoc 1`,
  (t) => {
    t.equal(
      matchRight(`a<!--[if gte mso 9]>x<![endif]-->z`, 19, ["<!-->"], {
        trimBeforeMatching: true,
        maxMismatches: 1,
      }),
      false,
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, one mismatch`,
  (t) => {
    t.equal(
      matchRightIncl(`<!--[if gte mso 9]>x<1[endif]-->`, 20, ["<![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "<![endif]",
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`,
  (t) => {
    t.equal(
      matchRightIncl(`<!--[if gte mso 9]>x<1[endf]-->`, 20, ["<![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "<![endif]",
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<[endif]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "![endif]",
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<endif]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "![endif]",
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<endif-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      false,
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<ndif]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      false,
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<[ndif-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      false,
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`abc<!--[if gte mso 9]><xml>`, 3, ["!--"], {
        maxMismatches: 1,
        firstMustMatch: true,
        trimBeforeMatching: true,
      }),
      "!--",
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}     opts.maxMismatches - 3-char string`,
  (t) => {
    t.equal(matchRight("abcdef", 1, ["cde"]), "cde", "21.01");

    // first char, "c" mismatching
    t.equal(matchRight("ab.def", 1, ["cde"]), false, "21.02");
    t.equal(
      matchRight("ab.def", 1, ["cde"], { maxMismatches: 1 }),
      false,
      "21.03"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], { maxMismatches: 1, hungry: false }),
      false,
      "21.04"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        hungry: true,
      }),
      "cde",
      "21.05"
    );

    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "21.06"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "21.07"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      false,
      "21.08"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      false,
      "21.09"
    );

    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
        hungry: true,
      }),
      false,
      "21.10"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
        hungry: true,
      }),
      false,
      "21.11"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
        hungry: true,
      }),
      "cde",
      "21.12"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
        hungry: true,
      }),
      "cde",
      "21.13"
    );

    // second char, "d" mismatching
    t.equal(matchRight("abc.ef", 1, ["cde"]), false, "21.14");
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "21.15"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      "cde",
      "21.16"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "21.17"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cde",
      "21.18"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "21.19"
    );

    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        hungry: true,
      }),
      "cde",
      "21.20"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
        hungry: true,
      }),
      "cde",
      "21.21"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
        hungry: true,
      }),
      "cde",
      "21.22"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
        hungry: true,
      }),
      "cde",
      "21.23"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
        hungry: true,
      }),
      "cde",
      "21.24"
    );

    // third char, "e" mismatching
    t.equal(matchRight("abcd.f", 1, ["cde"]), false, "21.25");
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "21.26"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "21.27"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "21.28"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      false,
      "21.29"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "21.30"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1 + lastMustMatch`,
  (t) => {
    t.equal(
      matchRight(`><!--z>`, 0, ["<!-->"], {
        trimBeforeMatching: true,
        maxMismatches: 1,
        lastMustMatch: true,
      }),
      "<!-->",
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(
        `a<!--[if]><z>
<AAAch>>
</o:Offict`,
        1,
        ["![cdata"],
        {
          i: true,
          maxMismatches: 1,
          trimBeforeMatching: true,
        }
      ),
      false,
      "23"
    );
    t.end();
  }
);
