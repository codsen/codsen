import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { within } from "../dist/email-all-chars-within-ascii.esm.js";

test("01 - wrong/missing input = throw", () => {
  throws(
    () => {
      within();
    },
    /THROW_ID_01/g,
    "01.01",
  );
  throws(
    () => {
      within(1);
    },
    /THROW_ID_01/g,
    "01.02",
  );
  throws(
    () => {
      within(null);
    },
    /THROW_ID_01/g,
    "01.03",
  );
  throws(
    () => {
      within(undefined);
    },
    /THROW_ID_01/g,
    "01.04",
  );
  throws(
    () => {
      within(true);
    },
    /THROW_ID_01/g,
    "01.05",
  );
});

test("02 - wrong opts = throw", () => {
  throws(
    () => {
      within("aaaa", true); // not object but bool
    },
    /THROW_ID_02/g,
    "02.01",
  );
  throws(
    () => {
      within("aaaa", 1); // not object but number
    },
    /THROW_ID_02/g,
    "02.02",
  );
  not.throws(() => {
    within("aaaa", undefined); // hardcoded "nothing" is ok!
  }, "02.03");
  not.throws(() => {
    within("aaaa", null); // null fine too - that's hardcoded "nothing"
  }, "02.04");
});

test.run();
