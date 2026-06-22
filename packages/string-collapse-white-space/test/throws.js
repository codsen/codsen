// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

// various throws
// -----------------------------------------------------------------------------

test(`01 - throws - wrong/missing input = throw`, () => {
  throws(
    () => {
      collapse();
    },
    /THROW_ID_01/,
    "01.01",
  );
  throws(
    () => {
      collapse(1);
    },
    /THROW_ID_01/,
    "01.02",
  );
  throws(
    () => {
      collapse(null);
    },
    /THROW_ID_01/,
    "01.03",
  );
  throws(
    () => {
      collapse(undefined);
    },
    /THROW_ID_01/,
    "01.04",
  );
  throws(
    () => {
      collapse(true);
    },
    /THROW_ID_01/,
    "01.05",
  );
});

test(`02 - throws - wrong opts = throw`, () => {
  throws(
    () => {
      collapse("aaaa", true); // not object but bool
    },
    /THROW_ID_02/,
    "02.01",
  );
  throws(
    () => {
      collapse("aaaa", 1); // not object but number
    },
    /THROW_ID_02/,
    "02.02",
  );
  not.throws(
    () => {
      collapse("aaaa", undefined); // hardcoded "nothing" is ok!
    },
    /THROW_ID_02/,
    "02.03",
  );
  not.throws(
    () => {
      collapse("aaaa", null); // null fine too - that's hardcoded "nothing"
    },
    /THROW_ID_02/,
    "02.04",
  );
});

test(`03 - throws - empty string`, () => {
  equal(collapse(""), { result: "", ranges: null }, "03.01");
});

test(`04 - throws - only letter characters, no white space`, () => {
  equal(collapse("aaa"), { result: "aaa", ranges: null }, "04.01");
});

test("05 - cb is null", () => {
  equal(
    collapse("aaa", { cb: null }),
    { result: "aaa", ranges: null },
    "05.01",
  );
});

test.run();
