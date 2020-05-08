import tap from "tap";
import i from "../dist/array-includes-with-glob.esm";

// ==============
// various throws
// ==============

tap.test("01 - throws when inputs are missing", (t) => {
  t.throws(() => {
    i();
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("02 - throws when second arg is missing", (t) => {
  t.throws(() => {
    i(["zzz"]);
  }, /THROW_ID_02/g);
  t.throws(() => {
    i({ a: "a" });
  }, /THROW_ID_02/g);
  t.throws(() => {
    i(1);
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("03 - first input arg is not array", (t) => {
  t.throws(() => {
    i({ a: "a" }, "a");
  }, /THROW_ID_03/g);
  t.doesNotThrow(() => {
    i("zzz", "a");
  }, /THROW_ID_03/g);
  t.throws(() => {
    i(1, "a");
  }, /THROW_ID_03/g);
  t.end();
});

tap.test("04 - throws when second arg is not string", (t) => {
  t.throws(() => {
    i(["zzz"], 1);
  }, /THROW_ID_04/g);
  t.throws(() => {
    i(["zzz"], false);
  }, /THROW_ID_04/g);
  t.end();
});

tap.test("05 - empty array always yields false", (t) => {
  t.doesNotThrow(() => {
    i([], "zzz", false);
  }, "05");
  t.end();
});

tap.test(
  "06 - non-empty array turned empty because of cleaning yields false too",
  (t) => {
    t.doesNotThrow(() => {
      i([null, null], "zzz", false);
    }, "06");
    t.end();
  }
);

tap.test("07 - throws if options is set to nonsense", (t) => {
  t.throws(() => {
    i(["aaa", "bbb", "ccc"], "zzz", { arrayVsArrayAllMustBeFound: "x" });
  }, "07");
  t.end();
});

// ===
// BAU
// ===

tap.test("08 - no wildcard, fails", (t) => {
  t.equal(i(["something", "anything", "everything"], "thing"), false, "08");
  t.end();
});

tap.test("09 - no wildcard, succeeds", (t) => {
  t.equal(i(["something", "anything", "everything"], "something"), true, "09");
  t.end();
});

tap.test("10 - wildcard, succeeds", (t) => {
  t.equal(i(["something", "anything", "everything"], "*thing"), true, "10.01");
  t.equal(i(["someTHING", "anyTHING", "everyTHING"], "*thing"), false, "10.02");
  t.equal(i(["someThInG", "anytHInG", "everyThINg"], "*thing"), false, "10.03");
  t.end();
});

tap.test("11 - wildcard, fails", (t) => {
  t.equal(i(["something", "anything", "everything"], "zzz"), false, "11");
  t.end();
});

tap.test("12 - emoji everywhere", (t) => {
  t.equal(i(["xxxaxxx", "zxxxzzzzxz", "xxz"], "*a*"), true, "12.01");
  t.equal(
    i(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*a*"),
    true,
    "12.02"
  );
  t.equal(
    i(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*🦄z"),
    true,
    "12.03"
  );
  t.equal(
    i(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "%%%"),
    false,
    "12.04"
  );
  t.end();
});

tap.test("13 - second arg is empty string", (t) => {
  t.equal(i(["something", "anything", "everything"], ""), false, "13");
  t.end();
});

tap.test("14 - input is not array but string", (t) => {
  t.equal(i(["something"], "*thing"), true, "14.01");
  t.equal(i("something", "*thing"), true, "14.02");
  t.equal(i("something", "thing"), false, "14.03");
  t.end();
});

// =======================================================
// various combinations of different types including globs
// =======================================================

tap.test("15 - both arrays, no wildcards", (t) => {
  t.equal(
    i(["something", "anything", "everything"], ["anything", "zzz"]),
    true,
    "15.01 - default (opts ANY)"
  );
  t.equal(
    i(["something", "anything", "everything"], ["anything", "zzz"], {
      arrayVsArrayAllMustBeFound: "any",
    }),
    true,
    "15.02 - hardcoded opts ANY"
  );
  t.equal(
    i(["something", "anything", "everything"], ["anything", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "15.03 - opts ALL"
  );
  t.equal(
    i(["something", "anything", "everything"], ["*thing", "zzz"]),
    true,
    "15.04 - hardcoded opts ANY"
  );
  t.equal(
    i("something", ["*thing", "zzz"]),
    true,
    "15.05 - string source, array to search, with wildcards, found"
  );
  t.equal(
    i("something", ["thing", "*zzz"]),
    false,
    "15.06 - string source, array to search, with wildcards, not found"
  );
  t.equal(
    i(["something", "anything", "everything"], ["*thing", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "15.07 - opts ALL vs array"
  );
  t.equal(
    i("something", ["*thing", "zzz"], { arrayVsArrayAllMustBeFound: "all" }),
    false,
    "15.08 - opts ALL vs string"
  );
  t.equal(
    i("something", "*thing", { arrayVsArrayAllMustBeFound: "all" }),
    true,
    "15.09 - opts ALL string vs string"
  );
  t.end();
});

tap.test("16 - various, #1", (t) => {
  t.equal(
    i("zzz", ["*thing", "*zz"]),
    true,
    "16.01 - two keys to match in a second arg, running on assumed default"
  );
  t.equal(
    i("zzz", ["*thing", "*zz"], { arrayVsArrayAllMustBeFound: "any" }),
    true,
    "16.02 - two keys to match in a second arg, running on hardcoded default"
  );
  t.equal(
    i("zzz", ["*thing", "*zz"], { arrayVsArrayAllMustBeFound: "all" }),
    false,
    "16.03 - two keys to match in a second arg, running on hardcoded default"
  );
  t.end();
});

// 👍
