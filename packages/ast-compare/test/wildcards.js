import tap from "tap";
import { compare } from "../dist/ast-compare.esm.js";

// (input, objToDelete, strictOrNot)

// wildcard matching
// -----------------------------------------------------------------------------

tap.test("01 - wildcards against values within object", (t) => {
  t.strictSame(
    compare({ a: "1", b: "2a", c: "3" }, { a: "1", b: "2*" }),
    false,
    "01.01 - default"
  );
  t.strictSame(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: false }
    ),
    false,
    "01.02 - hardcoded default"
  );
  t.strictSame(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: true }
    ),
    true,
    "01.03 - wildcards enabled"
  );
  t.strictSame(
    compare(
      { a: "1", b: "za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    true,
    "01.04 - with letters and wildcards"
  );
  t.strictSame(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    false,
    "01.05 - won't match because it's now case-sensitive in wildcards too"
  );
  t.strictSame(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "Z*" },
      { useWildcards: true }
    ),
    true,
    "01.06 - won't match because it's now case-sensitive in wildcards too"
  );

  t.strictSame(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: true }
    ),
    false,
    "01.07 - weird"
  );
  t.strictSame(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: false }
    ),
    false,
    "01.08 - weird, false anyway"
  );
  t.end();
});

tap.test("02 - wildcards against keys within object", (t) => {
  t.strictSame(
    compare({ az: "1", bz: "2a", cz: "3" }, { "a*": "1", "b*": "2*" }),
    false,
    "02.01 - default"
  );
  t.strictSame(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "a*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    true,
    "02.02 - wildcards on"
  );
  t.strictSame(
    compare({ az: "1", bz: "2a", cz: "3" }, { "x*": "1", "b*": "2*" }),
    false,
    "02.03 - won't find, despite wildcards, which are turned off"
  );
  t.strictSame(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "x*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    false,
    "02.04 - won't find, despite wildcards, which are turned on"
  );
  t.end();
});

tap.test("03 - wildcards in deeper levels", (t) => {
  t.strictSame(
    compare(
      {
        a: [
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: false }
    ),
    false,
    "03.01 - default (control), wildcards are turned off"
  );
  t.strictSame(
    compare(
      {
        a: [
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: true }
    ),
    true,
    "03.02 - default (control), wildcards are turned off"
  );
  t.end();
});

tap.test("04 - wildcards in deeper levels within arrays", (t) => {
  t.strictSame(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: false }
    ),
    false,
    "04.01"
  );
  t.strictSame(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "*orn",
          },
        ],
      },
      { useWildcards: true }
    ),
    true,
    "04.02"
  );
  t.strictSame(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "horn",
          },
        ],
      },
      {
        a: [
          {
            b: "ccc",
          },
        ],
      },
      { useWildcards: true }
    ),
    false,
    "04.03"
  );
  t.strictSame(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "ccc", // <---- !
          },
        ],
      },
      {
        a: [
          {
            "*": "ccc",
          },
        ],
      },
      { useWildcards: false }
    ),
    false,
    "04.04"
  );
  t.strictSame(
    compare(
      {
        a: [
          {
            z: "zzz",
          },
          {
            b: "yyy", // <---- !
          },
        ],
      },
      {
        a: [
          {
            "*": "ccc",
          },
        ],
      },
      { useWildcards: true }
    ),
    true,
    "04.05"
  );
  t.end();
});
