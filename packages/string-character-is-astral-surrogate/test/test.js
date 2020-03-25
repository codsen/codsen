const t = require("tap");
const {
  isHighSurrogate,
  isLowSurrogate,
} = require("../dist/string-character-is-astral-surrogate.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01.01 - wrong/missing input = throw", (t) => {
  t.throws(() => {
    isHighSurrogate(1);
  });
  t.throws(() => {
    isHighSurrogate(null);
  });
  t.throws(() => {
    isHighSurrogate(true);
  });

  t.throws(() => {
    isLowSurrogate(1);
  });
  t.throws(() => {
    isLowSurrogate(null);
  });
  t.throws(() => {
    isLowSurrogate(true);
  });
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

// undefined must yield false - that's to make the life easier when
// checking the "next character". If it doesn't exist, it will be
// "false" and as far as the issue of surrogates is concerned, it's
// "false". This will save us from otherwise unnecessary if-else
// statements during traversal.
t.test("02.01 - undefined yields false", (t) => {
  t.same(isHighSurrogate(undefined), false, "02.01.01");
  t.same(isLowSurrogate(undefined), false, "02.01.02");
  t.end();
});

t.test("02.02 - empty string yields false", (t) => {
  t.same(isHighSurrogate(""), false, "02.02.01");
  t.same(isLowSurrogate(""), false, "02.02.02");
  t.end();
});

t.test("02.03 - isHighSurrogate()", (t) => {
  t.same(isHighSurrogate("zzz"), false, "02.03.01");
  // 🧢 = \uD83E\uDDE2
  t.same(isHighSurrogate("\uD83E"), true, "02.03.02");
  t.same(isHighSurrogate("\uDDE2"), false, "02.03.03");
  t.same(
    isHighSurrogate("\uD83E\uDDE2"),
    true,
    "02.03.04" // second Unicode code point (and onwards) doesn't matter
  );
  t.end();
});

t.test("02.04 - isLowSurrogate()", (t) => {
  t.same(isLowSurrogate("zzz"), false, "02.04.01");
  // 🧢 = \uD83E\uDDE2
  t.same(isLowSurrogate("\uD83E"), false, "02.04.02");
  t.same(isLowSurrogate("\uDDE2"), true, "02.04.03");
  t.same(
    isLowSurrogate("\uD83E\uDDE2"),
    false,
    "02.04.04" // second Unicode code point (and onwards) doesn't matter
  );
  t.end();
});
