import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rApply } from "ranges-apply";

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
});

// ==============================
// 01. B.A.U.
// ==============================

test("06 - crops out few ranges outside the strlen", () => {
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij"),
    [
      [3, 6],
      [14, 17],
    ],
    "06.01",
  );
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij", "yo"),
    [
      [3, 6, "yo"],
      [14, 17, "yo"],
    ],
    "06.02",
  );
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij", null),
    [
      [3, 6, null],
      [14, 17, null],
    ],
    "06.03",
  );
  equal(
    rRegex(/def/g, "abcdefghij_abcdefghij", ""),
    [
      [3, 6],
      [14, 17],
    ],
    "06.04",
  );
});

test("07 - nothing found", () => {
  equal(rRegex(/def/g, ""), null, "07.01");
  equal(rRegex(/def/g, "", "yo"), null, "07.02");
  equal(rRegex(/def/g, "", null), null, "07.03");
});

test("08 - result ranges are consecutive so their ranges are merged into one", () => {
  let reg = /def/g;
  let str = "abcdefdefghij_abcdefghij";
  equal(
    rRegex(reg, str),
    [
      [3, 9],
      [17, 20],
    ],
    "08.01",
  );
  equal(rApply(str, rRegex(reg, str)), str.replace(reg, ""), "08.02");
});

test("09 - no findings - returns null", () => {
  let reg = /yyy/g;
  let str = "zzzzzzzz";
  equal(rRegex(reg, str), null, "09.01");
  equal(rRegex(reg, str, "yo"), null, "09.02");
});

test.run();
