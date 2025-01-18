import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { convertOne, convertAll } from "../dist/string-dashes.esm.js";

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

test("10 - happy path", () => {
  let input = "1880-1912, pages 330-39";
  equal(
    convertOne(input, {
      from: 4,
      convertDashes: true,
      convertEntities: true,
    }),
    [[4, 5, "&ndash;"]],
    "10.01",
  );
  equal(
    convertOne(input, {
      from: 20,
      convertDashes: true,
      convertEntities: true,
    }),
    [[20, 21, "&ndash;"]],
    "10.02",
  );
  equal(
    convertOne(input, {
      from: 0,
      convertDashes: true,
      convertEntities: true,
    }),
    null,
    "10.03",
  );
  equal(
    convertOne(input, {
      from: 21,
      convertDashes: true,
      convertEntities: true,
    }),
    null,
    "10.04",
  );
  throws(
    () => {
      convertOne(input, {
        from: 99,
      });
    },
    /THROW_ID_04/,
    "10.05",
  );
});

// convertAll()
// -----------------------------------------------------------------------------

test("11 - 1st input arg is wrong", () => {
  throws(
    () => {
      convertAll();
    },
    /THROW_ID_10/,
    "11.01",
  );
});

test("12 - 1st input arg is wrong", () => {
  throws(
    () => {
      convertAll(true);
    },
    /THROW_ID_10/,
    "12.01",
  );
});

test("13 - 2nd input arg is wrong", () => {
  throws(
    () => {
      convertAll("abc", true);
    },
    /THROW_ID_11/,
    "13.01",
  );
});

test("14 - 2nd input arg is wrong", () => {
  throws(
    () => {
      convertAll("abc", []);
    },
    /THROW_ID_11/,
    "14.01",
  );
});

test("15 - early exit", () => {
  equal(
    convertAll("", {}),
    {
      result: "",
      ranges: null,
    },
    "15.01",
  );
});

test.run();
