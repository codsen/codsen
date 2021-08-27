import tap from "tap";
import { rApply } from "ranges-apply";
import { rRegex } from "../dist/ranges-regex.esm.js";

// ==============================
// 0. THROWS
// ==============================

tap.test("01 - first input argument is missing", (t) => {
  // throw pinning:
  t.throws(() => {
    rRegex();
  }, /THROW_ID_01/);

  // with second arg:
  t.throws(() => {
    rRegex(undefined, "zzzzz");
  }, /THROW_ID_01/);

  // with third arg:
  t.throws(() => {
    rRegex(undefined, undefined, "zzzzz");
  }, /THROW_ID_01/);

  // with both second and third arg:
  t.throws(() => {
    rRegex(undefined, "yyyyy", "zzzzz");
  }, /THROW_ID_01/);

  t.end();
});

tap.test("02 - first input argument is not a regex", (t) => {
  // throw pinning:
  t.throws(() => {
    rRegex("zzzz", "yyyy");
  }, /THROW_ID_02/);

  // with third arg:
  t.throws(() => {
    rRegex("zzzz", "yyyy", "xxxxx");
  }, /THROW_ID_02/);

  t.end();
});

tap.test("03 - second input argument is missing", (t) => {
  // throw pinning:
  t.throws(() => {
    rRegex(/z/g);
  }, /THROW_ID_03/);

  // plus third arg:
  t.throws(() => {
    rRegex(/z/g, undefined, "zzzz");
  }, /THROW_ID_03/);

  t.end();
});

tap.test("04 - second input argument is not string", (t) => {
  // throw pinning:
  t.throws(() => {
    rRegex(/z/g, true);
  }, /THROW_ID_03/);

  // with third arg:
  t.throws(() => {
    rRegex(/z/g, true, "zzzzzz");
  }, /THROW_ID_03/);

  t.end();
});

tap.test("05 - third input argument is present and is not string", (t) => {
  // throw pinning:
  t.throws(() => {
    rRegex(/def/g, "abcdefghij_abcdefghij", true);
  }, /THROW_ID_04/);

  t.end();
});

// ==============================
// 01. B.A.U.
// ==============================

tap.test(`06 - crops out few ranges outside the strlen`, (t) => {
  t.strictSame(
    rRegex(/def/g, "abcdefghij_abcdefghij"),
    [
      [3, 6],
      [14, 17],
    ],
    "06.01"
  );
  t.strictSame(
    rRegex(/def/g, "abcdefghij_abcdefghij", "yo"),
    [
      [3, 6, "yo"],
      [14, 17, "yo"],
    ],
    "06.02"
  );
  t.strictSame(
    rRegex(/def/g, "abcdefghij_abcdefghij", null),
    [
      [3, 6, null],
      [14, 17, null],
    ],
    "06.03"
  );
  t.strictSame(
    rRegex(/def/g, "abcdefghij_abcdefghij", ""),
    [
      [3, 6],
      [14, 17],
    ],
    "06.04 - empty string is omitted by defa"
  );

  t.end();
});

tap.test(`07 - nothing found`, (t) => {
  t.strictSame(rRegex(/def/g, ""), null, "07.01");
  t.strictSame(rRegex(/def/g, "", "yo"), null, "07.02");
  t.strictSame(rRegex(/def/g, "", null), null, "07.03");
  t.end();
});

tap.test(
  `08 - result ranges are consecutive so their ranges are merged into one`,
  (t) => {
    const reg = /def/g;
    const str = "abcdefdefghij_abcdefghij";
    t.strictSame(
      rRegex(reg, str),
      [
        [3, 9],
        [17, 20],
      ],
      "08.01"
    );
    t.equal(rApply(str, rRegex(reg, str)), str.replace(reg, ""), "08.02");
    t.end();
  }
);

tap.test(`09 - no findings - returns null`, (t) => {
  const reg = /yyy/g;
  const str = "zzzzzzzz";
  t.equal(rRegex(reg, str), null, "09.01");
  t.equal(rRegex(reg, str, "yo"), null, "09.02");
  t.end();
});
