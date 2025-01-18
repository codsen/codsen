import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { expander as e } from "../dist/string-range-expander.esm.js";

// 00. THROWS.
// -----------------------------------------------------------------------------

test("01 - throws on Boolean input", () => {
  throws(
    () => {
      e(true);
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test("02 - throws on missing input", () => {
  throws(
    () => {
      e();
    },
    /missing completely/,
    "02.01",
  );
});

test("03 - throws on null input", () => {
  throws(
    () => {
      e(null);
    },
    /THROW_ID_01/,
    "03.01",
  );
});

test("04 - throws on string input", () => {
  throws(
    () => {
      e("zzz");
    },
    /THROW_ID_01/,
    "04.01",
  );
});

test("05 - throws on empty plain object", () => {
  throws(
    () => {
      e({});
    },
    /THROW_ID_02/,
    "05.01",
  );
});

test('06 - throws when "from" is not a number', () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: "0",
        to: 0,
      });
    },
    /THROW_ID_03/,
    "06.01",
  );
});

test('07 - throws when "to" is not a number', () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 0,
        to: "0",
      });
    },
    /THROW_ID_04/,
    "07.01",
  );
});

test('08 - throws when "from" is outside the str boundaries', () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 10,
        to: 20,
      });
    },
    /THROW_ID_05/,
    "08.01",
  );
});

test('09 - throws when "to" is way outside the str boundaries', () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 0,
        to: 4,
      });
    },
    /THROW_ID_06/,
    "09.01",
  );

  // but 3 (= str.length) is OK:
  not.throws(() => {
    e({
      str: "aaa",
      from: 0,
      to: 3,
    });
  }, "09.02");
});

test("10 - throws when opts.extendToOneSide is unrecognised", () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        extendToOneSide: "zzz",
      });
    },
    /THROW_ID_08/,
    "10.01",
  );

  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        extendToOneSide: null,
      });
    },
    /THROW_ID_08/,
    "10.02",
  );
});

test("11 - throws when opts.to < opts.from", () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 2,
        to: 1,
      });
    },
    /THROW_ID_07/,
    "11.01",
  );
});

test("12 - throws when opts.ifLeftSideIncludesThisThenCropTightly is wrong", () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifLeftSideIncludesThisThenCropTightly: 1,
      });
    },
    /THROW_ID_09/,
    "12.01",
  );

  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifLeftSideIncludesThisThenCropTightly: [],
      });
    },
    /THROW_ID_09/,
    "12.02",
  );
});

test("13 - throws when opts.ifLeftSideIncludesThisCropItToo is wrong", () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifLeftSideIncludesThisCropItToo: 1,
      });
    },
    /THROW_ID_10/,
    "13.01",
  );

  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifLeftSideIncludesThisCropItToo: [],
      });
    },
    /THROW_ID_10/,
    "13.02",
  );
});

test("14 - throws when opts.ifRightSideIncludesThisThenCropTightly is wrong", () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifRightSideIncludesThisThenCropTightly: 1,
      });
    },
    /THROW_ID_11/,
    "14.01",
  );

  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifRightSideIncludesThisThenCropTightly: [],
      });
    },
    /THROW_ID_11/,
    "14.02",
  );
});

test("15 - throws when opts.ifRightSideIncludesThisCropItToo is wrong", () => {
  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifRightSideIncludesThisCropItToo: 1,
      });
    },
    /THROW_ID_12/,
    "15.01",
  );

  throws(
    () => {
      e({
        str: "aaa",
        from: 1,
        to: 2,
        ifRightSideIncludesThisCropItToo: [],
      });
    },
    /THROW_ID_12/,
    "15.02",
  );
});

test.run();
