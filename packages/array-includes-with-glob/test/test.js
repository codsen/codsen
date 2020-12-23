import tap from "tap";
import { includesWithGlob } from "../dist/array-includes-with-glob.esm";

tap.test("01 - empty array always yields false", (t) => {
  t.doesNotThrow(() => {
    includesWithGlob([], "zzz", false);
  }, "01");
  t.end();
});

// ===
// BAU
// ===

tap.test("08 - no wildcard, fails", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "thing"),
    false,
    "08"
  );
  t.end();
});

tap.test("09 - no wildcard, succeeds", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "something"),
    true,
    "09"
  );
  t.end();
});

tap.test("10 - wildcard, succeeds", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "*thing"),
    true,
    "10.01"
  );
  t.equal(
    includesWithGlob(["someTHING", "anyTHING", "everyTHING"], "*thing"),
    false,
    "10.02"
  );
  t.equal(
    includesWithGlob(["someThInG", "anytHInG", "everyThINg"], "*thing"),
    false,
    "10.03"
  );
  t.end();
});

tap.test("11 - wildcard, fails", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "zzz"),
    false,
    "11"
  );
  t.end();
});

tap.test("12 - emoji everywhere", (t) => {
  t.equal(
    includesWithGlob(["xxxaxxx", "zxxxzzzzxz", "xxz"], "*a*"),
    true,
    "12.01"
  );
  t.equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*a*"),
    true,
    "12.02"
  );
  t.equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*🦄z"),
    true,
    "12.03"
  );
  t.equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "%%%"),
    false,
    "12.04"
  );
  t.end();
});

tap.test("13 - second arg is empty string", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], ""),
    false,
    "13"
  );
  t.end();
});

tap.test("14 - input is not array but string", (t) => {
  t.equal(includesWithGlob(["something"], "*thing"), true, "14.01");
  t.equal(includesWithGlob("something", "*thing"), true, "14.02");
  t.equal(includesWithGlob("something", "thing"), false, "14.03");
  t.end();
});

// =======================================================
// various combinations of different types including globs
// =======================================================

tap.test("15 - both arrays, no wildcards", (t) => {
  t.equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"]
    ),
    true,
    "15.01 - default (opts ANY)"
  );
  t.equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "any",
      }
    ),
    true,
    "15.02 - hardcoded opts ANY"
  );
  t.equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "all",
      }
    ),
    false,
    "15.03 - opts ALL"
  );
  t.equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["*thing", "zzz"]
    ),
    true,
    "15.04 - hardcoded opts ANY"
  );
  t.equal(
    includesWithGlob("something", ["*thing", "zzz"]),
    true,
    "15.05 - string source, array to search, with wildcards, found"
  );
  t.equal(
    includesWithGlob("something", ["thing", "*zzz"]),
    false,
    "15.06 - string source, array to search, with wildcards, not found"
  );
  t.equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["*thing", "zzz"],
      {
        arrayVsArrayAllMustBeFound: "all",
      }
    ),
    false,
    "15.07 - opts ALL vs array"
  );
  t.equal(
    includesWithGlob("something", ["*thing", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "15.08 - opts ALL vs string"
  );
  t.equal(
    includesWithGlob("something", "*thing", {
      arrayVsArrayAllMustBeFound: "all",
    }),
    true,
    "15.09 - opts ALL string vs string"
  );
  t.end();
});

tap.test("16", (t) => {
  t.equal(
    includesWithGlob("zzz", ["*thing", "*zz"]),
    true,
    "16.01 - two keys to match in a second arg, running on assumed default"
  );
  t.equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "any",
    }),
    true,
    "16.02 - two keys to match in a second arg, running on hardcoded default"
  );
  t.equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "16.03 - two keys to match in a second arg, running on hardcoded default"
  );
  t.end();
});

tap.test("17 - opts.caseSensitive", (t) => {
  t.equal(
    includesWithGlob("something", ["*THING", "zzz"]),
    false,
    "17.01 - default"
  );
  t.equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: true,
    }),
    false,
    "17.02 - hardcoded default"
  );
  t.equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: false,
    }),
    true,
    "17.03 - not case sensitive"
  );
  t.equal(
    includesWithGlob("something", ["*ZING", "zzz"], {
      caseSensitive: false,
    }),
    false,
    "17.04 - control"
  );
  t.end();
});
