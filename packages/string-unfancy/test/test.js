import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - wrong/missing input = throw", () => {
  throws(
    () => {
      unfancy();
    },
    /THROW_ID_01/g,
    "01.01",
  );
  throws(
    () => {
      unfancy(1);
    },
    /THROW_ID_01/g,
    "01.02",
  );
  throws(
    () => {
      unfancy(null);
    },
    /THROW_ID_01/g,
    "01.03",
  );
  throws(
    () => {
      unfancy(undefined);
    },
    /THROW_ID_01/g,
    "01.04",
  );
  throws(
    () => {
      unfancy(true);
    },
    /THROW_ID_01/g,
    "01.05",
  );
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("02 - unfancies fancy strings", () => {
  equal(unfancy("“zzz”"), '"zzz"', "02.01");
});

test("03 - copes with encoded HTML chars that happen to be fancy", () => {
  equal(unfancy("zzz&rsquo;zzz"), "zzz'zzz", "03.01");
});

test("04 - fancies with triple-encoded HTML", () => {
  equal(unfancy("zzz&amp;amp;rsquo;zzz"), "zzz'zzz", "04.01");
});

test("05 - removes non-breaking spaces", () => {
  equal(unfancy("aaaa&nbsp;&ndash; bbbb"), "aaaa - bbbb", "05.01");
  equal(unfancy("aaaa\u00A0\u2013 bbbb"), "aaaa - bbbb", "05.02");
});

test.run();
