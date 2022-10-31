import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  // matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// matchRight()
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`, () => {
  equal(matchRight("abcdef", 2, "d"), "d", "01.01");
  equal(matchRight("abcdef", 2, ["d"]), "d", "01.02");
  equal(matchRight("abcdef", 2, "def"), "def", "01.03");
  equal(matchRight("abcdef", 2, ["def"]), "def", "01.04");
  equal(matchRight("abcdef", 2, ["defg"]), false, "01.05");

  equal(matchRight("abcdef", 99, ["defg"]), false, "01.06");

  equal(
    matchRight("ab      cdef", 1, "cd", { trimBeforeMatching: true }),
    "cd",
    "01.07"
  );

  matchRight("ab      cdef", 1, "cd", {
    trimBeforeMatching: true,
    cb: (char, theRemainderOfTheString, index) => {
      equal(char, "e");
      equal(theRemainderOfTheString, "ef");
      equal(index, 10);
    },
  });
});

test(`02 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`, () => {
  equal(matchRight("abcdef", 0, "b"), "b", "02.01");
  equal(matchRight("abcdef", 0, ["b"]), "b", "02.02");
  equal(matchRight("abcdef", 0, ["bc"]), "bc", "02.03");
  equal(matchRight("abcdef", 0, ["hfd", "ghja", "bc"]), "bc", "02.04");
});

test(`03 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, case insensitive`, () => {
  equal(matchRight("abcdef", 2, "D"), false, "03.01");
  equal(matchRight("abcdef", 2, "D", { i: true }), "D", "03.02");
  equal(matchRight("abcdef", 2, ["D"], { i: true }), "D", "03.03");
  equal(matchRight("abcdef", 2, ["gDSS", "D"], { i: true }), "D", "03.04");
});

test(`04 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         adhoc test #1`, () => {
  equal(
    matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 13, ">"),
    ">",
    "04.01"
  );
  equal(
    matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 10, ">"),
    false,
    "04.02"
  );
});

test(`05 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char`, () => {
  equal(
    matchRight("a<!->z", 0, ["<!-->"], {
      maxMismatches: 1,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, "z");
        equal(theRemainderOfTheString, "z");
        equal(index, 5);
        return true;
      },
    }),
    "<!-->",
    "05.01"
  );
  equal(
    matchRightIncl("a<!->z", 1, ["<!-->"], {
      maxMismatches: 1,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, "z");
        equal(theRemainderOfTheString, "z");
        equal(index, 5);
        return true;
      },
    }),
    "<!-->",
    "05.02"
  );
});

test(`06 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char, space follows`, () => {
  equal(
    matchRight("a<!-> ", 0, ["<!-->"], {
      maxMismatches: 1,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, " ");
        equal(theRemainderOfTheString, " ");
        equal(index, 5);
        return true;
      },
    }),
    "<!-->",
    "06.01"
  );
  equal(
    matchRightIncl("a<!-> ", 1, ["<!-->"], {
      maxMismatches: 1,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, " ");
        equal(theRemainderOfTheString, " ");
        equal(index, 5);
        return true;
      },
    }),
    "<!-->",
    "06.02"
  );
});

test(`07 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char, EOF follows`, () => {
  equal(
    matchRight("a<!->", 0, ["<!-->"], {
      maxMismatches: 1,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, undefined);
        equal(theRemainderOfTheString, "");
        equal(index, 5);
        return true;
      },
    }),
    "<!-->",
    "07.01"
  );
  equal(
    matchRightIncl("a<!->", 1, ["<!-->"], {
      maxMismatches: 1,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, undefined);
        equal(theRemainderOfTheString, "");
        equal(index, 5);
        return true;
      },
    }),
    "<!-->",
    "07.02"
  );
});

test(`08 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, fail`, () => {
  equal(
    matchRight("a<--b", 1, ["!--"], {
      maxMismatches: 1,
      trimBeforeMatching: true,
    }),
    "!--",
    "08.01"
  );
});

test(`09 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, pass`, () => {
  // enforcing the exclamation mark:
  equal(
    matchRight("a<--b", 1, ["!--"], {
      maxMismatches: 1,
      trimBeforeMatching: true,
      firstMustMatch: true,
    }),
    false,
    "09.01"
  );
});

test(`10 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, succeed`, () => {
  equal(
    matchRight("a<!-b", 1, ["!--"], {
      maxMismatches: 1,
      trimBeforeMatching: true,
    }),
    "!--",
    "10.01"
  );

  // enforcing the exclamation mark:
  equal(
    matchRight("a<!-b", 1, ["!--"], {
      maxMismatches: 1,
      trimBeforeMatching: true,
      firstMustMatch: true,
    }),
    "!--",
    "10.02"
  );

  // now matchRightIncl():

  equal(
    matchRightIncl("a<!-b", 2, ["!--"], {
      maxMismatches: 1,
      trimBeforeMatching: true,
    }),
    "!--",
    "10.03"
  );

  // enforcing the exclamation mark:
  equal(
    matchRightIncl("a<!-b", 2, ["!--"], {
      maxMismatches: 1,
      trimBeforeMatching: true,
      firstMustMatch: true,
    }),
    "!--",
    "10.04"
  );
});

test(`11 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, false`, () => {
  equal(
    matchRight(`a<!--[if gte mso 9]>x<![endif]-->z`, 1, ["![cdata"], {
      i: true,
      maxMismatches: 1,
      trimBeforeMatching: true,
    }),
    false,
    "11.01"
  );
});

test(`12 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, adhoc 1`, () => {
  equal(
    matchRight(`a<!--[if gte mso 9]>x<![endif]-->z`, 19, ["<!-->"], {
      trimBeforeMatching: true,
      maxMismatches: 1,
    }),
    false,
    "12.01"
  );
});

test(`13 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, one mismatch`, () => {
  equal(
    matchRightIncl(`<!--[if gte mso 9]>x<1[endif]-->`, 20, ["<![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true,
    }),
    "<![endif]",
    "13.01"
  );
});

test(`14 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`, () => {
  equal(
    matchRightIncl(`<!--[if gte mso 9]>x<1[endf]-->`, 20, ["<![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true,
    }),
    "<![endif]",
    "14.01"
  );
});

test(`15 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`, () => {
  equal(
    matchRight(`<!--[if gte mso 9]>x<[endif]-->`, 20, ["![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true,
    }),
    "![endif]",
    "15.01"
  );
});

test(`16 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`, () => {
  equal(
    matchRight(`<!--[if gte mso 9]>x<endif]-->`, 20, ["![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true,
    }),
    "![endif]",
    "16.01"
  );
});

test(`17 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`, () => {
  equal(
    matchRight(`<!--[if gte mso 9]>x<endif-->`, 20, ["![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true,
    }),
    false,
    "17.01"
  );
});

test(`18 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`, () => {
  equal(
    matchRight(`<!--[if gte mso 9]>x<ndif]-->`, 20, ["![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true,
    }),
    false,
    "18.01"
  );
});

test(`19 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`, () => {
  equal(
    matchRight(`<!--[if gte mso 9]>x<[ndif-->`, 20, ["![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true,
    }),
    false,
    "19.01"
  );
});

test(`20 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`, () => {
  equal(
    matchRight(`abc<!--[if gte mso 9]><xml>`, 3, ["!--"], {
      maxMismatches: 1,
      firstMustMatch: true,
      trimBeforeMatching: true,
    }),
    "!--",
    "20.01"
  );
});

test(`21 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}     opts.maxMismatches - 3-char string`, () => {
  equal(matchRight("abcdef", 1, ["cde"]), "cde", "21.01");

  // first char, "c" mismatching
  equal(matchRight("ab.def", 1, ["cde"]), false, "21.02");
  equal(matchRight("ab.def", 1, ["cde"], { maxMismatches: 1 }), false, "21.03");
  equal(
    matchRight("ab.def", 1, ["cde"], { maxMismatches: 1, hungry: false }),
    false,
    "21.04"
  );
  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "cde",
    "21.05"
  );

  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "21.06"
  );
  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    false,
    "21.07"
  );
  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    false,
    "21.08"
  );
  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    false,
    "21.09"
  );

  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
      hungry: true,
    }),
    false,
    "21.10"
  );
  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
      hungry: true,
    }),
    false,
    "21.11"
  );
  equal(
    matchRight("ab.def", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
      hungry: true,
    }),
    "cde",
    "21.12"
  );
  equal(
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
  equal(matchRight("abc.ef", 1, ["cde"]), false, "21.14");
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
    }),
    "cde",
    "21.15"
  );
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    "cde",
    "21.16"
  );
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    "cde",
    "21.17"
  );
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    "cde",
    "21.18"
  );
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    "cde",
    "21.19"
  );

  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "cde",
    "21.20"
  );
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
      hungry: true,
    }),
    "cde",
    "21.21"
  );
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
      hungry: true,
    }),
    "cde",
    "21.22"
  );
  equal(
    matchRight("abc.ef", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
      hungry: true,
    }),
    "cde",
    "21.23"
  );
  equal(
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
  equal(matchRight("abcd.f", 1, ["cde"]), false, "21.25");
  equal(
    matchRight("abcd.f", 1, ["cde"], {
      maxMismatches: 1,
    }),
    "cde",
    "21.26"
  );
  equal(
    matchRight("abcd.f", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "21.27"
  );
  equal(
    matchRight("abcd.f", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    "cde",
    "21.28"
  );
  equal(
    matchRight("abcd.f", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    false,
    "21.29"
  );
  equal(
    matchRight("abcd.f", 1, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    "cde",
    "21.30"
  );
});

test(`22 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1 + lastMustMatch`, () => {
  equal(
    matchRight(`><!--z>`, 0, ["<!-->"], {
      trimBeforeMatching: true,
      maxMismatches: 1,
      lastMustMatch: true,
    }),
    "<!-->",
    "22.01"
  );
});

test(`23 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`, () => {
  equal(
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
    "23.01"
  );
});

test.run();
