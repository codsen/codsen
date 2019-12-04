const t = require("tap");
const rare = require("../dist/ranges-regex.cjs");
const rangesApply = require("ranges-apply");

// ==============================
// 0. THROWS
// ==============================

t.test("00.01 - first input argument is missing", t => {
  // throw pinning:
  const error1 = t.throws(() => {
    rare();
  });
  t.ok(error1.message.includes("THROW_ID_01"));

  // with second arg:
  const error2 = t.throws(() => {
    rare(undefined, "zzzzz");
  });
  t.ok(error2.message.includes("THROW_ID_01"));

  // with third arg:
  const error3 = t.throws(() => {
    rare(undefined, undefined, "zzzzz");
  });
  t.ok(error3.message.includes("THROW_ID_01"));

  // with both second and third arg:
  const error4 = t.throws(() => {
    rare(undefined, "yyyyy", "zzzzz");
  });
  t.ok(error4.message.includes("THROW_ID_01"));

  t.end();
});

t.test("00.02 - first input argument is not a regex", t => {
  // throw pinning:
  const error1 = t.throws(() => {
    rare("zzzz", "yyyy");
  });
  t.ok(error1.message.includes("THROW_ID_02"));

  // with third arg:
  const error2 = t.throws(() => {
    rare("zzzz", "yyyy", "xxxxx");
  });
  t.ok(error2.message.includes("THROW_ID_02"));

  t.end();
});

t.test("00.03 - second input argument is missing", t => {
  // throw pinning:
  const error1 = t.throws(() => {
    rare(/z/g);
  });
  t.ok(error1.message.includes("THROW_ID_03"));

  // plus third arg:
  const error2 = t.throws(() => {
    rare(/z/g, undefined, "zzzz");
  });
  t.ok(error2.message.includes("THROW_ID_03"));

  t.end();
});

t.test("00.04 - second input argument is not string", t => {
  // throw pinning:
  const error1 = t.throws(() => {
    rare(/z/g, true);
  });
  t.ok(error1.message.includes("THROW_ID_03"));

  // with third arg:
  const error2 = t.throws(() => {
    rare(/z/g, true, "zzzzzz");
  });
  t.ok(error2.message.includes("THROW_ID_03"));

  t.end();
});

// ==============================
// 01. B.A.U.
// ==============================

t.t.test(`01.01 - crops out few ranges outside the strlen`, t => {
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij"),
    [
      [3, 6],
      [14, 17]
    ],
    "01.01.01"
  );
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij", "yo"),
    [
      [3, 6, "yo"],
      [14, 17, "yo"]
    ],
    "01.01.02"
  );
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij", null),
    [
      [3, 6, null],
      [14, 17, null]
    ],
    "01.01.03"
  );
  t.same(
    rare(/def/g, "abcdefghij_abcdefghij", ""),
    [
      [3, 6],
      [14, 17]
    ],
    "01.01.04 - empty string is omitted by defa"
  );

  t.end();
});

t.t.test(`01.02 - nothing found`, t => {
  t.same(rare(/def/g, ""), null, "01.02.01");
  t.same(rare(/def/g, "", "yo"), null, "01.02.02");
  t.same(rare(/def/g, "", null), null, "01.02.03");
  t.end();
});

t.t.test(
  `01.03 - result ranges are consecutive so their ranges are merged into one`,
  t => {
    const reg = /def/g;
    const str = "abcdefdefghij_abcdefghij";
    t.same(
      rare(reg, str),
      [
        [3, 9],
        [17, 20]
      ],
      "01.03.01"
    );
    t.equal(rangesApply(str, rare(reg, str)), str.replace(reg, ""), "01.03.02");
    t.end();
  }
);

t.t.test(`01.04 - no findings - returns null`, t => {
  const reg = /yyy/g;
  const str = "zzzzzzzz";
  t.equal(rare(reg, str), null, "01.04.01");
  t.equal(rare(reg, str, "yo"), null, "01.04.02");
  t.end();
});
