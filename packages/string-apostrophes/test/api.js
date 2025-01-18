import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { convertOne, convertAll } from "../dist/string-apostrophes.esm.js";

// convertOne()
// -----------------------------------------------------------------------------

test("01 - 1st input arg is missing", () => {
  throws(
    () => {
      convertOne();
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test("02 - 1st input arg wrong type", () => {
  throws(
    () => {
      convertOne(true);
    },
    /THROW_ID_01/,
    "02.01",
  );
});

test("03 - 2nd input arg wrong type", () => {
  throws(
    () => {
      convertOne("abc", true);
    },
    /THROW_ID_02/,
    "03.01",
  );
});

test("04 - 2nd input arg wrong type", () => {
  throws(
    () => {
      convertOne("abc", []);
    },
    /THROW_ID_02/,
    "04.01",
  );
});

test("05 - opts.to is wrong", () => {
  throws(
    () => {
      convertOne("abc", {});
    },
    /THROW_ID_03/,
    "05.01",
  );
});

test("06 - opts.from is wrong", () => {
  throws(
    () => {
      convertOne("abc", { from: true });
    },
    /THROW_ID_03/,
    "06.01",
  );
});

test("07 - opts.from is wrong", () => {
  throws(
    () => {
      convertOne("a", { from: -1 });
    },
    /THROW_ID_03/,
    "07.01",
  );
});

test("08 - opts.from is at or beyond str.length", () => {
  throws(
    () => {
      convertOne("a", { from: 1 });
    },
    /THROW_ID_04/,
    "08.01",
  );
});

test("09 - opts.from is at or beyond str.length", () => {
  throws(
    () => {
      convertOne("abc", { from: 999 });
    },
    /THROW_ID_04/,
    "09.01",
  );
});

// convertAll()
// -----------------------------------------------------------------------------

test("10 - 1st input arg is wrong", () => {
  throws(
    () => {
      convertAll();
    },
    /THROW_ID_10/,
    "10.01",
  );
});

test("11 - 1st input arg is wrong", () => {
  throws(
    () => {
      convertAll(true);
    },
    /THROW_ID_10/,
    "11.01",
  );
});

test("12 - 2nd input arg is wrong", () => {
  throws(
    () => {
      convertAll("abc", true);
    },
    /THROW_ID_11/,
    "12.01",
  );
});

test("13 - 2nd input arg is wrong", () => {
  throws(
    () => {
      convertAll("abc", []);
    },
    /THROW_ID_11/,
    "13.01",
  );
});

test("14 - early exit", () => {
  equal(
    convertAll("", {}),
    {
      result: "",
      ranges: null,
    },
    "14.01",
  );
});

test.run();
