// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import vm from "node:vm";

import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { rRegex } from "../dist/ranges-regex.esm.js";

// ==============================
// 0. THROWS
// ==============================

test("01 - first input argument is missing", () => {
  // throw pinning:
  throws(
    () => {
      rRegex();
    },
    /THROW_ID_01/,
    "01.01",
  );

  // with second arg:
  throws(
    () => {
      rRegex(undefined, "zzzzz");
    },
    /THROW_ID_01/,
    "01.02",
  );

  // with third arg:
  throws(
    () => {
      rRegex(undefined, undefined, "zzzzz");
    },
    /THROW_ID_01/,
    "01.03",
  );

  // with both second and third arg:
  throws(
    () => {
      rRegex(undefined, "yyyyy", "zzzzz");
    },
    /THROW_ID_01/,
    "01.04",
  );
});

test("02 - first input argument is not a regex", () => {
  // throw pinning:
  throws(
    () => {
      rRegex("zzzz", "yyyy");
    },
    /THROW_ID_02/,
    "02.01",
  );

  // with third arg:
  throws(
    () => {
      rRegex("zzzz", "yyyy", "xxxxx");
    },
    /THROW_ID_02/,
    "02.02",
  );
});

test("03 - second input argument is missing", () => {
  // throw pinning:
  throws(
    () => {
      rRegex(/z/g);
    },
    /THROW_ID_03/,
    "03.01",
  );

  // plus third arg:
  throws(
    () => {
      rRegex(/z/g, undefined, "zzzz");
    },
    /THROW_ID_03/,
    "03.02",
  );
});

test("04 - second input argument is not string", () => {
  // throw pinning:
  throws(
    () => {
      rRegex(/z/g, true);
    },
    /THROW_ID_03/,
    "04.01",
  );

  // with third arg:
  throws(
    () => {
      rRegex(/z/g, true, "zzzzzz");
    },
    /THROW_ID_03/,
    "04.02",
  );
});

test("05 - third input argument is present and is not string", () => {
  // throw pinning:
  throws(
    () => {
      rRegex(/def/g, "abcdefghij_abcdefghij", true);
    },
    /THROW_ID_04/,
    "05.01",
  );
  throws(
    () => {
      rRegex(/def/g, "abcdefghij_abcdefghij", false);
    },
    /THROW_ID_04/,
    "05.02",
  );
  throws(
    () => {
      rRegex(/def/g, "abcdefghij_abcdefghij", 0);
    },
    /THROW_ID_04/,
    "05.03",
  );
});

test("06 - first input regex is not global", () => {
  throws(
    () => {
      rRegex(/def/, "abcdef");
    },
    /THROW_ID_05/,
    "06.01",
  );
  throws(
    () => {
      rRegex(/def/y, "abcdef");
    },
    /THROW_ID_05/,
    "06.02",
  );
});

// ==============================
// 01. B.A.U.
// ==============================

test("07 - crops out few ranges outside the strlen", () => {
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij"),
    [
      [3, 6],
      [14, 17],
    ],
    "07.01",
  );
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij", "yo"),
    [
      [3, 6, "yo"],
      [14, 17, "yo"],
    ],
    "07.02",
  );
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij", null),
    [
      [3, 6, null],
      [14, 17, null],
    ],
    "07.03",
  );
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij", ""),
    [
      [3, 6],
      [14, 17],
    ],
    "07.04",
  );
});

test("08 - nothing found", () => {
  equal(rRegex(/def/g, ""), null, "08.01");
  equal(rRegex(/def/g, "", "yo"), null, "08.02");
  equal(rRegex(/def/g, "", null), null, "08.03");
});

test("09 - result ranges are consecutive so their ranges are merged into one", () => {
  let reg = /def/g;
  let str = "abcdefdefghij_abcdefghij";
  equal(
    rRegex(reg, str),
    [
      [3, 9],
      [17, 20],
    ],
    "09.01",
  );
  equal(rApply(str, rRegex(reg, str)), str.replace(reg, ""), "09.02");
});

test("10 - no findings - returns null", () => {
  let reg = /yyy/g;
  let str = "zzzzzzzz";
  equal(rRegex(reg, str), null, "10.01");
  equal(rRegex(reg, str, "yo"), null, "10.02");
});

test("11 - zero-width matches advance safely", () => {
  equal(
    rRegex(/(?:)/g, "ab", "x"),
    [
      [0, 0, "x"],
      [1, 1, "x"],
      [2, 2, "x"],
    ],
    "11.01",
  );
  equal(rApply("ab", rRegex(/(?:)/g, "ab", "x")), "xaxbx", "11.02");
  equal(rRegex(/(?:)/g, "ab"), null, "11.03");
  equal(rRegex(/(?:)/g, "ab", ""), null, "11.04");
  equal(
    rRegex(/(?:)/g, "ab", null),
    [
      [0, 0, null],
      [1, 1, null],
      [2, 2, null],
    ],
    "11.05",
  );
  equal(rRegex(/^|b/g, "ab"), [[1, 2]], "11.06");
  equal(
    rRegex(/(?:)/gu, "😀", "x"),
    [
      [0, 0, "x"],
      [2, 2, "x"],
    ],
    "11.07",
  );
  equal(rRegex(/(?:)/g, "", "x"), null, "11.08");
});

test("12 - zero-width matching reads Unicode mode once", () => {
  let reads = 0;
  class CountingRegExp extends RegExp {
    get unicode() {
      reads += 1;
      return false;
    }

    get unicodeSets() {
      reads += 1;
      return false;
    }
  }

  equal(
    rRegex(new CountingRegExp("(?:)", "g"), "ab", "x"),
    [
      [0, 0, "x"],
      [1, 1, "x"],
      [2, 2, "x"],
    ],
    "12.01",
  );
  equal(reads, 2, "12.02");
});

test("13 - accepts a cross-realm regular expression", () => {
  equal(
    rRegex(vm.runInNewContext("/a/g"), "a_a"),
    [
      [0, 1],
      [2, 3],
    ],
    "13.01",
  );
});

test.run();
