import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

test("01 - empty array always yields false", () => {
  not.throws(() => {
    includesWithGlob([], "zzz", false);
  }, "01.01");
});

// ===
// BAU
// ===

test("02 - no wildcard, fails", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "thing"),
    false,
    "02.01"
  );
});

test("03 - no wildcard, succeeds", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "something"),
    true,
    "03.01"
  );
});

test("04 - wildcard, succeeds", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "*thing"),
    true,
    "04.01"
  );
  equal(
    includesWithGlob(["someTHING", "anyTHING", "everyTHING"], "*thing"),
    false,
    "04.02"
  );
  equal(
    includesWithGlob(["someThInG", "anytHInG", "everyThINg"], "*thing"),
    false,
    "04.03"
  );
});

test("05 - wildcard, fails", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], "zzz"),
    false,
    "05.01"
  );
});

test("06 - emoji everywhere", () => {
  equal(
    includesWithGlob(["xxxaxxx", "zxxxzzzzxz", "xxz"], "*a*"),
    true,
    "06.01"
  );
  equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*a*"),
    true,
    "06.02"
  );
  equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*🦄z"),
    true,
    "06.03"
  );
  equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "%%%"),
    false,
    "06.04"
  );
});

test("07 - second arg is empty string", () => {
  equal(
    includesWithGlob(["something", "anything", "everything"], ""),
    false,
    "07.01"
  );
});

test("08 - input is not array but string", () => {
  equal(includesWithGlob(["something"], "*thing"), true, "08.01");
  equal(includesWithGlob("something", "*thing"), true, "08.02");
  equal(includesWithGlob("something", "thing"), false, "08.03");
});

// =======================================================
// various combinations of different types including globs
// =======================================================

test("09 - both arrays, no wildcards", () => {
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"]
    ),
    true,
    "09.01 - default (opts ANY)"
  );
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "any",
      }
    ),
    true,
    "09.02 - hardcoded opts ANY"
  );
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "all",
      }
    ),
    false,
    "09.03 - opts ALL"
  );
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["*thing", "zzz"]
    ),
    true,
    "09.04 - hardcoded opts ANY"
  );
  equal(
    includesWithGlob("something", ["*thing", "zzz"]),
    true,
    "09.05 - string source, array to search, with wildcards, found"
  );
  equal(
    includesWithGlob("something", ["thing", "*zzz"]),
    false,
    "09.06 - string source, array to search, with wildcards, not found"
  );
  equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["*thing", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "all",
      }
    ),
    false,
    "09.07 - opts ALL vs array"
  );
  equal(
    includesWithGlob("something", ["*thing", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "09.08 - opts ALL vs string"
  );
  equal(
    includesWithGlob("something", "*thing", {
      arrayVsArrayAllMustBeFound: "all",
    }),
    true,
    "09.09 - opts ALL string vs string"
  );
});

test("10", () => {
  equal(
    includesWithGlob("zzz", ["*thing", "*zz"]),
    true,
    "10.01 - two keys to match in a second arg, running on assumed default"
  );
  equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "any",
    }),
    true,
    "10.02 - two keys to match in a second arg, running on hardcoded default"
  );
  equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "10.03 - two keys to match in a second arg, running on hardcoded default"
  );
});

test("11 - opts.caseSensitive", () => {
  equal(
    includesWithGlob("something", ["*THING", "zzz"]),
    false,
    "11.01 - default"
  );
  equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: true,
    }),
    false,
    "11.02 - hardcoded default"
  );
  equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: false,
    }),
    true,
    "11.03 - not case sensitive"
  );
  equal(
    includesWithGlob("something", ["*ZING", "zzz"], {
      caseSensitive: false,
    }),
    false,
    "11.04 - control"
  );
});

test.run();
