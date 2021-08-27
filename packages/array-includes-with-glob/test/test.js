import tap from "tap";
import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

tap.test("01 - empty array always yields false", (t) => {
  t.doesNotThrow(() => {
    includesWithGlob([], "zzz", false);
  }, "01");
  t.end();
});

// ===
// BAU
// ===

tap.test("02 - no wildcard, fails", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "thing"),
    false,
    "02"
  );
  t.end();
});

tap.test("03 - no wildcard, succeeds", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "something"),
    true,
    "03"
  );
  t.end();
});

tap.test("04 - wildcard, succeeds", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "*thing"),
    true,
    "04.01"
  );
  t.equal(
    includesWithGlob(["someTHING", "anyTHING", "everyTHING"], "*thing"),
    false,
    "04.02"
  );
  t.equal(
    includesWithGlob(["someThInG", "anytHInG", "everyThINg"], "*thing"),
    false,
    "04.03"
  );
  t.end();
});

tap.test("05 - wildcard, fails", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], "zzz"),
    false,
    "05"
  );
  t.end();
});

tap.test("06 - emoji everywhere", (t) => {
  t.equal(
    includesWithGlob(["xxxaxxx", "zxxxzzzzxz", "xxz"], "*a*"),
    true,
    "06.01"
  );
  t.equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*a*"),
    true,
    "06.02"
  );
  t.equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*🦄z"),
    true,
    "06.03"
  );
  t.equal(
    includesWithGlob(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "%%%"),
    false,
    "06.04"
  );
  t.end();
});

tap.test("07 - second arg is empty string", (t) => {
  t.equal(
    includesWithGlob(["something", "anything", "everything"], ""),
    false,
    "07"
  );
  t.end();
});

tap.test("08 - input is not array but string", (t) => {
  t.equal(includesWithGlob(["something"], "*thing"), true, "08.01");
  t.equal(includesWithGlob("something", "*thing"), true, "08.02");
  t.equal(includesWithGlob("something", "thing"), false, "08.03");
  t.end();
});

// =======================================================
// various combinations of different types including globs
// =======================================================

tap.test("09 - both arrays, no wildcards", (t) => {
  t.equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["anything", "zzz"]
    ),
    true,
    "09.01 - default (opts ANY)"
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
    "09.02 - hardcoded opts ANY"
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
    "09.03 - opts ALL"
  );
  t.equal(
    includesWithGlob(
      ["something", "anything", "everything"],
      ["*thing", "zzz"]
    ),
    true,
    "09.04 - hardcoded opts ANY"
  );
  t.equal(
    includesWithGlob("something", ["*thing", "zzz"]),
    true,
    "09.05 - string source, array to search, with wildcards, found"
  );
  t.equal(
    includesWithGlob("something", ["thing", "*zzz"]),
    false,
    "09.06 - string source, array to search, with wildcards, not found"
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
    "09.07 - opts ALL vs array"
  );
  t.equal(
    includesWithGlob("something", ["*thing", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "09.08 - opts ALL vs string"
  );
  t.equal(
    includesWithGlob("something", "*thing", {
      arrayVsArrayAllMustBeFound: "all",
    }),
    true,
    "09.09 - opts ALL string vs string"
  );
  t.end();
});

tap.test("10", (t) => {
  t.equal(
    includesWithGlob("zzz", ["*thing", "*zz"]),
    true,
    "10.01 - two keys to match in a second arg, running on assumed default"
  );
  t.equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "any",
    }),
    true,
    "10.02 - two keys to match in a second arg, running on hardcoded default"
  );
  t.equal(
    includesWithGlob("zzz", ["*thing", "*zz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "10.03 - two keys to match in a second arg, running on hardcoded default"
  );
  t.end();
});

tap.test("11 - opts.caseSensitive", (t) => {
  t.equal(
    includesWithGlob("something", ["*THING", "zzz"]),
    false,
    "11.01 - default"
  );
  t.equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: true,
    }),
    false,
    "11.02 - hardcoded default"
  );
  t.equal(
    includesWithGlob("something", ["*THING", "zzz"], {
      caseSensitive: false,
    }),
    true,
    "11.03 - not case sensitive"
  );
  t.equal(
    includesWithGlob("something", ["*ZING", "zzz"], {
      caseSensitive: false,
    }),
    false,
    "11.04 - control"
  );
  t.end();
});
