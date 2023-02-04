import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// (input, objToDelete, strictOrNot)

// wildcard matching
// -----------------------------------------------------------------------------

test("01 - wildcards against values within object", () => {
  equal(
    compare({ a: "1", b: "2a", c: "3" }, { a: "1", b: "2*" }),
    false,
    "01.01"
  );
  equal(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: false }
    ),
    false,
    "01.02"
  );
  equal(
    compare(
      { a: "1", b: "2a", c: "3" },
      { a: "1", b: "2*" },
      { useWildcards: true }
    ),
    true,
    "01.03"
  );
  equal(
    compare(
      { a: "1", b: "za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    true,
    "01.04"
  );
  equal(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "z*" },
      { useWildcards: true }
    ),
    false,
    "01.05"
  );
  equal(
    compare(
      { a: "1", b: "Za", c: "3" },
      { a: "1", b: "Z*" },
      { useWildcards: true }
    ),
    true,
    "01.06"
  );

  equal(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: true }
    ),
    false,
    "01.07"
  );
  equal(
    compare(
      { a: "1", b: "2*" },
      { a: "1", b: "2a", c: "3" },
      { useWildcards: false }
    ),
    false,
    "01.08"
  );
});

test("02 - wildcards against keys within object", () => {
  equal(
    compare({ az: "1", bz: "2a", cz: "3" }, { "a*": "1", "b*": "2*" }),
    false,
    "02.01"
  );
  equal(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "a*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    true,
    "02.02"
  );
  equal(
    compare({ az: "1", bz: "2a", cz: "3" }, { "x*": "1", "b*": "2*" }),
    false,
    "02.03"
  );
  equal(
    compare(
      { az: "1", bz: "2a", cz: "3" },
      { "x*": "1", "b*": "2a" },
      { useWildcards: true }
    ),
    false,
    "02.04"
  );
});

test("03 - wildcards in deeper levels", () => {
  equal(
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
    "03.01"
  );
  equal(
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
    "03.02"
  );
});

test("04 - wildcards in deeper levels within arrays", () => {
  equal(
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
  equal(
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
  equal(
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
  equal(
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
  equal(
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
});

test.run();
