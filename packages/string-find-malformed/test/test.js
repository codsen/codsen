import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { findMalformed } from "../dist/string-find-malformed.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - throws when the first argument, source string, is not a string", () => {
  throws(
    () => {
      findMalformed(1);
    },
    /THROW_ID_01/,
    "01.01"
  );

  // more resembling real-life:
  throws(
    () => {
      findMalformed(
        1,
        "a",
        () => {
          console.log("yo");
        },
        null
      );
    },
    /THROW_ID_01/,
    "01.02"
  );
});

test("02 - throws when the second argument, ref string, is not a string", () => {
  throws(
    () => {
      findMalformed("aaa", 1);
    },
    /THROW_ID_02/,
    "02.01"
  );

  // more resembling real-life:
  throws(
    () => {
      findMalformed(
        "a",
        1,
        () => {
          console.log("yo");
        },
        null
      );
    },
    /THROW_ID_02/,
    "02.02"
  );
});

test("03 - throws when the third argument, callback, is not a function", () => {
  throws(
    () => {
      findMalformed("aaa", "zzz", 1);
    },
    /THROW_ID_03/,
    "03.01"
  );

  throws(
    () => {
      findMalformed("a", "b", "c", null);
    },
    /THROW_ID_03/,
    "03.02"
  );
});

test("04 - throws when the fourth argument, optional options object, is not a plain object", () => {
  throws(
    () => {
      findMalformed("aaa", "bbb", () => {}, "ccc");
    },
    /THROW_ID_04/,
    "04.01"
  );
});

test("05 - throws when opts.stringOffset is not a number", () => {
  throws(
    () => {
      findMalformed("aaa", "bbb", () => {}, { stringOffset: "ccc" });
    },
    /THROW_ID_05/,
    "05.01"
  );
});

test("06 - empty string", () => {
  let gathered = [];
  findMalformed("", "bde", (obj) => {
    gathered.push(obj);
  });
  equal(gathered, [], "06.01");
});

test("07 - empty string", () => {
  let gathered = [];
  findMalformed("abc", "", (obj) => {
    gathered.push(obj);
  });
  equal(gathered, [], "07.01");
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test('08 - rogue character, "c"', () => {
  let gathered = [];
  findMalformed("abcdef", "bde", (obj) => {
    gathered.push(obj);
  });
  equal(
    gathered,
    [
      {
        idxFrom: 1,
        idxTo: 5,
      },
    ],
    "08.01"
  );
});

test("09 - overlapping and extended maxDistance", () => {
  let gathered = [];
  findMalformed(
    "abcabcd.f",
    "abcdef",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 2,
    }
  );
  equal(
    gathered,
    [
      {
        idxFrom: 3,
        idxTo: 9,
      },
    ],
    "09.01"
  );
});

test("10 - with opts.stringOffset", () => {
  let gathered = [];
  findMalformed(
    "<div><!-something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 1,
      stringOffset: 100,
    }
  );
  equal(
    gathered,
    [
      {
        idxFrom: 105,
        idxTo: 108,
      },
    ],
    "10.01"
  );
});

test("11 - correct, fully matching value is not pinged", () => {
  let gathered = [];
  findMalformed(
    "<div><!--something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 1,
      stringOffset: 100,
    }
  );
  equal(gathered, [], "11.01");
});

test("12 - like before but strings in opts", () => {
  let gathered = [];
  findMalformed(
    "<div><!-\n\n\n-something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: "1",
      stringOffset: "100",
    }
  );
  equal(
    gathered,
    [
      {
        idxFrom: 105,
        idxTo: 112,
      },
    ],
    "12.01"
  );
});

test("13 - whitespace", () => {
  let gathered = [];
  findMalformed(
    "<div>< ! - -something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    null
  );
  equal(
    gathered,
    [
      {
        idxFrom: 5,
        idxTo: 12,
      },
    ],
    "13.01"
  );
});

test("14 - repeated characters after failed match", () => {
  let gathered = [];
  findMalformed(
    "<--z",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    null
  );
  equal(
    gathered,
    [
      {
        idxFrom: 0,
        idxTo: 3,
      },
    ],
    "14.01"
  );
});

test("15 - repeated characters after failed match", () => {
  let gathered = [];
  findMalformed(
    "<!-[if mso]>",
    "<!--[",
    (obj) => {
      gathered.push(obj);
    },
    null
  );
  equal(
    gathered,
    [
      {
        idxFrom: 0,
        idxTo: 4,
      },
    ],
    "15.01"
  );
});

test.run();
