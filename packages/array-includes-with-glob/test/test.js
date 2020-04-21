import t from "tap";
import i from "../dist/array-includes-with-glob.esm";

// ==============
// various throws
// ==============

t.test("0.1 - throws when inputs are missing", (t) => {
  t.throws(() => {
    i();
  }, /THROW_ID_01/g);
  t.end();
});

t.test("0.2 - throws when second arg is missing", (t) => {
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

t.test("0.3 - first input arg is not array", (t) => {
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

t.test("0.4 - throws when second arg is not string", (t) => {
  t.throws(() => {
    i(["zzz"], 1);
  }, /THROW_ID_04/g);
  t.throws(() => {
    i(["zzz"], false);
  }, /THROW_ID_04/g);
  t.end();
});

t.test("0.5 - empty array always yields false", (t) => {
  t.doesNotThrow(() => {
    i([], "zzz", false);
  });
  t.end();
});

t.test(
  "0.6 - non-empty array turned empty because of cleaning yields false too",
  (t) => {
    t.doesNotThrow(() => {
      i([null, null], "zzz", false);
    });
    t.end();
  }
);

t.test("0.7 - throws if options is set to nonsense", (t) => {
  t.throws(() => {
    i(["aaa", "bbb", "ccc"], "zzz", { arrayVsArrayAllMustBeFound: "x" });
  });
  t.end();
});

// ===
// BAU
// ===

t.test("1.1 - no wildcard, fails", (t) => {
  t.equal(i(["something", "anything", "everything"], "thing"), false, "1.1");
  t.end();
});

t.test("1.2 - no wildcard, succeeds", (t) => {
  t.equal(i(["something", "anything", "everything"], "something"), true, "1.2");
  t.end();
});

t.test("1.3 - wildcard, succeeds", (t) => {
  t.equal(i(["something", "anything", "everything"], "*thing"), true, "1.3.1");
  t.equal(i(["someTHING", "anyTHING", "everyTHING"], "*thing"), false, "1.3.2");
  t.equal(i(["someThInG", "anytHInG", "everyThINg"], "*thing"), false, "1.3.3");
  t.end();
});

t.test("1.4 - wildcard, fails", (t) => {
  t.equal(i(["something", "anything", "everything"], "zzz"), false, "1.4");
  t.end();
});

t.test("1.5 - emoji everywhere", (t) => {
  t.equal(i(["xxxaxxx", "zxxxzzzzxz", "xxz"], "*a*"), true, "1.5.1");
  t.equal(
    i(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*a*"),
    true,
    "1.5.2"
  );
  t.equal(
    i(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "*🦄z"),
    true,
    "1.5.3"
  );
  t.equal(
    i(["🦄🦄🦄a🦄🦄🦄", "z🦄🦄🦄zzzz🦄z", "🦄🦄z"], "%%%"),
    false,
    "1.5.4"
  );
  t.end();
});

t.test("1.6 - second arg is empty string", (t) => {
  t.equal(i(["something", "anything", "everything"], ""), false, "1.6");
  t.end();
});

t.test("1.7 - input is not array but string", (t) => {
  t.equal(i(["something"], "*thing"), true, "1.7.1");
  t.equal(i("something", "*thing"), true, "1.7.2");
  t.equal(i("something", "thing"), false, "1.7.3");
  t.end();
});

// =======================================================
// various combinations of different types including globs
// =======================================================

t.test("2.1 - both arrays, no wildcards", (t) => {
  t.equal(
    i(["something", "anything", "everything"], ["anything", "zzz"]),
    true,
    "2.1.1 - default (opts ANY)"
  );
  t.equal(
    i(["something", "anything", "everything"], ["anything", "zzz"], {
      arrayVsArrayAllMustBeFound: "any",
    }),
    true,
    "2.1.2 - hardcoded opts ANY"
  );
  t.equal(
    i(["something", "anything", "everything"], ["anything", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "2.1.3 - opts ALL"
  );
  t.equal(
    i(["something", "anything", "everything"], ["*thing", "zzz"]),
    true,
    "2.1.4 - hardcoded opts ANY"
  );
  t.equal(
    i("something", ["*thing", "zzz"]),
    true,
    "2.1.5 - string source, array to search, with wildcards, found"
  );
  t.equal(
    i("something", ["thing", "*zzz"]),
    false,
    "2.1.6 - string source, array to search, with wildcards, not found"
  );
  t.equal(
    i(["something", "anything", "everything"], ["*thing", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "2.1.7 - opts ALL vs array"
  );
  t.equal(
    i("something", ["*thing", "zzz"], { arrayVsArrayAllMustBeFound: "all" }),
    false,
    "2.1.8 - opts ALL vs string"
  );
  t.equal(
    i("something", "*thing", { arrayVsArrayAllMustBeFound: "all" }),
    true,
    "2.1.9 - opts ALL string vs string"
  );
  t.end();
});

t.test("2.2 - various, #1", (t) => {
  t.equal(
    i("zzz", ["*thing", "*zz"]),
    true,
    "2.2.1 - two keys to match in a second arg, running on assumed default"
  );
  t.equal(
    i("zzz", ["*thing", "*zz"], { arrayVsArrayAllMustBeFound: "any" }),
    true,
    "2.2.2 - two keys to match in a second arg, running on hardcoded default"
  );
  t.equal(
    i("zzz", ["*thing", "*zz"], { arrayVsArrayAllMustBeFound: "all" }),
    false,
    "2.2.3 - two keys to match in a second arg, running on hardcoded default"
  );
  t.end();
});

// 👍
