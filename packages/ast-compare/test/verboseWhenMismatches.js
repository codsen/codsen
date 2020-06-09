import tap from "tap";
import compare from "../dist/ast-compare.esm";

tap.test("01 - plain objects", (t) => {
  t.not(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "2", c: "3" },
      { verboseWhenMismatches: true }
    ),
    true,
    "01"
  );
  t.end();
});

tap.only("02 - plain objects, useWildcards, key with wildcard", (t) => {
  t.not(
    compare(
      { a: "1", b: "2" },
      { a: "1", b: "2", "c*": "3" },
      { verboseWhenMismatches: true, useWildcards: true }
    ),
    true,
    "02"
  );
  t.end();
});
