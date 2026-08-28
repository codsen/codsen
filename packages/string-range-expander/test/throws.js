// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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
    /THROW_ID_04/,
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
    /THROW_ID_05/,
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
    /THROW_ID_06/,
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
    /THROW_ID_07/,
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
    /THROW_ID_09/,
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
    /THROW_ID_09/,
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
    /THROW_ID_08/,
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
    /THROW_ID_10/,
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
    /THROW_ID_10/,
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
    /THROW_ID_11/,
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
    /THROW_ID_11/,
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
    /THROW_ID_12/,
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
    /THROW_ID_12/,
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
    /THROW_ID_13/,
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
    /THROW_ID_13/,
    "15.02",
  );
});

test("16 - hostile non-object inputs preserve the validation error", () => {
  throws(
    () => {
      e(1n);
    },
    (error) =>
      error.constructor === Error &&
      /^string-range-expander\/expander\(\): \[THROW_ID_01\]/.test(
        error.message,
      ),
    "16.01",
  );
  throws(
    () => {
      e(Symbol("hostile"));
    },
    (error) =>
      error.constructor === Error &&
      /^string-range-expander\/expander\(\): \[THROW_ID_01\]/.test(
        error.message,
      ),
    "16.02",
  );
});

test('17 - throws when "str" is not a string', () => {
  [undefined, null, false, 0, [], {}].forEach((str, index) => {
    throws(
      () => {
        e({ str, from: 0, to: 0 });
      },
      /THROW_ID_03/,
      `17.${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("18 - rejects negative and fractional boundaries", () => {
  throws(() => e({ str: "abc", from: -1, to: 0 }), /THROW_ID_04/, "18.01");
  throws(() => e({ str: "abc", from: 0.5, to: 1 }), /THROW_ID_04/, "18.02");
  throws(() => e({ str: "abc", from: 0, to: -1 }), /THROW_ID_05/, "18.03");
  throws(() => e({ str: "abc", from: 0, to: 1.5 }), /THROW_ID_05/, "18.04");
});

test("19 - rejects boundaries beyond the string length", () => {
  throws(() => e({ str: "abc", from: 4, to: 4 }), /THROW_ID_06/, "19.01");
  throws(() => e({ str: "abc", from: 0, to: 4 }), /THROW_ID_07/, "19.02");
  throws(() => e({ str: "", from: 1, to: 1 }), /THROW_ID_06/, "19.03");
});

test("20 - rejects every wrong marker-option type", () => {
  const markerOptions = [
    ["ifLeftSideIncludesThisThenCropTightly", "10"],
    ["ifLeftSideIncludesThisCropItToo", "11"],
    ["ifRightSideIncludesThisThenCropTightly", "12"],
    ["ifRightSideIncludesThisCropItToo", "13"],
  ];
  const invalidValues = [null, false, 0, Number.NaN, [], {}];
  let assertion = 0;

  markerOptions.forEach(([option, throwId]) => {
    invalidValues.forEach((value) => {
      assertion += 1;
      throws(
        () => e({ str: "abc", from: 1, to: 2, [option]: value }),
        new RegExp(`THROW_ID_${throwId}`),
        `20.${String(assertion).padStart(2, "0")}`,
      );
    });
  });
});

test("21 - accepts only the declared one-side modes", () => {
  const invalidValues = [null, true, 0, Number.NaN, "", "up", [], {}];
  const validValues = [undefined, false, "left", "right"];

  invalidValues.forEach((extendToOneSide, index) => {
    throws(
      () => e({ str: "abc", from: 1, to: 2, extendToOneSide }),
      /THROW_ID_09/,
      `21.${String(index + 1).padStart(2, "0")}`,
    );
  });
  validValues.forEach((extendToOneSide, index) => {
    not.throws(
      () => e({ str: "abc", from: 1, to: 2, extendToOneSide }),
      `21.${String(invalidValues.length + index + 1).padStart(2, "0")}`,
    );
  });
});

test("22 - requires Boolean wipe and insertion options", () => {
  const booleanOptions = [
    ["wipeAllWhitespaceOnLeft", "14"],
    ["wipeAllWhitespaceOnRight", "15"],
    ["addSingleSpaceToPreventAccidentalConcatenation", "16"],
  ];
  const invalidValues = [null, 0, 1, "", "false", [], {}];
  const validValues = [undefined, false, true];
  let assertion = 0;

  booleanOptions.forEach(([option, throwId]) => {
    invalidValues.forEach((value) => {
      assertion += 1;
      throws(
        () => e({ str: "abc", from: 1, to: 2, [option]: value }),
        new RegExp(`THROW_ID_${throwId}`),
        `22.${String(assertion).padStart(2, "0")}`,
      );
    });
    validValues.forEach((value) => {
      assertion += 1;
      not.throws(
        () => e({ str: "abc", from: 1, to: 2, [option]: value }),
        `22.${String(assertion).padStart(2, "0")}`,
      );
    });
  });
});

test.run();
