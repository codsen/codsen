import tap from "tap";
import rangesApply from "ranges-apply";
import rare from "../dist/ranges-regex.esm";

// ==============================
// 0. THROWS
// ==============================

tap.test("01 - first input argument is missing", (t) => {
  // throw pinning:
  t.throws(() => {
    rare();
  }, /THROW_ID_01/);

  // with second arg:
  t.throws(() => {
    rare(undefined, "zzzzz");
  }, /THROW_ID_01/);

  // with third arg:
  t.throws(() => {
    rare(undefined, undefined, "zzzzz");
  }, /THROW_ID_01/);

  // with both second and third arg:
  t.throws(() => {
    rare(undefined, "yyyyy", "zzzzz");
  }, /THROW_ID_01/);

  t.end();
});

tap.test("02 - first input argument is not a regex", (t) => {
  // throw pinning:
  t.throws(() => {
    rare("zzzz", "yyyy");
  }, /THROW_ID_02/);

  // with third arg:
  t.throws(() => {
    rare("zzzz", "yyyy", "xxxxx");
  }, /THROW_ID_02/);

  t.end();
});

tap.test("03 - second input argument is missing", (t) => {
  // throw pinning:
  t.throws(() => {
    rare(/z/g);
  }, /THROW_ID_03/);

  // plus third arg:
  t.throws(() => {
    rare(/z/g, undefined, "zzzz");
  }, /THROW_ID_03/);

  t.end();
});

tap.test("04 - second input argument is not string", (t) => {
  // throw pinning:
  t.throws(() => {
    rare(/z/g, true);
  }, /THROW_ID_03/);

  // with third arg:
  t.throws(() => {
    rare(/z/g, true, "zzzzzz");
  }, /THROW_ID_03/);

  t.end();
});

tap.test("05 - third input argument is present and is not string", (t) => {
  // throw pinning:
  t.throws(() => {
    rare(/def/g, "abcdefghij_abcdefghij", true);
  }, /THROW_ID_04/);

  t.end();
});

// ==============================
// 01. B.A.U.
// ==============================

tap.test(`06 - crops out few ranges outside the strlen`, (t) => {
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij"),
    [
      [3, 6],
      [14, 17],
    ],
    "06.01"
  );
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij", "yo"),
    [
      [3, 6, "yo"],
      [14, 17, "yo"],
    ],
    "06.02"
  );
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij", null),
    [
      [3, 6, null],
      [14, 17, null],
    ],
    "06.03"
  );
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij", ""),
    [
      [3, 6],
      [14, 17],
    ],
    "06.04 - empty string is omitted by defa"
  );

  t.end();
});

tap.test(`07 - nothing found`, (t) => {
  t.same(rare(/def/g, ""), null, "07.01");
  t.same(rare(/def/g, "", "yo"), null, "07.02");
  t.same(rare(/def/g, "", null), null, "07.03");
  t.end();
});

tap.test(
  `08 - result ranges are consecutive so their ranges are merged into one`,
  (t) => {
    const reg = /def/g;
    const str = "abcdefdefghij_abcdefghij";
    t.same(
      rare(reg, str),
      [
        [3, 9],
        [17, 20],
      ],
      "08.01"
    );
    t.equal(rangesApply(str, rare(reg, str)), str.replace(reg, ""), "08.02");
    t.end();
  }
);

tap.test(`09 - no findings - returns null`, (t) => {
  const reg = /yyy/g;
  const str = "zzzzzzzz";
  t.equal(rare(reg, str), null, "09.01");
  t.equal(rare(reg, str, "yo"), null, "09.02");
  t.end();
});
