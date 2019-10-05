import test from "ava";
import overlap from "../dist/string-overlap-one-on-another.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01.01 - wrong inputs throw", t => {
  const error1 = t.throws(() => {
    overlap(true, "z");
  });
  t.regex(error1.message, /THROW_ID_01/);

  const error2 = t.throws(() => {
    overlap("z", true);
  });
  t.regex(error2.message, /THROW_ID_02/);

  const error3 = t.throws(() => {
    overlap("z", "z", true);
  });
  t.regex(error3.message, /THROW_ID_03/);

  const error4 = t.throws(() => {
    overlap("z", "z", { offset: 1.2 });
  });
  t.regex(error4.message, /THROW_ID_04/);

  const error5 = t.throws(() => {
    overlap("z", "z", { offset: -1.2 });
  });
  t.regex(error5.message, /THROW_ID_04/);
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("02.01 - no offset", t => {
  t.is(overlap("123", "b"), "b23", "02.01.01");
  t.is(overlap("123", "bb"), "bb3", "02.01.02");
  t.is(overlap("123", "bbb"), "bbb", "02.01.03");
  t.is(overlap("123", "bbbb"), "bbbb", "02.01.04");

  // hardcoded offset
  t.is(overlap("123", "b", { offset: 0 }), "b23", "02.01.05");
  t.is(overlap("123", "bb", { offset: 0 }), "bb3", "02.01.06");
  t.is(overlap("123", "bbb", { offset: 0 }), "bbb", "02.01.07");
  t.is(overlap("123", "bbbb", { offset: 0 }), "bbbb", "02.01.08");
});

test("02.02 - empty strings", t => {
  // str2
  t.is(overlap("123", ""), "123", "02.02.01");
  t.is(overlap("123", "", { offset: 0 }), "123", "02.02.02");

  // str1
  t.is(overlap("", "456"), "456", "02.02.03");
  t.is(overlap("", "456", { offset: 0 }), "456", "02.02.04");
  t.is(
    overlap("", "456", { offset: 99, offsetFillerCharacter: "zzzz" }),
    "456",
    "02.02.05"
  );

  // both
  t.is(overlap("", ""), "", "02.02.06");
  t.is(overlap("", "", { offset: 0 }), "", "02.02.07");
});

test("02.03 - positive offset", t => {
  t.is(overlap("123", "b", { offset: 1 }), "1b3", "02.03.01");
  t.is(overlap("123", "b", { offset: 2 }), "12b", "02.03.02");
  t.is(overlap("123", "b", { offset: 3 }), "123b", "02.03.03");
  t.is(overlap("123", "b", { offset: 4 }), "123 b", "02.03.04");
  t.is(
    overlap("123", "b", { offset: 4, offsetFillerCharacter: "_" }),
    "123_b",
    "02.03.05"
  );
  t.is(
    overlap("123", "b", { offset: 4, offsetFillerCharacter: false }),
    "123 b",
    "02.03.06"
  );
  t.is(
    overlap("123", "b", { offset: 4, offsetFillerCharacter: null }),
    "123 b",
    "02.03.07"
  );
  t.is(
    overlap("123", "b", { offset: 5, offsetFillerCharacter: "_" }),
    "123__b",
    "02.03.08"
  );
  t.is(
    overlap("123", "b", { offset: 5, offsetFillerCharacter: "" }),
    "123b",
    "02.03.09"
  );
  t.is(
    overlap("123", "b", { offset: 99, offsetFillerCharacter: "" }),
    "123b",
    "02.03.10"
  );
});

test("02.04 - negative offset", t => {
  t.is(overlap("123", "b", { offset: -2 }), "b 123", "02.04.01");
  t.is(
    overlap("123", "b", { offset: -2, offsetFillerCharacter: "-" }),
    "b-123",
    "02.04.02"
  );
  t.is(overlap("123", "b", { offset: -1 }), "b123", "02.04.03");
  t.is(overlap("123", "abc", { offset: -2 }), "abc23", "02.04.04");
  t.is(overlap("123", "abcd", { offset: -2 }), "abcd3", "02.04.05");
  t.is(overlap("123", "abcde", { offset: -2 }), "abcde", "02.04.06");
  t.is(overlap("123", "abcdef", { offset: -2 }), "abcdef", "02.04.07");
  t.is(overlap("123", "b", { offset: -5 }), "b    123", "02.04.08");
});
