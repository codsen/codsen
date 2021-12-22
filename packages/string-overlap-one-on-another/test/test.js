import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { overlap } from "../dist/string-overlap-one-on-another.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - wrong inputs throw", () => {
  throws(() => {
    overlap(true, "z");
  }, /THROW_ID_01/);

  throws(() => {
    overlap("z", true);
  }, /THROW_ID_02/);

  throws(() => {
    overlap("z", "z", true);
  }, /THROW_ID_03/);

  throws(() => {
    overlap("z", "z", { offset: 1.2 });
  }, /THROW_ID_04/);

  throws(() => {
    overlap("z", "z", { offset: -1.2 });
  }, /THROW_ID_04/);
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("02 - no offset", () => {
  equal(overlap("123", "b"), "b23", "02.01");
  equal(overlap("123", "bb"), "bb3", "02.02");
  equal(overlap("123", "bbb"), "bbb", "02.03");
  equal(overlap("123", "bbbb"), "bbbb", "02.04");

  // hardcoded offset
  equal(overlap("123", "b", { offset: 0 }), "b23", "02.05");
  equal(overlap("123", "bb", { offset: 0 }), "bb3", "02.06");
  equal(overlap("123", "bbb", { offset: 0 }), "bbb", "02.07");
  equal(overlap("123", "bbbb", { offset: 0 }), "bbbb", "02.08");
});

test("03 - empty strings", () => {
  // str2
  equal(overlap("123", ""), "123", "03.01");
  equal(overlap("123", "", { offset: 0 }), "123", "03.02");

  // str1
  equal(overlap("", "456"), "456", "03.03");
  equal(overlap("", "456", { offset: 0 }), "456", "03.04");
  equal(
    overlap("", "456", { offset: 99, offsetFillerCharacter: "zzzz" }),
    "456",
    "03.05"
  );

  // both
  equal(overlap("", ""), "", "03.06");
  equal(overlap("", "", { offset: 0 }), "", "03.07");
});

test("04 - positive offset", () => {
  equal(overlap("123", "b", { offset: 1 }), "1b3", "04.01");
  equal(overlap("123", "b", { offset: 2 }), "12b", "04.02");
  equal(overlap("123", "b", { offset: 3 }), "123b", "04.03");
  equal(overlap("123", "b", { offset: 4 }), "123 b", "04.04");
  equal(
    overlap("123", "b", { offset: 4, offsetFillerCharacter: "_" }),
    "123_b",
    "04.05"
  );
  equal(
    overlap("123", "b", { offset: 4, offsetFillerCharacter: false }),
    "123 b",
    "04.06"
  );
  equal(
    overlap("123", "b", { offset: 4, offsetFillerCharacter: null }),
    "123 b",
    "04.07"
  );
  equal(
    overlap("123", "b", { offset: 5, offsetFillerCharacter: "_" }),
    "123__b",
    "04.08"
  );
  equal(
    overlap("123", "b", { offset: 5, offsetFillerCharacter: "" }),
    "123b",
    "04.09"
  );
  equal(
    overlap("123", "b", { offset: 99, offsetFillerCharacter: "" }),
    "123b",
    "04.10"
  );
});

test("05 - negative offset", () => {
  equal(overlap("123", "b", { offset: -2 }), "b 123", "05.01");
  equal(
    overlap("123", "b", { offset: -2, offsetFillerCharacter: "-" }),
    "b-123",
    "05.02"
  );
  equal(overlap("123", "b", { offset: -1 }), "b123", "05.03");
  equal(overlap("123", "abc", { offset: -2 }), "abc23", "05.04");
  equal(overlap("123", "abcd", { offset: -2 }), "abcd3", "05.05");
  equal(overlap("123", "abcde", { offset: -2 }), "abcde", "05.06");
  equal(overlap("123", "abcdef", { offset: -2 }), "abcdef", "05.07");
  equal(overlap("123", "b", { offset: -5 }), "b    123", "05.08");
});

test.run();
